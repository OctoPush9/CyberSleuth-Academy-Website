<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    session_start(); // Start session FIRST
    include 'includes/db_connection.php';
    include 'includes/csrf_protection.php';

    // CSRF Protection
    if (!isset($_POST['csrf_token']) || !validate_csrf_token($_POST['csrf_token'])) {
        regenerate_csrf_token();
        $_SESSION['error_message'] = "Invalid CSRF token.";
        header("Location: forgot_password.php");
        exit;
    }

    // Retrieve POST data and sanitize
    $user_id = filter_var($_POST['user_id'], FILTER_VALIDATE_INT);
    $new_password = trim($_POST['new_password']);
    $confirm_password = trim($_POST['confirm_password']);

    // Validate user ID
    if (!$user_id) {
        $_SESSION['error_message'] = "Invalid user ID.";
        header("Location: forgot_password.php");
        exit;
    }

    // Check if passwords match
    if ($new_password !== $confirm_password) {
        $_SESSION['error_message'] = "Passwords do not match.";
        header("Location: forgot_password.php");
        exit;
    }

    // Check password strength
    if (strlen($new_password) < 8 || !preg_match('/[A-Z]/', $new_password) || !preg_match('/[0-9]/', $new_password)) {
        $_SESSION['error_message'] = "Password must be at least 8 characters long, include at least one uppercase letter, and one number.";
        header("Location: forgot_password.php");
        exit;
    }

    // Hash the new password
    $hashed_password = password_hash($new_password, PASSWORD_DEFAULT);

    try {
        // Update the password in the `users` table
        $stmt = $conn->prepare("
            UPDATE users 
            SET hashed_password = ? 
            WHERE id = ?
        ");
        $stmt->bind_param('si', $hashed_password, $user_id);
        $stmt->execute();

        if ($stmt->affected_rows === 0) {
            throw new Exception("Failed to update password.");
        }

        // Invalidate the reset token
        $stmt = $conn->prepare("
            UPDATE users 
            SET reset_token = NULL, reset_token_expires = NULL 
            WHERE id = ?
        ");
        $stmt->bind_param('i', $user_id);
        $stmt->execute();

        $_SESSION['success_message'] = "Password reset successfully. You can now log in.";
        header("Location: loginform.php");
        exit;
    } catch (Exception $e) {
        $_SESSION['error_message'] = $e->getMessage();
        header("Location: forgot_password.php");
        exit;
    } finally {
        $stmt->close();
        $conn->close();
    }
}
?>