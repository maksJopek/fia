import { Colors, Color, tColors, Data, fiaTable, dbRes } from "./helpersBack";
import { Request, Response } from "express";

export default class Helpers {
  static async makeQuery(query: string, params: Array<any>): Promise<object> {
    let t = await (
      //@ts-ignore - this doesn't exist for backend, but its never used there
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
    ).json();
    // console.log(t);
    // return JSON.parse(t);
    return t;
  }

  static dbResToFiaTable(dbRes: dbRes): fiaTable {
    if (typeof dbRes.data === "string") {
      console.log("dbRes.data: ", dbRes.data); 
      console.log("dbRes.data as string: ", JSON.stringify(dbRes.data)); 
      dbRes.data = JSON.parse(dbRes.data);
    }
    else
      throw new Error("dbResToFiaTable : wrong $1 type; ");

    // @ts-ignore
    return dbRes;
  }

  static checkApiRes(res: any, nRes = {} as Response): boolean {
    if (res.success === false) {
      if (Object.keys(nRes).length === 0) {
        // @ts-ignore - here error is because backend tsc is checking this file, where lib: DOM is not present 
        // alert("API Error!");
        throw new Error("API Error!");
      } else {
        nRes.status(500);
        nRes.send("");
        return false;
      }
    }
    if (Object.keys(nRes).length !== 0)
      nRes.status(200);
    return true;
  }

  static async mFetch(url: string, body: object): Promise<any> {
    //@ts-ignore - this doesn't exist for backend, but its never used there
    let res: any = await (await fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    })).json();
    if (this.checkApiRes(res) == true)
      return res;
    else
      throw new Error("API Error!");;
  }

  static getRandomInt(min: number, max: number): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
  }

  static async sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  static Color: Colors = {
    blue: 0,
    red: 1,
    green: 2,
    yellow: 3,
    0: 0,
    1: 1,
    2: 2,
    3: 3
  };
}