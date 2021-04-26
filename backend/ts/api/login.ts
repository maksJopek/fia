import { Request, Response } from "express";
import { fiaTable, dbRes, Color, Colors, Helpers, makeQuery, Chequer, tColors, waitForQueue } from "../../../helpers/helpersBack";
import startGame from "../startGame";
import { global } from "../index";

export default async function apiLogin(req: Request, res: Response) {
  if (req.session === undefined) {
    res.status(500);
    res.send("");
    return;
  }
  req.session.uid = req.session.id;
  req.session.name = req.body.name;

  if (global.stop === true) {
    await waitForQueue();
  }
  global.stop = true;

  let dbRes = (await makeQuery("SELECT * FROM `fia` WHERE `started`= 0 LIMIT 1", [])) as Array<fiaTable>,
    row: fiaTable;
  if (dbRes[0] === undefined) {
    let color = Helpers.getRandomInt(0, 4);
    row = {} as fiaTable;

    row.data = [{
      id: req.session.uid,
      index: 0,
      ready: false,
      color: Color.red,
      name: req.body.name,
    }];
    req.session.color = color;

    await makeQuery('INSERT INTO `fia`(`data`) VALUES (?)', [row.data]);
    req.session.gid = (await makeQuery('SELECT `id` FROM `fia` WHERE `data`= ?', [row.data]) as any)[0].id;
  } else {
    // row = Helpers.dbResToFiaTable(dbRes[0]);
    row = dbRes[0];
    let playersColors: Array<tColors> = [],
      colors = [...Array(4).keys()];

    if (row.data.filter(el => el.id !== req.session?.uid).length === 0) {
      res.send(JSON.stringify({ data: row.data, uid: req.session.uid }));
      return;
    }

    for (let playerData of row.data)
      playersColors.push(playerData.color);

    colors = colors.filter(el => !playersColors.includes(el));
    let color = colors[Helpers.getRandomInt(0, colors.length)],
      index = row.data.length;

    row.data.push({
      id: req.session.uid,
      index: index,
      ready: false,
      color: color,
      name: req.body.name,
    });

    req.session.gid = row.id;
    req.session.index = index;

    await makeQuery('UPDATE `fia` SET `data`= ? WHERE `id`= ?', [row.data, row.id]);

    if (row.data.length >= 4)
      startGame(req.session.gid);

  }

  await makeQuery("UPDATE `fia` SET `playersCount`=`playersCount`+1 WHERE `id`= ?", [req.session.gid]);
  global.stop = false;
  res.send(JSON.stringify({ data: row.data, uid: req.session.uid }));
}
