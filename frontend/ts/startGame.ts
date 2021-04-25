import { Data, Coordinates, tColors, HomesOrBases, Square, HoBSquare, Ghost, mFetch } from "../../helpers/helpersBack";
import Helpers from "../../helpers/helpers.js";
import { Chequer, GameBoard } from "../../helpers/helpersBack.js";
import Timer from "./timer.js";
import Logic from "./logic.js";
import gameTable from "./gameTable.js";
import ghost from "./ghost.js";
import gameBoardClass from "./gameBoard.js";

export default class StartGame {
  bgColors = ["primary", "danger", "success", "warning"];
  static colors = ["blue", "red", "green", "yellow"];
  colors = StartGame.colors;
  radius = 20;
  startInterval = () => { this.getData(); this.interval = setInterval(() => this.getData(), 2000); }

  uid!: string;
  color!: tColors;
  data!: Data;
  gameBoard!: GameBoard;
  index!: number;
  oldIndex!: number;

  interval!: any;
  timer!: Timer;
  gameWasStopped!: boolean;

  inpStateToggle!: HTMLInputElement;
  btnRollDice!: HTMLButtonElement;
  divDice!: HTMLDivElement;

  mineTurn = false;
  gameStarted = false;
  toggleStop = false;

  constructor(data: { data: Data, uid: string }) {
    this.init(data);
  }

  async init(data: { data: Data, uid: string }) {
    document.body.innerHTML = await (await fetch("/map.html")).text();

    this.uid = data.uid;
    this.data = data.data;
    this.index = data.data.filter(el => el.id === this.uid)[0].index;
    this.color = data.data.filter(el => el.id === this.uid)[0].color;

    this.inpStateToggle = document.getElementsByTagName("input")[0];
    this.btnRollDice = document.getElementsByTagName("button")[0];
    this.divDice = document.getElementById("dice") as HTMLDivElement;
    gameTable.gameTable = document.getElementsByTagName("table")[1];
    this.timer = new Timer();

    this.inpStateToggle.onclick = this.readyStateToggle;
    this.btnRollDice.onclick = this.rollDice;

    this.setOpponents(data.data, true);
    gameTable.drawGameTable();

    this.startInterval();
  }

  async setOpponents(data: Data, firstTime: boolean): Promise<void> {
    let tds = (document.getElementsByClassName("player-name") as HTMLCollectionOf<HTMLElement>),
      i = 0;

    for (let player of data) {
      tds[i].className = tds[i].className.replace(/\bbg-.*\b/, '');

      if (player.ready === true || this.gameStarted === true) {
        tds[i].classList.add("bg-" + this.bgColors[player.color]);
        if (this.uid === player.id)
          this.inpStateToggle.checked = true;
      }
      else
        tds[i].classList.add("bg-secondary");

      (tds[i].children[0] as HTMLElement).innerText = player.name;
      i++;
    }
    if (firstTime === true) {
      for (; i < 4; i++) {
        tds[i].classList.add("bg-secondary");
        (tds[i].children[0] as HTMLElement).innerText = "?";
      }
    }
  }

  readyStateToggle = async (e: MouseEvent): Promise<void> => {
    if (this.toggleStop) {
      this.inpStateToggle.checked = true;
      return;
    }
    this.toggleStop = true;
    let res = await Helpers.mFetch("/readyStateToggle", {
      state: this.inpStateToggle.checked
    });
    if (res.started === true)
      this.toggleStop = true;
    else
      this.toggleStop = false;
    clearInterval(this.interval);
    this.getData();
    this.startInterval();
  }

  rollDice = async (e: MouseEvent): Promise<void> => {
    let number = Helpers.getRandomInt(1, 7);
    this.diceHash;
    this.divDice.classList.add(`dice-${number}`);
    this.btnRollDice.style.display = "none";
    this.calcMoves(number);
  }

  calcMoves(number: number) {
    if ([1, 6].includes(number))
      Logic.moveFromBase(this.gameBoard, this.color);

    Logic.moveInMap(this.gameBoard, this.color, number);
    Logic.moveInHome(this.gameBoard, this.color, number);

    gameBoardClass.drawGameBoard(this.gameBoard, this.drawChequer);
    if (ghost.anyGhosts(this.gameBoard, this.color) === false)
      this.sendGameBoard(true);
    else
      ghost.allBlink(this.gameBoard, this.color);
  }

