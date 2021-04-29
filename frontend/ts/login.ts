import StartGame from "./startGame.js";
import Helpers from "../../helpers/helpers.js";

class Login {
  static html = /* html */ `
	<div class="container text-center fs-1" style="margin-top: 45vh;">
  <label for="username">Vad heter du?</label>
  <input type="text" name="username" required>
  <button type="button" class="btn btn-light btn-lg" onclick="Login.login">Starta spelet</button>
  </div>
`;
  static clicked = false;

  static async start() {
    let res = await (await fetch("/startPoint")).json();
    if (res.status === true) {
      new StartGame({ data: res.data.data, uid: res.uid });
    } else {
      document.body.innerHTML = Login.html;
      document.getElementsByTagName("button")[0].onclick = () => Login.login();

      // !!
      // document.getElementsByTagName("input")[0].value = "maks " + Helpers.getRandomInt(1, 100);
      // document.title = document.getElementsByTagName("input")[0].value;
      // document.getElementsByTagName("button")[0].click();
    }
  }

  static async login(username = "") {
    if(Login.clicked === true) 
      return;
    
    Login.clicked = true;
    if (username === "")
      username = document.getElementsByTagName("input")[0].value;

    let res = await Helpers.mFetch("/login", { name: username });
    new StartGame(res);
  }
}
Login.start();