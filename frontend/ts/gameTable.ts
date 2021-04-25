import { Coordinates } from "../../helpers/helpersBack";

export default class gameTable {
    static numberOfSquaresOnGameBoard = 11;
    static gameTable: HTMLTableElement;

    static drawGameTable(): void {
        for (let i = 0; i < gameTable.numberOfSquaresOnGameBoard; i++) {
          let tr = document.createElement("tr");
          for (let j = 0; j < gameTable.numberOfSquaresOnGameBoard; j++) {
            let td = document.createElement("td");
            td.classList.add("chequer");
            td.dataset.count = '0';
            tr.appendChild(td);
          }
          gameTable.gameTable.appendChild(tr);
        }
      }
      static getTd(coords: Coordinates): HTMLElement {
        return gameTable.gameTable.children[coords.y].children[coords.x] as HTMLElement;
      }
}