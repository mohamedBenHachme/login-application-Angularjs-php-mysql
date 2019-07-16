<?php
session_start();

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

if(!isset($_POST)) die();

$response = [];
$con = mysqli_connect('localhost', 'root', '', 'mydatabase');
$username = mysqli_real_escape_string($con, $_POST['username']);
$password = mysqli_real_escape_string($con, $_POST['password']);
$query = "SELECT * FROM `users` WHERE username='$username' AND password='$password'";
$result = mysqli_query($con, $query);
if(mysqli_num_rows($result) > 0) {

	$response['status'] = 'loggedin';
	$response['user'] = $username;
	$response['SID'] = session_id();
	$response['id'] = md5(uniqid());
	$_SESSION['id'] = $response['id'];
	$_SESSION['user'] = $username;
	
} else {
	$response['status'] = 'error';
}
session_write_close();
echo json_encode($response);
