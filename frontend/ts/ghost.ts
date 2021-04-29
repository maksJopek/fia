import { Chequer, GameBoard, HoBSquare, HomesOrBases, OldTd, Square, tColors } from "../../helpers/helpersBack";
import gameBoardClass from "./gameBoard.js";
import gameTable from "./gameTable.js";
import StartGame from "./startGame.js";

export default class ghost {
    static ghostsTds: Array<{ td: HTMLElement, class: string }> = [];
    static interval: any;
    static hide = true;
    static oldTd: OldTd;

    static showGhost(chequer: Chequer | HoBSquare, color: tColors) {
        if (chequer.ghost === undefined || chequer.ghost.coords === undefined) {
            chequer.ghost?.coords === undefined ? console.log("showShost::chequer.ghost.coords === undefined", chequer.ghost?.coords === undefined) : '';
            return;
        }
        let td = gameTable.getTd(chequer.ghost.coords);
        if (td.dataset.count === undefined) {
            throw new Error("td.dataset.count === undefined");
        }
        ghost.oldTd = { className: td.className, innerHTML: td.innerHTML, count: td.dataset.count };
        gameBoardClass.showChequer(chequer.ghost.coords, 4, StartGame.colors[color])
    }

    static hideGhost(chequer: Chequer | HoBSquare): void {
        if (chequer.ghost === undefined || chequer.ghost.coords === undefined) {
            chequer.ghost?.coords === undefined ? console.log("hideGhost::chequer.ghost.coords === undefined", chequer.ghost?.coords === undefined) : '';
            return;
        }
        gameBoardClass.hideChequer(chequer.ghost.coords, false, ghost.oldTd);
        ghost.oldTd = { className: '', innerHTML: '', count: '' };
    }

    static removeGhosts(gameBoard: GameBoard, color: tColors): void {
        for (let square of gameBoard.map) {
            for (let chequer of square.chequers) {
                chequer.ghost = undefined;
            }
        }
        for (let chequer of gameBoard.bases[color as keyof HomesOrBases]) {
            chequer.ghost = undefined;
        }
        for (let chequer of gameBoard.homes[color as keyof HomesOrBases]) {
            chequer.ghost = undefined;
        }
    }

    static anyGhosts(gameBoard: GameBoard, color: tColors): boolean {
        for (let square of gameBoard.map) {
            for (let chequer of square.chequers) {
                if (chequer.ghost !== undefined)
                    return true;
            }
        }
        for (let chequer of gameBoard.bases[color as keyof HomesOrBases]) {
            if (chequer.ghost !== undefined)
                return true;
        }
        for (let chequer of gameBoard.homes[color as keyof HomesOrBases]) {
            if (chequer.ghost !== undefined)
                return true;
        }
        return false;
    }

    static allBlink(gameBoard: GameBoard, color: tColors) {
        for (let square of gameBoard.map) {
            if (square.chequers.some(el => el.ghost !== undefined) === true)
                ghost.blink(square);
        }
        for (let chequer of gameBoard.bases[color as keyof HomesOrBases]) {
            if (chequer.ghost !== undefined)
                ghost.blink(chequer);
        }
        for (let chequer of gameBoard.homes[color as keyof HomesOrBases]) {
            if (chequer.ghost !== undefined)
                ghost.blink(chequer);
        }
    }

    static blink(chequer: Square | HoBSquare) {
        if (ghost.interval === undefined)
            ghost.interval = setInterval(ghost.blinking, 700);
        let td = gameTable.getTd({ x: chequer.x, y: chequer.y });
        ghost.ghostsTds.push({ td, class: td.className });
    }

    static blinking() {
        for (let td of ghost.ghostsTds) {
            if (!td.td.className.includes("white"))
                td.td.className = ghost.hide === true ? 'chequer chequer-pink' : td.class;
        }
        ghost.hide = !ghost.hide;
    }
    
    static allStopBlink() {
        clearInterval(ghost.interval);
        ghost.interval = undefined;
        ghost.hide = true;
        for (let td of ghost.ghostsTds) {
            td.td.className = td.class;
        }
        ghost.ghostsTds = [];
    }
}