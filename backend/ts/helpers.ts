import fetch from "node-fetch";

export async function makeQuery (query: string, params: Array<string>): Promise<string> {
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