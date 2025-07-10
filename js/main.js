// ========================================
// CyberSleuth Lab Engine – Core Setup
// Shared across all modules like phishing, insider etc.
// ========================================

// Global state
let hasCelebrated = false;
let usedHints = 0;
let maxHintsAllowed = 0;
let answerStreak = 0;

// Game progress state
let currentDifficulty = localStorage.getItem("difficulty") || "Intermediate";
let currentStep = 0;
let score = 0;
const totalSteps = tasks.length;

// Dynamic state per task/question
const taskCompletion = Array(tasks.length).fill(false);
const answeredCorrectly = tasks.map(task => Array(task.quiz.length).fill(false));
const attemptsLeft = tasks.map(task => task.quiz.map(q => q.attemptsAllowed));

// ========================================
// Render Tasks & Quizzes
// Handles all card generation per task
// ========================================

function renderTasks() {
    const container = document.getElementById("tasksAccordion");
    container.innerHTML = "";

    // ====== Hint Counter Setup ======
    const totalQuestions = tasks.reduce((sum, task) => sum + task.quiz.length, 0);
    maxHintsAllowed = currentDifficulty === "Intermediate" ? Math.floor(totalQuestions / 3) : Infinity;
    usedHints = 0;

    const hintCounter = document.getElementById("hintCounterDisplay");
    if (currentDifficulty === "Intermediate") {
        hintCounter.style.display = "block";
        document.getElementById("usedHintCount").textContent = usedHints;
        document.getElementById("maxHintCount").textContent = maxHintsAllowed;
    } else {
        hintCounter.style.display = "none";
    }

    // ====== Render Each Task ======
    tasks.forEach((task, taskIndex) => {
        const quizHTML = task.quiz.map((question, qIndex) =>
            generateQuizBlock(taskIndex, qIndex, question)
        ).join("");

        container.innerHTML += `
            <div class="card task-card">
                <div class="task-header bg-white d-flex justify-content-between align-items-center"
                     onclick="toggleTask(${taskIndex})">
                    <div class="d-flex align-items-center">
                        <div class="task-icon"><i class="${task.icon}"></i></div>
                        <h5 class="mb-0">${task.title}</h5>
                    </div>
                    <div class="d-flex align-items-center gap-2">
                        <span id="taskStatus${taskIndex}" class="badge bg-secondary">Pending</span>
                        <i class="fas fa-chevron-down"></i>
                    </div>
                </div>
                <div id="taskBody${taskIndex}" class="collapse">
                    <div class="card-body">
                        <p>${task.content}</p>
                        <hr class="my-3" />

                        <div class="d-flex align-items-center mb-3 mt-4">
                            <i class="fas fa-question-circle me-2 text-info fs-3"></i>
                            <span class="fs-5 fw-semibold">Knowledge Check</span>
                        </div>

                        ${quizHTML}
                    </div>
                </div>
            </div>
        `;
    });

    // ====== Bootstrap Tooltips (clean re-init) ======
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    tooltipTriggerList.forEach(el => {
        const tooltipInstance = bootstrap.Tooltip.getInstance(el);
        if (tooltipInstance) tooltipInstance.dispose();
        new bootstrap.Tooltip(el);
    });
    // Reload H5P embeds to fix blank issue
    reloadAllH5P();
}

