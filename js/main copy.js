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

// Detect which lab is running (phishing or insider)
const moduleType = document.title.includes("Insider Threats") ? "Insider Threats" : "Phishing Forensics";


const cyberSleuthIcon = "data:image/png;base64,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"; // <-- use full base64 here


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
        // const quizHTML = task.quiz.map((question, qIndex) =>
        //     generateQuizBlock(taskIndex, qIndex, question)
        // ).join("");
        let quizHTML = task.quiz.map((question, qIndex) =>
            generateQuizBlock(taskIndex, qIndex, question)
        ).join("");

        // If it's the last task (e.g. task 8), add certificate button
        // if (taskIndex === tasks.length - 1) {
        //     quizHTML += `
        //         <div class="text-center mt-4">

        //             <button id="downloadCertBtn" class="btn btn-outline-success fw-semibold">
        //                 <i class="fas fa-file-download fa-lg me-2"></i> Download Certificate
        //             </button>
        //         </div>
        //     `;
        // }
        // If it's the last task (e.g. task 8), add certificate button
        // if (taskIndex === tasks.length - 1) {
        //     quizHTML += `
        //         <div class="text-center mt-4">
        //             <button id="downloadCertBtn" class="btn btn-outline-secondary fw-semibold"
        //                 disabled
        //                 data-bs-toggle="tooltip"
        //                 title="Complete all tasks to unlock your certificate.">
        //                 <i class="fas fa-file-download fa-lg me-2"></i> Download Certificate
        //             </button>
        //         </div>
        //     `;
        // }
        if (taskIndex === tasks.length - 1) {
            quizHTML += `
                <div class="text-center mt-4">
                    <span id="certTooltipWrapper" data-bs-toggle="tooltip" title="Complete all tasks to unlock your certificate.">
                        <button id="downloadCertBtn" class="btn btn-outline-secondary fw-semibold" disabled>
                            <i class="fas fa-file-download fa-lg me-2"></i> Download Certificate
                        </button>
                    </span>
                </div>
            `;
        }




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
                        <div>${task.content}</div>
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

    // Check if all tasks are completed
    // const certBtn = document.getElementById("downloadCertBtn");
    // if (certBtn) {
    //     if (progressPercent === 100) {
    //         certBtn.disabled = false;
    //         certBtn.classList.remove("btn-outline-secondary");
    //         certBtn.classList.add("btn-outline-success");
    //         certBtn.removeAttribute("title");
    //         certBtn.removeAttribute("data-bs-toggle");

    //         // Remove Bootstrap tooltip (cleanly)
    //         const tooltipInstance = bootstrap.Tooltip.getInstance(certBtn);
    //         if (tooltipInstance) tooltipInstance.dispose();
    //     } else {
    //         certBtn.disabled = true;
    //         certBtn.classList.remove("btn-outline-success");
    //         certBtn.classList.add("btn-outline-secondary");
    //         certBtn.setAttribute("data-bs-toggle", "tooltip");
    //         certBtn.setAttribute("title", "Complete all tasks to unlock your certificate.");
    //     }
    // }
    // const certBtn = document.getElementById("downloadCertBtn");
    // if (certBtn) {
    //     // Remove any existing tooltip first
    //     const oldTooltip = bootstrap.Tooltip.getInstance(certBtn);
    //     if (oldTooltip) oldTooltip.dispose();

    //     if (progressPercent === 100) {
    //         certBtn.disabled = false;
    //         certBtn.classList.remove("btn-outline-secondary");
    //         certBtn.classList.add("btn-outline-success");
    //         certBtn.setAttribute("data-bs-toggle", "tooltip");
    //         certBtn.setAttribute("title", "Click to download your Certificate of Completion.");
    //     } else {
    //         certBtn.disabled = true;
    //         certBtn.classList.remove("btn-outline-success");
    //         certBtn.classList.add("btn-outline-secondary");
    //         certBtn.setAttribute("data-bs-toggle", "tooltip");
    //         certBtn.setAttribute("title", "Complete all tasks to unlock your certificate.");
    //     }

    //     // Reinitialize tooltip
    //     new bootstrap.Tooltip(certBtn);
    // }
    const certBtn = document.getElementById("downloadCertBtn");
    const certWrapper = document.getElementById("certTooltipWrapper");

    if (certBtn && certWrapper) {
        const existingTooltip = bootstrap.Tooltip.getInstance(certWrapper);
        if (existingTooltip) existingTooltip.dispose();

        if (progressPercent === 100) {
            certBtn.disabled = false;
            certBtn.classList.remove("btn-outline-secondary");
            certBtn.classList.add("btn-outline-success");

            certWrapper.setAttribute("title", "Click to download your Certificate of Completion.");
        } else {
            certBtn.disabled = true;
            certBtn.classList.remove("btn-outline-success");
            certBtn.classList.add("btn-outline-secondary");

            certWrapper.setAttribute("title", "Complete all tasks to unlock your certificate.");
        }

        // Reinitialize tooltip
        new bootstrap.Tooltip(certWrapper);
    }



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
    const prefix = moduleType === "Insider Threats" ? "Insider Threats" : "Phishing Forensics";

    if (percent >= 100) {
        newBadge = "gold";
        badgeHTML = `<span class="badge rounded-pill bg-primary text-white small">🥇 ${prefix} Expert</span>`;
    } else if (percent >= 70) {
        newBadge = "silver";
        badgeHTML = `<span class="badge rounded-pill bg-info text-white small">🥈 ${prefix} Specialist</span>`;
    } else if (percent >= 50) {
        newBadge = "bronze";
        badgeHTML = `<span class="badge rounded-pill bg-secondary text-white small">🥉 ${prefix} Rookie</span>`;
    }


    // Only update if changed
    if (newBadge !== previousBadge) {
        badgeEl.setAttribute("data-badge-earned", newBadge);
        badgeEl.innerHTML = badgeHTML;

        const messages = {
            bronze: `🎉 Congrats! You unlocked the ‘🥉 ${prefix} Rookie’ badge!`,
            silver: `🎉 Congrats! You unlocked the ‘🥈 ${prefix} Specialist’ badge!`,
            gold: `🎉 Congrats! You unlocked the ‘🥇 ${prefix} Expert’ badge! You've also completed the entire ${prefix} module.`
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

// Alert users not to close or reload browser - progress will not be saved.

window.addEventListener("beforeunload", function (e) {
    e.preventDefault();
    e.returnValue = "";
});



// Wait for tasks to render before attaching the button
// document.addEventListener("click", function (e) {
//     if (e.target && e.target.id === "downloadCertBtn") {
//         showCertificatePrompt();
//     }
// });

document.addEventListener("click", function (e) {
    if (e.target && e.target.id === "downloadCertBtn") {
        if (e.target.disabled) return; // extra safeguard
        showCertificatePrompt();
    }
});


// function showCertificatePrompt() {
//     const userName = prompt("Enter your full name for the certificate:");
//     if (!userName || userName.trim() === "") {
//         alert("Please enter a valid name.");
//         return;
//     }
//     generateCertificate(userName.trim());
// }
function showCertificatePrompt() {
    const userName = prompt("Enter your full name for the certificate:");
    if (!userName || userName.trim() === "") {
        alert("Please enter a valid name.");
        return;
    }

    const trimmed = userName.trim();

    // ✅ Only allow letters and spaces (no digits or symbols)
    if (!/^[A-Za-z\s]+$/.test(trimmed)) {
        alert("Name should only contain letters and spaces. No numbers or special characters.");
        return;
    }

    generateCertificate(trimmed);
}

// Track how many times certificate has been downloaded
let certificateDownloadCount = parseInt(localStorage.getItem("certDownloadCount")) || 0;



// function generateCertificate(userName) {
//     const { jsPDF } = window.jspdf;
//     if (!jsPDF) {
//         alert("Certificate library failed to load. Please check your internet connection.");
//         return;
//     }
//     const doc = new jsPDF({
//         orientation: "landscape",
//         unit: "pt",
//         format: "a4"
//     });

//     doc.setFillColor(245, 245, 245);
//     doc.rect(0, 0, doc.internal.pageSize.width, doc.internal.pageSize.height, 'F');

//     doc.setDrawColor(0, 0, 0);
//     doc.setLineWidth(4);
//     doc.rect(20, 20, doc.internal.pageSize.width - 40, doc.internal.pageSize.height - 40);

//     doc.setFont("helvetica", "bold");
//     doc.setFontSize(30);
//     doc.text("CyberSleuth Academy", doc.internal.pageSize.width / 2, 100, { align: "center" });

//     doc.setFontSize(18);
//     doc.text("Certificate of Completion", doc.internal.pageSize.width / 2, 150, { align: "center" });

//     doc.setFont("times", "italic");
//     doc.setFontSize(26);
//     doc.text(userName, doc.internal.pageSize.width / 2, 220, { align: "center" });

//     doc.setFont("helvetica", "normal");
//     doc.setFontSize(16);
//     doc.text("Has successfully completed the Phishing Forensics Lab", doc.internal.pageSize.width / 2, 260, { align: "center" });

//     doc.setFontSize(14);
//     doc.text("Temasek Polytechnic – Cybersecurity & Digital Forensics", doc.internal.pageSize.width / 2, 310, { align: "center" });

//     const today = new Date().toLocaleDateString();
//     doc.setFontSize(12);
//     doc.text(`Issued on: ${today}`, doc.internal.pageSize.width - 100, doc.internal.pageSize.height - 50, { align: "right" });

//     doc.save(`${userName.replace(/\s+/g, "_")}_Phishing_Certificate.pdf`);
// }


// function generateCertificate(userName) {
//     const { jsPDF } = window.jspdf;
//     if (!jsPDF) {
//         alert("Certificate library failed to load. Please check your internet connection.");
//         return;
//     }

//     // Increment and store download count
//     certificateDownloadCount++;
//     localStorage.setItem("certDownloadCount", certificateDownloadCount);

//     const doc = new jsPDF({
//         orientation: "landscape",
//         unit: "pt",
//         format: "a4"
//     });

//     doc.setFillColor(245, 245, 245);
//     doc.rect(0, 0, doc.internal.pageSize.width, doc.internal.pageSize.height, 'F');

//     doc.setDrawColor(0, 0, 0);
//     doc.setLineWidth(4);
//     doc.rect(20, 20, doc.internal.pageSize.width - 40, doc.internal.pageSize.height - 40);

//     doc.setFont("helvetica", "bold");
//     doc.setFontSize(30);
//     doc.text("CyberSleuth Academy", doc.internal.pageSize.width / 2, 100, { align: "center" });

//     doc.setFontSize(18);
//     doc.text("Certificate of Completion", doc.internal.pageSize.width / 2, 150, { align: "center" });

//     doc.setFont("times", "italic");
//     doc.setFontSize(26);
//     doc.text(userName, doc.internal.pageSize.width / 2, 220, { align: "center" });

//     doc.setFont("helvetica", "normal");
//     doc.setFontSize(16);
//     doc.text("Has successfully completed the Phishing Forensics Lab", doc.internal.pageSize.width / 2, 260, { align: "center" });

//     doc.setFontSize(14);
//     doc.text("Temasek Polytechnic – Cybersecurity & Digital Forensics", doc.internal.pageSize.width / 2, 310, { align: "center" });

//     // Issued date
//     const today = new Date().toLocaleDateString();
//     doc.setFontSize(12);
//     doc.text(`Issued on: ${today}`, doc.internal.pageSize.width - 100, doc.internal.pageSize.height - 50, { align: "right" });

//     // Certificate download count
//     doc.setFontSize(12);
//     doc.text(`Download Count: ${certificateDownloadCount}`, 40, doc.internal.pageSize.height - 50); // Bottom-left

//     doc.save(`${userName.replace(/\s+/g, "_")}_Phishing_Certificate.pdf`);
// }

//enhanced version above is main version but not look good but logic crct
// function generateCertificate(userName) {
//     const { jsPDF } = window.jspdf;
//     if (!jsPDF) {
//         alert("Certificate library failed to load. Please check your internet connection.");
//         return;
//     }

//     certificateDownloadCount++;
//     localStorage.setItem("certDownloadCount", certificateDownloadCount);

//     const doc = new jsPDF({
//         orientation: "landscape",
//         unit: "pt",
//         format: "a4"
//     });

//     const width = doc.internal.pageSize.width;
//     const height = doc.internal.pageSize.height;

//     // ===== Blue Header Bar =====
//     doc.setFillColor(33, 106, 203); // Bootstrap blue
//     doc.rect(0, 0, width, 100, 'F');

//     // ===== Academy Name in Header =====
//     doc.setFont("helvetica", "bold");
//     doc.setFontSize(26);
//     doc.setTextColor(255, 255, 255);
//     doc.text("CyberSleuth Academy", 50, 60);

//     // ===== Title =====
//     doc.setFontSize(20);
//     doc.setTextColor(33, 106, 203);
//     doc.text("Certificate of Completion", width / 2, 160, { align: "center" });

//     // ===== User Name =====
//     doc.setFont("times", "bolditalic");
//     doc.setFontSize(40);
//     doc.setTextColor(0, 0, 0);
//     doc.text(userName, width / 2, 220, { align: "center" });

//     // ===== Description =====
//     doc.setFont("helvetica", "normal");
//     doc.setFontSize(16);
//     doc.text("Has successfully completed the Phishing Forensics Lab", width / 2, 260, { align: "center" });

//     // doc.setFontSize(14);
//     // doc.text("Temasek Polytechnic – Cybersecurity & Digital Forensics", width / 2, 290, { align: "center" });

//     // ===== Grey Footer Bar =====
//     doc.setFillColor(240, 240, 240);
//     doc.rect(0, height - 60, width, 60, 'F');

//     doc.setFontSize(12);
//     doc.setTextColor(0, 0, 0);
//     doc.text(`Download Count: ${certificateDownloadCount}`, 40, height - 30);

//     const today = new Date().toLocaleDateString("en-GB");
//     doc.text(`Issued on: ${today}`, width - 50, height - 30, { align: "right" });

//     doc.save(`${userName.replace(/\s+/g, "_")}_Phishing_Certificate.pdf`);
// }

//final version
// function generateCertificate(userName) {
//     const { jsPDF } = window.jspdf;
//     if (!jsPDF) {
//         alert("Certificate library failed to load. Please check your internet connection.");
//         return;
//     }

//     certificateDownloadCount++;
//     localStorage.setItem("certDownloadCount", certificateDownloadCount);

//     const doc = new jsPDF({
//         orientation: "landscape",
//         unit: "pt",
//         format: "a4"
//     });

//     const width = doc.internal.pageSize.width;
//     const height = doc.internal.pageSize.height;

//     // ===== Background =====
//     doc.setFillColor(255, 253, 245); // Light ivory tone
//     doc.rect(0, 0, width, height, 'F');

//     // ===== Header Bar =====
//     doc.setFillColor(33, 106, 203); // Bootstrap blue
//     doc.rect(0, 0, width, 80, 'F');

//     // ===== Academy Name =====
//     doc.setFont("helvetica", "bold");
//     doc.setFontSize(26);
//     doc.setTextColor(255, 255, 255);
//     doc.text("CyberSleuth Academy", 50, 50);

//     // ===== Title =====
//     doc.setFont("helvetica", "bold");
//     doc.setFontSize(40);
//     doc.setTextColor(40, 40, 40); // Dark gray
//     doc.text("CERTIFICATE", width / 2, 150, { align: "center" });

//     // ===== Subtitle =====
//     doc.setFontSize(20);
//     doc.text("OF COMPLETION", width / 2, 180, { align: "center" });

//     // ===== Presented To =====
//     doc.setFont("helvetica", "normal");
//     doc.setFontSize(16);
//     doc.text("This Certificate is presented to", width / 2, 230, { align: "center" });

//     // ===== User Name =====
//     doc.setFont("times", "bolditalic");
//     doc.setFontSize(32);
//     doc.text(userName, width / 2, 270, { align: "center" });


//     // ===== Achievement Description =====
//     doc.setFont("helvetica", "normal");
//     doc.setFontSize(16);
//     doc.text("For successfully completing the Phishing Forensics Lab", width / 2, 320, { align: "center" });

//     // ===== Footer Background =====
//     doc.setFillColor(240, 240, 240); // Light gray
//     doc.rect(0, height - 60, width, 60, 'F');

//     // ===== Footer Info =====
//     doc.setFontSize(12);
//     doc.setTextColor(50, 50, 50);

//     const today = new Date().toLocaleDateString("en-GB");
//     doc.text(`Issued on: ${today}`, width - 50, height - 30, { align: "right" });

//     // Generate alphanumerical Certificate ID
//     const certId = "CSA-" + Array.from({ length: 8 }, () => "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"[Math.floor(Math.random() * 36)]).join('');
//     doc.text(`Certificate ID: ${certId}`, 40, height - 45);

//     doc.text(`Download Count: ${certificateDownloadCount}`, 40, height - 30);

//     doc.save(`${userName.replace(/\s+/g, "_")}_Phishing_Certificate.pdf`);
// }

//final version
// function generateCertificate(userName) {
//     const { jsPDF } = window.jspdf;
//     if (!jsPDF) {
//         alert("Certificate library failed to load. Please check your internet connection.");
//         return;
//     }

//     // ===== Check name length =====
//     if (userName.length > 40) {
//         alert("The name entered is too long. \n\nPlease enter a shorter version of your name (ideally under 40 characters).");
//         return;
//     }


//     // ===== Get lab name from meta tag =====
//     const metaTag = document.querySelector('meta[name="lab-title"]');
//     const labTitle = metaTag ? metaTag.content : "Cybersecurity Lab"; // fallback if missing

//     certificateDownloadCount++;
//     localStorage.setItem("certDownloadCount", certificateDownloadCount);

//     const doc = new jsPDF({
//         orientation: "landscape",
//         unit: "pt",
//         format: "a4"
//     });

//     const width = doc.internal.pageSize.width;
//     const height = doc.internal.pageSize.height;

//     // ===== Background =====
//     doc.setFillColor(255, 253, 245); // Light ivory tone
//     doc.rect(0, 0, width, height, 'F');

//     // ===== Header Bar =====
//     doc.setFillColor(33, 106, 203); // Bootstrap blue
//     doc.rect(0, 0, width, 80, 'F');

//     // ===== Academy Logo and Name =====
//     const logoX = 50;
//     const logoY = 25;
//     const logoSize = 30;

//     doc.addImage(cyberSleuthIcon, "PNG", logoX, logoY, logoSize, logoSize); // icon

//     doc.setFont("helvetica", "bold");
//     doc.setFontSize(26);
//     doc.setTextColor(255, 255, 255);
//     doc.text("CyberSleuth Academy", logoX + logoSize + 10, 50); // text beside icon


//     // ===== Title =====
//     doc.setFont("helvetica", "bold");
//     doc.setFontSize(40);
//     doc.setTextColor(40, 40, 40); // Dark gray
//     doc.text("CERTIFICATE", width / 2, 150, { align: "center" });

//     // ===== Subtitle =====
//     doc.setFontSize(20);
//     doc.text("OF COMPLETION", width / 2, 180, { align: "center" });

//     // ===== Presented To =====
//     doc.setFont("helvetica", "normal");
//     doc.setFontSize(16);
//     doc.text("This Certificate is presented to", width / 2, 230, { align: "center" });

//     // ===== User Name =====
//     doc.setFont("times", "bolditalic");
//     doc.setFontSize(32);
//     doc.text(userName, width / 2, 270, { align: "center" });

//     // ===== Achievement Description (with dynamic lab name) =====
//     doc.setFont("helvetica", "normal");
//     doc.setFontSize(16);
//     doc.text(`For successfully completing the ${labTitle}`, width / 2, 320, { align: "center" });

//     // ===== Footer Background =====
//     doc.setFillColor(240, 240, 240); // Light gray
//     doc.rect(0, height - 60, width, 60, 'F');

//     // ===== Footer Info =====
//     doc.setFontSize(12);
//     doc.setTextColor(50, 50, 50);

//     const today = new Date().toLocaleDateString("en-GB");
//     doc.text(`Issued on: ${today}`, width - 50, height - 30, { align: "right" });

//     // Generate alphanumerical Certificate ID
//     const certId = "CSA-" + Array.from({ length: 8 }, () =>
//         "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"[Math.floor(Math.random() * 36)]
//     ).join('');
//     doc.text(`Certificate ID: ${certId}`, 40, height - 45);

//     doc.text(`Download Count: ${certificateDownloadCount}`, 40, height - 30);

//     // ===== Save with correct lab name in filename =====
//     const cleanLabName = labTitle.toLowerCase().replace(/\s+/g, "_").replace(/[^\w]/g, "");
//     doc.save(`${userName.replace(/\s+/g, "_")}_${cleanLabName}_certificate.pdf`);
// }


function generateCertificate(userName) {
    const { jsPDF } = window.jspdf;
    if (!jsPDF) {
        alert("Certificate library failed to load. Please check your internet connection.");
        return;
    }

    // ===== Check name length =====
    if (userName.length > 40) {
        alert("The name entered is too long. \n\nPlease enter a shorter version of your name (ideally under 40 characters).");
        return;
    }


    // ===== Get lab name from meta tag =====
    const metaTag = document.querySelector('meta[name="lab-title"]');
    const labTitle = metaTag ? metaTag.content : "Cybersecurity Lab"; // fallback if missing

    const labKey = `certDownloadCount_${labTitle}`;
    let certificateDownloadCount = parseInt(localStorage.getItem(labKey)) || 0;
    certificateDownloadCount++;
    localStorage.setItem(labKey, certificateDownloadCount);


    const doc = new jsPDF({
        orientation: "landscape",
        unit: "pt",
        format: "a4"
    });

    const width = doc.internal.pageSize.width;
    const height = doc.internal.pageSize.height;

    // ===== Background =====
    doc.setFillColor(255, 253, 245); // Light ivory tone
    doc.rect(0, 0, width, height, 'F');

    // ===== Header Bar =====
    doc.setFillColor(33, 106, 203); // Bootstrap blue
    doc.rect(0, 0, width, 80, 'F');

    // ===== Academy Logo and Name =====
    const logoX = 50;
    const logoY = 25;
    const logoSize = 30;

    doc.addImage(cyberSleuthIcon, "PNG", logoX, logoY, logoSize, logoSize); // icon

    doc.setFont("helvetica", "bold");
    doc.setFontSize(26);
    doc.setTextColor(255, 255, 255);
    doc.text("CyberSleuth Academy", logoX + logoSize + 10, 50); // text beside icon


    // ===== Title =====
    doc.setFont("helvetica", "bold");
    doc.setFontSize(40);
    doc.setTextColor(40, 40, 40); // Dark gray
    doc.text("CERTIFICATE", width / 2, 150, { align: "center" });

    // ===== Subtitle =====
    doc.setFontSize(20);
    doc.text("OF COMPLETION", width / 2, 180, { align: "center" });

    // ===== Presented To =====
    doc.setFont("helvetica", "normal");
    doc.setFontSize(16);
    doc.text("This Certificate is presented to", width / 2, 230, { align: "center" });

    // ===== User Name =====
    doc.setFont("times", "bolditalic");
    doc.setFontSize(32);
    doc.text(userName, width / 2, 270, { align: "center" });

    // ===== Achievement Description (with dynamic lab name) =====
    doc.setFont("helvetica", "normal");
    doc.setFontSize(16);
    doc.text(`For successfully completing the ${labTitle}`, width / 2, 320, { align: "center" });

    // ===== Footer Background =====
    doc.setFillColor(240, 240, 240); // Light gray
    doc.rect(0, height - 60, width, 60, 'F');

    // ===== Footer Info =====
    doc.setFontSize(12);
    doc.setTextColor(50, 50, 50);

    const today = new Date().toLocaleDateString("en-GB");
    doc.text(`Issued on: ${today}`, width - 50, height - 30, { align: "right" });

    // Generate alphanumerical Certificate ID
    const certId = "CSA-" + Array.from({ length: 8 }, () =>
        "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"[Math.floor(Math.random() * 36)]
    ).join('');
    doc.text(`Certificate ID: ${certId}`, 40, height - 45);

    doc.text(`Download Count: ${certificateDownloadCount}`, 40, height - 30);

    // ===== Save with correct lab name in filename =====
    const cleanLabName = labTitle.toLowerCase().replace(/\s+/g, "_").replace(/[^\w]/g, "");
    doc.save(`${userName.replace(/\s+/g, "_")}_${cleanLabName}_certificate.pdf`);
}