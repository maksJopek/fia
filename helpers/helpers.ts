import fetch from "node-fetch";

export async function makeQuery(
  query: string,
  params: Array<string>
): Promise<string> {
  console.log("makeQuery");
  return await (
    await fetch("https://jopek.eu/maks/szkola/apkKli/fiaFiles/fia.php", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        apiKey: process.env.API_KEY,
        stmt: query,
        params: params
      })
    })
  ).text();
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
