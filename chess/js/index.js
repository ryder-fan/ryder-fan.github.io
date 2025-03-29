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
     * @returns {Promise<void>} 加载所有图片
     */
    static async loadImgs() {
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
    }
}

document.addEventListener('DOMContentLoaded', function () {
    ImgManager.loadImgs();
});
