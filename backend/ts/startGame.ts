import { makeQuery, nextTurnEndsAt, GameBoard, Data, HomesOrBases } from "../../helpers/helpersBack";

export default async function startGame(gid: number) {
  let dbRes: { gameBoard: GameBoard, data: Data } =
    (await makeQuery("SELECT `gameBoard`, `data` FROM `fia` WHERE `id` = ?", [gid]))[0];

  console.log(dbRes.gameBoard)
  for (let player of dbRes.data) {
    player.ready = true;
    for (let square of dbRes.gameBoard.bases[player.color as keyof HomesOrBases]) {
      square.chequer = player.color;
    }
  }
  console.log(dbRes.gameBoard)

  await makeQuery("UPDATE `fia` SET `gameBoard` = ?, `started` = 1, `timeTillTurnEnd` = ?, `data` = ? WHERE `id`= ?",
    [dbRes.gameBoard, nextTurnEndsAt(), dbRes.data, gid]);
}
