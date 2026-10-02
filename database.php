<?php
// api/get-users.php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

// Database configuration
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "college_db";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Database connection failed: ' . $conn->connect_error
    ]);
    exit();
}

// Fetch all users from database
$sql = "SELECT username, password, role, name FROM users";
$result = $conn->query($sql);

$users = [];
if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        // Convert to the same format as your mock data
        $users[$row['username']] = [
            'password' => $row['password'],
            'role' => $row['role'],
            'name' => $row['name']
        ];
    }
}

$conn->close();

echo json_encode([
    'success' => true,
    'users' => $users,
    'count' => count($users)
]);
?>