"use strict";
import { Request, Response } from 'express';
import fetch from "node-fetch";
export default async function apiLogin(req: Request, res: Response) {
	let response = await fetch("https://jopek.eu/maks/szkola/apkKli/fiaFiles/fia.php", {
		method: "POST",
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			apiKey: process.env.API_KEY,
			stmt: "SELECT `data` FROM `fia` WHERE `started`= ?",
			params: [false]
		}),
	});
	let resText = await response.text()
	res.send(resText);
}