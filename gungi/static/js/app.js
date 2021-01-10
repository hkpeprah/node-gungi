// Copyright (C) 2020 Ford Peprah

let React = window.React;
let ReactDOM = window.ReactDOM;
let e = React.createElement;

const urlParams = new URLSearchParams(window.location.search);


// ------------- FRONT -------------
// PAWN (兵)
// BOW (弓)
// PRODIGY (雛)
// HIDDEN DRAGON (臥)
// FORTRESS (砦)
// CATAPULT (砲)
// SPY (忍)
// SAMURAI (侍)
// CAPTAIN (謀)
// COMMANDER (帥)

// --------------- BACK ----------------
// BRONZE (へ)
// SILVER (さ)
// GOLD (と)
// ARROW (矢)
// PHOENIX (鳳)
// DRAGON KING (龍)
// LANCE (香)
// CLANDESTINITE (上)
// PIKE (槍)
// PISTOL (筒)

let gungiPieces = [
    {
        front: {
            name: 'Pawn',
            text: '兵',
            identifier: 'PZ'
        },
        back: {
            name: 'Bronze',
            text: 'へ',
            identifier: 'ZP'
        },
        row: 0,
        count: 7,
    },
    {
        front: {
            name: 'Pawn',
            text: '兵',
            identifier: 'PV'
        },
        back: {
            name: 'Silver',
            text: 'さ',
            identifier: 'VP'
        },
        row: 0,
        count: 1
    },
    {
        front: {
            name: 'Pawn',
            text: '兵',
            identifier: 'PG'
        },
        back: {
            name: 'Gold',
            text: 'と',
            identifier: 'GP'
        },
        row: 0,
        count: 1
    },
    {
        front: {
            name: 'Bow',
            text: '弓',
            identifier: 'BA'
        },
        back: {
            name: 'Arrow',
            text: '矢',
            identifier: 'AB'
        },
        row: 1,
        count: 2
    },
    {
        front: {
            name: 'Prodigy',
            text: '雛',
            identifier: 'RX'
        },
        back: {
            name: 'Phoenix',
            text: '鳳',
            identifier: 'XR'
        },
        row: 2,
        count: 1
    },
    {
        front: {
            name: 'Hidden Dragon',
            text: '臥',
            identifier: 'HK'
        },
        back: {
            name: 'Dragon King',
            text: '龍',
            identifier: 'KH'
        },
        row: 3,
        count: 1
    },
    {
        front: {
            name: 'Fortress',
            text: '砦',
            identifier: 'FL'
        },
        back: {
            name: 'Lance',
            text: '香',
            identifier: 'LF'
        },
        row: 4,
        count: 1
    },
    {
        front: {
            name: 'Catapult',
            text: '砲',
            identifier: 'TL'
        },
        back: {
            name: 'Lance',
            text: '香',
            identifier: 'LT'
        },
        row: 5,
        count: 1
    },
    {
        front: {
            name: 'Spy',
            text: '忍',
            identifier: 'YN'
        },
        back: {
            name: 'Clandestinite',
            text: '上',
            identifier: 'NY'
        },
        row: 6,
        count: 3
    },
    {
        front: {
            name: 'Samurai',
            text: '侍',
            identifier: 'SE',
            effects: [
                'Substitution'
            ]
        },
        back: {
            name: 'Pike',
            text: '槍',
            identifier: 'ES'
        },
        row: 7,
        count: 2
    },
    {
        front: {
            name: 'Captain',
            text: '謀',
            identifier: 'CI',
            effects: [
                'Tier Exchange'
            ]
        },
        back: {
            name: 'Pistol',
            text: '筒',
            identifier: 'IC'
        },
        row: 8,
        count: 2
    },
    {
        front: {
            name: 'Commander',
            text: '竜',
            identifier: 'O-'
        },
        back: null,
        row: 9,
        count: 1
    },
];

class Api {
    constructor() {
        this.port = urlParams.get('port');
        this.baseUrl = 'http://localhost:' + this.port + '/api/v1';
        this.ping('Hello World');
    }

    newGame(callback) {
        this.makeRequest('gungi/new', {}, callback);
    }

    restart(gameId, callback) {
        this.makeGameRequest(gameId, 'restart', {}, callback);
    }

    drop(gameId, id, col, row, callback, error, finish) {
        let data = { id: id, col: col, row: row };
        this.makeGameRequest(gameId, 'drop', data, callback, error, finish);
    }

    substitute(gameId, id, srcCol, srcRow, srcTier, destCol, destRow, destTier, callback, error, finish) {
        let data = {
            id: id,
            src: {
                col: srcCol,
                row: srcRow,
                tier: srcTier
            },
            dest: {
                col: srcCol,
                row: srcRow,
                tier: destTier
            }
        };
        this.makeGameRequest(gameId, 'sub', data, callback, error, finish);
    }

