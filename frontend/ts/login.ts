import { json } from "express";
import startGame from "./startGame.js";
// import { Data, Color } from "../../helpers/helpers.js";

let html = /* html */ `
	<div class="container text-center fs-1" style="margin-top: 45vh;">
  	<label for="username">Vad heter du?</label>
    <input type="text" name="username" required>
		<button type="button" class="btn btn-light btn-lg" onclick="login">Starta spelet</button>
  </div>
`;

async function login(username = "") {
  if (username === "")
    username = document.getElementsByTagName("input")[0].value;
  let res = await fetch("/login", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ name: username })
  });
  startGame(await res.json());
}

(async () => {
  let res = await (await fetch("/startPoint")).json();
  if (res.status === true) {
    startGame(JSON.parse(res.data[0].data));
  } else {
    document.body.innerHTML = html;
    document.getElementsByTagName("button")[0].onclick = () => login();
  }
})()