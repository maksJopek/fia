<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

$req = json_decode(file_get_contents("php://input"));
require_once "dbCredentials.php";

if ($req->apiKey === $apiKey) {
	$http = isset($_SERVER["HTTPS"]) ? "https" : "http";
	header("Access-Control-Allow-Origin: $http://localhost:8000");
	$pdo = new PDO("mysql:dbname=ClientApps;host=localhost;charset=utf8mb4", $dbUser, $dbPassword);
	$pdo->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
	$stmt = $pdo->prepare($req->query);
	try {
		$params = [];
		foreach ($req->params as $v) {
			if(is_string($v))
				array_push($params, $v);
			else
				array_push($params, json_encode($v));
		}
		$stmt->execute($params);
	} catch (PDOException $e) {
		echo "ERROR!!!";
		var_dump($req);
		var_dump($stmt);
		throw $e;
	}
	echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
	http_response_code(200);
} else {
	echo "Wrong username or password!";
	http_response_code(401);
}
