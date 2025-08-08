<?php
// db_connection.php
$host = 'localhost';
$dbname = 'cybersleuth_academy';
$username = 'root';
$password = '';

$conn = mysqli_connect($host, $username, $password, $dbname);

if (!$conn) {
    die("Database connection failed: " . mysqli_connect_error());
}
?>