import fetch from "node-fetch";
import { Response } from "express";

export async function makeQuery(query: string, params: Array<any>): Promise<object> {
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

export function dbResToFiaTable(dbRes: dbRes): fiaTable {
  if (typeof dbRes.data === "string")
    dbRes.data = JSON.parse(dbRes.data);
  else
    throw new Error("dbResToFiaTable : wrong $1 type; ");

  // @ts-ignore
  return dbRes;
}

export function checkApiRes(res: any, nRes = {} as Response): void {
  if (res.api === false) {
    if (Object.keys(nRes).length === 0) {
      alert("API Error!");
      throw new Error("API Error!");
    } else {
      nRes.status(500);
      res.send("");
    }
  }
  if (Object.keys(nRes).length !== 0)
    nRes.status(200);
  return res;
}

export async function mFetch(url: string, body: object) /* : Promise<Response> */ {
  return fetch(url, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  }).then(checkApiRes);
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
export type Data = Array<{ id: any; color: tColors; name: string }>;
export interface fiaTable {
  id: number;
  data: Data;
  started: boolean;
}
export interface dbRes {
  id: number;
  data: string | Data;
  started: boolean;
}
