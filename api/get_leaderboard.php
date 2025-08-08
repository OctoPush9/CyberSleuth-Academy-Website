<?php
header('Content-Type: application/json');
include '../includes/db_connection.php';

// Get filter parameters
$input = json_decode(file_get_contents('php://input'), true);
$period = $input['period'] ?? 'all-time';
$country = $input['country'] ?? 'all';

// Build query based on filters
$sql = "SELECT id, username, points, rooms_completed, country FROM users WHERE 1=1";

// Add country filter
if ($country !== 'all') {
    $sql .= " AND country = '" . $conn->real_escape_string($country) . "'";
}

// Add order by points
$sql .= " ORDER BY points DESC LIMIT 10";

// Execute query
$result = $conn->query($sql);
$users = [];

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $users[] = [
            'id' => $row['id'],
            'username' => $row['username'],
            'points' => (int)$row['points'],
            'rooms_completed' => (int)$row['rooms_completed'],
            'country' => $row['country']
        ];
    }
}

echo json_encode($users);
$conn->close();
?>