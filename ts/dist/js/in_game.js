/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/@overwolf/overwolf-api-ts/dist/index.js":
/*!**************************************************************!*\
  !*** ./node_modules/@overwolf/overwolf-api-ts/dist/index.js ***!
  \**************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__webpack_require__(/*! ./ow-game-listener */ "./node_modules/@overwolf/overwolf-api-ts/dist/ow-game-listener.js"), exports);
__exportStar(__webpack_require__(/*! ./ow-games-events */ "./node_modules/@overwolf/overwolf-api-ts/dist/ow-games-events.js"), exports);
__exportStar(__webpack_require__(/*! ./ow-games */ "./node_modules/@overwolf/overwolf-api-ts/dist/ow-games.js"), exports);
__exportStar(__webpack_require__(/*! ./ow-hotkeys */ "./node_modules/@overwolf/overwolf-api-ts/dist/ow-hotkeys.js"), exports);
__exportStar(__webpack_require__(/*! ./ow-listener */ "./node_modules/@overwolf/overwolf-api-ts/dist/ow-listener.js"), exports);
__exportStar(__webpack_require__(/*! ./ow-window */ "./node_modules/@overwolf/overwolf-api-ts/dist/ow-window.js"), exports);


/***/ }),

/***/ "./node_modules/@overwolf/overwolf-api-ts/dist/ow-game-listener.js":
/*!*************************************************************************!*\
  !*** ./node_modules/@overwolf/overwolf-api-ts/dist/ow-game-listener.js ***!
  \*************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.OWGameListener = void 0;
const ow_listener_1 = __webpack_require__(/*! ./ow-listener */ "./node_modules/@overwolf/overwolf-api-ts/dist/ow-listener.js");
class OWGameListener extends ow_listener_1.OWListener {
    constructor(delegate) {
        super(delegate);
        this.onGameInfoUpdated = (update) => {
            if (!update || !update.gameInfo) {
                return;
            }
            if (!update.runningChanged && !update.gameChanged) {
                return;
            }
            if (update.gameInfo.isRunning) {
                if (this._delegate.onGameStarted) {
                    this._delegate.onGameStarted(update.gameInfo);
                }
            }
            else {
                if (this._delegate.onGameEnded) {
                    this._delegate.onGameEnded(update.gameInfo);
                }
            }
        };
        this.onRunningGameInfo = (info) => {
            if (!info) {
                return;
            }
            if (info.isRunning) {
                if (this._delegate.onGameStarted) {
                    this._delegate.onGameStarted(info);
                }
            }
        };
    }
    start() {
        super.start();
        overwolf.games.onGameInfoUpdated.addListener(this.onGameInfoUpdated);
        overwolf.games.getRunningGameInfo(this.onRunningGameInfo);
    }
    stop() {
        overwolf.games.onGameInfoUpdated.removeListener(this.onGameInfoUpdated);
    }
}
exports.OWGameListener = OWGameListener;


/***/ }),

/***/ "./node_modules/@overwolf/overwolf-api-ts/dist/ow-games-events.js":
/*!************************************************************************!*\
  !*** ./node_modules/@overwolf/overwolf-api-ts/dist/ow-games-events.js ***!
  \************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.OWGamesEvents = void 0;
const timer_1 = __webpack_require__(/*! ./timer */ "./node_modules/@overwolf/overwolf-api-ts/dist/timer.js");
class OWGamesEvents {
    constructor(delegate, requiredFeatures, featureRetries = 10) {
        this.onInfoUpdates = (info) => {
            this._delegate.onInfoUpdates(info.info);
        };
        this.onNewEvents = (e) => {
            this._delegate.onNewEvents(e);
        };
        this._delegate = delegate;
        this._requiredFeatures = requiredFeatures;
        this._featureRetries = featureRetries;
    }
    async getInfo() {
        return new Promise((resolve) => {
            overwolf.games.events.getInfo(resolve);
        });
    }
    async setRequiredFeatures() {
        let tries = 1, result;
        while (tries <= this._featureRetries) {
            result = await new Promise(resolve => {
                overwolf.games.events.setRequiredFeatures(this._requiredFeatures, resolve);
            });
            if (result.status === 'success') {
                console.log('setRequiredFeatures(): success: ' + JSON.stringify(result, null, 2));
                return (result.supportedFeatures.length > 0);
            }
            await timer_1.Timer.wait(3000);
            tries++;
        }
        console.warn('setRequiredFeatures(): failure after ' + tries + ' tries' + JSON.stringify(result, null, 2));
        return false;
    }
    registerEvents() {
        this.unRegisterEvents();
        overwolf.games.events.onInfoUpdates2.addListener(this.onInfoUpdates);
        overwolf.games.events.onNewEvents.addListener(this.onNewEvents);
    }
    unRegisterEvents() {
        overwolf.games.events.onInfoUpdates2.removeListener(this.onInfoUpdates);
        overwolf.games.events.onNewEvents.removeListener(this.onNewEvents);
    }
    async start() {
        console.log(`[ow-game-events] START`);
        this.registerEvents();
        await this.setRequiredFeatures();
        const { res, status } = await this.getInfo();
        if (res && status === 'success') {
            this.onInfoUpdates({ info: res });
        }
    }
    stop() {
        console.log(`[ow-game-events] STOP`);
        this.unRegisterEvents();
    }
}
exports.OWGamesEvents = OWGamesEvents;


/***/ }),

/***/ "./node_modules/@overwolf/overwolf-api-ts/dist/ow-games.js":
/*!*****************************************************************!*\
  !*** ./node_modules/@overwolf/overwolf-api-ts/dist/ow-games.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.OWGames = void 0;
class OWGames {
    static getRunningGameInfo() {
        return new Promise((resolve) => {
            overwolf.games.getRunningGameInfo(resolve);
        });
    }
    static classIdFromGameId(gameId) {
        let classId = Math.floor(gameId / 10);
        return classId;
    }
    static async getRecentlyPlayedGames(limit = 3) {
        return new Promise((resolve) => {
            if (!overwolf.games.getRecentlyPlayedGames) {
                return resolve(null);
            }
            overwolf.games.getRecentlyPlayedGames(limit, result => {
                resolve(result.games);
            });
        });
    }
    static async getGameDBInfo(gameClassId) {
        return new Promise((resolve) => {
            overwolf.games.getGameDBInfo(gameClassId, resolve);
        });
    }
}
exports.OWGames = OWGames;


/***/ }),

/***/ "./node_modules/@overwolf/overwolf-api-ts/dist/ow-hotkeys.js":
/*!*******************************************************************!*\
  !*** ./node_modules/@overwolf/overwolf-api-ts/dist/ow-hotkeys.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.OWHotkeys = void 0;
class OWHotkeys {
    constructor() { }
    static getHotkeyText(hotkeyId, gameId) {
        return new Promise(resolve => {
            overwolf.settings.hotkeys.get(result => {
                if (result && result.success) {
                    let hotkey;
                    if (gameId === undefined)
                        hotkey = result.globals.find(h => h.name === hotkeyId);
                    else if (result.games && result.games[gameId])
                        hotkey = result.games[gameId].find(h => h.name === hotkeyId);
                    if (hotkey)
                        return resolve(hotkey.binding);
                }
                resolve('UNASSIGNED');
            });
        });
    }
    static onHotkeyDown(hotkeyId, action) {
        overwolf.settings.hotkeys.onPressed.addListener((result) => {
            if (result && result.name === hotkeyId)
                action(result);
        });
    }
}
exports.OWHotkeys = OWHotkeys;


/***/ }),

/***/ "./node_modules/@overwolf/overwolf-api-ts/dist/ow-listener.js":
/*!********************************************************************!*\
  !*** ./node_modules/@overwolf/overwolf-api-ts/dist/ow-listener.js ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.OWListener = void 0;
class OWListener {
    constructor(delegate) {
        this._delegate = delegate;
    }
    start() {
        this.stop();
    }
}
exports.OWListener = OWListener;


/***/ }),

/***/ "./node_modules/@overwolf/overwolf-api-ts/dist/ow-window.js":
/*!******************************************************************!*\
  !*** ./node_modules/@overwolf/overwolf-api-ts/dist/ow-window.js ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.OWWindow = void 0;
class OWWindow {
    constructor(name = null) {
        this._name = name;
        this._id = null;
    }
    async restore() {
        let that = this;
        return new Promise(async (resolve) => {
            await that.assureObtained();
            let id = that._id;
            overwolf.windows.restore(id, result => {
                if (!result.success)
                    console.error(`[restore] - an error occurred, windowId=${id}, reason=${result.error}`);
                resolve();
            });
        });
    }
    async minimize() {
        let that = this;
        return new Promise(async (resolve) => {
            await that.assureObtained();
            let id = that._id;
            overwolf.windows.minimize(id, () => { });
            return resolve();
        });
    }
    async maximize() {
        let that = this;
        return new Promise(async (resolve) => {
            await that.assureObtained();
            let id = that._id;
            overwolf.windows.maximize(id, () => { });
            return resolve();
        });
    }
    async hide() {
        let that = this;
        return new Promise(async (resolve) => {
            await that.assureObtained();
            let id = that._id;
            overwolf.windows.hide(id, () => { });
            return resolve();
        });
    }
    async close() {
        let that = this;
        return new Promise(async (resolve) => {
            await that.assureObtained();
            let id = that._id;
            const result = await this.getWindowState();
            if (result.success &&
                (result.window_state !== 'closed')) {
                await this.internalClose();
            }
            return resolve();
        });
    }
    dragMove(elem) {
        elem.className = elem.className + ' draggable';
        elem.onmousedown = e => {
            e.preventDefault();
            overwolf.windows.dragMove(this._name);
        };
    }
    async getWindowState() {
        let that = this;
        return new Promise(async (resolve) => {
            await that.assureObtained();
            let id = that._id;
            overwolf.windows.getWindowState(id, resolve);
        });
    }
    static async getCurrentInfo() {
        return new Promise(async (resolve) => {
            overwolf.windows.getCurrentWindow(result => {
                resolve(result.window);
            });
        });
    }
    obtain() {
        return new Promise((resolve, reject) => {
            const cb = res => {
                if (res && res.status === "success" && res.window && res.window.id) {
                    this._id = res.window.id;
                    if (!this._name) {
                        this._name = res.window.name;
                    }
                    resolve(res.window);
                }
                else {
                    this._id = null;
                    reject();
                }
            };
            if (!this._name) {
                overwolf.windows.getCurrentWindow(cb);
            }
            else {
                overwolf.windows.obtainDeclaredWindow(this._name, cb);
            }
        });
    }
    async assureObtained() {
        let that = this;
        return new Promise(async (resolve) => {
            await that.obtain();
            return resolve();
        });
    }
    async internalClose() {
        let that = this;
        return new Promise(async (resolve, reject) => {
            await that.assureObtained();
            let id = that._id;
            overwolf.windows.close(id, res => {
                if (res && res.success)
                    resolve();
                else
                    reject(res);
            });
        });
    }
}
exports.OWWindow = OWWindow;


/***/ }),

