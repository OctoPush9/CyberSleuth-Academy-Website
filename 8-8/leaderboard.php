<?php
// Start session and include security files
session_start();
include 'includes/db_connection.php';
include 'includes/session_management.php';
include 'includes/csrf_protection.php';

// Force logout when visiting leaderboard directly (optional)
if (!isset($_SESSION['user_id'])) {
    header("Location: loginform.php");
    exit;
}

// Fetch leaderboard data from MySQL
$stmt = $conn->prepare("
    SELECT id, username, points, rooms_completed, country 
    FROM users 
    ORDER BY points DESC 
    LIMIT 10
");
$stmt->execute();
$result = $stmt->get_result();
$leaderboard_users = [];
while ($row = $result->fetch_assoc()) {
    $leaderboard_users[] = $row;
}
$stmt->close();
$conn->close();
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="icon" href="assets/images/cybersleuth-icon.png" type="image/png">
    <title>CyberSleuth Academy Dashboard</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
    <link href="node_modules/bootstrap/dist/css/bootstrap.min.css" rel="stylesheet" />
    <link rel="stylesheet" href="css/leaderboard.css">
</head>
<body class="lab-page">
    <!-- Header -->
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark sticky-top">
        <!-- Alert container for JS -->
        <div id="alertArea" class="container position-fixed top-0 start-50 translate-middle-x mt-3"
            style="z-index: 1055; max-width: 600px;"></div>

        <div class="container">
            <!-- Logo and Brand -->
            <a class="navbar-brand d-flex align-items-center me-4" href="index.html" target="_blank">
                <img src="assets/images/cybersleuth-icon.png" alt="Logo" style="height: 22px;" class="me-2">
                CyberSleuth Academy
            </a>

            <!-- Collapse toggle for mobile -->
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainNavbar"
                aria-controls="mainNavbar" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>

            <!-- Navbar Content -->
            <div class="collapse navbar-collapse" id="mainNavbar">
                <!-- Left Links -->
                <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                    <li class="nav-item">
                        <a href="home.html" class="nav-link">Dashboard</a>
                    </li>
                    <li class="nav-item">
                        <a href="learn.html" class="nav-link">Training Zone</a>
                    </li>
                    <li class="nav-item">
                        <a href="leaderboard.php" class="nav-link active">Leaderboard</a>
                    </li>
                    <li class="nav-item">
                        <a href="quiz.html" class="nav-link">Knowledge Battle</a>
                    </li>
                </ul>

                    <!-- Settings Dropdown -->
                    <li class="nav-item dropdown settings-dropdown d-none">
                        <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
                            <i class="fas fa-cog me-1"></i> Settings
                        </a>
                        <ul class="dropdown-menu dropdown-menu-end">
                            <li><a class="dropdown-item" href="#" data-bs-toggle="modal"
                                    data-bs-target="#difficultyModal">
                                    <i class="fas fa-sliders-h me-2"></i>Difficulty Level</a></li>
                            <li><a class="dropdown-item" href="#" data-bs-toggle="modal" data-bs-target="#resetModal">
                                    <i class="fas fa-redo me-2"></i>Reset Progress</a></li>
                            <li>
                                <div class="dropdown-item d-flex align-items-center" onclick="event.stopPropagation();">
                                    <span class="me-2"><i class="fas fa-moon"></i> Dark Mode</span>
                                    <label class="theme-toggle ms-auto mb-0">
                                        <input type="checkbox" id="darkModeToggle" />
                                        <span class="slider"></span>
                                    </label>
                                </div>
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>
        </div>
    </nav>

    <!-- Main Content -->
    <main class="main-content">
        <div class="container">
            <div class="leaderboard-section">
                <h1 class="leaderboard-title">Leaderboards</h1>
                <p class="leaderboard-welcome">Welcome to the wall of fame - Here are some of our top users.</p>

                <!-- Filters -->
                <div class="filters">
                    <button class="filter-button active" data-period="all-time">General</button>
                    <button class="filter-button" data-period="monthly">All time</button>
                    <select class="filter-select" id="countryFilter">
                        <option value="all">All countries</option>
                        <option value="US">US</option>
                        <option value="UK">UK</option>
                        <option value="SG">SG</option>
                    </select>
                </div>

                <!-- Top Users Section -->
                <div class="top-users-container">
                    <h2>Top Performers</h2>
                    <div class="top-users" id="topUsersContainer">
                        <!-- Top users will be populated by JavaScript -->
                    </div>
                </div>

                <!-- Leaderboard Table -->
                <div class="table-container">
                    <table class="leaderboard-table">
                        <thead>
                            <tr>
                                <th>Rank</th>
                                <th>Username</th>
                                <th>Country</th>
                                <th>Points</th>
                                <th>Rooms</th>
                            </tr>
                        </thead>
                        <tbody id="leaderboardBody">
                            <!-- Table rows will be populated by JavaScript -->
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </main>

    <footer class="footer mt-auto">
        <div class="container">
            <p>© 2025 CyberSleuth Academy. Developed by TP Cybersecurity & Digital Forensics Students.</p>
            <p class="mb-0">All content is for educational purposes only.</p>
        </div>
    </footer>

    <script src="node_modules/bootstrap/dist/js/bootstrap.bundle.min.js"></script>
    <script src="js/leaderboard.js"></script>
</body>
</html>