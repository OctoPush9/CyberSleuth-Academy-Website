<?php
header('Content-Type: application/json');
include '../includes/db_connection.php';
include '../includes/csrf_protection.php';

// Validate CSRF token
if (!isset($_POST['csrf_token']) || !validate_csrf_token($_POST['csrf_token'])) {
    http_response_code(403);
    echo json_encode(['success' => false, 'error' => 'Invalid CSRF token']);
    exit;
}

// Get user data
$user_id = $_POST['user_id'] ?? null;
$points = $_POST['points'] ?? 0;
$rooms_completed = $_POST['rooms_completed'] ?? 0;

if (!$user_id) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'User ID is required']);
    exit;
}

try {
    // Update user points and rooms completed
    $stmt = $conn->prepare("
        UPDATE users 
        SET points = points + ?, rooms_completed = rooms_completed + ? 
        WHERE id = ?
    ");
    $stmt->bind_param("iii", $points, $rooms_completed, $user_id);
    
    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'User points updated successfully']);
    } else {
        throw new Exception("Failed to update user points");
    }
    
    $stmt->close();
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}

$conn->close();
?>