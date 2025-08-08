<?php
// Start session FIRST (before any includes)
session_start();

// Include security files
include 'includes/session_management.php';
include 'includes/csrf_protection.php';

// Generate CSRF token BEFORE any HTML output
generate_csrf_token(); // ← This ensures token exists

// Get error message from session
$error_message = $_SESSION['error_message'] ?? '';
unset($_SESSION['error_message']);
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="icon" href="assets/images/cybersleuth-icon.png" type="image/png">
    <title>CyberSleuth Academy Login</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
    <link href="node_modules/bootstrap/dist/css/bootstrap.min.css" rel="stylesheet" />
    <link rel="stylesheet" href="css/loginform.css">
</head>

<body>
    <!-- Login Form -->
    <main class="main-content">
        <div class="login-container">
            <div class="login-card">
                <h2>Login to CyberSleuth Academy</h2>
                
                <?php if (!empty($error_message)): ?>
                    <div class="error-message">
                        <?php echo htmlspecialchars($error_message, ENT_QUOTES, 'UTF-8'); ?>
                    </div>
                <?php endif; ?>
                
                <!-- Fixed form action path -->
                <form action="./login.php" method="POST" class="login-form">
                    <!-- CSRF Token -->
                    <input type="hidden" name="csrf_token" value="<?php echo htmlspecialchars($_SESSION['csrf_token']); ?>">
                    
                    <div class="form-group">
                        <label for="email">Email Address</label>
                        <input type="email" id="email" name="email" placeholder="Enter your email" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="password">Password</label>
                        <input type="password" id="password" name="password" placeholder="Enter your password" required>
                    </div>
                    
                    <button type="submit" class="login-btn">Login</button>
                </form>
                
                <div class="login-footer">
                    <p>Contact admin for account access</p>
                </div>
                <a href="forgot_password.php" class="forgot-password-btn">Forgot Password?</a>
            </div>
        </div>
    </main>

    <!-- Footer -->
    <footer class="footer">
        <div>
            <p>© 2025 CyberSleuth Academy. Developed by TP Cybersecurity & Digital Forensics Students.</p>
            <p class="mb-0">All content is for educational purposes only.</p>
        </div>
    </footer>
</body>
</html>