  doTurn(chequer: Chequer | HoBSquare, redraw = true): void {
    if (chequer.ghost === undefined || chequer.ghost.coords === undefined) {
      return;
    }
    this.mineTurn = false;
    let where = chequer.ghost.where;

    if (where.from === "map") {
      this.gameBoard.map[where.oldIndex].chequers.pop();
    } else if (where.from === "base") {
      this.gameBoard.bases[this.color as keyof HomesOrBases][where.oldIndex].chequer = -1;
    } else {
      this.gameBoard.homes[this.color as keyof HomesOrBases][where.oldIndex].chequer = -1;
    }

    if (where.to === "map") {
      let mapIndex = this.gameBoard.map[where.newIndex],
        enemyColor = mapIndex.chequers[0]?.color;
      if (enemyColor !== this.color && enemyColor !== undefined) {
        let enemyBase = this.gameBoard.bases[enemyColor as keyof HomesOrBases];
        for (let chequer of mapIndex.chequers) {
          let i = 0;
          for (let c of enemyBase) {
            if (c.chequer < 0) break;
            i++;
          }
          chequer.ghost = {
            color: enemyColor, coords: { x: mapIndex.x, y: mapIndex.y },
            where: {
              from: "map", oldIndex: where.newIndex,
              to: "base", newIndex: i
            }
          }
          this.doTurn(chequer, true);
        }
        mapIndex.chequers = [];
      }

      mapIndex.chequers.push({ color: this.color });
    } else if (where.to === "base") {
      this.gameBoard.bases[this.color as keyof HomesOrBases][where.newIndex].chequer = this.color;
    } else {
      this.gameBoard.homes[this.color as keyof HomesOrBases][where.newIndex].chequer = this.color;
    }

    if (redraw === true) {
      gameBoardClass.drawGameBoard(this.gameBoard, this.drawChequer);
      this.sendGameBoard(false);
    }
  }

  async hideDice(wait: boolean) {
    let diceHash = this._diceHash;
    wait === true ? await Helpers.sleep(5000) : '';
    if (diceHash === this.diceHash)
      this.divDice.className = this.divDice.className.replace(/dice.*/, '');
  }

  async sendGameBoard(diceWait: boolean) {
    ghost.allStopBlink();
    ghost.removeGhosts(this.gameBoard, this.color);
    this.timer.stop();
    this.gameWasStopped = true;
    this.hideDice(diceWait);
    await Helpers.mFetch("/saveGameBoard", { gameBoard: this.gameBoard });
  }

  drawChequer = (coords: Coordinates, color: tColors, chequer: Chequer | HoBSquare): void => {
    let td = gameTable.getTd(coords);
    gameBoardClass.showChequer(coords, color);
    if (this.mineTurn === true && chequer.ghost !== undefined) {
      td.onmouseenter = () => ghost.showGhost(chequer, this.color);
      td.onmouseleave = () => ghost.hideGhost(chequer);
      td.onclick = () => this.doTurn(chequer);
    }
  }

  async startTimer(currentPlayer: number, timeTillTurnEnd: number) {
    await this.timer.start(currentPlayer, timeTillTurnEnd);
    if (this.gameWasStopped !== true)
      this.sendGameBoard(false);
  }
  _diceHash = 0;
  get diceHash(): number {
    if (this._diceHash >= Number.MAX_SAFE_INTEGER)
      this._diceHash = 0;

    return this._diceHash++;
  }

  async getData() {
    let data: { gameBoard: GameBoard, currentPlayer: number, started: number, data: Data, timeTillTurnEnd: number }
      = await Helpers.mFetch("/getCurrentGameState", {});
    if (data.started === 1) {
      this.gameStarted = true;
      if (this.oldIndex !== data.currentPlayer) {
        this.oldIndex = data.currentPlayer;
        if (data.currentPlayer === this.index/*  && this.mineTurn === false */) {
          this.mineTurn = true;
          this.gameWasStopped = false;
          this.btnRollDice.style.display = "block";
        }// else if (JSON.stringify(data.gameBoard) !== JSON.stringify(this.gameBoard)) {
        this.gameBoard = data.gameBoard;
        gameBoardClass.drawGameBoard(this.gameBoard, this.drawChequer);
        // }
        this.startTimer(data.currentPlayer, data.timeTillTurnEnd);
      }
    }

    if (JSON.stringify(data.data) !== JSON.stringify(this.data)) {
      this.data = data.data;
      this.setOpponents(this.data, false);
    }

    // TODO: Going to home
    // TODO: Check stacking
    // TODO: Check zbijanie
    // TODO: Going from [40] -> [0]
    // TODO: Ending turn
  }
}
