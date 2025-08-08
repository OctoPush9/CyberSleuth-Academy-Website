<?php
// Only start the session if it's not already started
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Regenerate session ID for security
session_regenerate_id(true);

$_SESSION['last_activity'] = time();
?>