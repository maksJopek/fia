import { Data, Coordinates, tColors, HomesOrBases, Square, HoBSquare, Ghost, mFetch } from "../../helpers/helpersBack";
import Helpers from "../../helpers/helpers.js";
import { Chequer, GameBoard } from "../../helpers/helpersBack.js";
import Timer from "./timer.js";

export default class StartGame {
  bgColors = ["primary", "danger", "success", "warning"];
  colors = ["blue", "red", "green", "yellow"];
  radius = 20;
  numberOfSquaresOnGameBoard = 11;
  startInterval = () => { this.getData(); this.interval = setInterval(() => this.getData(), 2000); }

  uid!: string;
  color!: tColors;
  data!: Data;
  timeTillTurnEnd!: number;
  gameBoard!: GameBoard;
  index!: number;
  oldIndex!: number;

  interval!: any;
  timer!: Timer;

  btnStateToggle!: HTMLInputElement;
  gameTable!: HTMLTableElement;
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

    this.setOpponents(data.data, true);

    this.gameTable = document.getElementsByTagName("table")[1];
    this.btnStateToggle = document.getElementsByTagName("input")[0];
    this.btnRollDice = document.getElementsByTagName("button")[0];
    this.divDice = document.getElementById("dice") as HTMLDivElement;
    this.timer = new Timer();

    this.btnStateToggle.onclick = this.readyStateToggle;
    this.btnRollDice.onclick = this.rollDice;

    this.drawGameTable();

