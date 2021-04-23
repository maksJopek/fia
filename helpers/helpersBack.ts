import fetch from "node-fetch";
import { Response } from "express";
import Helpers from "./helpers";
import { global } from "../backend/ts/index";

export { Helpers };
export const API_RES = {
  success: '{"success": true}',
  failure: '{"success": false}',
};
export async function makeQuery(query: string, params: Array<any>): Promise<Array<any>> {
  // console.log("params are ", JSON.stringify({
  //   apiKey: process.env.API_KEY,
  //   query: query,
  //   params: params
  // }));
  let t: any = await (
    await fetch("https://jopek.eu/maks/szkola/apkKli/fiaFiles/fia.php", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        apiKey: process.env.API_KEY,
        query: query,
        params: params
      })
    })
  ).text();
  try {
    t = JSON.parse(t)[0];
  } catch (e) {
    console.log(`dbResposnse to  "${query}"`, ` is '${t}' (typeof res ${typeof t})`);
    console.log(`dbResposnse as object as string: '${JSON.stringify(t)}'`);
  }
  for (const p in t) {
    if (["data", "gameBoard"].includes(p))
      t[p] = JSON.parse(t[p]);
  }
  return [t];
}

export async function getData(gid: number): Promise<Data> {
  let data = (await makeQuery("SELECT `data` FROM `fia` WHERE `id` = ?", [gid]))[0].data;
  if (typeof data === "string") {
    data = JSON.parse(data) as Data;
    return data;
  } else {
    console.log(data);
    throw new Error("Data is not a object");
  }
}

export async function mFetch(url: string, body: object, res: Response): Promise<Response> {
  return fetch(url, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  }).then(fRes => Helpers.checkApiRes(fRes, res)) as Promise<Response>;
}

export function nextTurnEndsAt(): number {
  return Date.now() + (60 * 1000);
}

export async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
export async function waitForQueue(): Promise<void> {
  while(global.stop === true) {
    await sleep(200);
  }
}

export interface Colors {
  blue: number;
  red: number;
  green: number;
  yellow: number;
  0: number;
  1: number;
  2: number;
  3: number;
}

export const Color: Colors = {
  blue: 0,
  red: 1,
  green: 2,
  yellow: 3,
  0: 0,
  1: 1,
  2: 2,
  3: 3
};

export type tColors = typeof Color[keyof typeof Color];
export type Data = Array<DataObject>;
export interface DataObject {
  id: any;
  index: number;
  ready: boolean;
  color: tColors;
  name: string;
}
export interface GhostWhere {
  from: "base" | "map" | "home";
  oldIndex: number;
  to: "base" | "map" | "home";
  newIndex: number;
}
export interface Ghost {
  where: GhostWhere;
  color: tColors;
  coords?: Coordinates;
}
export interface Chequer {
  color: tColors;
  ghost?: Ghost; // number; // 1 | 2 | 3 | 4 | 5 | 6;
};
export interface Coordinates {
  x: number; //0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;
  y: number; //0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;
}
export interface Square extends Coordinates {
  chequers: Array<Chequer>;
  start: -1 | tColors;
}
export interface HoBSquare extends Coordinates {
  chequer: tColors;
  ghost?: Ghost; // number; // 1 | 2 | 3 | 4 | 5 | 6;
}
export interface HomesOrBases {
  0: Array<HoBSquare>;
  1: Array<HoBSquare>;
  2: Array<HoBSquare>;
  3: Array<HoBSquare>;
}

export interface GameBoard {
  map: Array<Square>;
  homes: HomesOrBases;
  bases: HomesOrBases;
};
export interface fiaTable {
  id: number;
  data: Data;
  gameBoard: GameBoard;
  playersAreReady: 1 | 2 | 3 | 4;
  playersCount: 1 | 2 | 3 | 4;
  currentPlayer: 1 | 2 | 3 | 4;
  started: boolean;
}
export interface dbRes extends Omit<fiaTable, 'data'> {
  data: string | Data;
}
