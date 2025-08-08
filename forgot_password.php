<?php
// Include the database connection and CSRF protection
include 'includes/db_connection.php';
include 'includes/csrf_protection.php';

// Ensure session is started
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Generate CSRF token
generate_csrf_token();

// Handle success messages
if (isset($_SESSION['success_message'])) {
    $success_message = $_SESSION['success_message'];
    unset($_SESSION['success_message']);
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Forgot Password - CyberSleuth Academy</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
    <link href="node_modules/bootstrap/dist/css/bootstrap.min.css" rel="stylesheet" />
    <link rel="stylesheet" href="css/forgot_password.css">
</head>

<body>
    <main class="main-content">
        <div class="forgot-password-container">
            <h2>Forgot Password</h2>
            <p class="forgot-password-welcome">Enter your registered email address to receive a password reset link.</p>

            <!-- Display success messages -->
            <?php if (isset($success_message)): ?>
                <div class="alert alert-success">
                    <?php echo htmlspecialchars($success_message, ENT_QUOTES, 'UTF-8'); ?>
                </div>
            <?php endif; ?>

            <!-- Display error messages -->
            <?php if (isset($_SESSION['error_message'])): ?>
                <div class="alert alert-danger">
                    <?php echo htmlspecialchars($_SESSION['error_message'], ENT_QUOTES, 'UTF-8'); unset($_SESSION['error_message']); ?>
                </div>
            <?php endif; ?>

            <form action="send_reset_link.php" method="POST" class="forgot-password-form">
                <input type="hidden" name="csrf_token" value="<?php echo htmlspecialchars($_SESSION['csrf_token']); ?>">
                <div class="form-group">
                    <label for="email">Email Address</label>
                    <input 
                        type="email" 
                        id="email" 
                        name="email" 
                        placeholder="Enter your registered email" 
                        aria-label="Email address" 
                        required
                        class="form-control">
                </div>
                <button type="submit" class="btn btn-primary">Send Reset Link</button>
            </form>
            
            <div class="back-to-login">
                <a href="loginform.php">← Back to Login</a>
            </div>
        </div>
    </main>
</body>

    <footer class="footer mt-auto">
        <div class="container">
            <p>© 2025 CyberSleuth Academy. Developed by TP Cybersecurity & Digital Forensics Students.</p>
            <p class="mb-0">All content is for educational purposes only.</p>
        </div>
    </footer>

    <script src="node_modules/bootstrap/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>