// Copyright (C) 2020 Ford Peprah

const ffi = require('ffi-napi');
const path = require('path');

const libPath = path.resolve(path.join(__dirname, 'lib', 'libgungi'));

const gungi = ffi.Library(libPath, {
    'gungi_game_start': [
        'uint',
        [
        ]
    ],
    'gungi_game_clear': [
        'void',
        [
            'uint'
        ]
    ],
    'gungi_games_clear': [
        'void',
        []
    ],
    'gungi_game_restart': [
        'bool',
        [
            'uint'
        ]
    ],
    'gungi_game_is_over': [
        'bool',
        [
            'uint'
        ]
    ],
    'gungi_game_is_draw': [
        'bool',
        [
            'uint'
        ]
    ],
    'gungi_game_is_forced_recovery': [
        'bool',
        [
            'uint'
        ]
    ],
    'gungi_game_is_forced_rearrangement': [
        'bool',
        [
            'uint'
        ]
    ],
    'gungi_game_get_turn': [
        'int',
        [
            'uint'
        ]
    ],
    'gungi_game_get_winner': [
        'int',
        [
            'uint'
        ]
    ],
    'gungi_game_drop_unit': [
        'int',
        [
            'uint',
            'string',
            'uint',
            'uint'
        ],
    ],
    'gungi_game_move_unit': [
        'int',
        [
            'uint',
            'uint',
            'uint',
            'int',
            'uint',
            'uint'
        ],
    ],
    'gungi_game_substitution': [
        'int',
        [
            'uint',
            'uint',
            'uint',
            'int',
            'uint',
            'uint',
            'int'
        ],
    ],
    'gungi_game_exchange': [
        'int',
        [
            'uint',
            'uint',
            'uint',
            'int',
            'uint',
            'uint',
            'int'
        ],
    ],
    'gungi_game_immobile_strike': [
        'int',
        [
            'uint',
            'uint',
            'uint',
            'int',
            'int'
        ],
    ],
    'gungi_game_force_recover': [
        'int',
        [
            'uint',
            'bool'
        ],
    ]
});

const errors = {
     0: null,
     1: 'Not a valid unit identifier.',
     2: 'Unit does not have a back side.',
     3: 'Tower is full.',
     4: 'Unit is not a member of the tower.',
     5: 'No unit at the given tower tier.',
     6: 'Cannot add same unit to tower twice.',
     7: 'Cannot reach position.',
     8: 'Game is over.',
     9: 'Unit is not valid.',
    10: 'Move / drop is not valid for escaping check.',
    11: 'Can only drop in territory.',
    12: 'Can only move a unit at the top of a tower.',
    13: 'Cannot drop Pawn into same file as another Pawn.',
    14: 'Cannot put Bronze into same file as another Bronze.',
    15: 'Can only drop on units with the Land Link effect.',
    16: 'Cannot attack a unit on the same team.',
    17: 'Pawn cannot be used to achieve checkmate.',
    18: 'Bronze cannot be used to achieve checkmate.',
    19: 'Tower cannot be built on unit.',
    20: 'Only back pieces can be dropped on unit.',
    21: 'Only front pieces can be dropped on unit.',
    22: 'Unit is immune to effect.',
    23: 'Tier exchange is invalid.',
    24: 'Substitution is invalid.',
    25: 'Unit cannot be dropped on another unit.',
    26: 'Move made out of turn.',
    27: 'Only drops allowed during initial arrangement.',
    28: 'Move cannot be perofrmed during the present state of the game.',
};

module.exports = {
    'errors': errors,
    'lib': gungi,
    'players': {
        'WHITE': 1,
        'BLACK': 2
    }
};
