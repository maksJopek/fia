import { Data } from "../../helpers/helpersBack";
import Helpers from "../../helpers/helpers.js";
import { Chequer, GameBoard } from "../../helpers/helpersBack.js";

export default class StartGame {
  colors = ["primary", "danger", "success", "warning"];
  radius = 20;

  ctx!: CanvasRenderingContext2D;
  canvas!: HTMLCanvasElement;
  interval!: any;
  img!: HTMLImageElement;
  
  chequers: Array<Chequer> = [];
  gameBoard: GameBoard = [];
  gmString = "[\n";

  constructor(data: Data) {
    this.init(data);
  }

  async init(data: Data) {
    document.body.innerHTML = await (await fetch("/map.html")).text();
    document.getElementsByTagName("input")[0].onclick = this.readyStateToggle;
    [this.canvas, this.ctx] = this.getCanvasAndCtx();

    this.setOpponents(data);

    this.canvas.onclick = e => this.canvasClickHandler(e);

    this.img = await this.loadImage("https://jopek.eu/maks/szkola/apkKli/fiaFiles/fia.png");
    
    await this.getData();
    this.ctx.drawImage(this.img, 0, 0, this.img.width, this.img.height, 0, 0, this.canvas.width, this.canvas.height);
    this.drawChequer({ x: 4, y: 1, color: 1 });

    // this.interval = setInterval(this.getData, 2000);
  }

  getCanvasAndCtx(): [HTMLCanvasElement, CanvasRenderingContext2D] {
    let canvas = document.getElementsByTagName("canvas")[0],
      ctx = canvas.getContext("2d");
    if (ctx === null) {
      document.write("stop using IE ...");
      throw new Error("Player is using browser older than ...");
    } else return [canvas, ctx];
  }

  async setOpponents(data: Data): Promise<void> {
    let tds = (document.getElementsByClassName("player-name") as HTMLCollectionOf<HTMLElement>),
      i = 0;
    
    for (let player of data) {
      if (player.ready === true)
        tds[i].classList.add("bg-" + this.colors[player.color]);
      else
        tds[i].classList.add("bg-secondary");

      tds[i].innerText = player.name;
      console.log("player, i", player, i);
      i++;
    }
    for (; i < 4; i++) {
      console.log("i", i);
      tds[i].classList.add("bg-secondary");
      tds[i].innerText = "?";
    }
  }

  isIntersect(point: { x: number, y: number }, circle: Chequer) {
    return Math.sqrt((point.x - circle.x) ** 2 + (point.y - circle.y) ** 2) < this.radius;
  }

  canvasClickHandler(e: MouseEvent) {
    const mousePos = {
      x: e.clientX - this.canvas.offsetLeft,
      y: e.clientY - this.canvas.offsetTop
    };

    if (Math.round((mousePos.x - 30) / 60) == 0 && Math.round((mousePos.y - 28) / 60) == 0) {
      console.log(this.gmString + "]");
      this.gmString = "[\n"
    }
    else
      this.gmString += JSON.stringify({ x: Math.round((mousePos.x - 30) / 60), y: Math.round((mousePos.y - 28) / 60) }) + ",\n";

    this.chequers.forEach(chequer => {
      if (this.isIntersect(mousePos, chequer)) {
        alert('click on circle: ' + chequer);
      }
    });
  }

  readyStateToggle(e: MouseEvent): void {
    Helpers.mFetch("/readyStateToggle", { 
      state: (e.target as HTMLInputElement).checked 
    });
  }

  async loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise(resolve => {
      let img = new Image()
      img.src = src
      img.onload = () => resolve(img)
    })
  }

  drawChequer(chequer: Chequer): void {
    let x = chequer.x * 60 + 30,
      y = chequer.y * 60 + 28;

    this.ctx.beginPath();
    this.ctx.arc(x, y, this.radius, 0, 2 * Math.PI);
    this.ctx.fillStyle = this.colors[chequer.color];
    this.ctx.fill();
    this.ctx.lineWidth = 5;
    this.ctx.strokeStyle = 'grey';
    this.ctx.closePath();
    this.ctx.stroke();

    this.chequers.push(chequer);
  }

  async getData() {
    let data = await Helpers.mFetch("/getCurrentGameState", {});
    // this.setOpponents(JSON.parse(data.data));
    // TODO: assign data to this.gameBoard and draw it
    // TODO: add D6 dice
    // TODO: if currentPLayer === true, call to logic or calc logic here
  }
}