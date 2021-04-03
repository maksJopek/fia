import { Request, Response } from "express";
import { makeQuery } from "../helpers";

interface Colors {
  blue: number;
  red: number;
  green: number;
  yellow: number;
  0: number;
  1: number;
  2: number;
  3: number;
}

interface fiaTable {
  id: number;
  data: Array<object>;
  started: boolean;
}

const Color: Colors = {
  blue: 0,
  red: 1,
  green: 2,
  yellow: 3,
  0: 0, 1: 1, 2: 2, 3: 3
}

export default async function apiLogin(req: Request, res: Response) {
  if (req.session === undefined) {
    res.send(/* html */`<script>alert("Something went wrong, try to reload the page")</script>`);
    return;
  }
  req.session.uid = req.session.id;
  let c = await makeQuery("SELECT * FROM `fia` WHERE `started`= false LIMIT 1", []),
    row: fiaTable;
  if (c === "") {
    let data = { id: req.session.uid, color: Color.blue };
    makeQuery("INSERT INTO `fia`(`data`, `started`) VALUES (?, ?)", [JSON.stringify(data), "0"]);
  }
  else {
    row = JSON.parse(c);
    row.data.push({ id: req.session.uid, color: Color[row.data.length as keyof Colors] });
    makeQuery("UPDATE `fia` SET `data`=? WHERE `id`=?", [JSON.stringify(row.data), row.id.toString()]);
    if(row.data.length === 4)
      makeQuery("UPDATE `fia` SET `started` = 1 WHERE `id`=?", [row.id.toString()]);
  }
  res.send("[1, 2, 3]");
}
