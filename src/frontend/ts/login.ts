let html = /* html */`
	<div class="container text-center fs-1" style="margin-top: 45vh;">
		<label for="username">Vad heter du?</label>
		<input type="text" name="username" required>
		<button type="button" class="btn btn-light btn-lg" onclick="login">Starta spelet</button>
	</div>
`;
document.body.innerHTML = html;

function login() {
	
}