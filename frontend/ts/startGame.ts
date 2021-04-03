function getCanvasAndCtx(): [HTMLCanvasElement, CanvasRenderingContext2D] {
  let canvas = document.getElementsByTagName("canvas")[0],
    ctx = canvas.getContext("2d");
  if (ctx === null) {
    document.write("ur muther is fat, stop using IE");
    throw new Error("PLayer is using browser older that his mom");
  } else return [canvas, ctx];
}
function setOpponents(data: object, body: string) {
  let a = [
    {
      id: 1,
      color: "red",
    }
  ]
  document.body.innerHTML = body;
}
export default async function startGame (data: object) {
  let body = await (await fetch("/map.html")).text();
  setOpponents(data, body);
  let [canvas, ctx] = getCanvasAndCtx();
  let img = new Image(600, 600);
  img.width = 600;
  img.height = 600;
  img.src = "https://www.egierki.pl/app/uploads/2020/05/Ludo-Play.jpg";
  img.onload = () => ctx.drawImage(img, 0, 0);
}
