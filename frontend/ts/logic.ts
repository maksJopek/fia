import { Coordinates, GameBoard, HomesOrBases, Square, tColors } from "../../helpers/helpersBack";
import Helpers from "../../helpers/helpers.js"
export default class Logic {
  static moveFromBase(gameBoard: GameBoard, color: tColors,) {
    let start: Square, i: number;

    gameBoard.map.forEach((square, j) => {
      if (square.start === color) {
        start = square;
        i = j;
      }
    })

    gameBoard.bases[color as keyof HomesOrBases].forEach((chequer, j) => {
      if (chequer.chequer > -1) {
        chequer.ghost = {
          where: {
            from: "base", oldIndex: j,
            to: "map", newIndex: i
          },
          color: color,
          coords: { x: start.x, y: start.y }
        };
      }
    })

    return gameBoard;
  }
  static moveInMap(gameBoard: GameBoard, color: tColors, number: number) {
    gameBoard.map.forEach((square, i) => {
      if (square.chequers.length > 0 && square.chequers[0].color === color) {
        for (let chequer of square.chequers) {
          let x: number | undefined, y: number | undefined, coords: Coordinates | undefined, inMap: boolean,
            homeIndex: number | undefined, befStart: number | undefined, normalTurn = true;

          if (color !== Helpers.Color.red) {
            gameBoard.map.forEach((square, i) => {
              if (square.start === color)
                befStart = i - 1;
            });
          } else {
            befStart = gameBoard.map.length - 1;
          }
          if (befStart === undefined)
            throw new Error("before start doesnt exist");

          let range = (start: number, end: number) => Array.from(Array(end + 1).keys()).slice(start);
          // if(i >= befStart && i + number <= befStart) {  
          inMap = true;
          if (range(i, i + number).includes(befStart)) {
            homeIndex = number - befStart + i - 1;
            inMap = false;

            if (homeIndex !== -1) {
              normalTurn = false;

              if (homeIndex < gameBoard.homes[0].length) {
                x = gameBoard.homes[color as keyof HomesOrBases][homeIndex].x;
                y = gameBoard.homes[color as keyof HomesOrBases][homeIndex].y;
                let homeSquare = gameBoard.homes[color as keyof HomesOrBases][homeIndex];
                if (homeSquare.chequer >= 0) { x = y = homeIndex = undefined; }
              }
              else {
                x = y = undefined;
              }
            }
          }
          if (normalTurn === true) {
            if (homeIndex === -1) {
              x = gameBoard.map[befStart].x;
              y = gameBoard.map[befStart].y;
              inMap = true;
              homeIndex = undefined;
            }
            else {
              if (i + number >= gameBoard.map.length)
                number += i - gameBoard.map.length - i; //* -$i 'cause adding $i on 62 && 63 

              x = gameBoard.map[i + number].x;
              y = gameBoard.map[i + number].y;
              inMap = true;
            }
          }

          if (x === undefined || y === undefined)
            coords = undefined;
          else
            coords = { x, y };

          let newIndex: number;
          if (homeIndex !== undefined)
            newIndex = homeIndex;
          else
            newIndex = i + number;

          if (coords !== undefined) {
            chequer.ghost = {
              where: {
                from: "map", oldIndex: i,
                to: (inMap === true ? "map" : "home"),
                newIndex: newIndex
              },
              color: color,
              coords,
            } 
          } else {
            chequer.ghost = undefined;
          }
        }
      }
    })
    return gameBoard;
  }
  static moveInHome(gameBoard: GameBoard, color: tColors, number: number) {
    let home = gameBoard.homes[color as keyof HomesOrBases];

    home.forEach((chequer, i) => {
      if (chequer.chequer > -1) {
        let x: number | undefined, y: number | undefined, coords: Coordinates | undefined;
        if (home[i + number] !== undefined && home[i + number].chequer < 0) {
          x = home[i + number].x;
          y = home[i + number].y;
        } else {
          x = y = undefined;
        }

        if (x === undefined || y === undefined)
          coords = undefined;
        else
          coords = { x, y };

        if (coords !== undefined) {
          chequer.ghost = {
            where: {
              from: "home", oldIndex: i,
              to: "home", newIndex: i + number
            },
            color: color,
            coords,
          };
        } else {
          chequer.ghost = undefined;
        }
      }
    });

    return gameBoard;
  }
}