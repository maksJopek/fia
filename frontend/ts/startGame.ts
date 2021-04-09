import { Data, checkApiRes, mFetch } from "../../helpers/helpers";

function getCanvasAndCtx(): [HTMLCanvasElement, CanvasRenderingContext2D] {
  let canvas = document.getElementsByTagName("canvas")[0],
    ctx = canvas.getContext("2d");
  if (ctx === null) {
    document.write("ur muther is fat, stop using IE");
    throw new Error("Player is using browser older that his mom");
  } else return [canvas, ctx];
}

function setOpponents(data: Data) {
  // Start game
  console.log("startGame.ts: data: ", data)
  let tds = document.getElementsByClassName("player-name"),
    colors = ["primary", "danger", "success", "warning"],
    replacement = { name: "", color: "" };
  for (let i = 0; i < 4; i++) {
    if (data[i] !== undefined) {
      replacement.name = data[i].name;
      replacement.color = colors[i];
    } else {
      replacement.name = "?";
      replacement.color = "secondary";
    }
    tds[i].innerHTML = replacement.name;
    tds[i].classList.add("bg-" + replacement.color);
  }
}

function readyStateToggle(e: MouseEvent) {
  mFetch("/readyStateToggle", { state: (e.target as any).checked });
}

export default async function (data: Data) {
  console.log(data);
  let body = await (await fetch("/map.html")).text();
  document.body.innerHTML = body;

  setOpponents(data);
  document.getElementsByTagName("input")[0].onclick = readyStateToggle;
  
  let [canvas, ctx] = getCanvasAndCtx();
  let img = new Image(600, 600);
  img.width = 600;
  img.height = 600;
  img.src = "https://www.egierki.pl/app/uploads/2020/05/Ludo-Play.jpg";
  img.onload = () => ctx.drawImage(img, 0, 0);
}
