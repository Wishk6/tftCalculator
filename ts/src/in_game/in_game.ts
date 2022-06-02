import {
  OWGames,
  OWGamesEvents,
  OWHotkeys
} from "@overwolf/overwolf-api-ts";

import { AppWindow } from "../AppWindow";
import { kHotkeys, kWindowNames, kGamesFeatures } from "../consts";

import WindowState = overwolf.windows.WindowStateEx;

class InGame extends AppWindow {
  private static _instance: InGame;
  private _gameEventsListener: OWGamesEvents;
  private _eventsLog: HTMLElement;
  private _boardLog: HTMLElement;
  private _damageLog: HTMLElement;
  private _champsLog: HTMLElement;
  public localChampsData = [];
  public localDamageData = [];

  private constructor() {
    super(kWindowNames.inGame);

    this._damageLog = document.getElementById('dmgLog');
    this._boardLog = document.getElementById('boardLog');

    this.setToggleHotkeyBehavior();
    this.setToggleHotkeyText();
  }

  public static instance() {
    if (!this._instance) {
      this._instance = new InGame();
    }

    return this._instance;
  }

  public async run() {
    const gameClassId = await this.getCurrentGameClassId();

    const gameFeatures = kGamesFeatures.get(gameClassId);

    if (gameFeatures && gameFeatures.length) {
      this._gameEventsListener = new OWGamesEvents(
        {
          onInfoUpdates: this.onInfoUpdates.bind(this),
          onNewEvents: this.onNewEvents.bind(this)
        },
        gameFeatures
      );
      this._gameEventsListener.start();
    }
  }

  private async onInfoUpdates(info: any) {

    if (info.match_info.local_player_damage != undefined) {
      await this.logLineDmg(info)
    }

    if (info.board != undefined) {
      await this.logBoard(info);
    }

  }

  // Special events will be highlighted in the event log
  private onNewEvents(e: { events: any[]; }) {

  }

  // Displays the toggle minimize/restore hotkey in the window header
  private async setToggleHotkeyText() {
    const gameClassId = await this.getCurrentGameClassId();
    const hotkeyText = await OWHotkeys.getHotkeyText(kHotkeys.toggle, gameClassId);
    const hotkeyElem = document.getElementById('hotkey');
    hotkeyElem.textContent = hotkeyText;
  }

  // Sets toggleInGameWindow as the behavior for the Ctrl+F hotkey
  private async setToggleHotkeyBehavior() {
    const toggleInGameWindow = async (
      hotkeyResult: overwolf.settings.hotkeys.OnPressedEvent
    ): Promise<void> => {
      console.log(`pressed hotkey for ${hotkeyResult.name}`);
      const inGameState = await this.getWindowState();

      if (inGameState.window_state === WindowState.NORMAL ||
        inGameState.window_state === WindowState.MAXIMIZED) {
        this.currWindow.minimize();
      } else if (inGameState.window_state === WindowState.MINIMIZED ||
        inGameState.window_state === WindowState.CLOSED) {
        this.currWindow.restore();
      }
    }
    OWHotkeys.onHotkeyDown(kHotkeys.toggle, toggleInGameWindow);
  }

  // Appends a new line to the specified log
  private async logLineDmg(data: { match_info: { local_player_damage: string; }; }) {
    let damageData = [];
    let champsData = [];
    // let dmgData = [];
    let len = (Math.floor(data.match_info.local_player_damage.split("\"").length / 10));
    for (let i = 0; i < len; i++) {
      // dmgData.push(data.match_info.local_player_damage.split("\"")[5 + (i * 10)].replace(/\s|TFT6_/g, '') + (data.match_info.local_player_damage.split("\"")[8 + (i * 10)].replace(/\s|:|,/g, ' ')));
      champsData.push(data.match_info.local_player_damage.split("\"")[5 + (i * 10)].replace(/\s|TFT6_/g, ''));
      damageData.push(data.match_info.local_player_damage.split("\"")[8 + (i * 10)].replace(/\s|:|,/g, ' '));
    }
    this.localChampsData = champsData;
    this.localDamageData = damageData;
    this._damageLog.innerHTML = JSON.stringify(damageData).replace(/\s|,/g, ' '); // dmg
    this._champsLog.innerHTML = JSON.stringify(damageData).replace(/\s|,/g, ' '); // dmg

  }

  private async logBoard(data: { board: { board_pieces: string; }; }) {

    this._boardLog.innerHTML = JSON.stringify(data.board.board_pieces.replace(/,|:|item_1|item_2|item_3|name|cell_|TFT6_|\"/g, ' '));
    await this.logChampsOpt();
  }

  private async logChampsOpt() {

    for (let i = 0; i < this.localChampsData.length; i++) {
      document.getElementById(i.toString()).innerHTML = this.localChampsData[i];
    }
    this.localChampsData.length = 0;
    
  }

  // faire les fonctions sur le clic kdes images 'les stinrgs envoyé 
  // faire en sorte de nettoyer la data reçue et modifée 
  // voir pour algos si le temps

  private async getCurrentGameClassId(): Promise<number | null> {
    const info = await OWGames.getRunningGameInfo();

    return (info && info.isRunning && info.classId) ? info.classId : null;
  }
}

InGame.instance().run();