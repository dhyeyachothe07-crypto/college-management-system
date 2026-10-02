<?php
header("Content-Type: application/json");

// DATABASE CONNECTION
$servername = "localhost";
$username = "root";       // default for XAMPP/WAMP
$password = "";           // default empty
$dbname = "college_db";  // <<< CHANGE THIS to your DB name

$conn = new mysqli($servername, $username, $password, $dbname);

// CHECK CONNECTION
if ($conn->connect_error) {
    echo json_encode(["error" => "Database connection failed"]);
    exit();
}

// FETCH USERS
$sql = "SELECT username, password, role, name FROM users";
$result = $conn->query($sql);

$users = [];

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $users[$row['username']] = [
            "password" => $row['password'],
            "role"     => $row['role'],
            "name"     => $row['name']
        ];
    }
}

// RETURN JSON
echo json_encode($users);

$conn->close();
?>
