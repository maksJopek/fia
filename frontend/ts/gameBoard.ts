import { Coordinates, GameBoard, HomesOrBases, tColors } from "../../helpers/helpersBack";
import gameTable from "./gameTable.js";
import StartGame from "./startGame.js";

export default class gameBoardClass {
  static drawGameBoard(gameBoard: GameBoard, drawChequer: Function): void {
    gameBoardClass.removeGameBoard(gameBoard);
    for (let square of gameBoard.map) {
      if (square.chequers.length !== 0) {
        for (let chequer of square.chequers)
          drawChequer({ x: square.x, y: square.y }, chequer.color, chequer);
      }
    }
    for (let baseOfColor in gameBoard.bases) {
      for (let square of gameBoard.bases[baseOfColor as unknown as keyof HomesOrBases]) {
        if (square.chequer > -1)
          drawChequer({ x: square.x, y: square.y }, square.chequer, square);
      }
    }
    for (let baseOfColor in gameBoard.homes) {
      for (let square of gameBoard.homes[baseOfColor as unknown as keyof HomesOrBases]) {
        if (square.chequer > -1)
          drawChequer({ x: square.x, y: square.y }, square.chequer, square);
      }
    }
  }
  static removeGameBoard(gameBoard: GameBoard): void {
    for (let square of gameBoard.map) {
      gameBoardClass.removeChequer({ x: square.x, y: square.y }, true);
    }
    for (let baseOfColor in gameBoard.bases) {
      for (let square of gameBoard.bases[baseOfColor as unknown as keyof HomesOrBases]) {
        gameBoardClass.removeChequer({ x: square.x, y: square.y }, true);
      }
    }
    for (let baseOfColor in gameBoard.homes) {
      for (let square of gameBoard.homes[baseOfColor as unknown as keyof HomesOrBases]) {
        gameBoardClass.removeChequer({ x: square.x, y: square.y }, true);
      }
    }
  }
  static removeChequer(coords: Coordinates, all: boolean) {
    let td = gameTable.getTd(coords);
    gameBoardClass.hideChequer(coords);
    td.onmouseenter = () => null;
    td.onmouseleave = () => null;
    td.onclick = () => null;
  }

  static showChequer(coords: Coordinates, color: tColors): void {
    let td = gameTable.getTd(coords);
    if (td.dataset.count === undefined)
      throw new Error("td.dataset.count is undefined!!!")

    if (td.dataset.count === '0') {
      td.classList.add("chequer-" + StartGame.colors[color]);
      td.dataset.count = '1';
      td.innerHTML = '';
    } else {
      td.dataset.count = (parseInt(td.dataset.count) + 1).toString();
      td.innerHTML = 'x' + td.dataset.count;
    }
  }
  static hideChequer(coords: Coordinates, all = false) {
    let td = gameTable.getTd(coords);

    if (td.dataset.count === '0')
      return;
    if (td.dataset.count === undefined)
      throw new Error("td.dataset.count is undefined!!!")

    if (td.dataset.count === '1' || all === true) {
      td.className = td.className.replace(/chequer-.*/, '');
      td.dataset.count = '0';
      td.innerHTML = '';
    } else {
      td.dataset.count = (parseInt(td.dataset.count) - 1).toString();
      td.innerHTML = 'x' + td.dataset.count;
    }
  }
}