// ========================================
// Generate a Quiz Block for Each Question
// ========================================
function generateQuizBlock(taskIndex, questionIndex, question) {
    const inputType = Array.isArray(question.correctAnswer) ? "checkbox" : "radio";

    const optionsHTML = question.options.map((option, optIndex) => `
        <div class="quiz-option">
            <input class="quiz-input" type="${inputType}" name="task${taskIndex}_q${questionIndex}"
                   value="${optIndex}" id="task${taskIndex}_q${questionIndex}_opt${optIndex}">
            <label class="quiz-label" for="task${taskIndex}_q${questionIndex}_opt${optIndex}">${option}</label>
        </div>
    `).join("");

    const hintButton = generateHintButton(taskIndex, questionIndex);

    return `
        <div class="mt-3">
            <div class="mb-2">${question.question}</div>
            ${optionsHTML}
            <div class="d-flex justify-content-between align-items-center mt-2 flex-wrap gap-2">
                <div id="task${taskIndex}_q${questionIndex}_feedback" class="small"></div>
                <div class="d-flex gap-2 ms-auto">
                    ${hintButton}
                    <button class="btn btn-sm btn-outline-primary" onclick="checkAnswer(${taskIndex}, ${questionIndex})">
                        Submit Answer
                    </button>
                </div>
            </div>
        </div>
    `;
}
// ========================================
// Generate Hint Button Based on Difficulty
// ========================================
function generateHintButton(taskIndex, questionIndex) {
    if (currentDifficulty === "Hard") {
        return `
            <span data-bs-toggle="tooltip" data-bs-title="Hints are disabled on Hard difficulty.">
                <button class="btn btn-sm btn-outline-secondary hint-btn disabled" disabled>
                    Hint
                </button>
            </span>`;
    }

    return `
        <span data-bs-toggle="tooltip" data-bs-title="Reveal a clue for this question">
            <button class="btn btn-sm btn-outline-info hint-btn"
                    data-task="${taskIndex}"
                    data-question="${questionIndex}"
                    onclick="showHint(${taskIndex}, ${questionIndex}, this)">
                Hint
            </button>
        </span>`;
}



// ========================================
// Handle Answer Checking
// ========================================
function checkAnswer(taskIndex, questionIndex) {
    const question = tasks[taskIndex].quiz[questionIndex];

    // Prevents re-submission from triggering again
    if (answeredCorrectly[taskIndex][questionIndex]) return;

    const feedback = document.getElementById(`task${taskIndex}_q${questionIndex}_feedback`);
    const inputType = Array.isArray(question.correctAnswer) ? "checkbox" : "radio";
    let selected = [];

    // Clears error messages from *other* questions only
    document.querySelectorAll('[id$="_feedback"].text-danger').forEach(el => {
        const idMatch = el.id.match(/task(\d+)_q(\d+)_feedback/);
        if (!idMatch) return;

        const i = parseInt(idMatch[1]);
        const q = parseInt(idMatch[2]);

        const isLocked = attemptsLeft[i][q] === 0 && !answeredCorrectly[i][q];
        if (!isLocked) {
            el.innerHTML = '';
            el.className = 'small';
        }
    });


    // Intermediate: initialize max attempts once
    if (currentDifficulty === "Intermediate" && !question.__attemptsInit) {
        attemptsLeft[taskIndex][questionIndex] = Math.min(3, question.options.length);
        question.__attemptsInit = true;
    }

    const remaining = attemptsLeft[taskIndex][questionIndex];
    const inputsSelector = `input[name="task${taskIndex}_q${questionIndex}"]`;

    // Prevent checking if no attempts left
    if ((currentDifficulty === "Hard" || currentDifficulty === "Intermediate") && remaining <= 0) {
        if (currentDifficulty === "Intermediate") {
            feedback.innerHTML = `<i class="fas fa-ban me-1 text-danger"></i>Wrong answer. You've used all attempts allowed in Intermediate mode.`;
            feedback.className = "text-danger fw-semibold mb-1";
        }
        return;
    }

    // Get selected options
    if (inputType === "radio") {
        const selectedOption = document.querySelector(`${inputsSelector}:checked`);
        if (!selectedOption) {
            feedback.innerHTML = `<i class="fas fa-exclamation-circle me-1 text-danger"></i>Please select an answer.`;
            feedback.className = "text-danger fw-semibold mb-1";
            return;
        }
        selected = [parseInt(selectedOption.value)];
    } else {
        const checked = document.querySelectorAll(`${inputsSelector}:checked`);
        if (checked.length === 0) {
            feedback.innerHTML = `<i class="fas fa-exclamation-circle me-1 text-danger"></i>Please select at least one answer.`;
            feedback.className = "text-danger fw-semibold mb-1";
            return;
        }
        selected = Array.from(checked).map(cb => parseInt(cb.value)).sort((a, b) => a - b);
    }

    const correct = Array.isArray(question.correctAnswer)
        ? [...question.correctAnswer].sort((a, b) => a - b)
        : [question.correctAnswer];

    const isCorrect = selected.length === correct.length &&
        selected.every((val, idx) => val === correct[idx]);

    if (isCorrect) {
        handleCorrectAnswer(taskIndex, questionIndex, feedback, inputsSelector);
    } else {
        handleWrongAnswer(taskIndex, questionIndex, feedback, inputsSelector);
    }
}

