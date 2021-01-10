// Copyright (C) 2020 Ford Peprah

const bindings = require('./bindings')
const express = require('express');
const { Router } = require('express');

const server = express();
const router = Router();

// Bind the middleware for parsing bodies.
server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use('/api/v1', router);

/**
 * Called to convert an error code to error string.
 *
 * @returns {String}
 */
function errorToString(error) {
    if (!bindings.errors.hasOwnProperty(error)) {
        return 'Unknown Error';
    }
    return bindings.errors[error];
}

/**
 * Makes and sends a response for a game based on the game state.
 *
 * @param {Response}
 * @param {Integer}
 * @param {Integer}
 * @returns {undefined}
 */
function makeResponse(res, gameId, error) {
    let data = {
        'gameId': gameId,
        'status': (error === 0),
        'turn': bindings.lib.gungi_game_get_turn(gameId),
        'forced_recovery': bindings.lib.gungi_game_is_forced_recovery(gameId),
        'forced_rearrangement': bindings.lib.gungi_game_is_forced_rearrangement(gameId)
    };

    if (error) {
        data['error'] = {
            'code': error,
            'string': errorToString(error)
        };
    }

    data['result'] = {
        'over': bindings.lib.gungi_game_is_over(gameId),
        'winner': bindings.lib.gungi_game_get_winner(gameId),
        'draw': bindings.lib.gungi_game_is_draw(gameId)
    };

    return res.send(data);
}

// POST /ping
router.post('/ping', (req, res) => {
    return res.send(req.body);
});

// POST /gungi/new
router.post('/gungi/new', (req, res) => {
    const id = bindings.lib.gungi_game_start();
    return res.send({ id: id });
});

// POST /gungi/game/<gameId>/restart
router.post('/gungi/game/:gameId/restart', (req, res) => {
    return makeResponse(res, req.params.gameId, bindings.lib.gungi_game_restart(
        req.params.gameId) ? 0 : 1);
});

// POST /gungi/game/<gameId>/drop
//     id: <string>
//     col: [0..9]
//     row: [0..9]
router.post('/gungi/game/:gameId/drop', (req, res) => {
    return makeResponse(res, req.params.gameId, bindings.lib.gungi_game_drop_unit(
        req.params.gameId, req.body.id, req.body.col, req.body.row));
});

// POST /gungi/game/<gameId>/move
//     id: <string>
//     src:
//         col: [0..9]
//         row: [0..9]
//         tier: [0..2]
//     dest:
//         col: [0..9]
//         row: [0..9]
router.post('/gungi/game/:gameId/move', (req, res) => {
    return makeResponse(res, req.params.gameId, bindings.lib.gungi_game_move_unit(
        req.params.gameId, req.body.src.col, req.body.src.row, req.body.src.tier,
        req.body.dest.col, req.body.dest.row));
});

// POST /gungi/game/<gameId>/attack
//     id: <string>
//     src:
//         col: [0..9]
//         row: [0..9]
//         tier: [0..2]
//     dest:
//         col: [0..9]
//         row: [0..9]
//         tier: [0..2]
router.post('/gungi/game/:gameId/attack', (req, res) => {
    return makeResponse(res, req.params.gameId, bindings.lib.gungi_game_immobile_strike(
        req.params.gameId, req.body.src.col, req.body.src.row, req.body.src.tier,
        req.body.dest.tier));
});

// POST /gungi/game/<gameId>/sub
//     id: <string>
//     src:
//         col: [0..9]
//         row: [0..9]
//         tier: [0..2]
//     dest:
//         col: [0..9]
//         row: [0..9]
//         tier: [0..2]
router.post('/gungi/game/:gameId/sub', (req, res) => {
    if ((req.body.src.row === req.body.dest.row) &&
        (req.body.src.col === req.body.dest.col)) {
        return makeResponse(req, req.params.gameId, bindings.lib.gungi_game_exchange(
            req.params.gameId, req.body.src.col, req.body.src.row, req.body.src.tier,
            req.body.dest.col, req.body.dest.row, req.body.dest.tier));
    }
    return makeResponse(res, req.params.gameId, bindings.lib.gungi_game_substitution(
        req.params.gameId, req.body.src.col, req.body.src.row, req.body.src.tier,
        req.body.dest.col, req.body.dest.row, req.body.dest.tier));
});

// POST /gungi/game/<gameId>/recover
//     id: <string>
//     recover: <bool>
router.post('/gungi/game/:gameId/recover', (req, res) => {
    return makeResponse(res, req.params.gameId, bindings.lib.gungi_game_force_recover(
        req.params.gameId, req.body.recover));
});

exports.server = server;

module.exports = exports;
