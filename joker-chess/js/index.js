'use strict';

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
     * 页面大小
     */
    static size;
    /**
     * @static #board 棋盘节点
     */
    static #board;
    /**
     * 棋盘图片节点
     */
    static #board_img;
    /**
     * @static #chessMap 棋子映射
     */
    static #chessMap = {
        'CC-B1': {
            x: 2,
            y: 7,
            type: 'B',
            color: 'C',
            img: ImgManager.getImg('CC-B'),
        },
        'CC-B2': {
            x: 3,
            y: 7,
            type: 'B',
            color: 'C',
            img: ImgManager.getImg('CC-B'),
        },
        'CC-B3': {
            x: 4,
            y: 7,
            type: 'B',
            color: 'C',
            img: ImgManager.getImg('CC-B'),
        },
        'CC-B4': {
            x: 6,
            y: 7,
            type: 'B',
            color: 'C',
            img: ImgManager.getImg('CC-B'),
        },
        'CC-B5': {
            x: 7,
            y: 7,
            type: 'B',
            color: 'C',
            img: ImgManager.getImg('CC-B'),
        },
        'CC-C1': {
            x: 1,
            y: 7,
            type: 'C',
            color: 'C',
            img: ImgManager.getImg('CC-C'),
        },
        'CC-C2': {
            x: 8,
            y: 7,
            type: 'C',
            color: 'C',
            img: ImgManager.getImg('CC-C'),
        },
        'CC-M1': {
            x: 2,
            y: 8,
            type: 'M',
            color: 'C',
            img: ImgManager.getImg('CC-M'),
        },
        'CC-M2': {
            x: 7,
            y: 8,
            type: 'M',
            color: 'C',
            img: ImgManager.getImg('CC-M'),
        },
        'CC-P1': {
            x: 1,
            y: 8,
            type: 'P',
            color: 'C',
            img: ImgManager.getImg('CC-P'),
        },
        'CC-P2': {
            x: 8,
            y: 8,
            type: 'P',
            color: 'C',
            img: ImgManager.getImg('CC-P'),
        },
        'CC-S1': {
            x: 5,
            y: 7,
            type: 'S',
            color: 'C',
            img: ImgManager.getImg('CC-S'),
        },
        'CC-S2': {
            x: 5,
            y: 8,
            type: 'S',
            color: 'C',
            img: ImgManager.getImg('CC-S'),
        },
        'CC-W': {
            x: 4,
            y: 8,
            type: 'W',
            color: 'C',
            img: ImgManager.getImg('CC-W'),
        },
        'CC-X1': {
            x: 3,
            y: 8,
            type: 'X',
            color: 'C',
            img: ImgManager.getImg('CC-X'),
        },
        'CC-X2': {
            x: 6,
            y: 8,
            type: 'X',
            color: 'C',
            img: ImgManager.getImg('CC-X'),
        },
        
        'IC-B1': {
            x: 3,
            y: 1,
            type: 'B',
            color: 'I',
            img: ImgManager.getImg('IC-B'),
        },
        'IC-B2': {
            x: 6,
            y: 1,
            type: 'B',
            color: 'I',
            img: ImgManager.getImg('IC-B'),
        },
        'IC-K': {
            x: 4,
            y: 1,
            type: 'K',
            color: 'I',
            img: ImgManager.getImg('IC-K'),
        },
        'IC-N1': {
            x: 2,
            y: 1,
            type: 'N',
            color: 'I',
            img: ImgManager.getImg('IC-N'),
        },
        'IC-N2': {
            x: 7,
            y: 1,
            type: 'N',
            color: 'I',
            img: ImgManager.getImg('IC-N'),
        },
        'IC-Q': {
            x: 5,
            y: 1,
            type: 'Q',
            color: 'I',
            img: ImgManager.getImg('IC-Q'),
        },
        'IC-R1': {
            x: 1,
            y: 1,
            type: 'R',
            color: 'I',
            img: ImgManager.getImg('IC-R'),
        },
        'IC-R2': {
            x: 8,
            y: 1,
            type: 'R',
            color: 'I',
            img: ImgManager.getImg('IC-R'),
        },
        'IC-S1': {
            x: 1,
            y: 2,
            type: 'S',
            color: 'I',
            img: ImgManager.getImg('IC-S'),
        },
        'IC-S2': {
            x: 2,
            y: 2,
            type: 'S',
            color: 'I',
            img: ImgManager.getImg('IC-S'),
        },
        'IC-S3': {
            x: 3,
            y: 2,
            type: 'S',
            color: 'I',
            img: ImgManager.getImg('IC-S'),
        },
        'IC-S4': {
            x: 4,
            y: 2,
            type: 'S',
            color: 'I',
            img: ImgManager.getImg('IC-S'),
        },
        'IC-S5': {
            x: 5,
            y: 2,
            type: 'S',
            color: 'I',
            img: ImgManager.getImg('IC-S'),
        },
        'IC-S6': {
            x: 6,
            y: 2,
            type: 'S',
            color: 'I',
            img: ImgManager.getImg('IC-S'),
        },
        'IC-S7': {
            x: 7,
            y: 2,
            type: 'S',
            color: 'I',
            img: ImgManager.getImg('IC-S'),
        },
        'IC-S8': {
            x: 8,
            y: 2,
            type: 'S',
            color: 'I',
            img: ImgManager.getImg('IC-S'),
        },
    }

    /**
     * @function setup 游戏初始化
     */
    static setup() {
        this.#board = document.getElementById("board");
        this.#board_img = document.getElementById("board-img");
        this.setupBoard();
        this.setSize();
    }

    /**
     * @function setSize 设置页面大小
     */
    static setSize() {
        this.size = Math.min(window.innerWidth, window.innerHeight);
        this.#board.style.width = `${this.size * 0.9}px`;
        this.#board.style.height = `${this.size * 0.9}px`;
    }

    /**
     * @function setChessPos 设置棋子位置
     * @param {HTMLElement} node 棋子节点
     * @param {1|2|3|4|5|6|7|8} x x坐标
     * @param {1|2|3|4|5|6|7|8} y y坐标
     */
    static setChessPos(node, x, y) {
        if ([1, 2, 3, 4, 5, 6, 7, 8].includes(x) && [1, 2, 3, 4, 5, 6, 7, 8].includes(y)) {
            node.style.left = `${(x - 1) * 12.5}%`;
            node.style.top = `${(y - 1) * 12.5}%`;
        } else {
            console.warn(`Invalid position: (${x}, ${y}), Chess: ${node.id}`);
        }
    }

    /**
     * @function createChess 创建棋子
     * @param {string} id 棋子id
     */
    static createChess(id) {
        const chess = document.createElement('div');
        chess.id = id;
        chess.classList.add('chess');

        const chessImg = document.createElement('img');
        chessImg.id = id + '-img';
        chessImg.src = this.#chessMap[id].img;
        chessImg.alt = id;
        chess.appendChild(chessImg);

        this.#board.appendChild(chess);

        this.setChessPos(chess, this.#chessMap[id].x, this.#chessMap[id].y);
    }

    /**
     * @function setupBoard 棋盘初始化
     */
    static setupBoard() {
        this.#board_img.src = ImgManager.getImg('background');
        for (const id in this.#chessMap) this.createChess(id);
    }
}

document.addEventListener('DOMContentLoaded', () => ImgManager.loadImgs(GameManager.setup.bind(GameManager)));
window.addEventListener('resize', GameManager.setSize.bind(GameManager));