    immobileStrike(gameId, id, srcCol, srcRow, srcTier, destTier, callback, error, finish) {
        let data = {
            id: id,
            src: {
                col: srcCol,
                row: srcRow,
                tier: srcTier
            },
            dest: {
                col: srcCol,
                row: srcRow,
                tier: destTier
            }
        };
        this.makeGameRequest(gameId, 'attack', data, callback, error, finish);
    }

    move(gameId, id, srcCol, srcRow, srcTier, destCol, destRow, callback, error, finish) {
        let data = {
            id: id,
            src: {
                col: srcCol,
                row: srcRow,
                tier: srcTier
            },
            dest: {
                col: destCol,
                row: destRow
            }
        };
        this.makeGameRequest(gameId, 'move', data, callback, error, finish);
    }

    ping(message, callback) {
        console.info('--> Ping: ' + message);
        this.makeRequest('ping', { message: message }, callback || ((data) => {
            console.info('<-- Pong: ' + data.message);
        }));
    }

    makeGameRequest(id, req, data, callback, error, finish) {
        let ep = 'gungi/game/' + id + '/' + req;
        this.makeRequest(ep, data, ((data) => {
            if (callback) {
                callback(data.status, data);
            } else {
                console.error('No callback found for:', ep);
            }

            if (!data.status) {
                if (error) {
                    console.error('Error', data);
                    error(data.error);
                } else {
                    console.error('Unhandled error in API response:', data);
                }
            }

            if (data.result.over) {
                finish(data.result.draw, data.result.winner);
            }
        }).bind(this));
    }

    makeRequest(endpoint, data, callback) {
        let url = this.baseUrl + '/' + endpoint;
        console.debug('--> Request:', endpoint, data);
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then((response) => {
            try {
                return response.json()
            } catch (error) {
                console.error('--> Error:', error);
            }
            return null;
        }).then(data => {
            console.debug('<-- Response:', data);
            if (data) {
                callback(data);
            }
        });
    }
}

class Tower {
    constructor(row, col) {
        this.children = [];
        this.row = row;
        this.col = col;
    }

    getRow() {
        return this.row;
    }

    getCol() {
        return this.col;
    }

    getChild(index) {
        if (index >= this.children.length) {
            return null;
        } else if (index < 0) {
            return null;
        }
        return this.children[index];
    }

    getChildren() {
        return this.children;
    }

    getIndex(piece) {
        return this.children.indexOf(piece);
    }

    getSize() {
        return this.children.length;
    }

    insert(piece) {
        this.children.push(piece);
    }

    insertAt(index, piece) {
        this.children[index] = piece;
    }

    remove(piece) {
        let index = this.children.indexOf(piece);
        this.children.splice(index, 1);
    }

    swap(srcIndex, destIndex) {
        let src = this.children[srcIndex];
        let dest = this.children[destIndex];
        this.children[srcIndex] = dest;
        this.children[destIndex] = src;
    }
}

class Cell extends React.Component {
    constructor(props) {
        super(props);
        this.row = this.props.row;
        this.col = this.props.col;
        this.even = (((this.row * 9) + this.col) % 2 === 0);
        this.className = 'cell ' + (this.even ? 'light' : 'dark');
        this.cellRef = React.createRef();
    }

    onDragOver(event) {
        event.preventDefault();
    }

    onDrop(event) {
        let ref = this.cellRef.current;
        console.debug(`<-- Drop Stop @ (${this.row}, ${this.col}) (Empty)`);
        this.props.onPieceDropped(event, ref, this.row, this.col);
    }

    render() {
        return e('div', {
            className: this.className,
            onDragOver: this.onDragOver.bind(this),
            onDrop: this.onDrop.bind(this),
            ref: this.cellRef
        });
    }
}

class Row extends React.Component {
    constructor(props) {
        super(props);
        this.index = props.index;
        this.offset = 'calc(100% / 9 * ' + this.index + ')';
        this.style = {
            'top': this.offset
        }
    }

    render() {
        let cells = [];
        for (var col = 0; col < 9; col++) {
            cells.push(e(Cell, { col: col, row: this.index, onPieceDropped: this.props.onPieceDropped }));
        }
        return e('div', { className: 'row', style: this.style}, cells);
    }
}

class Grid extends React.Component {
    constructor(props) {
        super(props);
    }

    onDragOver(event) {
        event.preventDefault();
    }

    render() {
        let rows = [];

        for (var rowIndex = 0; rowIndex < 9; rowIndex++) {
            rows.push(e(Row, { index: rowIndex, onPieceDropped: this.props.onPieceDropped }));
        }

        return e('div', {
            className: (this.props.ingame ? '' : 'full ') + 'player-grid'
        },
        e('div', { className: 'grid-container' },
            e('div', {
                className: 'grid',
                onDragOver: this.onDragOver.bind(this)
            }, rows)
        ));
    }
}

class Tooltip extends React.Component {
    constructor(props) {
        super(props);
        this.state = { leftSide: true };
        this.tooltipRef = React.createRef();
    }

    componentDidMount() {
        let current = this.tooltipRef.current;
        let rect = current.getBoundingClientRect();
        let winWidth = (window.innerWidth || document.documentElement.clientWidth);
        if ((this.props.left + rect.width) > winWidth) {
            this.setState({ leftSide: false });
        }
    }