// ========================================
// Handle Correct Answer
// ========================================
function handleCorrectAnswer(taskIndex, questionIndex, feedbackEl, inputsSelector) {
    answeredCorrectly[taskIndex][questionIndex] = true;

    // Mark correct visually
    feedbackEl.innerHTML = `<i class="fas fa-check-circle me-1 text-success"></i>Correct answer.`;
    feedbackEl.className = "text-success fw-semibold mb-1";

    document.querySelectorAll(inputsSelector).forEach(input => input.disabled = true);

    // Update streak display
    answerStreak++;
    const cappedStreak = answerStreak > 10 ? "10+" : answerStreak;
    const flames = "🔥".repeat(Math.min(answerStreak, 10));
    document.getElementById("currentStreak").innerHTML = `${cappedStreak} ${flames}`;

    // Milestone streak alerts
    const milestoneAlerts = {
        3: "🔥 You're on a 3-answer streak! Keep it going!",
        5: "🚀 5-answer streak! Incredible focus!",
        7: "⚡ 7 in a row! You're a streak master!",
        10: "🏆 10-answer streak! Legendary accuracy!"
    };
    if (milestoneAlerts[answerStreak]) {
        showAlert(milestoneAlerts[answerStreak], "info");
    }

    //  Check if entire task is now completed
    if (answeredCorrectly[taskIndex].every(v => v)) {
        if (!taskCompletion[taskIndex]) {
            taskCompletion[taskIndex] = true;
            score += 10;
            currentStep++;
            document.getElementById(`taskStatus${taskIndex}`).textContent = "Completed";
            document.getElementById(`taskStatus${taskIndex}`).className = "badge bg-success";
            updateProgress();
        }
    }
}

// ========================================
// Handle Wrong Answer
// ========================================
function handleWrongAnswer(taskIndex, questionIndex, feedbackEl, inputsSelector) {
    // Reset streak display
    answerStreak = 0;
    document.getElementById("currentStreak").innerHTML = "0";

    const badge = document.getElementById(`taskStatus${taskIndex}`);

    if (currentDifficulty === "Hard") {
        attemptsLeft[taskIndex][questionIndex] = 0;
        document.querySelectorAll(inputsSelector).forEach(input => input.disabled = true);
        feedbackEl.innerHTML = `<i class="fas fa-times-circle me-1 text-danger"></i>Wrong answer. No more attempts allowed in Hard mode.`;
        feedbackEl.className = "text-danger fw-semibold mb-1";

        if (!taskCompletion[taskIndex]) {
            badge.textContent = "Incomplete";
            badge.className = "badge bg-danger";
        }
    } else if (currentDifficulty === "Intermediate") {
        attemptsLeft[taskIndex][questionIndex]--;
        const rem = attemptsLeft[taskIndex][questionIndex];

        if (rem > 0) {
            feedbackEl.innerHTML = `<i class="fas fa-times-circle me-1 text-danger"></i>Wrong answer. You have ${rem} attempt${rem > 1 ? "s" : ""} left for Intermediate mode.`;
        } else {
            document.querySelectorAll(inputsSelector).forEach(input => input.disabled = true);
            feedbackEl.innerHTML = `<i class="fas fa-times-circle me-1 text-danger"></i>Wrong answer. You've used all attempts allowed in Intermediate mode.`;

            if (!taskCompletion[taskIndex]) {
                badge.textContent = "Incomplete";
                badge.className = "badge bg-danger";
            }
        }

        feedbackEl.className = "text-danger fw-semibold mb-1";
    } else {
        // Easy mode
        feedbackEl.innerHTML = `<i class="fas fa-times-circle me-1 text-danger"></i>Wrong answer. Try again.`;
        feedbackEl.className = "text-danger fw-semibold mb-1";
    }
}



