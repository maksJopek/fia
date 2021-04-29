import { Coordinates, GameBoard, HomesOrBases, OldTd, tColors } from "../../helpers/helpersBack";
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
    gameBoardClass.hideChequer(coords, all);
    td.onmouseenter = () => null;
    td.onmouseleave = () => null;
    td.onclick = () => null;
  }

  static showChequer(coords: Coordinates, color: tColors, oldColor = 'void'): void {
    let td = gameTable.getTd(coords);
    if (td.dataset.count === undefined)
      throw new Error("td.dataset.count is undefined!!!")

    if (td.className === '')
      td.classList.add("chequer");

    if (color === 4 && !td.className.includes(oldColor) && !td.className.includes('pink')) {
      td.className = 'chequer chequer-' + StartGame.colors[color];
      td.innerHTML = '';
      td.dataset.count = '1';
    } else if (td.dataset.count === '0') {
      td.classList.add("chequer-" + StartGame.colors[color]);
      td.dataset.count = '1';
      td.innerHTML = '';
    } else {
      td.dataset.count = (parseInt(td.dataset.count) + 1).toString();
      td.innerHTML = td.dataset.count === '1' ? '' : 'x' + td.dataset.count;
    }
  }
  static hideChequer(coords: Coordinates, all = false, oldTd: OldTd = { className: '', innerHTML: '', count: '' }) {
    let td = gameTable.getTd(coords);

    if (td.dataset.count === undefined)
      throw new Error("td.dataset.count is undefined!!!")

    if (oldTd.className !== '' && oldTd.count !== '') {
      td.className = oldTd.className;
      td.innerHTML = oldTd.innerHTML;
      td.dataset.count = oldTd.count;
    } else if (all === true || ['0', '1'].includes(td.dataset.count)) {
      td.className = 'chequer';
      td.dataset.count = '0';
      td.innerHTML = '';
    } else {
      td.dataset.count = (parseInt(td.dataset.count) - 1).toString();
      td.innerHTML = td.dataset.count === '1' ? '' : 'x' + td.dataset.count;
    }
  }
}