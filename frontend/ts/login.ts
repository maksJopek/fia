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
    let res = await (await fetch("startPoint")).json();
    if (res.status === true) {
      new StartGame({ data: res.data.data, uid: res.uid });
    } else {
      document.body.innerHTML = Login.html;
      document.getElementsByTagName("button")[0].onclick = () => Login.login();
    }
  }

  static async login(username = "") {
    if (Login.clicked === true)
      return;

    if (username === "")
      username = document.getElementsByTagName("input")[0].value;

    if (username.length > 15) {
      alert("Ditt namn är för långt!");
      return;
    }

    Login.clicked = true;

    let res = await Helpers.mFetch("login", { name: username });
    new StartGame(res);
  }
}
Login.start();