// ========================================
// Show Hint Logic (Based on Difficulty)
// Called on hint button click
// ========================================
function showHint(taskIndex, questionIndex, buttonEl) {
    const feedback = document.getElementById(`task${taskIndex}_q${questionIndex}_feedback`);
    const hintText = tasks[taskIndex].quiz[questionIndex].hint;

    // Always block if already correct
    if (answeredCorrectly[taskIndex][questionIndex]) {
        disableHintButton(buttonEl, "Hint unavailable – question already answered correctly.");
        return;
    }

    // Block hint if question is locked (Hard or Intermediate)
    const isLocked = attemptsLeft[taskIndex][questionIndex] === 0;
    if (isLocked && currentDifficulty !== "Easy") {
        const message =
            currentDifficulty === "Intermediate"
                ? "Hint unavailable – all answer attempts are used."
                : "Hint unavailable – question is locked after first wrong answer in Hard mode.";

        disableHintButton(buttonEl, message);
        return;
    }

    // Easy Mode – always allow hints
    if (currentDifficulty === "Easy") {
        displayHint(feedback, hintText);
        return;
    }

    // Intermediate Mode
    const alreadyShown = feedback.getAttribute("data-hint-shown") === "true";

    // Allow re-showing hint without extra usage
    if (alreadyShown) {
        displayHint(feedback, hintText);
        return;
    }

    // Limit reached globally
    if (usedHints >= maxHintsAllowed) {
        disableHintButton(buttonEl, "Hint limit reached for Intermediate difficulty.");
        return;
    }

    // First-time hint use
    displayHint(feedback, hintText);
    feedback.setAttribute("data-hint-shown", "true");

    usedHints++;
    document.getElementById("usedHintCount").textContent = usedHints;

    if (usedHints >= maxHintsAllowed) {
        disableAllRemainingHints();
    }
}

// ========================================
// Display Hint in Feedback Area
// ========================================
function displayHint(feedbackEl, text) {
    feedbackEl.innerHTML = `<i class="fas fa-lightbulb me-1 text-info"></i>${text}`;
    feedbackEl.className = "text-info fw-semibold mb-1";
}

// ========================================
// Disable Single Hint Button with Tooltip
// ========================================
function disableHintButton(buttonEl, tooltipMsg) {
    buttonEl.disabled = true;
    buttonEl.classList.add("disabled", "btn-outline-secondary");
    buttonEl.classList.remove("btn-outline-info");

    const tooltipInstance = bootstrap.Tooltip.getOrCreateInstance(buttonEl.parentElement);
    tooltipInstance.setContent({ '.tooltip-inner': tooltipMsg });
    tooltipInstance.show();
}

// ========================================
// Disable All Remaining Hint Buttons
// (when global hint limit is reached)
// ========================================
function disableAllRemainingHints() {
    document.querySelectorAll(".hint-btn").forEach(btn => {
        const parent = btn.parentElement;
        if (!btn.disabled && !btn.closest(".disabled")) {
            btn.disabled = true;
            btn.classList.add("disabled", "btn-outline-secondary");
            btn.classList.remove("btn-outline-info");

            const tooltip = bootstrap.Tooltip.getOrCreateInstance(parent);
            tooltip.setContent({
                '.tooltip-inner': "Hint limit reached for Intermediate difficulty."
            });
        }
    });
}