/***/ "./node_modules/@overwolf/overwolf-api-ts/dist/timer.js":
/*!**************************************************************!*\
  !*** ./node_modules/@overwolf/overwolf-api-ts/dist/timer.js ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Timer = void 0;
class Timer {
    constructor(delegate, id) {
        this._timerId = null;
        this.handleTimerEvent = () => {
            this._timerId = null;
            this._delegate.onTimer(this._id);
        };
        this._delegate = delegate;
        this._id = id;
    }
    static async wait(intervalInMS) {
        return new Promise(resolve => {
            setTimeout(resolve, intervalInMS);
        });
    }
    start(intervalInMS) {
        this.stop();
        this._timerId = setTimeout(this.handleTimerEvent, intervalInMS);
    }
    stop() {
        if (this._timerId == null) {
            return;
        }
        clearTimeout(this._timerId);
        this._timerId = null;
    }
}
exports.Timer = Timer;


/***/ }),

/***/ "./src/AppWindow.ts":
/*!**************************!*\
  !*** ./src/AppWindow.ts ***!
  \**************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AppWindow = void 0;
const overwolf_api_ts_1 = __webpack_require__(/*! @overwolf/overwolf-api-ts */ "./node_modules/@overwolf/overwolf-api-ts/dist/index.js");
class AppWindow {
    constructor(windowName) {
        this.maximized = false;
        this.mainWindow = new overwolf_api_ts_1.OWWindow('background');
        this.currWindow = new overwolf_api_ts_1.OWWindow(windowName);
        const closeButton = document.getElementById('closeButton');
        const maximizeButton = document.getElementById('maximizeButton');
        const minimizeButton = document.getElementById('minimizeButton');
        const header = document.getElementById('header');
        this.setDrag(header);
        closeButton.addEventListener('click', () => {
            this.mainWindow.close();
        });
        minimizeButton.addEventListener('click', () => {
            this.currWindow.minimize();
        });
        maximizeButton.addEventListener('click', () => {
            if (!this.maximized) {
                this.currWindow.maximize();
            }
            else {
                this.currWindow.restore();
            }
            this.maximized = !this.maximized;
        });
    }
    async getWindowState() {
        return await this.currWindow.getWindowState();
    }
    async setDrag(elem) {
        this.currWindow.dragMove(elem);
    }
}
exports.AppWindow = AppWindow;


/***/ }),

/***/ "./src/consts.ts":
/*!***********************!*\
  !*** ./src/consts.ts ***!
  \***********************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.kHotkeys = exports.kWindowNames = exports.kGameClassIds = exports.kGamesFeatures = void 0;
exports.kGamesFeatures = new Map([
    [
        21216,
        [
            'kill',
            'killed',
            'killer',
            'revived',
            'death',
            'match',
            'match_info',
            'rank',
            'me',
            'phase',
            'location',
            'team',
            'items',
            'counters'
        ]
    ],
    [
        7764,
        [
            'match_info',
            'kill',
            'death',
            'assist',
            'headshot',
            'round_start',
            'match_start',
            'match_info',
            'match_end',
            'team_round_win',
            'bomb_planted',
            'bomb_change',
            'reloading',
            'fired',
            'weapon_change',
            'weapon_acquired',
            'info',
            'roster',
            'player_activity_change',
            'team_set',
            'replay',
            'counters',
            'mvp',
            'scoreboard',
            'kill_feed'
        ]
    ],
    [
        5426,
        [
            'me',
            'store',
            'board',
            'bench',
            'match_info',
        ]
    ],
    [
        21570,
        [
            'round_start',
            'round_end',
            'battle_end',
            'battle_start'
        ]
    ],
    [
        21634,
        [
            'match_info',
            'game_info'
        ]
    ],
    [
        8032,
        [
            'game_info',
            'match_info'
        ]
    ],
    [
        10844,
        [
            'game_info',
            'match_info',
            'kill',
            'death'
        ]
    ],
    [
        10906,
        [
            'kill',
            'revived',
            'death',
            'killer',
            'match',
            'match_info',
            'rank',
            'counters',
            'location',
            'me',
            'team',
            'phase',
            'map',
            'roster'
        ]
    ],
    [
        10826,
        [
            'game_info',
            'match',
            'match_info',
            'roster',
            'kill',
            'death',
            'me',
            'defuser'
        ]
    ],
    [
        21404,
        [
            'game_info',
            'match_info',
            'player',
            'location',
            'match',
            'feed',
            'connection',
            'kill',
            'death',
            'portal',
            'assist'
        ]
    ],
    [
        7212,
        [
            'kill',
            'death',
            'me',
            'match_info'
        ]
    ],
    [
        21640,
        [
            'me',
            'game_info',
            'match_info',
            'kill',
            'death'
        ]
    ],
    [
        7314,
        [
            'game_state_changed',
            'match_state_changed',
            'match_detected',
            'daytime_changed',
            'clock_time_changed',
            'ward_purchase_cooldown_changed',
            'match_ended',
            'kill',
            'assist',
            'death',
            'cs',
            'xpm',
            'gpm',
            'gold',
            'hero_leveled_up',
            'hero_respawned',
            'hero_buyback_info_changed',
            'hero_boughtback',
            'hero_health_mana_info',
            'hero_status_effect_changed',
            'hero_attributes_skilled',
            'hero_ability_skilled',
            'hero_ability_used',
            'hero_ability_cooldown_changed',
            'hero_ability_changed',
            'hero_item_cooldown_changed',
            'hero_item_changed',
            'hero_item_used',
            'hero_item_consumed',
            'hero_item_charged',
            'match_info',
            'roster',
            'party',
            'error',
            'hero_pool',
            'me',
            'game'
        ]
    ],
    [
        21626,
        [
            'match_info',
            'game_info',
            'kill',
            'death'
        ]
    ],
    [
        8954,
        [
            'game_info',
            'match_info'
        ]
    ],
]);
exports.kGameClassIds = Array.from(exports.kGamesFeatures.keys());
exports.kWindowNames = {
    inGame: 'in_game',
    desktop: 'desktop'
};
exports.kHotkeys = {
    toggle: 'sample_app_ts_showhide'
};


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;
/*!********************************!*\
  !*** ./src/in_game/in_game.ts ***!
  \********************************/

