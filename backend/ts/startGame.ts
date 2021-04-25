import { } from "../../helpers/helpers";
import { makeQuery, nextTurnEndsAt, Color, GameBoard, Chequer, Coordinates, Data, getData, HomesOrBases, Square, tColors } from "../../helpers/helpersBack";

export default async function startGame(gid: number) {
    let dbRes: {gameBoard: GameBoard, data: Data} = 
        (await makeQuery("SELECT `gameBoard`, `data` FROM `fia` WHERE `id` = ?", [gid]))[0];

    for (let player of dbRes.data) {
        player.ready = true;
        for(let square of dbRes.gameBoard.bases[player.color as keyof HomesOrBases]) {
            square.chequer = player.color;
        }
    }

    await makeQuery("UPDATE `fia` SET `gameBoard` = ?, `started` = 1, `timeTillTurnEnd` = ? WHERE `id`= ?", 
                    [dbRes.gameBoard, nextTurnEndsAt(), gid]);
}