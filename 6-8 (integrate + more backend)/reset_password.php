<?php
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    include 'includes/db_connection.php';
    include 'includes/csrf_protection.php';

    // Generate CSRF token for the form
    generate_csrf_token();

    $token = $_GET['token'] ?? '';

    // Validate token and check expiration
    $stmt = $conn->prepare("
        SELECT users.id, users.reset_token_expires 
        FROM users 
        WHERE users.reset_token = ?
    ");
    $stmt->bind_param('s', $token);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 1) {
        $row = $result->fetch_assoc();
        $reset_token_expires = strtotime($row['reset_token_expires']);
        $current_time = time();

        if ($current_time > $reset_token_expires) {
            die("Invalid or expired token.");
        } else {
            $user_id = $row['id'];
        }
    } else {
        die("Invalid or expired token.");
    }
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Password - CyberSleuth Academy</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
    <link href="node_modules/bootstrap/dist/css/bootstrap.min.css" rel="stylesheet" />
    <link rel="stylesheet" href="css/reset_password.css">
</head>
<body>
    <!-- Main Content -->
    <main class="main-content">
        <div class="reset-password-container">
            <h2>Reset Your Password</h2>
            <form action="process_reset_password.php" method="POST" class="reset-password-form" id="resetForm">
                <!-- CSRF Token -->
                <input type="hidden" name="csrf_token" value="<?php echo htmlspecialchars($_SESSION['csrf_token']); ?>">
                <input type="hidden" name="user_id" value="<?php echo htmlspecialchars($user_id); ?>">
                
                <!-- Password Fields with Enhanced Labels -->
                <div class="form-group">
                    <label for="new_password">New Password:</label>
                    <input type="password" id="new_password" name="new_password" placeholder="Enter new password" required minlength="8">
                    <!-- Password Strength Meter -->
                    <div class="password-strength-meter">
                        <div class="strength-header">
                            <span>Password Strength:</span>
                            <span id="strength-percent">0%</span>
                        </div>
                        <div class="strength-bar-container">
                            <div class="strength-bar strength-level-0" id="strengthBar"></div>
                        </div>
                        <div class="strength-label" id="strengthLabel">None</div>
                    </div>
                </div>

                <div class="form-group">
                    <label for="confirm_password">Confirm Password:</label>
                    <input type="password" id="confirm_password" name="confirm_password" placeholder="Confirm new password" required>
                    <div class="password-match" id="passwordMatch"></div>
                </div>
                
                <!-- Submit Button -->
                <button type="submit" class="reset-btn" id="submitBtn" disabled>Reset Password</button>
            </form>
            
            <div class="back-to-login">
                <a href="loginform.html">← Back to Login</a>
            </div>
        </div>
    </main>

    <footer class="footer mt-auto">
        <div>
            <p>© 2025 CyberSleuth Academy. Developed by TP Cybersecurity & Digital Forensics Students.</p>
            <p class="mb-0">All content is for educational purposes only.</p>
        </div>
    </footer>

    <script src="node_modules/bootstrap/dist/js/bootstrap.bundle.min.js"></script>
    <script src="js/reset_password.js"></script>
</body>
</html>