Object.defineProperty(exports, "__esModule", ({ value: true }));
const overwolf_api_ts_1 = __webpack_require__(/*! @overwolf/overwolf-api-ts */ "./node_modules/@overwolf/overwolf-api-ts/dist/index.js");
const AppWindow_1 = __webpack_require__(/*! ../AppWindow */ "./src/AppWindow.ts");
const consts_1 = __webpack_require__(/*! ../consts */ "./src/consts.ts");
class InGame extends AppWindow_1.AppWindow {
    constructor() {
        super(consts_1.kWindowNames.inGame);
        this._boardLog = document.getElementById('boardLog');
        this._defaultLog = document.getElementById('defaultLog');
        this._damageLog = document.getElementById('dmgLog');
        this._goldLog = document.getElementById('goldLog');
        this.setToggleHotkeyBehavior();
        this.setToggleHotkeyText();
    }
    static instance() {
        if (!this._instance) {
            this._instance = new InGame();
        }
        return this._instance;
    }
    async run() {
        const gameClassId = await this.getCurrentGameClassId();
        const gameFeatures = consts_1.kGamesFeatures.get(gameClassId);
        if (gameFeatures && gameFeatures.length) {
            this._gameEventsListener = new overwolf_api_ts_1.OWGamesEvents({
                onInfoUpdates: this.onInfoUpdates.bind(this),
                onNewEvents: this.onNewEvents.bind(this)
            }, gameFeatures);
            this._gameEventsListener.start();
        }
    }
    onInfoUpdates(info) {
        this.logLine(info);
    }
    onNewEvents(e) {
        this.logLine(e);
    }
    async setToggleHotkeyText() {
        const gameClassId = await this.getCurrentGameClassId();
        const hotkeyText = await overwolf_api_ts_1.OWHotkeys.getHotkeyText(consts_1.kHotkeys.toggle, gameClassId);
        const hotkeyElem = document.getElementById('hotkey');
        hotkeyElem.textContent = hotkeyText;
    }
    async setToggleHotkeyBehavior() {
        const toggleInGameWindow = async (hotkeyResult) => {
            console.log(`pressed hotkey for ${hotkeyResult.name}`);
            const inGameState = await this.getWindowState();
            if (inGameState.window_state === "normal" ||
                inGameState.window_state === "maximized") {
                this.currWindow.minimize();
            }
            else if (inGameState.window_state === "minimized" ||
                inGameState.window_state === "closed") {
                this.currWindow.restore();
            }
        };
        overwolf_api_ts_1.OWHotkeys.onHotkeyDown(consts_1.kHotkeys.toggle, toggleInGameWindow);
    }
    logLine(data) {
        const line = document.createElement('pre');
        document.getElementById('dmgLog').innerHTML = data.match_info.local_player_damage.split("\"")[5] + " ==> " + data.match_info.local_player_damage.split("\"")[8];
        document.getElementById('goldLog').innerHTML = data.me.gold;
    }
    async getCurrentGameClassId() {
        const info = await overwolf_api_ts_1.OWGames.getRunningGameInfo();
        return (info && info.isRunning && info.classId) ? info.classId : null;
    }
}
InGame.instance().run();

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9leGFtcGxlLXRzLy4vbm9kZV9tb2R1bGVzL0BvdmVyd29sZi9vdmVyd29sZi1hcGktdHMvZGlzdC9pbmRleC5qcyIsIndlYnBhY2s6Ly9leGFtcGxlLXRzLy4vbm9kZV9tb2R1bGVzL0BvdmVyd29sZi9vdmVyd29sZi1hcGktdHMvZGlzdC9vdy1nYW1lLWxpc3RlbmVyLmpzIiwid2VicGFjazovL2V4YW1wbGUtdHMvLi9ub2RlX21vZHVsZXMvQG92ZXJ3b2xmL292ZXJ3b2xmLWFwaS10cy9kaXN0L293LWdhbWVzLWV2ZW50cy5qcyIsIndlYnBhY2s6Ly9leGFtcGxlLXRzLy4vbm9kZV9tb2R1bGVzL0BvdmVyd29sZi9vdmVyd29sZi1hcGktdHMvZGlzdC9vdy1nYW1lcy5qcyIsIndlYnBhY2s6Ly9leGFtcGxlLXRzLy4vbm9kZV9tb2R1bGVzL0BvdmVyd29sZi9vdmVyd29sZi1hcGktdHMvZGlzdC9vdy1ob3RrZXlzLmpzIiwid2VicGFjazovL2V4YW1wbGUtdHMvLi9ub2RlX21vZHVsZXMvQG92ZXJ3b2xmL292ZXJ3b2xmLWFwaS10cy9kaXN0L293LWxpc3RlbmVyLmpzIiwid2VicGFjazovL2V4YW1wbGUtdHMvLi9ub2RlX21vZHVsZXMvQG92ZXJ3b2xmL292ZXJ3b2xmLWFwaS10cy9kaXN0L293LXdpbmRvdy5qcyIsIndlYnBhY2s6Ly9leGFtcGxlLXRzLy4vbm9kZV9tb2R1bGVzL0BvdmVyd29sZi9vdmVyd29sZi1hcGktdHMvZGlzdC90aW1lci5qcyIsIndlYnBhY2s6Ly9leGFtcGxlLXRzLy4vc3JjL0FwcFdpbmRvdy50cyIsIndlYnBhY2s6Ly9leGFtcGxlLXRzLy4vc3JjL2NvbnN0cy50cyIsIndlYnBhY2s6Ly9leGFtcGxlLXRzL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2V4YW1wbGUtdHMvLi9zcmMvaW5fZ2FtZS9pbl9nYW1lLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBYTtBQUNi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LEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxtQkFBbUIsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUU7UUFDakssUUFBUSxDQUFDLGNBQWMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUM7SUFFOUQsQ0FBQztJQUVPLEtBQUssQ0FBQyxxQkFBcUI7UUFDakMsTUFBTSxJQUFJLEdBQUcsTUFBTSx5QkFBTyxDQUFDLGtCQUFrQixFQUFFLENBQUM7UUFFaEQsT0FBTyxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsU0FBUyxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO0lBQ3hFLENBQUM7Q0FDRjtBQUVELE1BQU0sQ0FBQyxRQUFRLEVBQUUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyIsImZpbGUiOiJqcy9pbl9nYW1lLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCI7XHJcbnZhciBfX2NyZWF0ZUJpbmRpbmcgPSAodGhpcyAmJiB0aGlzLl9fY3JlYXRlQmluZGluZykgfHwgKE9iamVjdC5jcmVhdGUgPyAoZnVuY3Rpb24obywgbSwgaywgazIpIHtcclxuICAgIGlmIChrMiA9PT0gdW5kZWZpbmVkKSBrMiA9IGs7XHJcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkobywgazIsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBmdW5jdGlvbigpIHsgcmV0dXJuIG1ba107IH0gfSk7XHJcbn0pIDogKGZ1bmN0aW9uKG8sIG0sIGssIGsyKSB7XHJcbiAgICBpZiAoazIgPT09IHVuZGVmaW5lZCkgazIgPSBrO1xyXG4gICAgb1trMl0gPSBtW2tdO1xyXG59KSk7XHJcbnZhciBfX2V4cG9ydFN0YXIgPSAodGhpcyAmJiB0aGlzLl9fZXhwb3J0U3RhcikgfHwgZnVuY3Rpb24obSwgZXhwb3J0cykge1xyXG4gICAgZm9yICh2YXIgcCBpbiBtKSBpZiAocCAhPT0gXCJkZWZhdWx0XCIgJiYgIU9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChleHBvcnRzLCBwKSkgX19jcmVhdGVCaW5kaW5nKGV4cG9ydHMsIG0sIHApO1xyXG59O1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbl9fZXhwb3J0U3RhcihyZXF1aXJlKFwiLi9vdy1nYW1lLWxpc3RlbmVyXCIpLCBleHBvcnRzKTtcclxuX19leHBvcnRTdGFyKHJlcXVpcmUoXCIuL293LWdhbWVzLWV2ZW50c1wiKSwgZXhwb3J0cyk7XHJcbl9fZXhwb3J0U3RhcihyZXF1aXJlKFwiLi9vdy1nYW1lc1wiKSwgZXhwb3J0cyk7XHJcbl9fZXhwb3J0U3RhcihyZXF1aXJlKFwiLi9vdy1ob3RrZXlzXCIpLCBleHBvcnRzKTtcclxuX19leHBvcnRTdGFyKHJlcXVpcmUoXCIuL293LWxpc3RlbmVyXCIpLCBleHBvcnRzKTtcclxuX19leHBvcnRTdGFyKHJlcXVpcmUoXCIuL293LXdpbmRvd1wiKSwgZXhwb3J0cyk7XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmV4cG9ydHMuT1dHYW1lTGlzdGVuZXIgPSB2b2lkIDA7XHJcbmNvbnN0IG93X2xpc3RlbmVyXzEgPSByZXF1aXJlKFwiLi9vdy1saXN0ZW5lclwiKTtcclxuY2xhc3MgT1dHYW1lTGlzdGVuZXIgZXh0ZW5kcyBvd19saXN0ZW5lcl8xLk9XTGlzdGVuZXIge1xyXG4gICAgY29uc3RydWN0b3IoZGVsZWdhdGUpIHtcclxuICAgICAgICBzdXBlcihkZWxlZ2F0ZSk7XHJcbiAgICAgICAgdGhpcy5vbkdhbWVJbmZvVXBkYXRlZCA9ICh1cGRhdGUpID0+IHtcclxuICAgICAgICAgICAgaWYgKCF1cGRhdGUgfHwgIXVwZGF0ZS5nYW1lSW5mbykge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICghdXBkYXRlLnJ1bm5pbmdDaGFuZ2VkICYmICF1cGRhdGUuZ2FtZUNoYW5nZWQpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAodXBkYXRlLmdhbWVJbmZvLmlzUnVubmluZykge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX2RlbGVnYXRlLm9uR2FtZVN0YXJ0ZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9kZWxlZ2F0ZS5vbkdhbWVTdGFydGVkKHVwZGF0ZS5nYW1lSW5mbyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fZGVsZWdhdGUub25HYW1lRW5kZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9kZWxlZ2F0ZS5vbkdhbWVFbmRlZCh1cGRhdGUuZ2FtZUluZm8pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgICAgICB0aGlzLm9uUnVubmluZ0dhbWVJbmZvID0gKGluZm8pID0+IHtcclxuICAgICAgICAgICAgaWYgKCFpbmZvKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKGluZm8uaXNSdW5uaW5nKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fZGVsZWdhdGUub25HYW1lU3RhcnRlZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2RlbGVnYXRlLm9uR2FtZVN0YXJ0ZWQoaW5mbyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgfVxyXG4gICAgc3RhcnQoKSB7XHJcbiAgICAgICAgc3VwZXIuc3RhcnQoKTtcclxuICAgICAgICBvdmVyd29sZi5nYW1lcy5vbkdhbWVJbmZvVXBkYXRlZC5hZGRMaXN0ZW5lcih0aGlzLm9uR2FtZUluZm9VcGRhdGVkKTtcclxuICAgICAgICBvdmVyd29sZi5nYW1lcy5nZXRSdW5uaW5nR2FtZUluZm8odGhpcy5vblJ1bm5pbmdHYW1lSW5mbyk7XHJcbiAgICB9XHJcbiAgICBzdG9wKCkge1xyXG4gICAgICAgIG92ZXJ3b2xmLmdhbWVzLm9uR2FtZUluZm9VcGRhdGVkLnJlbW92ZUxpc3RlbmVyKHRoaXMub25HYW1lSW5mb1VwZGF0ZWQpO1xyXG4gICAgfVxyXG59XHJcbmV4cG9ydHMuT1dHYW1lTGlzdGVuZXIgPSBPV0dhbWVMaXN0ZW5lcjtcclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuZXhwb3J0cy5PV0dhbWVzRXZlbnRzID0gdm9pZCAwO1xyXG5jb25zdCB0aW1lcl8xID0gcmVxdWlyZShcIi4vdGltZXJcIik7XHJcbmNsYXNzIE9XR2FtZXNFdmVudHMge1xyXG4gICAgY29uc3RydWN0b3IoZGVsZWdhdGUsIHJlcXVpcmVkRmVhdHVyZXMsIGZlYXR1cmVSZXRyaWVzID0gMTApIHtcclxuICAgICAgICB0aGlzLm9uSW5mb1VwZGF0ZXMgPSAoaW5mbykgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLl9kZWxlZ2F0ZS5vbkluZm9VcGRhdGVzKGluZm8uaW5mbyk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICB0aGlzLm9uTmV3RXZlbnRzID0gKGUpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5fZGVsZWdhdGUub25OZXdFdmVudHMoZSk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICB0aGlzLl9kZWxlZ2F0ZSA9IGRlbGVnYXRlO1xyXG4gICAgICAgIHRoaXMuX3JlcXVpcmVkRmVhdHVyZXMgPSByZXF1aXJlZEZlYXR1cmVzO1xyXG4gICAgICAgIHRoaXMuX2ZlYXR1cmVSZXRyaWVzID0gZmVhdHVyZVJldHJpZXM7XHJcbiAgICB9XHJcbiAgICBhc3luYyBnZXRJbmZvKCkge1xyXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xyXG4gICAgICAgICAgICBvdmVyd29sZi5nYW1lcy5ldmVudHMuZ2V0SW5mbyhyZXNvbHZlKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIGFzeW5jIHNldFJlcXVpcmVkRmVhdHVyZXMoKSB7XHJcbiAgICAgICAgbGV0IHRyaWVzID0gMSwgcmVzdWx0O1xyXG4gICAgICAgIHdoaWxlICh0cmllcyA8PSB0aGlzLl9mZWF0dXJlUmV0cmllcykge1xyXG4gICAgICAgICAgICByZXN1bHQgPSBhd2FpdCBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcclxuICAgICAgICAgICAgICAgIG92ZXJ3b2xmLmdhbWVzLmV2ZW50cy5zZXRSZXF1aXJlZEZlYXR1cmVzKHRoaXMuX3JlcXVpcmVkRmVhdHVyZXMsIHJlc29sdmUpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgaWYgKHJlc3VsdC5zdGF0dXMgPT09ICdzdWNjZXNzJykge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ3NldFJlcXVpcmVkRmVhdHVyZXMoKTogc3VjY2VzczogJyArIEpTT04uc3RyaW5naWZ5KHJlc3VsdCwgbnVsbCwgMikpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIChyZXN1bHQuc3VwcG9ydGVkRmVhdHVyZXMubGVuZ3RoID4gMCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgYXdhaXQgdGltZXJfMS5UaW1lci53YWl0KDMwMDApO1xyXG4gICAgICAgICAgICB0cmllcysrO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zb2xlLndhcm4oJ3NldFJlcXVpcmVkRmVhdHVyZXMoKTogZmFpbHVyZSBhZnRlciAnICsgdHJpZXMgKyAnIHRyaWVzJyArIEpTT04uc3RyaW5naWZ5KHJlc3VsdCwgbnVsbCwgMikpO1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuICAgIHJlZ2lzdGVyRXZlbnRzKCkge1xyXG4gICAgICAgIHRoaXMudW5SZWdpc3RlckV2ZW50cygpO1xyXG4gICAgICAgIG92ZXJ3b2xmLmdhbWVzLmV2ZW50cy5vbkluZm9VcGRhdGVzMi5hZGRMaXN0ZW5lcih0aGlzLm9uSW5mb1VwZGF0ZXMpO1xyXG4gICAgICAgIG92ZXJ3b2xmLmdhbWVzLmV2ZW50cy5vbk5ld0V2ZW50cy5hZGRMaXN0ZW5lcih0aGlzLm9uTmV3RXZlbnRzKTtcclxuICAgIH1cclxuICAgIHVuUmVnaXN0ZXJFdmVudHMoKSB7XHJcbiAgICAgICAgb3ZlcndvbGYuZ2FtZXMuZXZlbnRzLm9uSW5mb1VwZGF0ZXMyLnJlbW92ZUxpc3RlbmVyKHRoaXMub25JbmZvVXBkYXRlcyk7XHJcbiAgICAgICAgb3ZlcndvbGYuZ2FtZXMuZXZlbnRzLm9uTmV3RXZlbnRzLnJlbW92ZUxpc3RlbmVyKHRoaXMub25OZXdFdmVudHMpO1xyXG4gICAgfVxyXG4gICAgYXN5bmMgc3RhcnQoKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coYFtvdy1nYW1lLWV2ZW50c10gU1RBUlRgKTtcclxuICAgICAgICB0aGlzLnJlZ2lzdGVyRXZlbnRzKCk7XHJcbiAgICAgICAgYXdhaXQgdGhpcy5zZXRSZXF1aXJlZEZlYXR1cmVzKCk7XHJcbiAgICAgICAgY29uc3QgeyByZXMsIHN0YXR1cyB9ID0gYXdhaXQgdGhpcy5nZXRJbmZvKCk7XHJcbiAgICAgICAgaWYgKHJlcyAmJiBzdGF0dXMgPT09ICdzdWNjZXNzJykge1xyXG4gICAgICAgICAgICB0aGlzLm9uSW5mb1VwZGF0ZXMoeyBpbmZvOiByZXMgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgc3RvcCgpIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhgW293LWdhbWUtZXZlbnRzXSBTVE9QYCk7XHJcbiAgICAgICAgdGhpcy51blJlZ2lzdGVyRXZlbnRzKCk7XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0cy5PV0dhbWVzRXZlbnRzID0gT1dHYW1lc0V2ZW50cztcclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuZXhwb3J0cy5PV0dhbWVzID0gdm9pZCAwO1xyXG5jbGFzcyBPV0dhbWVzIHtcclxuICAgIHN0YXRpYyBnZXRSdW5uaW5nR2FtZUluZm8oKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XHJcbiAgICAgICAgICAgIG92ZXJ3b2xmLmdhbWVzLmdldFJ1bm5pbmdHYW1lSW5mbyhyZXNvbHZlKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIHN0YXRpYyBjbGFzc0lkRnJvbUdhbWVJZChnYW1lSWQpIHtcclxuICAgICAgICBsZXQgY2xhc3NJZCA9IE1hdGguZmxvb3IoZ2FtZUlkIC8gMTApO1xyXG4gICAgICAgIHJldHVybiBjbGFzc0lkO1xyXG4gICAgfVxyXG4gICAgc3RhdGljIGFzeW5jIGdldFJlY2VudGx5UGxheWVkR2FtZXMobGltaXQgPSAzKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XHJcbiAgICAgICAgICAgIGlmICghb3ZlcndvbGYuZ2FtZXMuZ2V0UmVjZW50bHlQbGF5ZWRHYW1lcykge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc29sdmUobnVsbCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgb3ZlcndvbGYuZ2FtZXMuZ2V0UmVjZW50bHlQbGF5ZWRHYW1lcyhsaW1pdCwgcmVzdWx0ID0+IHtcclxuICAgICAgICAgICAgICAgIHJlc29sdmUocmVzdWx0LmdhbWVzKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBzdGF0aWMgYXN5bmMgZ2V0R2FtZURCSW5mbyhnYW1lQ2xhc3NJZCkge1xyXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xyXG4gICAgICAgICAgICBvdmVyd29sZi5nYW1lcy5nZXRHYW1lREJJbmZvKGdhbWVDbGFzc0lkLCByZXNvbHZlKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxufVxyXG5leHBvcnRzLk9XR2FtZXMgPSBPV0dhbWVzO1xyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5leHBvcnRzLk9XSG90a2V5cyA9IHZvaWQgMDtcclxuY2xhc3MgT1dIb3RrZXlzIHtcclxuICAgIGNvbnN0cnVjdG9yKCkgeyB9XHJcbiAgICBzdGF0aWMgZ2V0SG90a2V5VGV4dChob3RrZXlJZCwgZ2FtZUlkKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmUgPT4ge1xyXG4gICAgICAgICAgICBvdmVyd29sZi5zZXR0aW5ncy5ob3RrZXlzLmdldChyZXN1bHQgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKHJlc3VsdCAmJiByZXN1bHQuc3VjY2Vzcykge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBob3RrZXk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGdhbWVJZCA9PT0gdW5kZWZpbmVkKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBob3RrZXkgPSByZXN1bHQuZ2xvYmFscy5maW5kKGggPT4gaC5uYW1lID09PSBob3RrZXlJZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAocmVzdWx0LmdhbWVzICYmIHJlc3VsdC5nYW1lc1tnYW1lSWRdKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBob3RrZXkgPSByZXN1bHQuZ2FtZXNbZ2FtZUlkXS5maW5kKGggPT4gaC5uYW1lID09PSBob3RrZXlJZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGhvdGtleSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlc29sdmUoaG90a2V5LmJpbmRpbmcpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmVzb2x2ZSgnVU5BU1NJR05FRCcpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIHN0YXRpYyBvbkhvdGtleURvd24oaG90a2V5SWQsIGFjdGlvbikge1xyXG4gICAgICAgIG92ZXJ3b2xmLnNldHRpbmdzLmhvdGtleXMub25QcmVzc2VkLmFkZExpc3RlbmVyKChyZXN1bHQpID0+IHtcclxuICAgICAgICAgICAgaWYgKHJlc3VsdCAmJiByZXN1bHQubmFtZSA9PT0gaG90a2V5SWQpXHJcbiAgICAgICAgICAgICAgICBhY3Rpb24ocmVzdWx0KTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxufVxyXG5leHBvcnRzLk9XSG90a2V5cyA9IE9XSG90a2V5cztcclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuZXhwb3J0cy5PV0xpc3RlbmVyID0gdm9pZCAwO1xyXG5jbGFzcyBPV0xpc3RlbmVyIHtcclxuICAgIGNvbnN0cnVjdG9yKGRlbGVnYXRlKSB7XHJcbiAgICAgICAgdGhpcy5fZGVsZWdhdGUgPSBkZWxlZ2F0ZTtcclxuICAgIH1cclxuICAgIHN0YXJ0KCkge1xyXG4gICAgICAgIHRoaXMuc3RvcCgpO1xyXG4gICAgfVxyXG59XHJcbmV4cG9ydHMuT1dMaXN0ZW5lciA9IE9XTGlzdGVuZXI7XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmV4cG9ydHMuT1dXaW5kb3cgPSB2b2lkIDA7XHJcbmNsYXNzIE9XV2luZG93IHtcclxuICAgIGNvbnN0cnVjdG9yKG5hbWUgPSBudWxsKSB7XHJcbiAgICAgICAgdGhpcy5fbmFtZSA9IG5hbWU7XHJcbiAgICAgICAgdGhpcy5faWQgPSBudWxsO1xyXG4gICAgfVxyXG4gICAgYXN5bmMgcmVzdG9yZSgpIHtcclxuICAgICAgICBsZXQgdGhhdCA9IHRoaXM7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKGFzeW5jIChyZXNvbHZlKSA9PiB7XHJcbiAgICAgICAgICAgIGF3YWl0IHRoYXQuYXNzdXJlT2J0YWluZWQoKTtcclxuICAgICAgICAgICAgbGV0IGlkID0gdGhhdC5faWQ7XHJcbiAgICAgICAgICAgIG92ZXJ3b2xmLndpbmRvd3MucmVzdG9yZShpZCwgcmVzdWx0ID0+IHtcclxuICAgICAgICAgICAgICAgIGlmICghcmVzdWx0LnN1Y2Nlc3MpXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihgW3Jlc3RvcmVdIC0gYW4gZXJyb3Igb2NjdXJyZWQsIHdpbmRvd0lkPSR7aWR9LCByZWFzb249JHtyZXN1bHQuZXJyb3J9YCk7XHJcbiAgICAgICAgICAgICAgICByZXNvbHZlKCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgYXN5bmMgbWluaW1pemUoKSB7XHJcbiAgICAgICAgbGV0IHRoYXQgPSB0aGlzO1xyXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZShhc3luYyAocmVzb2x2ZSkgPT4ge1xyXG4gICAgICAgICAgICBhd2FpdCB0aGF0LmFzc3VyZU9idGFpbmVkKCk7XHJcbiAgICAgICAgICAgIGxldCBpZCA9IHRoYXQuX2lkO1xyXG4gICAgICAgICAgICBvdmVyd29sZi53aW5kb3dzLm1pbmltaXplKGlkLCAoKSA9PiB7IH0pO1xyXG4gICAgICAgICAgICByZXR1cm4gcmVzb2x2ZSgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgYXN5bmMgbWF4aW1pemUoKSB7XHJcbiAgICAgICAgbGV0IHRoYXQgPSB0aGlzO1xyXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZShhc3luYyAocmVzb2x2ZSkgPT4ge1xyXG4gICAgICAgICAgICBhd2FpdCB0aGF0LmFzc3VyZU9idGFpbmVkKCk7XHJcbiAgICAgICAgICAgIGxldCBpZCA9IHRoYXQuX2lkO1xyXG4gICAgICAgICAgICBvdmVyd29sZi53aW5kb3dzLm1heGltaXplKGlkLCAoKSA9PiB7IH0pO1xyXG4gICAgICAgICAgICByZXR1cm4gcmVzb2x2ZSgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgYXN5bmMgaGlkZSgpIHtcclxuICAgICAgICBsZXQgdGhhdCA9IHRoaXM7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKGFzeW5jIChyZXNvbHZlKSA9PiB7XHJcbiAgICAgICAgICAgIGF3YWl0IHRoYXQuYXNzdXJlT2J0YWluZWQoKTtcclxuICAgICAgICAgICAgbGV0IGlkID0gdGhhdC5faWQ7XHJcbiAgICAgICAgICAgIG92ZXJ3b2xmLndpbmRvd3MuaGlkZShpZCwgKCkgPT4geyB9KTtcclxuICAgICAgICAgICAgcmV0dXJuIHJlc29sdmUoKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIGFzeW5jIGNsb3NlKCkge1xyXG4gICAgICAgIGxldCB0aGF0ID0gdGhpcztcclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoYXN5bmMgKHJlc29sdmUpID0+IHtcclxuICAgICAgICAgICAgYXdhaXQgdGhhdC5hc3N1cmVPYnRhaW5lZCgpO1xyXG4gICAgICAgICAgICBsZXQgaWQgPSB0aGF0Ll9pZDtcclxuICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgdGhpcy5nZXRXaW5kb3dTdGF0ZSgpO1xyXG4gICAgICAgICAgICBpZiAocmVzdWx0LnN1Y2Nlc3MgJiZcclxuICAgICAgICAgICAgICAgIChyZXN1bHQud2luZG93X3N0YXRlICE9PSAnY2xvc2VkJykpIHtcclxuICAgICAgICAgICAgICAgIGF3YWl0IHRoaXMuaW50ZXJuYWxDbG9zZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiByZXNvbHZlKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBkcmFnTW92ZShlbGVtKSB7XHJcbiAgICAgICAgZWxlbS5jbGFzc05hbWUgPSBlbGVtLmNsYXNzTmFtZSArICcgZHJhZ2dhYmxlJztcclxuICAgICAgICBlbGVtLm9ubW91c2Vkb3duID0gZSA9PiB7XHJcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgb3ZlcndvbGYud2luZG93cy5kcmFnTW92ZSh0aGlzLl9uYW1lKTtcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG4gICAgYXN5bmMgZ2V0V2luZG93U3RhdGUoKSB7XHJcbiAgICAgICAgbGV0IHRoYXQgPSB0aGlzO1xyXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZShhc3luYyAocmVzb2x2ZSkgPT4ge1xyXG4gICAgICAgICAgICBhd2FpdCB0aGF0LmFzc3VyZU9idGFpbmVkKCk7XHJcbiAgICAgICAgICAgIGxldCBpZCA9IHRoYXQuX2lkO1xyXG4gICAgICAgICAgICBvdmVyd29sZi53aW5kb3dzLmdldFdpbmRvd1N0YXRlKGlkLCByZXNvbHZlKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIHN0YXRpYyBhc3luYyBnZXRDdXJyZW50SW5mbygpIHtcclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoYXN5bmMgKHJlc29sdmUpID0+IHtcclxuICAgICAgICAgICAgb3ZlcndvbGYud2luZG93cy5nZXRDdXJyZW50V2luZG93KHJlc3VsdCA9PiB7XHJcbiAgICAgICAgICAgICAgICByZXNvbHZlKHJlc3VsdC53aW5kb3cpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIG9idGFpbigpIHtcclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBjYiA9IHJlcyA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAocmVzICYmIHJlcy5zdGF0dXMgPT09IFwic3VjY2Vzc1wiICYmIHJlcy53aW5kb3cgJiYgcmVzLndpbmRvdy5pZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2lkID0gcmVzLndpbmRvdy5pZDtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoIXRoaXMuX25hbWUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fbmFtZSA9IHJlcy53aW5kb3cubmFtZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShyZXMud2luZG93KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2lkID0gbnVsbDtcclxuICAgICAgICAgICAgICAgICAgICByZWplY3QoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLl9uYW1lKSB7XHJcbiAgICAgICAgICAgICAgICBvdmVyd29sZi53aW5kb3dzLmdldEN1cnJlbnRXaW5kb3coY2IpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgb3ZlcndvbGYud2luZG93cy5vYnRhaW5EZWNsYXJlZFdpbmRvdyh0aGlzLl9uYW1lLCBjYik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIGFzeW5jIGFzc3VyZU9idGFpbmVkKCkge1xyXG4gICAgICAgIGxldCB0aGF0ID0gdGhpcztcclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoYXN5bmMgKHJlc29sdmUpID0+IHtcclxuICAgICAgICAgICAgYXdhaXQgdGhhdC5vYnRhaW4oKTtcclxuICAgICAgICAgICAgcmV0dXJuIHJlc29sdmUoKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIGFzeW5jIGludGVybmFsQ2xvc2UoKSB7XHJcbiAgICAgICAgbGV0IHRoYXQgPSB0aGlzO1xyXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZShhc3luYyAocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgIGF3YWl0IHRoYXQuYXNzdXJlT2J0YWluZWQoKTtcclxuICAgICAgICAgICAgbGV0IGlkID0gdGhhdC5faWQ7XHJcbiAgICAgICAgICAgIG92ZXJ3b2xmLndpbmRvd3MuY2xvc2UoaWQsIHJlcyA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAocmVzICYmIHJlcy5zdWNjZXNzKVxyXG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcclxuICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgICAgICByZWplY3QocmVzKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0cy5PV1dpbmRvdyA9IE9XV2luZG93O1xyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5leHBvcnRzLlRpbWVyID0gdm9pZCAwO1xyXG5jbGFzcyBUaW1lciB7XHJcbiAgICBjb25zdHJ1Y3RvcihkZWxlZ2F0ZSwgaWQpIHtcclxuICAgICAgICB0aGlzLl90aW1lcklkID0gbnVsbDtcclxuICAgICAgICB0aGlzLmhhbmRsZVRpbWVyRXZlbnQgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuX3RpbWVySWQgPSBudWxsO1xyXG4gICAgICAgICAgICB0aGlzLl9kZWxlZ2F0ZS5vblRpbWVyKHRoaXMuX2lkKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMuX2RlbGVnYXRlID0gZGVsZWdhdGU7XHJcbiAgICAgICAgdGhpcy5faWQgPSBpZDtcclxuICAgIH1cclxuICAgIHN0YXRpYyBhc3luYyB3YWl0KGludGVydmFsSW5NUykge1xyXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcclxuICAgICAgICAgICAgc2V0VGltZW91dChyZXNvbHZlLCBpbnRlcnZhbEluTVMpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgc3RhcnQoaW50ZXJ2YWxJbk1TKSB7XHJcbiAgICAgICAgdGhpcy5zdG9wKCk7XHJcbiAgICAgICAgdGhpcy5fdGltZXJJZCA9IHNldFRpbWVvdXQodGhpcy5oYW5kbGVUaW1lckV2ZW50LCBpbnRlcnZhbEluTVMpO1xyXG4gICAgfVxyXG4gICAgc3RvcCgpIHtcclxuICAgICAgICBpZiAodGhpcy5fdGltZXJJZCA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgY2xlYXJUaW1lb3V0KHRoaXMuX3RpbWVySWQpO1xyXG4gICAgICAgIHRoaXMuX3RpbWVySWQgPSBudWxsO1xyXG4gICAgfVxyXG59XHJcbmV4cG9ydHMuVGltZXIgPSBUaW1lcjtcclxuIiwiaW1wb3J0IHsgT1dXaW5kb3cgfSBmcm9tIFwiQG92ZXJ3b2xmL292ZXJ3b2xmLWFwaS10c1wiO1xyXG5cclxuLy8gQSBiYXNlIGNsYXNzIGZvciB0aGUgYXBwJ3MgZm9yZWdyb3VuZCB3aW5kb3dzLlxyXG4vLyBTZXRzIHRoZSBtb2RhbCBhbmQgZHJhZyBiZWhhdmlvcnMsIHdoaWNoIGFyZSBzaGFyZWQgYWNjcm9zcyB0aGUgZGVza3RvcCBhbmQgaW4tZ2FtZSB3aW5kb3dzLlxyXG5leHBvcnQgY2xhc3MgQXBwV2luZG93IHtcclxuICBwcm90ZWN0ZWQgY3VycldpbmRvdzogT1dXaW5kb3c7XHJcbiAgcHJvdGVjdGVkIG1haW5XaW5kb3c6IE9XV2luZG93O1xyXG4gIHByb3RlY3RlZCBtYXhpbWl6ZWQ6IGJvb2xlYW4gPSBmYWxzZTtcclxuXHJcbiAgY29uc3RydWN0b3Iod2luZG93TmFtZSkge1xyXG4gICAgdGhpcy5tYWluV2luZG93ID0gbmV3IE9XV2luZG93KCdiYWNrZ3JvdW5kJyk7XHJcbiAgICB0aGlzLmN1cnJXaW5kb3cgPSBuZXcgT1dXaW5kb3cod2luZG93TmFtZSk7XHJcblxyXG4gICAgY29uc3QgY2xvc2VCdXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2xvc2VCdXR0b24nKTtcclxuICAgIGNvbnN0IG1heGltaXplQnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21heGltaXplQnV0dG9uJyk7XHJcbiAgICBjb25zdCBtaW5pbWl6ZUJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtaW5pbWl6ZUJ1dHRvbicpO1xyXG5cclxuICAgIGNvbnN0IGhlYWRlciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdoZWFkZXInKTtcclxuXHJcbiAgICB0aGlzLnNldERyYWcoaGVhZGVyKTtcclxuXHJcbiAgICBjbG9zZUJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcclxuICAgICAgdGhpcy5tYWluV2luZG93LmNsb3NlKCk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBtaW5pbWl6ZUJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcclxuICAgICAgdGhpcy5jdXJyV2luZG93Lm1pbmltaXplKCk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBtYXhpbWl6ZUJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcclxuICAgICAgaWYgKCF0aGlzLm1heGltaXplZCkge1xyXG4gICAgICAgIHRoaXMuY3VycldpbmRvdy5tYXhpbWl6ZSgpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRoaXMuY3VycldpbmRvdy5yZXN0b3JlKCk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHRoaXMubWF4aW1pemVkID0gIXRoaXMubWF4aW1pemVkO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgYXN5bmMgZ2V0V2luZG93U3RhdGUoKSB7XHJcbiAgICByZXR1cm4gYXdhaXQgdGhpcy5jdXJyV2luZG93LmdldFdpbmRvd1N0YXRlKCk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGFzeW5jIHNldERyYWcoZWxlbSkge1xyXG4gICAgdGhpcy5jdXJyV2luZG93LmRyYWdNb3ZlKGVsZW0pO1xyXG4gIH1cclxufVxyXG4iLCJleHBvcnQgY29uc3Qga0dhbWVzRmVhdHVyZXMgPSBuZXcgTWFwPG51bWJlciwgc3RyaW5nW10+KFtcclxuICAvLyBGb3J0bml0ZVxyXG4gIFtcclxuICAgIDIxMjE2LFxyXG4gICAgW1xyXG4gICAgICAna2lsbCcsXHJcbiAgICAgICdraWxsZWQnLFxyXG4gICAgICAna2lsbGVyJyxcclxuICAgICAgJ3Jldml2ZWQnLFxyXG4gICAgICAnZGVhdGgnLFxyXG4gICAgICAnbWF0Y2gnLFxyXG4gICAgICAnbWF0Y2hfaW5mbycsXHJcbiAgICAgICdyYW5rJyxcclxuICAgICAgJ21lJyxcclxuICAgICAgJ3BoYXNlJyxcclxuICAgICAgJ2xvY2F0aW9uJyxcclxuICAgICAgJ3RlYW0nLFxyXG4gICAgICAnaXRlbXMnLFxyXG4gICAgICAnY291bnRlcnMnXHJcbiAgICBdXHJcbiAgXSxcclxuICAvLyBDU0dPXHJcbiAgW1xyXG4gICAgNzc2NCxcclxuICAgIFtcclxuICAgICAgJ21hdGNoX2luZm8nLFxyXG4gICAgICAna2lsbCcsXHJcbiAgICAgICdkZWF0aCcsXHJcbiAgICAgICdhc3Npc3QnLFxyXG4gICAgICAnaGVhZHNob3QnLFxyXG4gICAgICAncm91bmRfc3RhcnQnLFxyXG4gICAgICAnbWF0Y2hfc3RhcnQnLFxyXG4gICAgICAnbWF0Y2hfaW5mbycsXHJcbiAgICAgICdtYXRjaF9lbmQnLFxyXG4gICAgICAndGVhbV9yb3VuZF93aW4nLFxyXG4gICAgICAnYm9tYl9wbGFudGVkJyxcclxuICAgICAgJ2JvbWJfY2hhbmdlJyxcclxuICAgICAgJ3JlbG9hZGluZycsXHJcbiAgICAgICdmaXJlZCcsXHJcbiAgICAgICd3ZWFwb25fY2hhbmdlJyxcclxuICAgICAgJ3dlYXBvbl9hY3F1aXJlZCcsXHJcbiAgICAgICdpbmZvJyxcclxuICAgICAgJ3Jvc3RlcicsXHJcbiAgICAgICdwbGF5ZXJfYWN0aXZpdHlfY2hhbmdlJyxcclxuICAgICAgJ3RlYW1fc2V0JyxcclxuICAgICAgJ3JlcGxheScsXHJcbiAgICAgICdjb3VudGVycycsXHJcbiAgICAgICdtdnAnLFxyXG4gICAgICAnc2NvcmVib2FyZCcsXHJcbiAgICAgICdraWxsX2ZlZWQnXHJcbiAgICBdXHJcbiAgXSxcclxuICAvLyBMZWFndWUgb2YgTGVnZW5kcyBBTkQgdGZ0XHJcbiAgW1xyXG4gICAgNTQyNixcclxuICAgIFtcclxuICAgICAgJ21lJyxcclxuXHJcbiAgICAgICdzdG9yZScsXHJcblxyXG4gICAgICAnYm9hcmQnLFxyXG5cclxuICAgICAgJ2JlbmNoJyxcclxuXHJcbiAgICAgICdtYXRjaF9pbmZvJyxcclxuXHJcbiAgICBdXHJcbiAgXSxcclxuICAvL1RGVCBnYW1lIGV2ZW50cyBcclxuICBbXHJcbiAgICAyMTU3MCxcclxuICAgIFtcclxuICAgICAgJ3JvdW5kX3N0YXJ0JyxcclxuICAgICAgJ3JvdW5kX2VuZCcsXHJcbiAgICAgICdiYXR0bGVfZW5kJyxcclxuICAgICAgJ2JhdHRsZV9zdGFydCdcclxuICAgIF1cclxuICBdLFxyXG5cclxuICAvLyBFc2NhcGUgRnJvbSBUYXJrb3ZcclxuICBbXHJcbiAgICAyMTYzNCxcclxuICAgIFtcclxuICAgICAgJ21hdGNoX2luZm8nLFxyXG4gICAgICAnZ2FtZV9pbmZvJ1xyXG4gICAgXVxyXG4gIF0sXHJcbiAgLy8gTWluZWNyYWZ0XHJcbiAgW1xyXG4gICAgODAzMixcclxuICAgIFtcclxuICAgICAgJ2dhbWVfaW5mbycsXHJcbiAgICAgICdtYXRjaF9pbmZvJ1xyXG4gICAgXVxyXG4gIF0sXHJcbiAgLy8gT3ZlcndhdGNoXHJcbiAgW1xyXG4gICAgMTA4NDQsXHJcbiAgICBbXHJcbiAgICAgICdnYW1lX2luZm8nLFxyXG4gICAgICAnbWF0Y2hfaW5mbycsXHJcbiAgICAgICdraWxsJyxcclxuICAgICAgJ2RlYXRoJ1xyXG4gICAgXVxyXG4gIF0sXHJcbiAgLy8gUFVCR1xyXG4gIFtcclxuICAgIDEwOTA2LFxyXG4gICAgW1xyXG4gICAgICAna2lsbCcsXHJcbiAgICAgICdyZXZpdmVkJyxcclxuICAgICAgJ2RlYXRoJyxcclxuICAgICAgJ2tpbGxlcicsXHJcbiAgICAgICdtYXRjaCcsXHJcbiAgICAgICdtYXRjaF9pbmZvJyxcclxuICAgICAgJ3JhbmsnLFxyXG4gICAgICAnY291bnRlcnMnLFxyXG4gICAgICAnbG9jYXRpb24nLFxyXG4gICAgICAnbWUnLFxyXG4gICAgICAndGVhbScsXHJcbiAgICAgICdwaGFzZScsXHJcbiAgICAgICdtYXAnLFxyXG4gICAgICAncm9zdGVyJ1xyXG4gICAgXVxyXG4gIF0sXHJcbiAgLy8gUmFpbmJvdyBTaXggU2llZ2VcclxuICBbXHJcbiAgICAxMDgyNixcclxuICAgIFtcclxuICAgICAgJ2dhbWVfaW5mbycsXHJcbiAgICAgICdtYXRjaCcsXHJcbiAgICAgICdtYXRjaF9pbmZvJyxcclxuICAgICAgJ3Jvc3RlcicsXHJcbiAgICAgICdraWxsJyxcclxuICAgICAgJ2RlYXRoJyxcclxuICAgICAgJ21lJyxcclxuICAgICAgJ2RlZnVzZXInXHJcbiAgICBdXHJcbiAgXSxcclxuICAvLyBTcGxpdGdhdGU6IEFyZW5hIFdhcmZhcmVcclxuICBbXHJcbiAgICAyMTQwNCxcclxuICAgIFtcclxuICAgICAgJ2dhbWVfaW5mbycsXHJcbiAgICAgICdtYXRjaF9pbmZvJyxcclxuICAgICAgJ3BsYXllcicsXHJcbiAgICAgICdsb2NhdGlvbicsXHJcbiAgICAgICdtYXRjaCcsXHJcbiAgICAgICdmZWVkJyxcclxuICAgICAgJ2Nvbm5lY3Rpb24nLFxyXG4gICAgICAna2lsbCcsXHJcbiAgICAgICdkZWF0aCcsXHJcbiAgICAgICdwb3J0YWwnLFxyXG4gICAgICAnYXNzaXN0J1xyXG4gICAgXVxyXG4gIF0sXHJcbiAgLy8gUGF0aCBvZiBFeGlsZVxyXG4gIFtcclxuICAgIDcyMTIsXHJcbiAgICBbXHJcbiAgICAgICdraWxsJyxcclxuICAgICAgJ2RlYXRoJyxcclxuICAgICAgJ21lJyxcclxuICAgICAgJ21hdGNoX2luZm8nXHJcbiAgICBdXHJcbiAgXSxcclxuICAvLyBWYWxvcmFudFxyXG4gIFtcclxuICAgIDIxNjQwLFxyXG4gICAgW1xyXG4gICAgICAnbWUnLFxyXG4gICAgICAnZ2FtZV9pbmZvJyxcclxuICAgICAgJ21hdGNoX2luZm8nLFxyXG4gICAgICAna2lsbCcsXHJcbiAgICAgICdkZWF0aCdcclxuICAgIF1cclxuICBdLFxyXG4gIC8vIERvdGEgMlxyXG4gIFtcclxuICAgIDczMTQsXHJcbiAgICBbXHJcbiAgICAgICdnYW1lX3N0YXRlX2NoYW5nZWQnLFxyXG4gICAgICAnbWF0Y2hfc3RhdGVfY2hhbmdlZCcsXHJcbiAgICAgICdtYXRjaF9kZXRlY3RlZCcsXHJcbiAgICAgICdkYXl0aW1lX2NoYW5nZWQnLFxyXG4gICAgICAnY2xvY2tfdGltZV9jaGFuZ2VkJyxcclxuICAgICAgJ3dhcmRfcHVyY2hhc2VfY29vbGRvd25fY2hhbmdlZCcsXHJcbiAgICAgICdtYXRjaF9lbmRlZCcsXHJcbiAgICAgICdraWxsJyxcclxuICAgICAgJ2Fzc2lzdCcsXHJcbiAgICAgICdkZWF0aCcsXHJcbiAgICAgICdjcycsXHJcbiAgICAgICd4cG0nLFxyXG4gICAgICAnZ3BtJyxcclxuICAgICAgJ2dvbGQnLFxyXG4gICAgICAnaGVyb19sZXZlbGVkX3VwJyxcclxuICAgICAgJ2hlcm9fcmVzcGF3bmVkJyxcclxuICAgICAgJ2hlcm9fYnV5YmFja19pbmZvX2NoYW5nZWQnLFxyXG4gICAgICAnaGVyb19ib3VnaHRiYWNrJyxcclxuICAgICAgJ2hlcm9faGVhbHRoX21hbmFfaW5mbycsXHJcbiAgICAgICdoZXJvX3N0YXR1c19lZmZlY3RfY2hhbmdlZCcsXHJcbiAgICAgICdoZXJvX2F0dHJpYnV0ZXNfc2tpbGxlZCcsXHJcbiAgICAgICdoZXJvX2FiaWxpdHlfc2tpbGxlZCcsXHJcbiAgICAgICdoZXJvX2FiaWxpdHlfdXNlZCcsXHJcbiAgICAgICdoZXJvX2FiaWxpdHlfY29vbGRvd25fY2hhbmdlZCcsXHJcbiAgICAgICdoZXJvX2FiaWxpdHlfY2hhbmdlZCcsXHJcbiAgICAgICdoZXJvX2l0ZW1fY29vbGRvd25fY2hhbmdlZCcsXHJcbiAgICAgICdoZXJvX2l0ZW1fY2hhbmdlZCcsXHJcbiAgICAgICdoZXJvX2l0ZW1fdXNlZCcsXHJcbiAgICAgICdoZXJvX2l0ZW1fY29uc3VtZWQnLFxyXG4gICAgICAnaGVyb19pdGVtX2NoYXJnZWQnLFxyXG4gICAgICAnbWF0Y2hfaW5mbycsXHJcbiAgICAgICdyb3N0ZXInLFxyXG4gICAgICAncGFydHknLFxyXG4gICAgICAnZXJyb3InLFxyXG4gICAgICAnaGVyb19wb29sJyxcclxuICAgICAgJ21lJyxcclxuICAgICAgJ2dhbWUnXHJcbiAgICBdXHJcbiAgXSxcclxuICAvLyBDYWxsIG9mIER1dHk6IFdhcnpvbmVcclxuICBbXHJcbiAgICAyMTYyNixcclxuICAgIFtcclxuICAgICAgJ21hdGNoX2luZm8nLFxyXG4gICAgICAnZ2FtZV9pbmZvJyxcclxuICAgICAgJ2tpbGwnLFxyXG4gICAgICAnZGVhdGgnXHJcbiAgICBdXHJcbiAgXSxcclxuICAvLyBXYXJmcmFtZVxyXG4gIFtcclxuICAgIDg5NTQsXHJcbiAgICBbXHJcbiAgICAgICdnYW1lX2luZm8nLFxyXG4gICAgICAnbWF0Y2hfaW5mbydcclxuICAgIF1cclxuICBdLFxyXG5dKTtcclxuXHJcbmV4cG9ydCBjb25zdCBrR2FtZUNsYXNzSWRzID0gQXJyYXkuZnJvbShrR2FtZXNGZWF0dXJlcy5rZXlzKCkpO1xyXG5cclxuZXhwb3J0IGNvbnN0IGtXaW5kb3dOYW1lcyA9IHtcclxuICBpbkdhbWU6ICdpbl9nYW1lJyxcclxuICBkZXNrdG9wOiAnZGVza3RvcCdcclxufTtcclxuXHJcbmV4cG9ydCBjb25zdCBrSG90a2V5cyA9IHtcclxuICB0b2dnbGU6ICdzYW1wbGVfYXBwX3RzX3Nob3doaWRlJ1xyXG59O1xyXG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHRpZihfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdKSB7XG5cdFx0cmV0dXJuIF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0uZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsImltcG9ydCB7XHJcbiAgT1dHYW1lcyxcclxuICBPV0dhbWVzRXZlbnRzLFxyXG4gIE9XSG90a2V5c1xyXG59IGZyb20gXCJAb3ZlcndvbGYvb3ZlcndvbGYtYXBpLXRzXCI7XHJcblxyXG5pbXBvcnQgeyBBcHBXaW5kb3cgfSBmcm9tIFwiLi4vQXBwV2luZG93XCI7XHJcbmltcG9ydCB7IGtIb3RrZXlzLCBrV2luZG93TmFtZXMsIGtHYW1lc0ZlYXR1cmVzIH0gZnJvbSBcIi4uL2NvbnN0c1wiO1xyXG5cclxuaW1wb3J0IFdpbmRvd1N0YXRlID0gb3ZlcndvbGYud2luZG93cy5XaW5kb3dTdGF0ZUV4O1xyXG5cclxuY2xhc3MgSW5HYW1lIGV4dGVuZHMgQXBwV2luZG93IHtcclxuICBwcml2YXRlIHN0YXRpYyBfaW5zdGFuY2U6IEluR2FtZTtcclxuICBwcml2YXRlIF9nYW1lRXZlbnRzTGlzdGVuZXI6IE9XR2FtZXNFdmVudHM7XHJcbiAgLy8gcHJpdmF0ZSBfZXZlbnRzTG9nOiBIVE1MRWxlbWVudDtcclxuICBwcml2YXRlIF9kYW1hZ2VMb2c6IEhUTUxFbGVtZW50O1xyXG4gICBwcml2YXRlIF9kZWZhdWx0TG9nOiBIVE1MRWxlbWVudDtcclxuICBwcml2YXRlIF9nb2xkTG9nOiBIVE1MRWxlbWVudDtcclxuICBwcml2YXRlIF9ib2FyZExvZzogSFRNTEVsZW1lbnQ7XHJcblxyXG4gIHByaXZhdGUgY29uc3RydWN0b3IoKSB7XHJcbiAgICBzdXBlcihrV2luZG93TmFtZXMuaW5HYW1lKTtcclxuXHJcbiAgICB0aGlzLl9ib2FyZExvZyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdib2FyZExvZycpO1xyXG4gICAgIHRoaXMuX2RlZmF1bHRMb2cgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZGVmYXVsdExvZycpO1xyXG4gICAgdGhpcy5fZGFtYWdlTG9nID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2RtZ0xvZycpO1xyXG4gICAgdGhpcy5fZ29sZExvZyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdnb2xkTG9nJyk7XHJcbiAgICAvLyB0aGlzLl9ldmVudHNMb2cgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZXZlbnRzTG9nJyk7XHJcblxyXG4gICAgdGhpcy5zZXRUb2dnbGVIb3RrZXlCZWhhdmlvcigpO1xyXG4gICAgdGhpcy5zZXRUb2dnbGVIb3RrZXlUZXh0KCk7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgc3RhdGljIGluc3RhbmNlKCkge1xyXG4gICAgaWYgKCF0aGlzLl9pbnN0YW5jZSkge1xyXG4gICAgICB0aGlzLl9pbnN0YW5jZSA9IG5ldyBJbkdhbWUoKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gdGhpcy5faW5zdGFuY2U7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgYXN5bmMgcnVuKCkge1xyXG4gICAgY29uc3QgZ2FtZUNsYXNzSWQgPSBhd2FpdCB0aGlzLmdldEN1cnJlbnRHYW1lQ2xhc3NJZCgpO1xyXG5cclxuICAgIGNvbnN0IGdhbWVGZWF0dXJlcyA9IGtHYW1lc0ZlYXR1cmVzLmdldChnYW1lQ2xhc3NJZCk7XHJcblxyXG4gICAgaWYgKGdhbWVGZWF0dXJlcyAmJiBnYW1lRmVhdHVyZXMubGVuZ3RoKSB7XHJcbiAgICAgIHRoaXMuX2dhbWVFdmVudHNMaXN0ZW5lciA9IG5ldyBPV0dhbWVzRXZlbnRzKFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIG9uSW5mb1VwZGF0ZXM6IHRoaXMub25JbmZvVXBkYXRlcy5iaW5kKHRoaXMpLFxyXG4gICAgICAgICAgb25OZXdFdmVudHM6IHRoaXMub25OZXdFdmVudHMuYmluZCh0aGlzKVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZ2FtZUZlYXR1cmVzXHJcbiAgICAgICk7XHJcbiAgICAgIHRoaXMuX2dhbWVFdmVudHNMaXN0ZW5lci5zdGFydCgpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgIHByaXZhdGUgIG9uSW5mb1VwZGF0ZXMoaW5mbykge1xyXG4gIFxyXG4gICAgICB0aGlzLmxvZ0xpbmUoaW5mbyk7XHJcblxyXG4gIH1cclxuXHJcbiAgLy8gU3BlY2lhbCBldmVudHMgd2lsbCBiZSBoaWdobGlnaHRlZCBpbiB0aGUgZXZlbnQgbG9nXHJcbiAgcHJpdmF0ZSBvbk5ld0V2ZW50cyhlKSB7XHJcblxyXG4gICAgdGhpcy5sb2dMaW5lKCBlKTtcclxuICB9XHJcblxyXG4gIC8vIERpc3BsYXlzIHRoZSB0b2dnbGUgbWluaW1pemUvcmVzdG9yZSBob3RrZXkgaW4gdGhlIHdpbmRvdyBoZWFkZXJcclxuICBwcml2YXRlIGFzeW5jIHNldFRvZ2dsZUhvdGtleVRleHQoKSB7XHJcbiAgICBjb25zdCBnYW1lQ2xhc3NJZCA9IGF3YWl0IHRoaXMuZ2V0Q3VycmVudEdhbWVDbGFzc0lkKCk7XHJcbiAgICBjb25zdCBob3RrZXlUZXh0ID0gYXdhaXQgT1dIb3RrZXlzLmdldEhvdGtleVRleHQoa0hvdGtleXMudG9nZ2xlLCBnYW1lQ2xhc3NJZCk7XHJcbiAgICBjb25zdCBob3RrZXlFbGVtID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2hvdGtleScpO1xyXG4gICAgaG90a2V5RWxlbS50ZXh0Q29udGVudCA9IGhvdGtleVRleHQ7XHJcbiAgfVxyXG5cclxuICAvLyBTZXRzIHRvZ2dsZUluR2FtZVdpbmRvdyBhcyB0aGUgYmVoYXZpb3IgZm9yIHRoZSBDdHJsK0YgaG90a2V5XHJcbiAgcHJpdmF0ZSBhc3luYyBzZXRUb2dnbGVIb3RrZXlCZWhhdmlvcigpIHtcclxuICAgIGNvbnN0IHRvZ2dsZUluR2FtZVdpbmRvdyA9IGFzeW5jIChcclxuICAgICAgaG90a2V5UmVzdWx0OiBvdmVyd29sZi5zZXR0aW5ncy5ob3RrZXlzLk9uUHJlc3NlZEV2ZW50XHJcbiAgICApOiBQcm9taXNlPHZvaWQ+ID0+IHtcclxuICAgICAgY29uc29sZS5sb2coYHByZXNzZWQgaG90a2V5IGZvciAke2hvdGtleVJlc3VsdC5uYW1lfWApO1xyXG4gICAgICBjb25zdCBpbkdhbWVTdGF0ZSA9IGF3YWl0IHRoaXMuZ2V0V2luZG93U3RhdGUoKTtcclxuXHJcbiAgICAgIGlmIChpbkdhbWVTdGF0ZS53aW5kb3dfc3RhdGUgPT09IFdpbmRvd1N0YXRlLk5PUk1BTCB8fFxyXG4gICAgICAgIGluR2FtZVN0YXRlLndpbmRvd19zdGF0ZSA9PT0gV2luZG93U3RhdGUuTUFYSU1JWkVEKSB7XHJcbiAgICAgICAgdGhpcy5jdXJyV2luZG93Lm1pbmltaXplKCk7XHJcbiAgICAgIH0gZWxzZSBpZiAoaW5HYW1lU3RhdGUud2luZG93X3N0YXRlID09PSBXaW5kb3dTdGF0ZS5NSU5JTUlaRUQgfHxcclxuICAgICAgICBpbkdhbWVTdGF0ZS53aW5kb3dfc3RhdGUgPT09IFdpbmRvd1N0YXRlLkNMT1NFRCkge1xyXG4gICAgICAgIHRoaXMuY3VycldpbmRvdy5yZXN0b3JlKCk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIE9XSG90a2V5cy5vbkhvdGtleURvd24oa0hvdGtleXMudG9nZ2xlLCB0b2dnbGVJbkdhbWVXaW5kb3cpO1xyXG4gIH1cclxuXHJcbiAgLy8gQXBwZW5kcyBhIG5ldyBsaW5lIHRvIHRoZSBzcGVjaWZpZWQgbG9nXHJcbiAgcHJpdmF0ZSBsb2dMaW5lKGRhdGEpIHtcclxuICAgIGNvbnN0IGxpbmUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwcmUnKTtcclxuXHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZG1nTG9nJykuaW5uZXJIVE1MID0gZGF0YS5tYXRjaF9pbmZvLmxvY2FsX3BsYXllcl9kYW1hZ2Uuc3BsaXQoXCJcXFwiXCIpWzVdICsgXCIgPT0+IFwiICsgZGF0YS5tYXRjaF9pbmZvLmxvY2FsX3BsYXllcl9kYW1hZ2Uuc3BsaXQoXCJcXFwiXCIpWzhdIDsgLy8gZG1nXHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZ29sZExvZycpLmlubmVySFRNTCA9IGRhdGEubWUuZ29sZDsgLy8gZ29sZCBcclxuXHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGFzeW5jIGdldEN1cnJlbnRHYW1lQ2xhc3NJZCgpOiBQcm9taXNlPG51bWJlciB8IG51bGw+IHtcclxuICAgIGNvbnN0IGluZm8gPSBhd2FpdCBPV0dhbWVzLmdldFJ1bm5pbmdHYW1lSW5mbygpO1xyXG5cclxuICAgIHJldHVybiAoaW5mbyAmJiBpbmZvLmlzUnVubmluZyAmJiBpbmZvLmNsYXNzSWQpID8gaW5mby5jbGFzc0lkIDogbnVsbDtcclxuICB9XHJcbn1cclxuXHJcbkluR2FtZS5pbnN0YW5jZSgpLnJ1bigpOyJdLCJzb3VyY2VSb290IjoiIn0=