// ========================================
// Toggle Task Accordion (open one, close rest)
// Updates status badge to "In Progress" when opened
// ========================================
function toggleTask(i) {
    const currentBody = document.getElementById(`taskBody${i}`);
    const currentStatus = document.getElementById(`taskStatus${i}`);

    // Close all other task bodies
    document.querySelectorAll("[id^=taskBody]").forEach((el, idx) => {
        if (idx !== i) el.classList.remove("show");
    });

    // Toggle the current task
    const isNowOpen = !currentBody.classList.contains("show");
    currentBody.classList.toggle("show");

    // Mark as In Progress when opened (if not completed/incomplete)
    if (isNowOpen && !taskCompletion[i]) {
        const exhausted = attemptsLeft[i].some(left => left === 0);
        if (!exhausted) {
            const badge = document.getElementById(`taskStatus${i}`);
            badge.textContent = "In Progress";
            badge.className = "badge bg-info";
        }
    }
}


// ========================================
// Update Task Badge Text & Color
// Based on answer progress for that task
// ========================================
function updateTaskStatusBadge(taskIndex, isOpen) {
    const statusEl = document.getElementById(`taskStatus${taskIndex}`);
    const exhausted = attemptsLeft[taskIndex].some(left => left === 0);
    const attempted = attemptsLeft[taskIndex].some((left, qIdx) => {
        const max = tasks[taskIndex].quiz[qIdx].attemptsAllowed;
        return left < max;
    });
    const hasSelected = Array.from(document.querySelectorAll(`input[name^=task${taskIndex}_]`)).some(input => input.checked);

    if (exhausted || attempted) {
        statusEl.textContent = "Incomplete";
        statusEl.className = "badge bg-danger";
    } else if (hasSelected || isOpen) {
        statusEl.textContent = "In Progress";
        statusEl.className = "badge bg-info";
    } else {
        statusEl.textContent = "Pending";
        statusEl.className = "badge bg-secondary";
    }
}


// ========================================
// Helper: Check if Task is Completed
// ========================================


function isCompleted(i) {
    return taskCompletion[i] === true;
}

// ========================================
// Mark Task as Completed
// Updates status, disables submit, adds score
// ========================================
function completeTask(i) {
    const btn = document.querySelector(`#taskBody${i} .btn-success`);
    const badge = document.getElementById(`taskStatus${i}`);

    if (!btn.disabled) {
        btn.disabled = true;
        taskCompletion[i] = true;
        score += 10;
        currentStep++;
        updateProgress();

        badge.textContent = "Completed";
        badge.className = "badge bg-success";
    }
}



// ========================================
// Update Progress Bar UI and Score
// Called after completing a task
// =========================================
function updateProgress() {
    const progressPercent = (currentStep / totalSteps) * 100;
    const progressBar = document.getElementById("progressBar");

    // Update total score based on tasks completed
    const pointsPerTask = 100 / totalSteps;
    score = Math.round(currentStep * pointsPerTask);

    // Set progress bar width + color
    progressBar.style.width = `${progressPercent}%`;
    progressBar.classList.toggle("bg-success", progressPercent === 100);
    progressBar.classList.toggle("bg-warning", progressPercent > 0 && progressPercent < 100);

    // Update progress label + points UI
    document.querySelector(".progress-label").textContent = `Step ${currentStep} of ${totalSteps}`;
    document.getElementById("progressText").textContent = `${Math.round(progressPercent)}% Complete`;
    document.getElementById("pointsDisplay").textContent = score;

    // Check for new badge unlocks
    updateBadge(progressPercent);
}

