import StartGame from "./startGame.js";
import Helpers from "../../helpers/helpers.js";

class Login {
  static html = /* html */ `
	<div class="container text-center fs-1" style="margin-top: 45vh;">
  	<label for="username">Vad heter du?</label>
    <input type="text" name="username" value="maks" required>
		<button type="button" class="btn btn-light btn-lg" onclick="Login.login">Starta spelet</button>
  </div>
`;

  static async start() {
    let res = await (await fetch("/startPoint")).json();
    if (res.status === true) {
      new StartGame(JSON.parse(res.data[0].data));
    } else {
      document.body.innerHTML = Login.html;
      document.getElementsByTagName("button")[0].onclick = () => Login.login();

      // !!
      document.getElementsByTagName("button")[0].click();
    }
  }

  static async login(username = "") {
    if (username === "")
      username = document.getElementsByTagName("input")[0].value;
    
    let res = await Helpers.mFetch("/login", { name: username });
    new StartGame(await res.json());
  }
}
Login.start();