    render() {
        let children = [];

        children.push(e('div', { className: 'row' },
            e('div', { className: 'cell' }, this.props.piece.getName())
        ));

        return e('div', {
            className: 'tooltip ' + (this.state.leftSide ? 'left' : 'right'),
            ref: this.tooltipRef,
            style: {
                top: this.props.top + 15,
                left: this.props.left + (this.state.leftSide ? 60 : -148)
            }
        }, e('div', { className: 'tooltip-wrapper' }, children));
    }
}

class Piece extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            parent: null,
            draggable: this.props.draggable,
            side: this.props.piece.front,
            tower: null,
            stack: null,
            hovered: false,
            dragging: false,
            player: this.props.player
        };
        this.onParentChanged = this.onParentChanged.bind(this);
        this.onMoved = this.onMoved.bind(this);
        this.resizeTimeout = null;
        this.pieceRef = React.createRef();

        window.addEventListener('resize', this.onResize.bind(this));
    }

    componentDidMount() {
        let tower = this.state && this.state.tower ? this.state.tower : null;
        let position = null;

        this.props.onReady(this);

        if (!this.state.parent) {
            return;
        }

        position = this.calculatePosition(this.state.parent, tower);
        this.setState({ top: position.top, left: position.left });
    }

    componentDidUpdate() {
    }

    calculatePosition(parent, tower, stack) {
        let offset = getCumulativeOffset(parent);
        let newOffset = null;

        stack = stack ? stack : this.state.stack;

        if (tower) {
            // Placement in a tower.  Need to determine our index.
            let xDiff = null;
            let yDiff = null;
            let towerIndex = tower.getIndex(this);
            switch (towerIndex) {
                case 0:
                    xDiff = 26;
                    yDiff = 26;
                    break;
                case 1:
                    xDiff = 30;
                    yDiff = 30;
                    break;
                case 2:
                    xDiff = 34;
                    yDiff = 34;
                    break;
                default:
                    break;
            }

            newOffset = {
                top: offset.top + (parent.clientHeight / 2) - yDiff,
                left: offset.left + (parent.clientWidth / 2) - xDiff,
                zIndex: towerIndex
            };
        } else {
            // Placement in a stack.  This is some voodoo magic mainly for the
            // placement of the pawns, but it can work up to three of anything
            // really.
            let diffBefore = 0;
            let first = stack[0];
            let top = offset.top + (parent.clientHeight / 2);
            let left = offset.left + (parent.clientWidth / 2);
            for (let i = 0; i < stack.length; i++) {
                let next = stack[i];
                if (!next.equals(first)) {
                    diffBefore += 1;
                    first = next;
                }
                if (next.equals(this)) {
                    break;
                }
            }

            switch (diffBefore) {
                case 1:
                    top -= 40;
                    left -= 35;
                    break;
                case 2:
                    top -= 40;
                    left -= 16;
                    break;
                case 0:
                default:
                    top -= 26;
                    left -= 26;
                    break;
            }

            newOffset = { top: top, left: left };
        }
        return newOffset;
    }

    onCaptured(parent, stack) {
        let tower = this.state.tower;
        let newPlayer = this.state.player === 'black' ?
            'white' : 'black';

        tower.remove(this);
        tower.getChildren().forEach((p) => {
            p.onParentChanged(p.getParent(), tower);
        });

        stack.push(this);

        this.setState({ tower: null, stack: stack, player: newPlayer, side: this.getFlipSide() });
        this.onParentChanged(parent, null);
    }

    equals(p) {
        if (this.getSide().name !== p.getSide().name) {
            return false;
        }

        if (this.getFlipSide() === null) {
            if (p.getFlipSide() !== null) {
                return false;
            }
            return true;
        } else if (p.getFlipSide() === null) {
            return false;
        }

        return (this.getFlipSide().name === p.getFlipSide().name);
    }

    flip() {
        this.setState({ side: this.getFlipSide() });
    }

    getData() {
        return this.props.piece;
    }

    getEffects() {
        return this.getSide().effects || [];
    }

    getFlipSide() {
        let side = null;
        if (this.state.side.name === this.props.piece.front.name) {
            side = this.props.piece.back;
        } else {
            side = this.props.piece.front;
        }
        return side;
    }

    getId() {
        return this.state.side.identifier;
    }

    getName() {
        let text = toTitleCase(this.state.player) + ' ' + this.state.side.name;
        let flipSide = this.getFlipSide();
        if (flipSide !== null) {
            text += ' (' + flipSide.name + ')';
        }
        return text;
    }

    getParent() {
        return this.state.parent;
    }

    getPlayer() {
        return this.state.player;
    }

    getSide() {
        return this.state.side;
    }

    getStack() {
        return this.state.stack;
    }

    getTower() {
        return this.state.tower;
    }

    hasEffect(effect) {
        return this.getEffects().indexOf(effect) > -1;
    }

    hasSubstitution() {
        return this.hasEffect('Substitution');
    }

    hasTierExchange() {
        return this.hasEffect('Tier Exchange');
    }

    setParent(parent) {
        this.setState({ parent: parent });
    }

    setStack(stack) {
        let tower = this.state.tower;

        if (tower !== null) {
            tower.remove(this);
            tower.getChildren().forEach((p) => {
                p.onParentChanged(p.getParent(), tower);
            });
        }

        this.setState({ tower: null, stack: stack });
    }

    setTower(tower) {
        let index = null;

        if (this.state.stack !== null) {
            index = this.state.stack.indexOf(this);
            if (index > -1) {
                this.state.stack.splice(index, 1);
            }
        }

        tower.insert(this);

        this.setState({ tower: tower, stack: null });
    }

    onClick(event) {
        event.stopPropagation();
        event.preventDefault();

        if (!this.state.dragging) {
            this.pieceRef.current.focus();
            this.props.onPieceClicked(this);
        }

        this.pieceRef.current.draggable = false;
    }

    onDragOver(event) {
        event.preventDefault();
    }

    onDrop(event) {
        let tower = this.state.tower;
        let ref = this.state.parent;
        if (tower === null) {
            event.preventDefault();
            return null;
        }
        console.debug(`<-- Drop Stop @(${tower.getRow()}, ${tower.getCol()}) (${this.getId()})`);
        this.props.onPieceDropped(event, ref, tower.getRow(), tower.getCol());
    }

    onDragStart(event) {
        console.debug('--> Drag Start: ' + this.getName());
        this.setState({ hovered: false, dragging: true });
        this.props.onPieceDragged(this);
    }

    onDragEnd(event) {
        this.pieceRef.current.draggable = false;
        this.setState({ dragging: false });
    }

    onKeyDown(event) {
        let tower = this.state.tower;
        if (tower === null) {
            return null;
        }

        let row = tower.getRow();
        let col = tower.getCol();
        let tier = tower.getIndex(this);
        if (event.keyCode == 38) {
            // Up
            this.props.onImmobileStrike(this, row, col, tier + 1);
        } else if (event.keyCode == 40) {
            // Down
            this.props.onImmobileStrike(this, row, col, tier - 1);
        }
    }

    onMouseDown(event) {
        if (this.props.canMove(this)) {
            this.pieceRef.current.draggable = true;
        }
    }

    onMouseExit(event) {
        console.debug('<-- Mouse Exit: ' + this.getName());
        this.setState({ hovered: false });
    }

    onMouseOver(event) {
        if (!this.state.hovered) {
            console.debug('--> Mouse Enter: ' + this.getName());
        }
        this.setState({ hovered: true });
    }

    onParentChanged(parent, tower, stack) {
        let offset = this.calculatePosition(parent, tower, stack);
        let zIndex = offset.zIndex !== null ? offset.zIndex : 0;
        this.setState({ top: offset.top, left: offset.left, parent: parent, zIndex: zIndex });
    }

    onMoved(row, col, grid, parent) {
        let tower = this.state.tower;

        if (tower !== null) {
            tower.remove(this);
            tower.getChildren().forEach((p) => {
                p.onParentChanged(p.getParent(), tower);
            });
        }

        tower = grid[row][col];

        this.setTower(tower);
        this.onParentChanged(parent, tower);
    }

    onResize() {
        if (this.resizeTimeout !== null) {
            clearTimeout(this.resizeTimeout);
        }

        this.resizeTimeout = setTimeout((() => {
            this.onParentChanged(this.state.parent, this.state.tower);
            this.resizeTimeout = null;
        }).bind(this), 100 /* 100 ms */);
    }

    render() {
        let stack = this.state.stack;
        let tooltip = null;
        let attrs = null;

        if (stack === null) {
            if (this.state.tower === null) {
                return null;
            }
            stack = this.state.tower.getChildren();
        }

        attrs = {
            className: 'piece ' + this.state.player,
            'data-colour': this.state.player,
            'data-name': this.state.side.name,
            'data-id': this.state.side.identifer,
            'data-tier': !this.state.tower ? -1 : this.state.tower.getIndex(this),
            onClick: this.onClick.bind(this),
            onDragOver: this.onDragOver.bind(this),
            onDrop: this.onDrop.bind(this),
            onDragStart: this.onDragStart.bind(this),
            onDragEnd: this.onDragEnd.bind(this),
            onKeyDown: this.onKeyDown.bind(this),
            onMouseDown: this.onMouseDown.bind(this),
            onMouseLeave: this.onMouseExit.bind(this),
            onMouseEnter: this.onMouseOver.bind(this),
            ref: this.pieceRef,
            style: {
                top: this.state.top,
                left: this.state.left,
                zIndex: this.state.zIndex
            },
            tabIndex: -1
        };

        if (this.state.hovered) {
            tooltip = e(Tooltip, { piece: this, top: this.state.top, left: this.state.left });
        }

        return [
            e('div', attrs,
                e('div', { className: 'content' },
                    e('span', {}, this.state.side.text)
                )
            ),
            tooltip
        ];
    }
}