// ========================================
// Update Badge UI + Trigger Alerts or Confetti
// Only triggers once per badge level
// ========================================
function updateBadge(percent) {
    const badgeEl = document.getElementById("badgesDisplay");
    const previousBadge = badgeEl.getAttribute("data-badge-earned") || "";

    let newBadge = "";
    let badgeHTML = "";

    // Badge thresholds
    if (percent >= 100) {
        newBadge = "gold";
        badgeHTML = `<span class="badge rounded-pill bg-primary text-white small">🥇 Phishing Forensics Expert</span>`;
    } else if (percent >= 70) {
        newBadge = "silver";
        badgeHTML = `<span class="badge rounded-pill bg-info text-white small">🥈 Phishing Forensics Specialist</span>`;
    } else if (percent >= 50) {
        newBadge = "bronze";
        badgeHTML = `<span class="badge rounded-pill bg-secondary text-white small">🥉 Phishing Forensics Rookie</span>`;
    } else {
        badgeHTML = "No badges";
    }

    // Only update if changed
    if (newBadge !== previousBadge) {
        badgeEl.setAttribute("data-badge-earned", newBadge);
        badgeEl.innerHTML = badgeHTML;

        const messages = {
            bronze: "🎉 Congrats! You unlocked the ‘🥉 Phishing Forensics Rookie’ badge!",
            silver: "🎉 Congrats! You unlocked the ‘🥈 Phishing Forensics Specialist’ badge!",
            gold: "🎉 Congrats! You unlocked the ‘🥇 Phishing Forensics Expert’ badge! You've also completed the entire Phishing Forensics module."
        };

        if (newBadge && messages[newBadge]) {
            showAlert(messages[newBadge], "info");
        }
    }

    // Trigger confetti once at full completion
    if (percent === 100 && !hasCelebrated) {
        hasCelebrated = true;
        confetti({
            particleCount: 150,
            spread: 90,
            origin: { y: 0.6 }
        });
    }
}




// ========================================
// Apply New Difficulty & Reset Progress
// Called from Difficulty modal confirm button
// ========================================
function applyDifficulty() {
    hasCelebrated = false;

    const selectedDiff = document.getElementById("difficultySelect").value;

    // Skip if no change
    if (selectedDiff === currentDifficulty) {
        showAlert("You are already on this difficulty. No changes applied.", "danger");
        bootstrap.Modal.getInstance(document.getElementById("difficultyModal")).hide();
        return;
    }

    // Update badge display
    updateDifficultyBadge(selectedDiff);

    // Set difficulty state + reset counter
    currentDifficulty = selectedDiff;
    localStorage.setItem("difficulty", currentDifficulty);
    currentStep = 0;
    score = 0;
    answerStreak = 0;

    // Clear attempts init flags
    for (let i = 0; i < tasks.length; i++) {
        for (let q = 0; q < tasks[i].quiz.length; q++) {
            if (tasks[i].quiz[q].hasOwnProperty("__attemptsInit")) {
                delete tasks[i].quiz[q].__attemptsInit;
            }
        }
    }

    // Full state reset (answers, inputs, status)
    resetAllTasksState();

    // Refresh UI
    updateProgress();
    document.getElementById("badgesDisplay").textContent = "No badges";
    document.getElementById("currentStreak").innerHTML = "0";

    // Hide modal + show confirmation
    bootstrap.Modal.getInstance(document.getElementById("difficultyModal")).hide();
    showAlert("Difficulty changed. Progress has been reset.", "info");

    // Fixes H5P iframe bug (re-renders)
    reloadAllH5P();
}

// ========================================
// Update Difficulty Badge UI (color + label)
// Called after changing difficulty
// ========================================
function updateDifficultyBadge(level) {
    const badge = document.getElementById("difficultyBadge");
    badge.innerHTML = `<i class="fas fa-graduation-cap me-1"></i> ${level}`;
    badge.classList.remove("bg-success", "bg-warning", "bg-danger");

    badge.classList.add(
        level === "Easy" ? "bg-success" :
            level === "Intermediate" ? "bg-warning" :
                "bg-danger"
    );
}

