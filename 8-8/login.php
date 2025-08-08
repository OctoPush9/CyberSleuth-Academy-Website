<?php
// Start session FIRST (before any includes)
session_start();

// Include security files
include 'includes/session_management.php';
include 'includes/csrf_protection.php';
include 'includes/db_connection.php';

// Force logout when visiting login.php directly
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    session_unset();
    session_destroy();
    header("Location: ./loginform.php");
    exit;
}

$error_message = "";

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Validate CSRF token FIRST
    if (!isset($_POST['csrf_token']) || !validate_csrf_token($_POST['csrf_token'])) {
        regenerate_csrf_token();
        $_SESSION['error_message'] = "Invalid CSRF token. Please try again.";
        header("Location: ./loginform.php");
        exit;
    }

    // Retrieve and sanitize inputs
    $email = filter_var(trim($_POST['email']), FILTER_SANITIZE_EMAIL);
    $password = trim($_POST['password']);

    // Check for empty fields
    if (empty($email) || empty($password)) {
        $error_message = "Email or password cannot be empty.";
    } else {
        // Connect to MySQL database
        $conn = new mysqli('localhost', 'root', '', 'cybersleuth_academy');
        
        // Check connection
        if ($conn->connect_error) {
            die("Database connection failed: " . $conn->connect_error);
        }

        // Prepare statement to prevent SQL injection
        $stmt = $conn->prepare("SELECT id, username, email, hashed_password FROM users WHERE email = ?");
        if (!$stmt) {
            die("Prepare failed: " . $conn->error);
        }
        
        $stmt->bind_param("s", $email);
        $stmt->execute();

        // Fetch user data
        $result = $stmt->get_result();
        $user = $result->fetch_assoc();

        // Check if user exists
        if (!$user) {
            $error_message = "Invalid credentials. Please try again.";
        } else {
            // Verify password using PHP's password_verify function
            if (!password_verify($password, $user['hashed_password'])) {
                $error_message = "Invalid credentials. Please try again.";
            } else {
                // Regenerate session ID for security
                session_regenerate_id(true);

                // Store user data in session
                $_SESSION['user_id'] = $user['id'];
                $_SESSION['username'] = $user['username'];
                $_SESSION['email'] = $user['email'];

                // Close database connection
                $stmt->close();
                $conn->close();

                // Redirect to dashboard
                header("Location: ./home.html");
                exit;
            }
        }
        $stmt->close();
        $conn->close();
    }

    // Store error message in session and redirect to login form
    if (!empty($error_message)) {
        $_SESSION['error_message'] = $error_message;
        header("Location: ./loginform.php");
        exit;
    }
}
?>