class Layout extends React.Component {
    constructor(props) {
        super(props);
        this.layoutRef = React.createRef();
    }

    componentDidMount() {
        this.props.onPlayerReady(this.props.player, this.layoutRef.current);
    }

    render() {
        let children = [];
        let maxRow = gungiPieces.reduce((acc, curr) => {
            return (acc.row > curr.row ? acc.row : curr.row);
        });

        for (var i = 0; i <= maxRow; i++) {
            children.push(e('div', {
                className: 'piece-rest'
            }));
        }

        return e('div', { className: 'player-board', ref: this.layoutRef }, children);
    }
}

class TurnIndicator extends React.Component {
    constructor(props) {
        super(props);

        this.state = { turn: this.props.turn, top: 5 };
        this.resizeTimeout = null;

        window.addEventListener('resize', this.onResize.bind(this));
    }

    componentDidMount() {
        this.onResize(1);
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ turn: nextProps.turn });
    }

    onResize(timeout) {
        if (this.resizeTimeout !== null) {
            clearTimeout(this.resizeTimeout);
        }

        this.resizeTimeout = setTimeout((() => {
            let grid = document.getElementsByClassName('player-grid');
            if (grid && grid[0]) {
                this.setState({ top: grid[0].offsetTop - 58 });
            }
            this.resizeTimeout = null;
        }).bind(this), timeout || 100 /* ms */);
    }

    render() {
        return e('div', { className: 'turn-indicator', style: { top: this.state.top } },
            e('div', { className: 'row' },
                e('div', { className: 'cell' }, e('span', {}, toTitleCase(this.state.turn))),
                e('div', { className: 'cell ' + this.state.turn })
            )
        );
    }
}