// ========================================
// Soft Reset: Reset All Task States (inputs, badges, feedback)
// Used for difficulty change or reset button
// ========================================
function resetAllTasksState() {
    taskCompletion.fill(false);

    // Reset answers + recalculate attempts per quiz
    for (let i = 0; i < answeredCorrectly.length; i++) {
        answeredCorrectly[i].fill(false);
        attemptsLeft[i] = tasks[i].quiz.map(q => q.attemptsAllowed);
    }

    // Re-enable and uncheck all options
    document.querySelectorAll('.quiz-input').forEach(input => {
        input.disabled = false;
        input.checked = false;
    });

    // Clear feedback areas
    document.querySelectorAll('[id$="_feedback"]').forEach(fb => {
        fb.innerHTML = '';
        fb.className = 'small';
    });

    // Reset all status badges
    document.querySelectorAll("[id^=taskStatus]").forEach(badge => {
        badge.textContent = "Pending";
        badge.className = "badge bg-secondary";
    });
    // Re-render all tasks
    renderTasks();
}


// ========================================
// Full Reset from Reset Modal
// Clears all progress and scores manually
// ========================================
function resetProgress() {
    const confirmed = confirm("Reset all progress?");
    if (!confirmed) return;

    score = 0;
    currentStep = 0;
    resetAllTasksState();
    document.getElementById("badgesDisplay").textContent = "No badges";
    updateProgress();
}



// ========================================
// Full Reset via Reset Modal
// Resets all core game variables + UI
// ========================================
function confirmReset() {
    hasCelebrated = false;
    score = 0;
    currentStep = 0;
    usedHints = 0;
    answerStreak = 0;

    // Reset task and question tracking
    for (let i = 0; i < tasks.length; i++) {
        taskCompletion[i] = false;
        answeredCorrectly[i] = Array(tasks[i].quiz.length).fill(false);
        attemptsLeft[i] = tasks[i].quiz.map(q => q.attemptsAllowed);

        tasks[i].quiz.forEach(q => {
            if (q.hasOwnProperty("__attemptsInit")) {
                delete q.__attemptsInit;
            }
        });
    }

    // Reset UI elements
    document.getElementById("currentStreak").innerHTML = "0";
    document.getElementById("pointsDisplay").textContent = "0";
    document.getElementById("badgesDisplay").textContent = "No badges";

    // Refresh UI and task list
    updateProgress();
    renderTasks();

    // Hide the reset modal
    bootstrap.Modal.getInstance(document.getElementById("resetModal")).hide();

    // Show confirmation
    showAlert("Progress has been reset.", "info");
}


// ========================================
// Dark Mode Toggle Logic
// Persists state using localStorage
// ========================================

function toggleDarkMode() {
    const toggle = document.getElementById("darkModeToggle");
    const darkEnabled = toggle.checked;

    document.body.classList.toggle("dark-mode", darkEnabled);
    localStorage.setItem("theme", darkEnabled ? "dark" : "light");
}


// ========================================
// Initial Setup on Page Load
// ========================================

document.addEventListener("DOMContentLoaded", () => {
    const toggle = document.getElementById("darkModeToggle");
    const savedTheme = localStorage.getItem("theme");
    const enableDark = savedTheme === "dark";

    document.body.classList.toggle("dark-mode", enableDark);
    if (toggle) {
        toggle.checked = enableDark;
        toggle.addEventListener("change", toggleDarkMode);
    }

    const diffSelect = document.getElementById("difficultySelect");
    const savedDiff = localStorage.getItem("difficulty") || "Intermediate";
    currentDifficulty = savedDiff;
    diffSelect.value = savedDiff;
    updateDifficultyBadge(savedDiff);

    document.getElementById("difficultyBadge").innerHTML = `<i class="fas fa-graduation-cap me-1"></i> ${savedDiff}`;

    // Initialize Bootstrap tooltips
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    tooltipTriggerList.forEach(triggerEl => {
        new bootstrap.Tooltip(triggerEl);
    });

    // Start application
    renderTasks();
    updateProgress();
});



