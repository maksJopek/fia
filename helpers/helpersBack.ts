import fetch from "node-fetch";
import { Response } from "express";
import Helpers from "./helpers";

export { Helpers };
export async function makeQuery(query: string, params: Array<any>): Promise<any> {
  let t = await (
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
  // console.log(t);
  return JSON.parse(t);
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
  color: tColors;
  name: string;
}
export interface Chequer extends Coordinates { 
  color: tColors;
};

export interface Coordinates {
  x: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;
  y: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;
}
export type GameBoard = Array<Chequer>;
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
