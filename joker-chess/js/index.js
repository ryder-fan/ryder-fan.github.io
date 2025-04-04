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
                console.warn('error load img: ' + id);
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
            type: 'B',
            color: 'CC',
            img: ImgManager.getImg('CC-B'),
        },
        'CC-B2': {
            x: 3,
            y: 7,
            type: 'B',
            color: 'CC',
            img: ImgManager.getImg('CC-B'),
        },
        'CC-B3': {
            x: 4,
            y: 7,
            type: 'B',
            color: 'CC',
            img: ImgManager.getImg('CC-B'),
        },
        'CC-B4': {
            x: 6,
            y: 7,
            type: 'B',
            color: 'CC',
            img: ImgManager.getImg('CC-B'),
        },
        'CC-B5': {
            x: 7,
            y: 7,
            type: 'B',
            color: 'CC',
            img: ImgManager.getImg('CC-B'),
        },
        'CC-C1': {
            x: 1,
            y: 7,
            type: 'CC',
            color: 'CC',
            img: ImgManager.getImg('CC-C'),
        },
        'CC-C2': {
            x: 8,
            y: 7,
            type: 'CC',
            color: 'CC',
            img: ImgManager.getImg('CC-C'),
        },
        'CC-M1': {
            x: 2,
            y: 8,
            type: 'M',
            color: 'CC',
            img: ImgManager.getImg('CC-M'),
        },
        'CC-M2': {
            x: 7,
            y: 8,
            type: 'M',
            color: 'CC',
            img: ImgManager.getImg('CC-M'),
        },
        'CC-P1': {
            x: 1,
            y: 8,
            type: 'P',
            color: 'CC',
            img: ImgManager.getImg('CC-P'),
        },
        'CC-P2': {
            x: 8,
            y: 8,
            type: 'P',
            color: 'CC',
            img: ImgManager.getImg('CC-P'),
        },
        'CC-S1': {
            x: 5,
            y: 7,
            type: 'S',
            color: 'CC',
            img: ImgManager.getImg('CC-S'),
        },
        'CC-S2': {
            x: 5,
            y: 8,
            type: 'S',
            color: 'CC',
            img: ImgManager.getImg('CC-S'),
        },
        'CC-W': {
            x: 4,
            y: 8,
            type: 'W',
            color: 'CC',
            img: ImgManager.getImg('CC-W'),
        },
        'CC-X1': {
            x: 3,
            y: 8,
            type: 'X',
            color: 'CC',
            img: ImgManager.getImg('CC-X'),
        },
        'CC-X2': {
            x: 6,
            y: 8,
            type: 'X',
            color: 'CC',
            img: ImgManager.getImg('CC-X'),
        },

        'IC-B1': {
            x: 3,
            y: 1,
            type: 'B',
            color: 'IC',
            img: ImgManager.getImg('IC-B'),
        },
        'IC-B2': {
            x: 6,
            y: 1,
            type: 'B',
            color: 'IC',
            img: ImgManager.getImg('IC-B'),
        },
        'IC-K': {
            x: 4,
            y: 1,
            type: 'K',
            color: 'IC',
            img: ImgManager.getImg('IC-K'),
        },
        'IC-N1': {
            x: 2,
            y: 1,
            type: 'N',
            color: 'IC',
            img: ImgManager.getImg('IC-N'),
        },
        'IC-N2': {
            x: 7,
            y: 1,
            type: 'N',
            color: 'IC',
            img: ImgManager.getImg('IC-N'),
        },
        'IC-Q': {
            x: 5,
            y: 1,
            type: 'Q',
            color: 'IC',
            img: ImgManager.getImg('IC-Q'),
        },
        'IC-R1': {
            x: 1,
            y: 1,
            type: 'R',
            color: 'IC',
            img: ImgManager.getImg('IC-R'),
        },
        'IC-R2': {
            x: 8,
            y: 1,
            type: 'R',
            color: 'IC',
            img: ImgManager.getImg('IC-R'),
        },
        'IC-S1': {
            x: 1,
            y: 2,
            type: 'S',
            color: 'IC',
            img: ImgManager.getImg('IC-S'),
        },
        'IC-S2': {
            x: 2,
            y: 2,
            type: 'S',
            color: 'IC',
            img: ImgManager.getImg('IC-S'),
        },
        'IC-S3': {
            x: 3,
            y: 2,
            type: 'S',
            color: 'IC',
            img: ImgManager.getImg('IC-S'),
        },
        'IC-S4': {
            x: 4,
            y: 2,
            type: 'S',
            color: 'IC',
            img: ImgManager.getImg('IC-S'),
        },
        'IC-S5': {
            x: 5,
            y: 2,
            type: 'S',
            color: 'IC',
            img: ImgManager.getImg('IC-S'),
        },
        'IC-S6': {
            x: 6,
            y: 2,
            type: 'S',
            color: 'IC',
            img: ImgManager.getImg('IC-S'),
        },
        'IC-S7': {
            x: 7,
            y: 2,
            type: 'S',
            color: 'IC',
            img: ImgManager.getImg('IC-S'),
        },
        'IC-S8': {
            x: 8,
            y: 2,
            type: 'S',
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

        for (const id in this.chessMap)
            this.ChessManagers[id] = new ChessManager(id);

        this.player_turn = 'CC';
        this.#player_turn_node.textContent = `${this.player_color[this.player_turn]}`;
    }

    static unChooseAll() {
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
        if (!this.movingChess) return;
        const x = Math.floor(event.offsetX / (this.size * 0.8 / 8));
        const y = Math.floor(event.offsetY / (this.size * 0.8 / 8));
        if ([1, 2, 3, 4, 5, 6, 7, 8].includes(x) && [1, 2, 3, 4, 5, 6, 7, 8].includes(y))
            this.movingChess.moveTo(x, y);
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
        this.createChess(id);
    }

    /**
     * @function unChoose 取消选中
     */
    unChoose() {
        if (GameManager.movingChess == this) GameManager.movingChess = undefined;
        this.status = '';
        this.#chess_node.classList.remove('chosen');
    }

    /**
     * @function choose 选中棋子
     */
    choose() {
        if (this.id.startsWith(GameManager.player_turn)) {
            GameManager.movingChess = this;
            this.status = 'chosen';
            this.#chess_node.classList.add('chosen');
        } else {
            Dialog.error('不是你的回合', `现在为${GameManager.player_color[GameManager.player_turn]}走棋`);
        }
    }

    /**
     * @function createChess 创建棋子
     */
    createChess() {
        this.#chess_node = document.createElement('div');
        this.#chess_node.id = this.id;
        this.#chess_node.classList.add('chess');
        this.#chess_node.addEventListener('click', this.onClicked.bind(this));

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
     * @param {1|2|3|4|5|6|7|8} x x坐标
     * @param {1|2|3|4|5|6|7|8} y y坐标
     */
    setPos(x, y) {
        if ([1, 2, 3, 4, 5, 6, 7, 8].includes(x) && [1, 2, 3, 4, 5, 6, 7, 8].includes(y)) {
            this.posx = x;
            this.posy = y;
            this.#chess_node.style.left = `${(x - 1) * 12.5}%`;
            this.#chess_node.style.top = `${(y - 1) * 12.5}%`;
        } else console.warn(`Invalid position: (${x}, ${y}), Chess: ${this.id}`);
    }

    onClicked() {
        if (this.status == '') {
            GameManager.unChooseAll();
            this.choose();
        } else if (this.status == 'chosen') {
            this.unChoose();
        }
    }

    moveTo(x, y) {
        if (this.status != 'chosen') return GameManager.unChooseAll();
        if (![1, 2, 3, 4, 5, 6, 7, 8].includes(x) || ![1, 2, 3, 4, 5, 6, 7, 8].includes(y)) return;
    }
}

document.addEventListener('DOMContentLoaded', () => ImgManager.loadImgs(GameManager.setup.bind(GameManager)));
window.addEventListener('resize', GameManager.setSize.bind(GameManager));