// ========================================
// Bootstrap alert queue system
// ========================================

let alertQueue = [];
let isAlertShowing = false;
let currentAlertEl = null;
let alertTimeoutId = null;

// Adds an alert to the queue and shows it.
// If an alert is already visible, it is closed immediately.

function showAlert(message, type = "info") {
    alertQueue.push({ message, type });

    if (isAlertShowing && currentAlertEl) {
        // Force close current alert immediately
        const alertInstance = bootstrap.Alert.getOrCreateInstance(currentAlertEl);
        alertInstance.close(); // will trigger 'closed.bs.alert' and call showNextAlert
    } else {
        showNextAlert(); // if nothing is showing
    }
}

// Shows the next alert in the queue if available
function showNextAlert() {
    if (alertQueue.length === 0) {
        isAlertShowing = false;
        currentAlertEl = null;
        return;
    }

    isAlertShowing = true;
    const { message, type } = alertQueue.shift();

    const alertArea = document.getElementById("alertArea");
    const alertDiv = document.createElement("div");
    alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
    alertDiv.setAttribute("role", "alert");
    alertDiv.style.marginTop = "0.5rem";
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;

    alertArea.appendChild(alertDiv);
    currentAlertEl = alertDiv;

    // Auto-dismiss after 5s ONLY if no newer alerts come in
    alertTimeoutId = setTimeout(() => {
        const instance = bootstrap.Alert.getOrCreateInstance(alertDiv);
        instance.close();
    }, 5000);

    // Once alert closes, go to next
    alertDiv.addEventListener("closed.bs.alert", () => {
        clearTimeout(alertTimeoutId);
        alertDiv.remove();
        currentAlertEl = null;
        isAlertShowing = false;
        showNextAlert();
    });
}



// ========================================
// Difficulty Modal – Updates Description Text
// ========================================

// Updates the difficulty description when user changes dropdown
function updateDifficultyDescription() {
    const selected = document.getElementById("difficultySelect").value;
    const descriptionBox = document.getElementById("difficultyDescription");

    const descriptions = {
        Easy: "Easy: Unlimited attempts and unlimited hints for all questions.",
        Intermediate: "Intermediate: Limited attempts per question, and limited hint usage.",
        Hard: "Hard: Only one attempt per question. Hints are disabled."
    };

    descriptionBox.textContent = descriptions[selected];
}

// ========================================
// Syncs the difficulty dropdown when modal opens
// ========================================
document.getElementById("difficultyModal").addEventListener("show.bs.modal", () => {
    const selectEl = document.getElementById("difficultySelect");
    selectEl.value = currentDifficulty;
    updateDifficultyDescription();
});





// ========================================
// H5P Reload Fix – Ensures embedded iframes load correctly
// ========================================
function reloadAllH5P() {
    const h5pIframes = document.querySelectorAll(".h5p-container iframe");

    h5pIframes.forEach((iframe) => {
        let reloaded = false;

        iframe.addEventListener("load", () => {
            if (!reloaded) {
                const src = iframe.getAttribute("src");
                if (src) {
                    reloaded = true;
                    setTimeout(() => {
                        iframe.src = src;
                    }, 500);
                }
            }

            // Send resize message after iframe loads
            setTimeout(() => {
                iframe.contentWindow.postMessage(
                    { context: "h5p", action: "resize", scrollTo: false },
                    "*"
                );
            }, 1200);
            // Send resize message again on hover
            iframe.addEventListener("mouseenter", () => {
                iframe.contentWindow.postMessage(
                    { context: "h5p", action: "resize" },
                    "*"
                );
            });
        });
    });
}
// Run reload once when DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {
    reloadAllH5P();
});
