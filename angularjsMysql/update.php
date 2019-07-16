<?php
	header('Access-Control-Allow-Origin: *');
	header('Content-Type: application/json');
	if(!isset($_POST) ) die();
	session_id($_POST['SID']);
	session_start();

	if($_SESSION['id'] != $_POST['id']) die(); // if someone try to the cross site attack will be stoped
	$response = [];
	$con = mysqli_connect('localhost', 'root', '', 'mydatabase');
	$newPass = mysqli_real_escape_string($con, $_POST['newPass']);
	$query = "UPDATE `users` SET `password` = '$newPass' WHERE `username` = '".$_SESSION['user']."'";
	$result = mysqli_query($con, $query);
	if($result) {
		$response['status'] = 'done';
	} else {
		$response['status'] = 'error';
	}
	session_write_close();
	echo json_encode($response);