class Copyright extends React.Component {
    render() {
        return e('div', { className: 'copyright' },
            e('span', {
                dangerouslySetInnerHTML: {
                    __html: 'Copyright &copy; 2020 Ford Peprah'
                }
            })
        );
    }
}

class GameBoard extends React.Component {
    render() {
        let children = [];

        children.push(e(Grid, {
            ingame: this.props.ingame,
            onPieceDropped: this.props.onPieceDropped
        }));

        if (this.props.ingame) {
            children.splice(0, 0, e(Layout, {
                player: 'black',
                ingame: this.props.ingame,
                start: this.props.start,
                onPlayerReady: this.props.onPlayerReady
            }));

            children.push(e(Layout, {
                player: 'white',
                ingame: this.props.ingame,
                start: this.props.start,
                onPlayerReady: this.props.onPlayerReady
            }));

            children.push(e(TurnIndicator, {
                turn: this.props.turn
            }));

            children.push(e(Copyright, {}));
        }

        return e('div', { className: 'game-board' }, children);
    }
}

class Button extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let className = 'btn block';
        if (this.props.disabled) {
            className += ' disabled';
        }
        return e('a', { className: className, onClick: this.props.onClick },
            e('span', {}, this.props.text));
    }
}

class Logo extends React.Component {
    render() {
        return e('img', { src: 'static/images/logo.png' });
    }
}

class Menu extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let paused = this.props.paused;
        let startText = paused ? 'Resume' : 'New Game';
        let exitText = paused ? 'Exit' : 'Quit';
        if (this.props.ingame && !this.props.paused) {
            return null;
        }
        return e('div', { className: 'overlay' },
            e('div', { className: 'flex-center' },
                e('div', { className: 'content' },
                    e(Logo),
                    e(Button, { text: startText, onClick: this.props.onStart }),
                    paused ? null : e(Button, { text: 'Continue Game', disabled: true, onClick: this.props.onContinue }),
                    e(Button, { text: 'Credits', onClick: (ev) => { this.props.onCredits(true) } }),
                    e(Button, { text: exitText, onClick: this.props.onQuit })
                )
            )
        );
    }
}

class Credits extends React.Component {
    render() {
        let children = [];
        let addCredit = (title, text) => {
            children.push(e('div', { className: 'row' },
                e('div', { className: 'cell' },
                    e('span', { className: '' }, title),
                    e('span', {
                        className: '',
                        dangerouslySetInnerHTML: {__html: text }
                    })
                )
            ));
        };

        if (!this.props.visible) {
            return null;
        }

        addCredit('Developed by', 'Ford Peprah');
        addCredit('Copyright', '&copy; Ford Peprah 2020');

        return e('div', { className: 'credits', onClick: this.props.onClick },
            e('div', { className: 'credits-wrapper' },
                e('div', { className: 'content-wrapper' },
                    e('div', { className: 'content' },
                        e('h1', {}, 'Credits'),
                        e('div', { className: 'line' }),
                        children
                    )
                )
            )
        );
    }
}

class ErrorWindow extends React.Component {
    constructor(props) {
        super(props);
        this.timeout = null;
    }

    componentDidUpdate() {
        if (this.props.message) {
            this.timeout = setTimeout(this.onClick.bind(this), 1500 /* 1.5 seconds */);
        }
    }

