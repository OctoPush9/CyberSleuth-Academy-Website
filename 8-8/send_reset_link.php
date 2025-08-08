<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'vendor/autoload.php';
include 'includes/db_connection.php';
include 'includes/csrf_protection.php';

// Start session if not already started
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Ensure request is POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header("Location: forgot_password.php");
    exit;
}

// Validate CSRF token
if (!isset($_POST['csrf_token']) || !validate_csrf_token($_POST['csrf_token'])) {
    regenerate_csrf_token();
    $_SESSION['error_message'] = "Invalid CSRF token. Please try again.";
    header("Location: forgot_password.php");
    exit;
}

// Sanitize and validate email input
$email = filter_var(trim($_POST['email']), FILTER_VALIDATE_EMAIL);
if (!$email) {
    $_SESSION['error_message'] = "Invalid email address.";
    header("Location: forgot_password.php");
    exit;
}

// Function to handle reset token generation and email sending
function handlePasswordReset($email, $conn) {
    // Generate reset token and expiration time
    $reset_token = bin2hex(random_bytes(32));
    $reset_token_expires = date('Y-m-d H:i:s', strtotime('+1 hour'));

    // Check if user exists
    $stmt = $conn->prepare("SELECT id FROM users WHERE email = ?");
    $stmt->bind_param('s', $email);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 1) {
        $user = $result->fetch_assoc();
        $user_id = $user['id'];

        // Update users table with the reset token and expiration
        $update_stmt = $conn->prepare("UPDATE users SET reset_token = ?, reset_token_expires = ? WHERE id = ?");
        $update_stmt->bind_param('ssi', $reset_token, $reset_token_expires, $user_id);

        if ($update_stmt->execute()) {
            // SMTP Configuration
            $smtp_host = "smtp.gmail.com";
            $smtp_username = "swapprojectsender@gmail.com"; // Your Gmail
            $smtp_password = "ylxv vvbf wzrx czqn"; // Your Gmail App Password
            $smtp_port = 587;
            $base_url = "http://localhost/MP"; // Adjust to your project path

            // Generate password reset link
            $reset_link = "$base_url/reset_password.php?token=" . urlencode($reset_token);

            // Send email using PHPMailer
            $mail = new PHPMailer(true);
            try {
                $mail->isSMTP();
                $mail->Host = $smtp_host;
                $mail->SMTPAuth = true;
                $mail->Username = $smtp_username;
                $mail->Password = $smtp_password;
                $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
                $mail->Port = $smtp_port;

                // Email Details
                $mail->setFrom('swapprojectsender@gmail.com', 'CyberSleuth Academy');
                $mail->addAddress($email);
                $mail->isHTML(true);
                $mail->Subject = 'Password Reset Request - CyberSleuth Academy';
                $mail->Body = "
                    <div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;'>
                        <h2 style='color: #00ff00;'>Password Reset Request</h2>
                        <p>Hello,</p>
                        <p>You have requested to reset your password for your CyberSleuth Academy account.</p>
                        <p>Click the button below to reset your password. This link will expire in 1 hour.</p>
                        <div style='text-align: center; margin: 20px 0;'>
                            <a href='$reset_link' 
                               style='background-color: #00ff00; color: #000; padding: 12px 24px; 
                                      text-decoration: none; border-radius: 5px; font-weight: bold;'>
                                Reset Password
                            </a>
                        </div>
                        <p>If you cannot click the button, copy and paste this link into your browser:</p>
                        <p style='word-break: break-all; color: #666;'>$reset_link</p>
                        <p>If you did not request this, please ignore this email.</p>
                        <hr>
                        <p>Regards,<br><strong>CyberSleuth Academy Team</strong></p>
                    </div>
                ";

                $mail->send();
                $_SESSION['success_message'] = "A password reset link has been sent to your email.";
            } catch (Exception $e) {
                $_SESSION['error_message'] = "Failed to send email. Please try again. Mailer Error: " . $mail->ErrorInfo;
            }
        } else {
            $_SESSION['error_message'] = "Failed to update reset token.";
        }
    } else {
        $_SESSION['error_message'] = "Email not found in our records.";
    }
}

// Handle password reset
handlePasswordReset($email, $conn);

// Close the database connection
$conn->close();

// Redirect back to forgot password page
header("Location: forgot_password.php");
exit;
?>