import { } from "../../helpers/helpers";
import { makeQuery, Color, GameBoard, Chequer, Coordinates, Data } from "../../helpers/helpersBack";
import { Request, Response } from "express";

export default async function startGame(req: Request, res: Response) {
    if (req.session === undefined) {
        res.status(500);
        res.send("");
        return;
    }

    makeQuery("UPDATE `fia` SET `started` = 1 WHERE `id`= ?", [req.session.gid]);
    let dbRes: {gameBoard: GameBoard, data: Data}
        = (await makeQuery("SELECT `gameBoard`, `playersCount` FROM `fia` WHERE `id` = ?", [req.session.gid]))[0];

    for (let player of dbRes.data) {
        let chequer: Chequer = { color: player.color, x: 1, y: 1 },
            start: Coordinates;

        switch (player.color) {
            case Color.red: start = { x: 1, y: 1 }; break;
            case Color.blue: start = { x: 8, y: 1 }; break;
            case Color.yellow: start = { x: 1, y: 8 }; break;
            default /* Color.green */: start = { x: 8, y: 8 }; break;
            // case Color.green: start = { x: 8, y: 8 }; break;
        }

        for (let i = 0; i < 2; i++) {
            for (let j = 0; j < 2; j++) {
                //@ts-ignore - 8 + 1 <= 11 which is max of Coordinates
                [chequer.x, chequer.y] = [start.x + i, start.y + j];
            }
        }

        dbRes.gameBoard.push(chequer);
    }

    await makeQuery("UPDATE `fia` SET `gameBoard` = ? WHERE `id`= ?", [dbRes.gameBoard, req.session.gid]);

    res.send("");
}