    onClick() {
        if (this.timeout) {
            clearTimeout(this.timeout);
        }
        this.props.onClick();
    }

    render() {
        if (!this.props.message) {
            return null;
        }

        return e('div', { className: 'dialog', onClick: this.onClick.bind(this) },
            e('div', { className: 'dialog-wrapper' },
                e('div', { className: 'dialog-content' },
                    e('label', {
                        className: 'dialog-close',
                        dangerouslySetInnerHTML: {
                            __html: '&#x2715;'
                        }
                    }),
                    e('h2', {}, 'Error'),
                    e('span', { className: 'dialog-border' }),
                    e('span', {}, this.props.message)
                )
            )
        );
    }
}

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ingame: false,
            paused: false,
            start: true,
            credits: false,
            piecesBlack: [],
            piecesWhite: [],
            turn: 'black',
            gameId: null,
            error: null
        };
        this.pieces = [];
        this.currentPiece = null;
        this.grid = [];
        this.hand = {};
        this.focusRef = React.createRef();
        this.blackRef = null;
        this.whiteRef = null;
        this.api = new Api();
        this.api.newGame(((data) => {
            this.setState({ gameId: data.id });
        }).bind(this));
    }

    componentDidMount() {
        this.focusRef.current.focus();
    }

    canMove(piece) {
        if (piece.getPlayer() !== this.getTurn()) {
            return false;
        }

        return true;
    }

    capture(piece) {
        let ref = piece.getPlayer() === 'white' ?
            this.blackRef : this.whiteRef;
        let data = piece.getData();
        console.debug(`--> ${piece.getName()} captured`)
        piece.onCaptured(ref.children[data.row], this.hand[piece.getPlayer()][data.row]);
    }

    getTurn() {
        return this.state.turn;
    }

    onKeyDown(event) {
        if (event.keyCode == 32) {
            // Space
            console.debug('--> Paused');
            this.setState({ paused: true });
            event.preventDefault();
            event.stopPropagation();
        }
    }

    onCredits(state) {
        if (state) {
            console.debug('--> Credits');
        } else {
            console.debug('<-- Credits');
        }
        this.setState({ credits: state });
    }

    onErrorDismissed() {
        console.debug('--> Error');
        this.setState({ error: null });
    }

    onStart() {
        let grid = null;
        let hand = null;
        let maxRow = null;
        let piecesWhite = [];
        let piecesBlack = [];
        if (this.state.paused) {
            return this.setState({ paused: false });
        }

        grid = [];
        hand = {'white': [], 'black': []};
        maxRow = gungiPieces.reduce((acc, curr) => {
            return (acc.row > curr.row ? acc.row : curr.row);
        });

        for (var row = 0; row <= maxRow; row++) {
            hand['white'].push([]);
            hand['black'].push([]);
        }

        for (var row = 0; row < 9; row++) {
            grid.push([]);
        }

        for (var row = 8; row >= 0; row--) {
            for (var col = 0; col < 9; col++) {
                grid[row].push(new Tower(row, col));
            }
        }

        for (let i = 0; i < gungiPieces.length; i++) {
            let piece = gungiPieces[i];
            for (let j = 0; j < piece.count; j++) {
                piecesBlack.push({ id: piecesBlack.length, piece: piece, player: 'black' });
                piecesWhite.push({ id: piecesWhite.length, piece: piece, player: 'white' });
            }
        }

        console.debug('--> Start');
        this.grid = grid;
        this.hand = hand;
        this.pieces = [];
        this.blackRef = null;
        this.whiteRef = null;

        this.onError = this.onError.bind(this);
        this.onFinish = this.onFinish.bind(this);

        this.api.restart(this.state.gameId, ((piecesWhite, piecesBlack) => {
            return ((data) => {
                this.setState({
                    ingame: true,
                    paused: false,
                    start: true,
                    turn: 'black',
                    piecesWhite: piecesWhite,
                    piecesBlack: piecesBlack
                });
            }).bind(this);
        }).bind(this)(piecesWhite, piecesBlack));
    }

    onError(error) {
        this.setState({
            error: error.string
        });
    }

    onFinish(draw, winner) {
        console.log('Game Over', 'Draw', draw, 'Winner', winner);
    }

    onQuit() {
        if (this.state.paused) {
            console.debug('--> Main Menu')
            this.setState({
                ingame: false,
                paused: false,
                piecesWhite: [],
                piecesBlack: []
            });
        } else {
            window.close();
        }
    }

    onPlayerReady(player, ref) {
        if (player === 'black') {
            this.blackRef = ref;
        } else {
            this.whiteRef = ref;
        }
    }

    onImmobileStrike(piece, row, col, targetTier) {
        let tower = this.grid[row][col];
        let tier = tower.getIndex(piece);
        let targetPiece = tower.getChild(targetTier);
        if (targetPiece === null) {
            return;
        } else if (targetPiece.getPlayer() === piece.getPlayer()) {
            return;
        }

        this.api.immobileStrike(this.state.gameId, piece.getId(), col, row, tier, targetTier, ((row, col, tier) => {
            return ((status) => {
                // Immobile strike succeeded, so capture piece.
                return this.onImmobileStrikeCallback(status, row, col, tier);
            }).bind(this);
        }).bind(this)(row, col, targetTier), this.onError, this.onFinish);
    }

    onPieceAdded(piece) {
        let stack = null;
        let row = null;
        let player = null;

        if (this.pieces.length < 46) {
            this.pieces.push(piece);

            player = piece.getPlayer();
            row = piece.getData().row;

            stack = this.hand[player][row];
            stack.push(piece);

            if (this.pieces.length != 46) {
                return;
            }
        } else {
            return;
        }

        this.pieces.forEach(((piece) => {
            player = piece.getPlayer();
            row = piece.getData().row;

            stack = this.hand[player][row];
            piece.setStack(stack);

            if (player == 'black') {
                piece.onParentChanged(this.blackRef.children[row], null, stack);
            } else {
                piece.onParentChanged(this.whiteRef.children[row], null, stack);
            }
        }).bind(this));
    }

    onPieceClicked(piece) {
        let source = null;
        let target = piece;
        if (piece.getPlayer() !== this.getTurn()) {
            return null;
        } else if (this.currentPiece === null) {
            this.currentPiece = piece;
            return;
        }

        source = this.currentPiece;
        this.currentPiece = null;

        // Check the condition for different effects that occur when a piece is
        // clicked.
        if ((piece.hasTierExchange() || source.hasTierExchange()) &&
            (piece.getTower() === source.getTower()) &&
            (piece.getTower() !== null)) {
            // Handle 1-3 Tier Exchange
            let tower = piece.getTower();
            let col = tower.getCol();
            let row = tower.getRow();
            let srcTier = tower.getIndex(source);
            let destTier = tower.getIndex(piece);
            this.api.substitute(this.state.gameId, source.getId(), col, row, srcTier, col, row, destTier, ((source, piece) => {
                return ((status) => {
                    return this.onSubCallback(status, source, piece);
                }).bind(this);
            }).bind(this)(source, piece));
        } else if ((piece.hasSubstitution() || source.hasSubstitution()) &&
                   (source.getTower() !== piece.getTower()) &&
                   (source.getTower() !== null) &&
                   (piece.getTower() !== null)) {
            // Handle Substitution
            let srcTower = source.getTower();
            let srcCol = srcTower.getCol();
            let srcRow = srcTower.getRow();
            let srcTier = srcTower.getIndex(source);
            let destTower = piece.getTower();
            let destCol = destTower.getCol();
            let destRow = destTower.getRow();
            let destTier = destTower.getIndex(piece);
            this.api.substitute(
                this.state.gameId, source.getId(), srcCol, srcRow, srcTier, destCol, destRow, destTier,
                ((source, piece) => {
                    return ((status) => {
                        return this.onSubCallback(status, source, piece);
                    }).bind(this);
                }).bind(this)(source, piece)
            );
        }
    }

    onPieceDragged(current) {
        this.currentPiece = current;
    }

    onPieceDropped(event, ref, row, col) {
        let piece = null;
        let stack = null;
        let callback = null;
        if (this.currentPiece === null) {
            return null;
        }

        event.preventDefault();
        piece = this.currentPiece;
        this.currentPiece = null;

        callback = (((piece, row, col, ref) => {
            return ((status) => {
                return this.onMoveCallback(status, piece, row, col, ref);
            }).bind(this);
        }).bind(this)(piece, row, col, ref));

        // TODO: IMPLEMENT ALL OF THE LOGIC HERE FOR COMMUNICATING UPSTREAM THE
        // MOVE BEING MADE.
        //   2. Forced Recovery
        //   4. Forced Recovery Rejection
        //   5. Betrayal
        //   6. Forced Re-arrangement
        if (piece.getTower() === null) {
            this.api.drop(this.state.gameId, piece.getId(), col, row, callback, this.onError, this.onFinish);
        } else {
            // Either this is a move, or an attack.  We need to make that
            // distinction here by prompting the user with a pop-up.  If they
            // indicate an attack, then we make an attack, otherwise we make
            // a move.
            let newTower = this.grid[row][col];
            let curTower = piece.getTower();
            if (!newTower.getSize()) {
                // New tower is empty, so just move there.
                this.api.move(this.state.gameId, piece.getId(), curTower.getCol(), curTower.getRow(), 0, col, row, callback, this.onError, this.onFinish);
            } else {
                // New tower is not empty, so we need to check whether this is a
                // mobile strike, or an immobile strike.  A mobile strike occurs
                // if this tower is not the same as our tower, otherwise it is an
                // immobile strike.  We will prompt the user to determine, in the
                // case of a mobile strike, whether they want to move or do a
                // mobile strike, provided the top piece is a different colour
                // than they are.
                if (newTower == curTower) {
                    // This is an immobile strike, so just stop here.
                    return;
                } else {
                    // This must be a mobile strike, or a move.
                    let target = null;
                    if (newTower.getChild(newTower.getSize() - 1).getPlayer() == piece.getPlayer()) {
                        // This is a move.
                        this.api.move(this.state.gameId, piece.getId(), curTower.getCol(), curTower.getRow(), 0, col, row, callback, this.onError, this.onFinish);
                    } else {
                        // Prompt for a mobile strike or move.
                        // TODO: Currently, we always treat a move as mobile strike, so we do not need
                        // to handle this specially, for now.
                        this.api.move(this.state.gameId, piece.getId(), curTower.getCol(), curTower.getRow(), 0, col, row, callback, this.onError, this.onFinish);
                    }
                }
            }
        }
    }

    onTurnChanged() {
        let turn = null;
        if (this.state.turn === 'black') {
            turn = 'white';
        } else {
            turn = 'black';
        }

        this.setState({ turn: turn });
    }

    onImmobileStrikeCallback(status, row, col, tier) {
        if (status) {
            this.capture(this.grid[row][col].getChild(tier));
            this.onTurnChanged();
        }
    }

    onMoveCallback(status, piece, row, col, ref) {
        let newTower = this.grid[row][col];
        if (!status) {
            return;
        }

        if ((newTower.getSize()) &&
            (newTower.getChild(newTower.getSize() - 1).getPlayer() !== piece.getPlayer())) {
            // Capture the top piece.
            this.capture(newTower.getChild(newTower.getSize() - 1));
        }

        // If the move was successful, then trigger the indication as such.
        console.debug(`--> ${piece.getName()} moved to (${row}, ${col})`);
        piece.onMoved(row, col, this.grid, ref);
        this.onTurnChanged();
    }

    onSubCallback(status, source, dest) {
        let srcTower = source.getTower();
        let destTower = dest.getTower()
        let srcTier = null;
        let destTier = null;
        let tower = null;
        let srcParent = null;
        let destParent = null;
        if (!status) {
            return;
        }

        if (srcTower == destTower) {
            tower = srcTower;
            tower.swap(tower.getIndex(source), tower.getIndex(dest));

            source.setTower(tower);
            source.onParentChanged(source.getParent(), tower);

            dest.setTower(tower);
            dest.onParentChanged(dest.getParent(), tower);
        } else {
            srcTier = srcTower.getIndex(source);
            destTier = destTower.getIndex(dest);

            srcParent = source.getParent();
            destParent = dest.getParent();

            srcTower.insertAt(srcTier, dest);
            destTower.insertAt(destTier, source);

            source.setTower(destTower);
            source.onParentChanged(destParent, destTower);

            dest.setTower(srcTower);
            dest.onParentChanged(srcParent, srcTower);
        }

        this.onTurnChanged();
    }

    render() {
        let children = [];
        let pieces = this.state.piecesBlack.concat(this.state.piecesWhite);

        children.push(e(GameBoard, {
            ingame: this.state.ingame,
            start: this.state.start,
            turn: this.state.turn,
            onPieceDropped: this.onPieceDropped.bind(this),
            onPlayerReady: this.onPlayerReady.bind(this)
        }));

        children.push(e(Menu, {
            ingame: this.state.ingame,
            paused: this.state.paused,
            onCredits: this.onCredits.bind(this),
            onStart: this.onStart.bind(this),
            onQuit: this.onQuit.bind(this)
        }));

        pieces.forEach(((piece, idx) => {
            children.push(e(Piece, {
                id: piece.id,
                piece: piece.piece,
                player: piece.player,
                canMove: this.canMove.bind(this),
                onImmobileStrike: this.onImmobileStrike.bind(this),
                onReady: this.onPieceAdded.bind(this),
                onPieceClicked: this.onPieceClicked.bind(this),
                onPieceDropped: this.onPieceDropped.bind(this),
                onPieceDragged: this.onPieceDragged.bind(this)
            }));
        }).bind(this));

        children.push(e(Credits, {
            visible: this.state.credits,
            onClick: ((ev) => {
                this.onCredits(false);
            }).bind(this)
        }));

        children.push(e(ErrorWindow, {
            message: this.state.error,
            onClick: ((ev) => {
                this.onErrorDismissed();
            }).bind(this)
        }));

        return e('div', {
            className: 'app' + (this.state.ingame ? '' : ' full'),
            ref: this.focusRef,
            onKeyDown: this.onKeyDown.bind(this),
            tabIndex: -1
        }, children);
    }
}

function getCumulativeOffset(elem) {
    let top = 0;
    let left = 0;
    do {
        top += elem.offsetTop  || 0;
        left += elem.offsetLeft || 0;
        elem = elem.offsetParent;
    } while (elem != null);

    return { top: top, left: left };
}

function toTitleCase(str) {
    return str.replace(/\w\S*/g, (txt) => {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}

document.addEventListener('DOMContentLoaded', function(ev) {
    let app = React.createElement(App);
    ReactDOM.render(app, document.getElementById('app-container'));
});
