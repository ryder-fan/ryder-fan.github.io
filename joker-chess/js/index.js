'use strict';

console.warn = function (...args) {
    console.log('[WARNING]', ...args);
    Dialog.warning('警告', args.join(' '));
};
console.error = function (...args) {
    console.log('[ERROR]', ...args);
    Dialog.error('错误', args.join(' '));
};

/**
 * @class 对话框类
 */
class Dialog {
    static info(title, text) {
        Swal.fire(
            title,
            text,
            'info',
        );
    }

    static success(title, text) {
        Swal.fire(
            title,
            text,
            'success',
        );
    }

    static error(title, text) {
        Swal.fire(
            title,
            text,
            'error',
        );
    }

    static warning(title, text) {
        Swal.fire(
            title,
            text,
            'warning',
        );
    }

    static confirm(title, text, callback) {
        Swal.fire({
            title: title,
            text: text,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: '确定',
            cancelButtonText: '取消',
        }).then((result) => {
            if (result.isConfirmed) {
                callback(true);
            } else {
                callback(false);
            }
        });
    }
}

/**
 * @class ImgManager 图片管理器
 */
class ImgManager {
    /**
     * @static #imgs 图片路径
     */
    static #imgs = {
        'CC-B': 'img/CC-B.png',
        'CC-C': 'img/CC-C.png',
        'CC-M': 'img/CC-M.png',
        'CC-P': 'img/CC-P.png',
        'CC-S': 'img/CC-S.png',
        'CC-W': 'img/CC-W.png',
        'CC-X': 'img/CC-X.png',
        'IC-B': 'img/IC-B.png',
        'IC-K': 'img/IC-K.png',
        'IC-N': 'img/IC-N.png',
        'IC-Q': 'img/IC-Q.png',
        'IC-R': 'img/IC-R.png',
        'IC-S': 'img/IC-S.png',
        'chosen-r': 'img/chosen-r.png',
        'chosen-b': 'img/chosen-b.png',
        'chosen-y': 'img/chosen-y.png',
        'background': 'img/background.png',
    };

    constructor() { }

    /**
     * 获取图片路径
     * @param {string} name 图片名称 
     * @returns 图片路径
     */
    static getImg(name) {
        if (!this.#imgs[name]) return '';
        else return this.#imgs[name];
    }

    /**
     * 加载所有图片
     * @param {function} whenFinish 加载完成回调函数
     * @returns {Promise<void>} 加载所有图片
     */
    static async loadImgs(whenFinish) {
        let startTick = Date.now();
        console.log('Start load imgs...');

        const loader_container = document.querySelector("#loader-container");
        const loadingtext = document.querySelector("#loadingtext");
        const loadingimg = document.querySelector("#loadingimg");

        let solve;
        let index = 0;
        let allImgNum = Object.keys(this.#imgs).length;

        for (let name in this.#imgs) {
            loadingimg.src = this.#imgs[name];
            loadingimg.onload = function () {
                index++;
                loadingtext.textContent = 'Loading (' + index + '/' + allImgNum + ') ...';
                solve();
            };
            loadingimg.onerror = function () {
                console.warn('error load img: ' + name);
                index++;
                loadingtext.textContent = 'Loading (' + index + '/' + allImgNum + ') ...';
                solve();
            };
            await new Promise(resolve => solve = resolve);
        }

        loader_container.parentNode && loader_container.parentNode.removeChild(loader_container);

        console.log('Load imgs done, time: ' + (Date.now() - startTick) + 'ms');
        whenFinish && whenFinish();
    }
}

/**
 * @class GameManager 游戏管理器
 */
class GameManager {
    /**
     * @static #size 页面大小
     */
    static size;
    /**
     * @static #board 棋盘节点
     */
    static #board_node;
    /**
     * @static #board_img 棋盘图片节点
     */
    static #board_img_node;
    /**
     * @static #board_img_moveFrom 移动来源的棋盘图片节点
     */
    static #board_img_moveFrom;
    /**
     * @static #board_img_moveTo 移动到位置的棋盘图片节点
     */
    static #board_img_moveTo;
    /**
     * @static #board_img_chosen 选中的棋盘图片节点
     */
    static #board_img_chosen;
    /**
     * @static #player_turn_node 当前走棋方显示节点
     */
    static #player_turn_node;
    /**
     * @static player_color 玩家颜色
     */
    static player_color = {
        CC: '红方',
        IC: '黑方',
    }
    /**
     * @static player_turn 当前走棋方
     */
    static player_turn;
    /**
     * @static chessMap 棋子映射
     * @readonly
     */
    static chessMap = {
        'CC-B1': {
            x: 2,
            y: 7,
            type: 'CC-B',
            color: 'CC',
            img: ImgManager.getImg('CC-B'),
        },
        'CC-B2': {
            x: 3,
            y: 7,
            type: 'CC-B',
            color: 'CC',
            img: ImgManager.getImg('CC-B'),
        },
        'CC-B3': {
            x: 4,
            y: 7,
            type: 'CC-B',
            color: 'CC',
            img: ImgManager.getImg('CC-B'),
        },
        'CC-B4': {
            x: 6,
            y: 7,
            type: 'CC-B',
            color: 'CC',
            img: ImgManager.getImg('CC-B'),
        },
        'CC-B5': {
            x: 7,
            y: 7,
            type: 'CC-B',
            color: 'CC',
            img: ImgManager.getImg('CC-B'),
        },
        'CC-C1': {
            x: 1,
            y: 7,
            type: 'CC-C',
            color: 'CC',
            img: ImgManager.getImg('CC-C'),
        },
        'CC-C2': {
            x: 8,
            y: 7,
            type: 'CC-C',
            color: 'CC',
            img: ImgManager.getImg('CC-C'),
        },
        'CC-M1': {
            x: 2,
            y: 8,
            type: 'CC-M',
            color: 'CC',
            img: ImgManager.getImg('CC-M'),
        },
        'CC-M2': {
            x: 7,
            y: 8,
            type: 'CC-M',
            color: 'CC',
            img: ImgManager.getImg('CC-M'),
        },
        'CC-P1': {
            x: 1,
            y: 8,
            type: 'CC-P',
            color: 'CC',
            img: ImgManager.getImg('CC-P'),
        },
        'CC-P2': {
            x: 8,
            y: 8,
            type: 'CC-P',
            color: 'CC',
            img: ImgManager.getImg('CC-P'),
        },
        'CC-S1': {
            x: 5,
            y: 7,
            type: 'CC-S',
            color: 'CC',
            img: ImgManager.getImg('CC-S'),
        },
        'CC-S2': {
            x: 5,
            y: 8,
            type: 'CC-S',
            color: 'CC',
            img: ImgManager.getImg('CC-S'),
        },
        'CC-W': {
            x: 4,
            y: 8,
            type: 'CC-W',
            color: 'CC',
            img: ImgManager.getImg('CC-W'),
        },
        'CC-X1': {
            x: 3,
            y: 8,
            type: 'CC-X',
            color: 'CC',
            img: ImgManager.getImg('CC-X'),
        },
        'CC-X2': {
            x: 6,
            y: 8,
            type: 'CC-X',
            color: 'CC',
            img: ImgManager.getImg('CC-X'),
        },

        'IC-B1': {
            x: 3,
            y: 1,
            type: 'IC-B',
            color: 'IC',
            img: ImgManager.getImg('IC-B'),
        },
        'IC-B2': {
            x: 6,
            y: 1,
            type: 'IC-B',
            color: 'IC',
            img: ImgManager.getImg('IC-B'),
        },
        'IC-K': {
            x: 4,
            y: 1,
            type: 'IC-K',
            color: 'IC',
            img: ImgManager.getImg('IC-K'),
        },
        'IC-N1': {
            x: 2,
            y: 1,
            type: 'IC-N',
            color: 'IC',
            img: ImgManager.getImg('IC-N'),
        },
        'IC-N2': {
            x: 7,
            y: 1,
            type: 'IC-N',
            color: 'IC',
            img: ImgManager.getImg('IC-N'),
        },
        'IC-Q': {
            x: 5,
            y: 1,
            type: 'IC-Q',
            color: 'IC',
            img: ImgManager.getImg('IC-Q'),
        },
        'IC-R1': {
            x: 1,
            y: 1,
            type: 'IC-R',
            color: 'IC',
            img: ImgManager.getImg('IC-R'),
        },
        'IC-R2': {
            x: 8,
            y: 1,
            type: 'IC-R',
            color: 'IC',
            img: ImgManager.getImg('IC-R'),
        },
        'IC-S1': {
            x: 1,
            y: 2,
            type: 'IC-S',
            color: 'IC',
            img: ImgManager.getImg('IC-S'),
        },
        'IC-S2': {
            x: 2,
            y: 2,
            type: 'IC-S',
            color: 'IC',
            img: ImgManager.getImg('IC-S'),
        },
        'IC-S3': {
            x: 3,
            y: 2,
            type: 'IC-S',
            color: 'IC',
            img: ImgManager.getImg('IC-S'),
        },
        'IC-S4': {
            x: 4,
            y: 2,
            type: 'IC-S',
            color: 'IC',
            img: ImgManager.getImg('IC-S'),
        },
        'IC-S5': {
            x: 5,
            y: 2,
            type: 'IC-S',
            color: 'IC',
            img: ImgManager.getImg('IC-S'),
        },
        'IC-S6': {
            x: 6,
            y: 2,
            type: 'IC-S',
            color: 'IC',
            img: ImgManager.getImg('IC-S'),
        },
        'IC-S7': {
            x: 7,
            y: 2,
            type: 'IC-S',
            color: 'IC',
            img: ImgManager.getImg('IC-S'),
        },
        'IC-S8': {
            x: 8,
            y: 2,
            type: 'IC-S',
            color: 'IC',
            img: ImgManager.getImg('IC-S'),
        },
    }
    /**
     * @static #chessManagers 棋子管理器
     */
    static ChessManagers = {
        'CC-B1': undefined,
        'CC-B2': undefined,
        'CC-B3': undefined,
        'CC-B4': undefined,
        'CC-B5': undefined,
        'CC-C1': undefined,
        'CC-C2': undefined,
        'CC-M1': undefined,
        'CC-M2': undefined,
        'CC-P1': undefined,
        'CC-P2': undefined,
        'CC-S1': undefined,
        'CC-S2': undefined,
        'CC-W': undefined,
        'CC-X1': undefined,
        'CC-X2': undefined,

        'IC-B1': undefined,
        'IC-B2': undefined,
        'IC-K': undefined,
        'IC-N1': undefined,
        'IC-N2': undefined,
        'IC-Q': undefined,
        'IC-R1': undefined,
        'IC-R2': undefined,
        'IC-S1': undefined,
        'IC-S2': undefined,
        'IC-S3': undefined,
        'IC-S4': undefined,
        'IC-S5': undefined,
        'IC-S6': undefined,
        'IC-S7': undefined,
        'IC-S8': undefined,
    }
    /**
     * @static movingChess 正在移动的棋子
     */
    static movingChess;

    /**
     * @function setup 游戏初始化
     */
    static setup() {
        this.#board_node = document.getElementById("board");
        this.#board_img_node = document.getElementById("board-img");
        this.#board_img_moveFrom = document.getElementById("move-from");
        this.#board_img_moveTo = document.getElementById("move-to");
        this.#board_img_chosen = document.getElementById("chosen");
        this.#player_turn_node = document.getElementById("player-turn");
        this.setupBoard();
        this.setSize();
    }

    /**
     * @function setSize 设置页面大小
     */
    static setSize() {
        this.size = Math.min(window.innerWidth, window.innerHeight);
        if (window.innerWidth >= window.innerHeight) {
            document.body.className = 'horizontal';
        } else {
            document.body.className = 'vertical';
        }
        this.#board_node.style.width = `${this.size * 0.8}px`;
        this.#board_node.style.height = `${this.size * 0.8}px`;
    }

    /**
     * @function setupBoard 棋盘初始化
     */
    static setupBoard() {
        this.#board_node.addEventListener('click', this.boardClicked.bind(this));
        this.#board_img_node.src = ImgManager.getImg('background');
        this.#board_img_moveFrom.src = ImgManager.getImg('chosen-y');
        this.#board_img_moveTo.src = ImgManager.getImg('chosen-y');
        this.#board_img_chosen.src = ImgManager.getImg('chosen-b');

        for (const id in this.chessMap)
            this.ChessManagers[id] = new ChessManager(id);

        this.player_turn = 'CC';
        this.#player_turn_node.textContent = `${this.player_color[this.player_turn]}`;
    }

    static choose(x, y) {
        this.#board_img_chosen.style.display = 'block';
        this.#board_img_chosen.style.left = `${(x - 1) * 12.5}%`;
        this.#board_img_chosen.style.top = `${(y - 1) * 12.5}%`;
    }

    static canMoveTipNode(x, y) {
        let node = document.createElement('img');
        node.id = 'canMovePos';
        node.src = ImgManager.getImg('chosen-r');
        node.alt = 'canMovePos';
        node.classList.add('selectBox');
        node.style.left = `${(x - 1) * 12.5}%`;
        node.style.top = `${(y - 1) * 12.5}%`;
        node.style.display = 'block';
        this.#board_node.appendChild(node);
    }

    static unChooseAll() {
        document.querySelectorAll('#canMovePos').forEach(node => node.remove());
        this.#board_img_chosen.style.display = 'none';

        for (const id in this.ChessManagers) {
            if (this.ChessManagers[id].status == 'chosen')
                this.ChessManagers[id].unChoose();
        }
        this.movingChess = undefined;
    }

    static getChessByPos(x, y) {
        for (const id in this.chessMap) {
            const chessManager = this.ChessManagers[id];
            if (chessManager.posx == x && chessManager.posy == y)
                return chessManager;
        }
        return undefined;
    }

    static boardClicked(event) {
        const x = Math.floor(event.offsetX / (this.size * 0.8 / 8)) + 1;
        const y = Math.floor(event.offsetY / (this.size * 0.8 / 8)) + 1;
        const chess = this.getChessByPos(x, y);

        if (!chess) {
            if (this.movingChess) this.movingChess.moveTo(x, y);
            else return;
        } else if (chess.status == '') {
            if (chess.id.startsWith(this.player_turn)) {
                this.unChooseAll();
                chess.choose();
            } else if (this.movingChess) this.movingChess.moveTo(x, y);
            else Dialog.error('不是你的回合', `现在为${this.player_color[this.player_turn]}走棋`);
        } else if (chess.status == 'chosen') this.unChooseAll();
    }

    static nextRound(fromx, fromy, tox, toy) {
        if (this.player_turn == 'CC') this.player_turn = 'IC';
        else this.player_turn = 'CC';
        this.#player_turn_node.textContent = `${this.player_color[this.player_turn]}`;
        this.#board_img_moveFrom.style.display = 'block';
        this.#board_img_moveFrom.style.left = `${(fromx - 1) * 12.5}%`;
        this.#board_img_moveFrom.style.top = `${(fromy - 1) * 12.5}%`;
        this.#board_img_moveTo.style.display = 'block';
        this.#board_img_moveTo.style.left = `${(tox - 1) * 12.5}%`;
        this.#board_img_moveTo.style.top = `${(toy - 1) * 12.5}%`;
        this.unChooseAll();
    }
}

/**
 * @class ChessManager 棋子管理器
 */
class ChessManager {
    /**
     * @readonly #chessMap 棋子映射
     */
    chessMap = GameManager.chessMap;
    /**
     * @readonly #chess_node 棋子节点
     */
    #chess_node;
    /**
     * @static #board_node;
     */
    #board_node;
    /**
     * @readonly #id 棋子id
     */
    id;
    /**
     * @readonly #type 棋子种类
     */
    type;
    /**
     * 棋子是否移动过
     */
    moved = false;
    /**
     * 棋子状态
     * '' 正常
     * 'chosen' 选中
     * 'eaten' 被吃掉
     */
    status = '';
    /**
     * 棋子位置x
     */
    posx;
    /**
     * 棋子位置y
     */
    posy;

    /**
     * 
     * @param {string} id 棋子id
     */
    constructor(id) {
        this.#board_node = document.getElementById("board");
        this.id = id;
        this.type = this.chessMap[id].type;
        this.createChess(id);
    }

    /**
     * @function unChoose 取消选中
     */
    unChoose() {
        if (GameManager.movingChess == this) GameManager.movingChess = undefined;
        this.status = '';
    }

    /**
     * @function choose 选中棋子
     */
    choose() {
        GameManager.movingChess = this;
        this.status = 'chosen';
        GameManager.choose(this.posx, this.posy);

        let canMovePosList = MoveManager.canMovePosList(this);
        console.log(canMovePosList);
        for (let pos of canMovePosList) GameManager.canMoveTipNode(pos[0], pos[1]);
    }

    /**
     * @function createChess 创建棋子
     */
    createChess() {
        this.#chess_node = document.createElement('div');
        this.#chess_node.id = this.id;
        this.#chess_node.classList.add('chess');

        const chessImg = document.createElement('img');
        chessImg.id = this.id + '-img';
        chessImg.src = this.chessMap[this.id].img;
        chessImg.alt = this.id;
        this.#chess_node.appendChild(chessImg);
        this.#board_node.appendChild(this.#chess_node);

        this.setPos(this.chessMap[this.id].x, this.chessMap[this.id].y);
    }

    /**
     * @function setPos 设置棋子位置
     * @param {-1|1|2|3|4|5|6|7|8} x x坐标
     * @param {-1|1|2|3|4|5|6|7|8} y y坐标
     */
    setPos(x, y) {
        if ([1, 2, 3, 4, 5, 6, 7, 8].includes(x) && [1, 2, 3, 4, 5, 6, 7, 8].includes(y)) {
            this.posx = x;
            this.posy = y;
            this.#chess_node.style.left = `${(x - 1) * 12.5}%`;
            this.#chess_node.style.top = `${(y - 1) * 12.5}%`;
        } else if (x == -1 && y == -1) {
            this.posx = -1;
            this.posy = -1;
            this.#chess_node.parentNode && this.#chess_node.parentNode.removeChild(this.#chess_node);
        } else console.warn(`Invalid position: (${x}, ${y}), Chess: ${this.id}`);
    }

    canMoveTo(x, y) {
        if (![1, 2, 3, 4, 5, 6, 7, 8].includes(x) || ![1, 2, 3, 4, 5, 6, 7, 8].includes(y)) return false;
        for (let pos of MoveManager.canMovePosList(this)) {
            if (pos[0] == x && pos[1] == y) return true;
        }
        return false;
    }

    moveTo(x, y) {
        if (this.status != 'chosen') return GameManager.unChooseAll();
        if (![1, 2, 3, 4, 5, 6, 7, 8].includes(x) || ![1, 2, 3, 4, 5, 6, 7, 8].includes(y)) return;
        if (!this.canMoveTo(x, y))
            return Dialog.warning('移动失败', `${this.id}不能从(${this.posx}, ${this.posy})移动到(${x}, ${y})`);
        else {
            if (GameManager.getChessByPos(x, y)) {
                const eatenChess = GameManager.getChessByPos(x, y);
                eatenChess.status = 'eaten';
                eatenChess.setPos(-1, -1);
            }
            this.moved = true;
            GameManager.nextRound(this.posx, this.posy, x, y);
            this.setPos(x, y);
        }
    }
}

/**
 * @class MoveManager 移动管理器
 */
class MoveManager {
    static isEmpty(posx, posy) {
        if (GameManager.getChessByPos(posx, posy)) return false;
        else return true;
    }

    static canEat(posx, posy, color) {
        if (this.isEmpty(posx, posy)) return true;
        const chess = GameManager.getChessByPos(posx, posy);
        if (chess.id.slice(0, 2) == color) return false;
        else return true;
    }

    static isBlock(posx, posy) {
        if ((posx == 1 || posx == 8) && posy == 6) return true;
        else return false;
    }

    static canMovePosList(chess) {
        const posx = chess.posx;
        const posy = chess.posy;

        if (chess.id.startsWith('CC') && this.isBlock(posx, posy)) return [];

        switch (chess.type) {
            case 'CC-B':
                return this.moveCCB(posx, posy);
            case 'CC-C':
                return this.moveCCC(posx, posy);
            case 'CC-M':
                return this.moveCCM(posx, posy);
            case 'CC-P':
                return this.moveCCP(posx, posy);
            case 'CC-S':
                return this.moveCCS(posx, posy);
            case 'CC-W':
                return this.moveCCW(posx, posy);
            case 'CC-X':
                return this.moveCCX(posx, posy);

            case 'IC-B':
                return this.moveICB(posx, posy);
            case 'IC-K':
                return this.moveICK(posx, posy);
            case 'IC-N':
                return this.moveICN(posx, posy);
            case 'IC-Q':
                return this.moveICQ(posx, posy);
            case 'IC-R':
                return this.moveICR(posx, posy);
            case 'IC-S':
                return this.moveICS(posx, posy);
        }

        return [];
    }

    static moveCCB(posx, posy) {
        let moves = [];

        if (this.canEat(posx, posy - 1, 'CC'))
            moves.push([posx, posy - 1]);
        if (posy <= 4 && this.canEat(posx - 1, posy, 'CC'))
            moves.push([posx - 1, posy]);
        if (posy <= 4 && this.canEat(posx + 1, posy, 'CC'))
            moves.push([posx + 1, posy]);

        return moves.filter((v) => v[0] >= 1 && v[0] <= 8 && v[1] >= 1 && v[1] <= 8);
    }

    static moveCCC(posx, posy) {
        let moves = [];

        for (let direction of [[-1, 0], [1, 0], [0, -1], [0, 1]])
            for (let distance = 1; distance <= 8; distance++) {
                let x = posx + direction[0] * distance;
                let y = posy + direction[1] * distance;
                if (x < 1 || x > 8 || y < 1 || y > 8) break;
                if (this.isBlock(x, y) && this.canEat(x, y, 'CC')) {
                    moves.push([x, y]);
                    break;
                }
                if (!this.isEmpty(x, y)) {
                    if (this.canEat(x, y, 'CC')) moves.push([x, y]);
                    break;
                }
                moves.push([x, y]);
            }

        return moves.filter((v) => v[0] >= 1 && v[0] <= 8 && v[1] >= 1 && v[1] <= 8);
    }

    static moveCCM(posx, posy) {
        let moves = [];

        if (this.isEmpty(posx, posy - 1) && this.canEat(posx + 1, posy - 2, 'CC'))
            moves.push([posx + 1, posy - 2]);
        if (this.isEmpty(posx, posy - 1) && this.canEat(posx - 1, posy - 2, 'CC'))
            moves.push([posx - 1, posy - 2]);
        if (this.isEmpty(posx + 1, posy) && this.canEat(posx + 2, posy - 1, 'CC'))
            moves.push([posx + 2, posy - 1]);
        if (this.isEmpty(posx - 1, posy) && this.canEat(posx - 2, posy - 1, 'CC'))
            moves.push([posx - 2, posy - 1]);
        if (this.isEmpty(posx, posy + 1) && this.canEat(posx + 1, posy + 2, 'CC'))
            moves.push([posx + 1, posy + 2]);
        if (this.isEmpty(posx, posy + 1) && this.canEat(posx - 1, posy + 2, 'CC'))
            moves.push([posx - 1, posy + 2]);
        if (this.isEmpty(posx + 1, posy) && this.canEat(posx + 2, posy + 1, 'CC'))
            moves.push([posx + 2, posy + 1]);
        if (this.isEmpty(posx - 1, posy) && this.canEat(posx - 2, posy + 1, 'CC'))
            moves.push([posx - 2, posy + 1]);

        return moves.filter((v) => v[0] >= 1 && v[0] <= 8 && v[1] >= 1 && v[1] <= 8);
    }

    static moveCCP(posx, posy) {
        let moves = [];

        for (let direction of [[-1, 0], [1, 0], [0, -1], [0, 1]])
            for (let distance = 1; distance <= 8; distance++) {
                let x = posx + direction[0] * distance;
                let y = posy + direction[1] * distance;
                if (x < 1 || x > 8 || y < 1 || y > 8) break;
                if (this.isBlock(x, y) && this.isEmpty(x, y)) {
                    moves.push([x, y]);
                    break;
                }
                if (!this.isEmpty(x, y)) break;
                moves.push([x, y]);
            }

        for (let targetx = 1; targetx <= 8; targetx++) for (let targety = 1; targety <= 8; targety++) {
            if (this.isEmpty(targetx, targety)) continue;
            if (!this.canEat(targetx, targety, 'CC')) continue;
            let targetChess = GameManager.getChessByPos(targetx, targety);
            let minx = Math.min(posx, targetx);
            let maxx = Math.max(posx, targetx);
            let miny = Math.min(posy, targety);
            let maxy = Math.max(posy, targety);
            let middleCount = 0;
            if (targetx == posx) {
                for (let middley = miny + 1; middley < maxy; middley++) {
                    if ((posx == 1 || posx == 8) && middley == 6) middleCount = Infinity;
                    if (!this.isEmpty(targetx, middley)) middleCount++;
                }
                if (middleCount == 1) moves.push([targetx, targety]);
            }
            if (targety == posy) {
                for (let middlex = minx + 1; middlex < maxx; middlex++) {
                    if (!this.isEmpty(middlex, targety)) middleCount++;
                }
                if (middleCount == 1) moves.push([targetx, targety]);
            }
            if (targetx != posx && targety != posy) {
                if (!targetChess.moved) continue;
                let k = (maxy - miny) / (maxx - minx);
                for (let i = 1; i < maxx - minx; i++) {
                    if (!Number.isInteger(k * i)) continue;
                    let middlex = minx + i;
                    let middley = miny + k * i;
                    if (!this.isEmpty(middlex, middley)) middleCount++;
                }
                if (middleCount == 1) moves.push([targetx, targety]);
            }
        }

        return moves.filter((v) => v[0] >= 1 && v[0] <= 8 && v[1] >= 1 && v[1] <= 8);
    }

    static moveCCS(posx, posy) {
        let moves = [];

        for (let direction of [[-1, -1], [-1, 1], [1, -1], [1, 1]]) {
            if (this.canEat(posx + direction[0], posy + direction[1], 'CC'))
                moves.push([posx + direction[0], posy + direction[1]]);
        }

        return moves.filter((v) => v[0] >= 1 && v[0] <= 8 && v[1] >= 1 && v[1] <= 8);
    }

    static moveCCW(posx, posy) {
        let moves = [];

        for (let direction of [[-1, 0], [1, 0], [0, -1], [0, 1], [-1, -1], [-1, 1], [1, -1], [1, 1]]) {
            if (this.canEat(posx + direction[0], posy + direction[1], 'CC'))
                moves.push([posx + direction[0], posy + direction[1]]);
        }

        return moves.filter((v) => v[0] >= 1 && v[0] <= 8 && v[1] >= 1 && v[1] <= 8);
    }

    static moveCCX(posx, posy) {
        let moves = [];

        for (let direction of [[-1, -1], [-1, 1], [1, -1], [1, 1]])
            for (let distance = 1; distance <= 3; distance++) {
                if (distance == 1) {
                    if (this.canEat(posx + direction[0], posy + direction[1], 'CC'))
                        moves.push([posx + direction[0], posy + direction[1]]);
                    continue;
                }
                if (this.isEmpty(posx + direction[0] * (distance - 1), posy + direction[1] * (distance - 1)))
                    if (this.canEat(posx + direction[0] * distance, posy + direction[1] * distance, 'CC'))
                        moves.push([posx + direction[0] * distance, posy + direction[1] * distance]);
        }

        return moves.filter((v) => v[0] >= 1 && v[0] <= 8 && v[1] >= 1 && v[1] <= 8);
    }

    static moveICB(posx, posy) {
        let moves = [];

        for (let direction of [[-1, -1], [-1, 1], [1, -1], [1, 1]])
            for (let distance = 1; distance <= 8; distance++) {
                let x = posx + direction[0] * distance;
                let y = posy + direction[1] * distance;
                if (x < 1 || x > 8 || y < 1 || y > 8) break;
                if (this.isBlock(x, y) && this.canEat(x, y, 'IC')) {
                    moves.push([x, y]);
                    break;
                }
                if (!this.isEmpty(x, y)) {
                    if (this.canEat(x, y, 'IC')) moves.push([x, y]);
                    break;
                }
                moves.push([x, y]);
            }

        return moves.filter((v) => v[0] >= 1 && v[0] <= 8 && v[1] >= 1 && v[1] <= 8);
    }

    static moveICK(posx, posy) {
        let moves = [];

        for (let direction of [[-1, 0], [1, 0], [0, -1], [0, 1], [-1, -1], [-1, 1], [1, -1], [1, 1]]) {
            if (this.canEat(posx + direction[0], posy + direction[1], 'IC'))
                moves.push([posx + direction[0], posy + direction[1]]);
        }

        return moves.filter((v) => v[0] >= 1 && v[0] <= 8 && v[1] >= 1 && v[1] <= 8);
    }
    
    static moveICN(posx, posy) {
        let moves = [];

        for (let direction of [[-1, -2], [-2, -1], [-2, 1], [-1, 2], [1, -2], [2, -1], [2, 1], [1, 2]]) {
            if (this.canEat(posx + direction[0], posy + direction[1], 'IC'))
                moves.push([posx + direction[0], posy + direction[1]]);
        }

        return moves.filter((v) => v[0] >= 1 && v[0] <= 8 && v[1] >= 1 && v[1] <= 8);
    }

    static moveICS(posx, posy) {
        let moves = [];

        if (this.isEmpty(posx, posy + 1))
            moves.push([posx, posy + 1]);
        if (!this.isEmpty(posx - 1, posy + 1) && this.canEat(posx - 1, posy + 1, 'IC'))
            moves.push([posx - 1, posy + 1]);
        if (!this.isEmpty(posx + 1, posy + 1) && this.canEat(posx + 1, posy + 1, 'IC'))
            moves.push([posx + 1, posy + 1]);
        if (posy == 2 && this.isEmpty(posx, posy + 1) && this.isEmpty(posx, posy + 2))
            moves.push([posx, posy + 2]);

        return moves.filter((v) => v[0] >= 1 && v[0] <= 8 && v[1] >= 1 && v[1] <= 8);
    }
}

document.addEventListener('DOMContentLoaded', () => ImgManager.loadImgs(GameManager.setup.bind(GameManager)));
window.addEventListener('resize', GameManager.setSize.bind(GameManager));
