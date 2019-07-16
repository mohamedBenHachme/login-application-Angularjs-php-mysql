<?php 
session_start();

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

if(!isset($_POST)) die();
$response = [];
if($_POST['password'] != $_POST['confirmPass']){ 
	$response['status'] = 'password dont match';
	die();
};
$con = mysqli_connect('localhost', 'root', '', 'mydatabase');
$username = mysqli_real_escape_string($con, $_POST['username']);
$password = mysqli_real_escape_string($con, $_POST['password']);
$query = "INSERT INTO `users`  (username,password) VALUES ('$username','$password')";
$result = mysqli_query($con, $query);
if( $result == true){
	$response['status'] = 'done';
	}
else
	$response['status'] = 'User already exist!';

echo json_encode($response);

 ?>