    this.startInterval();
  }

  async setOpponents(data: Data, firstTime: boolean): Promise<void> {
    let tds = (document.getElementsByClassName("player-name") as HTMLCollectionOf<HTMLElement>),
      i = 0;

    for (let player of data) {
      tds[i].className = tds[i].className.replace(/\bbg-.*\b/, '');

      if (player.ready === true) {
        tds[i].classList.add("bg-" + this.bgColors[player.color]);
        if (this.uid === player.id)
          document.getElementsByTagName("input")[0].checked = true;
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
      this.btnStateToggle.checked = true;
      return;
    }
    this.toggleStop = true;
    let res = await Helpers.mFetch("/readyStateToggle", {
      state: this.btnStateToggle.checked
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
    this.divDice.classList.add(`dice-${number}`);
    this.btnRollDice.style.display = "none";
    this.calcMoves(number);
  }

  calcMoves(number: number) {
    if ([1, 6].includes(number))
      this.moveFromBase();

    this.moveInMap(number);
    this.moveInHome(number);

    this.drawGameBoard();
    console.log("checking for ghosts");
    if (this.anyGhosts() === false)
      this.sendGameBoard();
    else
      console.log("ghost were created");
  }
  moveFromBase() {
    let start: Square, i: number;

    this.gameBoard.map.forEach((square, j) => {
      if (square.start === this.color) {
        start = square;
        i = j;
      }
    })

    this.gameBoard.bases[this.color as keyof HomesOrBases].forEach((chequer, j) => {
      if (chequer.chequer > -1) {
        chequer.ghost = {
          where: {
            from: "base", oldIndex: j,
            to: "map", newIndex: i
          },
          color: this.color,
          coords: { x: start.x, y: start.y }
        };
      }
    })
  }
  moveInMap(number: number) {
    this.gameBoard.map.forEach((square, i) => {
      if (square.chequers.length > 0 && square.chequers[0].color === this.color) {

        for (let chequer of square.chequers) {
          let x: number | undefined, y: number | undefined, coords: Coordinates | undefined, inMap: boolean,
            homeIndex: number | undefined;

          if (i + number < this.gameBoard.map.length) {
            x = this.gameBoard.map[i + number].x;
            y = this.gameBoard.map[i + number].y;
            inMap = true;
          }
          else {
            homeIndex = this.gameBoard.map.length - i - 1 - number - 1;
            inMap = true;

            if (homeIndex < this.gameBoard.homes[0].length) {
              x = this.gameBoard.homes[this.color as keyof HomesOrBases][homeIndex].x;
              y = this.gameBoard.homes[this.color as keyof HomesOrBases][homeIndex].y;
            }
            else {
              x = y = undefined;
            }
          }

          if (x === undefined || y === undefined)
            coords = undefined;
          else
            coords = { x, y };

          chequer.ghost = {
            where: {
              from: "map", oldIndex: i,
              to: (inMap === true ? "map" : "home"), newIndex: homeIndex || i + number
            },
            color: this.color,
            coords,
          }
        }
      }
    })
  }
  moveInHome(number: number) {
    let home = this.gameBoard.homes[this.color as keyof HomesOrBases];

    home.forEach((chequer, i) => {
      if (chequer.chequer > -1) {
        let x: number | undefined, y: number | undefined, coords: Coordinates | undefined;
        if (home[i + number] !== undefined) {
          x = home[i + number].x;
          y = home[i + number].y;
        } else {
          x = y = undefined;
        }

        if (x === undefined || y === undefined)
          coords = undefined;
        else
          coords = { x, y };

        chequer.ghost = {
          where: {
            from: "home", oldIndex: i,
            to: "home", newIndex: i + number
          },
          color: this.color,
          coords,
        };
      }
    });
  }

  showGhost(chequer: Chequer | HoBSquare) {
    if (chequer.ghost === undefined || chequer.ghost.coords === undefined) {
      console.log("showChequer::chequer.ghost.coords === undefined", chequer.ghost?.coords === undefined);
      return;
    }
    this.showChequer(chequer.ghost.coords, this.color)
  }
  hideGhost(chequer: Chequer | HoBSquare): void {
    if (chequer.ghost === undefined || chequer.ghost.coords === undefined) {
      console.log("hideChequer::chequer.ghost.coords === undefined", chequer.ghost?.coords === undefined);
      return;
    }
    this.hideChequer(chequer.ghost.coords);
  }
  doTurn(chequer: Chequer | HoBSquare): void {
    if (chequer.ghost === undefined || chequer.ghost.coords === undefined) {
      console.log("hideChequer::chequer.ghost.coords === undefined", chequer.ghost?.coords === undefined);
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
      this.gameBoard.map[where.newIndex].chequers.push({ color: this.color });
    } else if (where.to === "base") {
      this.gameBoard.bases[this.color as keyof HomesOrBases][where.newIndex].chequer = this.color;
    } else {
      this.gameBoard.homes[this.color as keyof HomesOrBases][where.newIndex].chequer = this.color;
    }

    this.sendGameBoard();
  }
  removeGhosts(): void {
    for (let square of this.gameBoard.map) {
      for (let chequer of square.chequers) {
        chequer.ghost = undefined;
      }
    }
    for (let chequer of this.gameBoard.bases[this.color as keyof HomesOrBases]) {
      chequer.ghost = undefined;
    }
    for (let chequer of this.gameBoard.homes[this.color as keyof HomesOrBases]) {
      chequer.ghost = undefined;
    }
  }
  anyGhosts(): boolean {
    for (let square of this.gameBoard.map) {
      for (let chequer of square.chequers) {
        if (chequer.ghost !== undefined)
          return true;
      }
    }
    for (let chequer of this.gameBoard.bases[this.color as keyof HomesOrBases]) {
      if (chequer.ghost !== undefined)
        return true;
    }
    for (let chequer of this.gameBoard.homes[this.color as keyof HomesOrBases]) {
      if (chequer.ghost !== undefined)
        return true;
    }
    return false;
  }

  drawGameBoard(): void {

    for (let square of this.gameBoard.map) {
      if (square.chequers.length !== 0) {
        for (let chequer of square.chequers)
          this.drawChequer({ x: square.x, y: square.y }, chequer.color, chequer);
      }
    }
    for (let baseOfColor in this.gameBoard.bases) {
      for (let square of this.gameBoard.bases[baseOfColor as unknown as keyof HomesOrBases]) {
        if (square.chequer > -1)
          this.drawChequer({ x: square.x, y: square.y }, square.chequer, square);
      }
    }
    for (let baseOfColor in this.gameBoard.homes) {
      for (let square of this.gameBoard.homes[baseOfColor as unknown as keyof HomesOrBases]) {
        if (square.chequer > -1)
          this.drawChequer({ x: square.x, y: square.y }, square.chequer, square);
      }
    }
  }

  drawGameTable(): void {
    for (let i = 0; i < this.numberOfSquaresOnGameBoard; i++) {
      let tr = document.createElement("tr");
      for (let j = 0; j < this.numberOfSquaresOnGameBoard; j++) {
        let td = document.createElement("td");
        td.classList.add("chequer");
        td.dataset.count = '0';
        tr.appendChild(td);
      }
      this.gameTable.appendChild(tr);
    }
  }

  async sendGameBoard() {
    this.divDice.className.replace(/dice.*/, '');
    this.removeGhosts();
    await Helpers.mFetch("/saveGameBoard", { gameBoard: this.gameBoard });
  }

  getTd(coords: Coordinates): HTMLElement {
    return this.gameTable.children[coords.y].children[coords.x] as HTMLElement;
  }
  showChequer(coords: Coordinates, color: tColors): void {
    let td = this.getTd(coords);
    if (td.dataset.count === undefined)
      throw new Error("td.dataset.count is undefined!!!")

    if (td.dataset.count === '0') {
      td.classList.add("chequer-" + this.colors[color]);
      td.dataset.count = "1";
    } else {
      td.dataset.count = (parseInt(td.dataset.count) + 1).toString();
      td.innerHTML = 'x' + td.dataset.count;
    }
  }
  hideChequer(coords: Coordinates, all = false) {
    let td = this.getTd(coords);
    if (td.dataset.count === undefined)
      throw new Error("td.dataset.count is undefined!!!")

    if (td.dataset.count === '0')
      throw new Error("Cannot remove from empty td!!!");

    if (td.dataset.count === '1' || all === true) {
      td.className = td.className.replace(/chequer-.*/, '');
      td.innerHTML = 'x' + td.dataset.count;
    } else {
      td.dataset.count = (parseInt(td.dataset.count) - 1).toString();
      td.innerHTML = 'x' + td.dataset.count;
    }
  }

  drawChequer(coords: Coordinates, color: tColors, chequer: Chequer | HoBSquare): void {
    let td = this.getTd(coords);
    this.showChequer(coords, color);
    if (this.mineTurn === true && chequer.ghost !== undefined) {
      td.onmouseenter = () => { console.log("mouseenter"); this.showGhost(chequer); }
      td.onmouseleave = () => { console.log("mouseleave"); this.hideGhost(chequer); }
      td.onclick = () => { console.log("mouseclick"); this.doTurn(chequer); }
    }
  }
  removeChequer(coords: Coordinates) {
    let td = this.getTd(coords);
    this.hideChequer(coords, true);
    td.onmouseenter = () => null;
    td.onmouseleave = () => null;
    td.onclick = () => null;
  }

  async startTimer(currentPlayer: number) {
    await this.timer.start(currentPlayer, this.timeTillTurnEnd);
    this.sendGameBoard();
  }

  async getData() {
    let data: { gameBoard: GameBoard, currentPlayer: number, started: number, data: Data, timeTillTurnEnd: number }
      = await Helpers.mFetch("/getCurrentGameState", {});
    if (data.started === 1) {
      if (this.oldIndex !== data.currentPlayer) {
        this.oldIndex = data.currentPlayer;
        if (data.currentPlayer === this.index && this.mineTurn === false) {
          this.mineTurn = true;
          this.btnRollDice.style.display = "block";
        }// else if (JSON.stringify(data.gameBoard) !== JSON.stringify(this.gameBoard)) {
        this.gameBoard = data.gameBoard;
        this.drawGameBoard();
        // }
        this.timeTillTurnEnd = data.timeTillTurnEnd;
        this.startTimer(data.currentPlayer);
      }
    }

    if (JSON.stringify(data.data) !== JSON.stringify(this.data)) {
      console.log("startGame::getData::data", data.data);
      this.data = data.data;
      this.setOpponents(this.data, false);
    }

    // TODO: Animation: blinking of chequers with ghosts
    // TODO: Ending turn
    // TODO: Ghost not working
    // TODO: Moving not working
  }
}
