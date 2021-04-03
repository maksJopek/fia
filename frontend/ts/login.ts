import startGame from "./startGame.js";

let html = /* html */ `
	<div class="container text-center fs-1" style="margin-top: 45vh;">
  	<label for="username">Vad heter du?</label>
		<input type="text" name="username" required>
		<button type="button" class="btn btn-light btn-lg" onclick="login">Starta spelet</button>
  </div>
`;

async function login() {
  let username = document.getElementsByTagName("input")[0].innerHTML,
    res = await fetch("/login", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ username: username })
    });
  res = await res.json();
  startGame(res);
}

document.body.innerHTML = html;
document.getElementsByTagName("button")[0].onclick = login;
