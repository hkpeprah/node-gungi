// Copyright (C) 2020 Ford Peprah

const express = require('express');
const { Router } = require('express');

const server = express();
const router = Router();

// Bind the middleware for parsing bodies.
server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use('/api/v1', router);

// POST /ping
router.post('/ping', (req, res) => {
    return res.send(req.body);
});

// POST /drop
//     id: <int>
//     col: [0..9]
//     row: [0..9]
router.post('/drop', (req, res) => {
    // TODO: ACTUALLY IMPLEMENT THIS
    return res.send({ status: true });
});

// POST /move
//     id: <int>
//     src:
//         col: [0..9]
//         row: [0..9]
//         tier: [0..2]
//     dest:
//         col: [0..9]
//         row: [0..9]
router.post('/move', (req, res) => {
    // TODO: ACTUALLY IMPLEMENT THIS
    return res.send({ status: true });
});

// POST /attack
//     id: <int>
//     src:
//         col: [0..9]
//         row: [0..9]
//         tier: [0..2]
//     dest:
//         col: [0..9]
//         row: [0..9]
//         tier: [0..2]
router.post('/attack', (req, res) => {
    // TODO: ACTUALLY IMPLEMENT THIS
    return res.send({ status: false });
});

// POST /sub
//     id: <int>
//     src:
//         col: [0..9]
//         row: [0..9]
//         tier: [0..2]
//     dest:
//         col: [0..9]
//         row: [0..9]
//         tier: [0..2]
router.post('/sub', (req, res) => {
    // TODO: ACTUALLY IMPLEMENT THIS
    return res.send({ status: true });
});

exports.server = server;

module.exports = exports;
