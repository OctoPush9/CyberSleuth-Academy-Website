// js/main.js
let hasCelebrated = false;
let usedHints = 0;
let maxHintsAllowed = 0;
let answerStreak = 0;



// ===========================
// Task Data
// ===========================

let currentDifficulty = "Intermediate"; // default or initial value
let currentStep = 0, score = 0;
const totalSteps = tasks.length;

// ===========================
// Render All Tasks
// ===========================



function renderTasks() {
    const container = document.getElementById("tasksAccordion");
    container.innerHTML = "";

    const totalQuestions = tasks.reduce((sum, task) => sum + task.quiz.length, 0);
    maxHintsAllowed = currentDifficulty === "Intermediate" ? Math.floor(totalQuestions / 3) : Infinity;
    usedHints = 0;

    // Show hint counter only in Intermediate
    // const hintCounter = document.getElementById("hintCounterDisplay");
    // if (currentDifficulty === "Intermediate") {
    //     hintCounter.style.display = "block";
    //     document.getElementById("usedHintCount").textContent = usedHints;
    //     document.getElementById("maxHintCount").textContent = maxHintsAllowed;
    // } else {
    //     hintCounter.style.display = "none";
    // }
    // document.getElementById("currentStreak").textContent = "0";  // Always reset streak to 0 or your tracked value

    const hintCounter = document.getElementById("hintCounterDisplay");
    if (currentDifficulty === "Intermediate") {
        hintCounter.style.display = "block";
        document.getElementById("usedHintCount").textContent = usedHints;
        document.getElementById("maxHintCount").textContent = maxHintsAllowed;
    } else {
        hintCounter.style.display = "none";
    }


    tasks.forEach((task, i) => {
        const quizHTML = task.quiz.map((q, qIndex) => {
            const inputType = Array.isArray(q.correctAnswer) ? "checkbox" : "radio";

            const optionsHTML = q.options.map((option, oIndex) => `
                <div class="quiz-option">
                    <input class="quiz-input" type="${inputType}" name="task${i}_q${qIndex}" value="${oIndex}" id="task${i}_q${qIndex}_opt${oIndex}">
                    <label class="quiz-label" for="task${i}_q${qIndex}_opt${oIndex}">${option}</label>
                </div>
            `).join("");

            let hintButtonHTML = "";

            if (currentDifficulty === "Hard") {
                hintButtonHTML = `
                    <span data-bs-toggle="tooltip" data-bs-title="Hints are disabled on Hard difficulty.">
                        <button class="btn btn-sm btn-outline-secondary hint-btn disabled" disabled>
                            Hint
                        </button>
                    </span>`;
            } else {
                hintButtonHTML = `
                    <span data-bs-toggle="tooltip" data-bs-title="Reveal a clue for this question">
                        <button class="btn btn-sm btn-outline-info hint-btn"
                                data-task="${i}"
                                data-question="${qIndex}"
                                onclick="showHint(${i}, ${qIndex}, this)">
                            Hint
                        </button>
                    </span>`;
            }

            return `
                <div class="mt-3">
                    <div class="mb-2">${q.question}</div>
                    ${optionsHTML}
                    <div class="d-flex justify-content-between align-items-center mt-2 flex-wrap gap-2">
                        <div id="task${i}_q${qIndex}_feedback" class="small"></div>
                        <div class="d-flex gap-2 ms-auto">
                            ${hintButtonHTML}
                            <button class="btn btn-sm btn-outline-primary" onclick="checkAnswer(${i}, ${qIndex})">
                                Submit Answer
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }).join("");

        container.innerHTML += `
            <div class="card task-card">
                <div class="task-header bg-white d-flex justify-content-between align-items-center" onclick="toggleTask(${i})">
                    <div class="d-flex align-items-center">
                        <div class="task-icon"><i class="${task.icon}"></i></div>
                        <h5 class="mb-0">${task.title}</h5>
                    </div>
                    <div class="d-flex align-items-center gap-2">
                        <span id="taskStatus${i}" class="badge bg-secondary">Pending</span>
                        <i class="fas fa-chevron-down"></i>
                    </div>
                </div>
                <div id="taskBody${i}" class="collapse">
                    <div class="card-body">
                        <p>${task.content}</p>
                        <hr class="my-3" />
                        <div class="d-flex align-items-center mb-3">
                            <i class="fas fa-question-circle me-2 fs-3 text-info"></i>
                            <span class="fs-5">Knowledge Check</span>
                        </div>
                        ${quizHTML}
                    </div>
                </div>
            </div>
        `;
    });

    // ✅ Cleanly dispose + reinitialize tooltips
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    tooltipTriggerList.forEach(el => {
        const existingTooltip = bootstrap.Tooltip.getInstance(el);
        if (existingTooltip) existingTooltip.dispose();
        new bootstrap.Tooltip(el);
    });
}

const taskCompletion = Array(tasks.length).fill(false);
const answeredCorrectly = tasks.map(task => Array(task.quiz.length).fill(false));
const attemptsLeft = tasks.map(task => task.quiz.map(q => q.attemptsAllowed));




// function checkAnswer(taskIndex, questionIndex) {
//     const question = tasks[taskIndex].quiz[questionIndex];
//     const feedback = document.getElementById(`task${taskIndex}_q${questionIndex}_feedback`);
//     const inputType = Array.isArray(question.correctAnswer) ? "checkbox" : "radio";
//     let selected = [];

//     // 🔒 HARD: block further checking after 1 attempt
//     if (currentDifficulty === "Hard" && attemptsLeft[taskIndex][questionIndex] <= 0) {
//         return; // no message, just silently ignore further clicks
//     }

//     if (inputType === "radio") {
//         const selectedOption = document.querySelector(`input[name="task${taskIndex}_q${questionIndex}"]:checked`);
//         if (!selectedOption) {
//             feedback.innerHTML = `<i class="fas fa-exclamation-circle me-1 text-danger"></i>Please select an answer.`;
//             feedback.className = "text-danger fw-semibold mb-1";
//             return;
//         }
//         selected = [parseInt(selectedOption.value)];
//     } else {
//         const selectedBoxes = document.querySelectorAll(`input[name="task${taskIndex}_q${questionIndex}"]:checked`);
//         if (selectedBoxes.length === 0) {
//             feedback.innerHTML = `<i class="fas fa-exclamation-circle me-1 text-danger"></i>Please select at least one answer.`;
//             feedback.className = "text-danger fw-semibold mb-1";
//             return;
//         }
//         selected = Array.from(selectedBoxes).map(cb => parseInt(cb.value)).sort((a, b) => a - b);
//     }

//     const correct = Array.isArray(question.correctAnswer)
//         ? [...question.correctAnswer].sort((a, b) => a - b)
//         : [question.correctAnswer];

//     const isCorrect = selected.length === correct.length &&
//         selected.every((val, idx) => val === correct[idx]);

//     if (isCorrect) {
//         answeredCorrectly[taskIndex][questionIndex] = true;
//         feedback.innerHTML = `<i class="fas fa-check-circle me-1 text-success"></i>Correct answer.`;
//         feedback.className = "text-success fw-semibold mb-1";

//         document.querySelectorAll(`input[name="task${taskIndex}_q${questionIndex}"]`).forEach(input => input.disabled = true);

//         if (answeredCorrectly[taskIndex].every(val => val)) {
//             if (!taskCompletion[taskIndex]) {
//                 taskCompletion[taskIndex] = true;
//                 score += 10;
//                 currentStep++;
//                 document.getElementById(`taskStatus${taskIndex}`).textContent = "Completed";
//                 document.getElementById(`taskStatus${taskIndex}`).className = "badge bg-success";
//                 updateProgress();
//             }
//         }
//     } else {
//         // Wrong answer
//         feedback.innerHTML = `<i class="fas fa-times-circle me-1 text-danger"></i>Wrong answer. Try again.`;
//         feedback.className = "text-danger fw-semibold mb-1";

//         // HARD MODE: only 1 attempt, lock and update message once
//         if (currentDifficulty === "Hard") {
//             attemptsLeft[taskIndex][questionIndex] = 0;
//             document.querySelectorAll(`input[name="task${taskIndex}_q${questionIndex}"]`).forEach(input => input.disabled = true);
//             feedback.innerHTML = `<i class="fas fa-times-circle me-1 text-danger"></i>Wrong answer. No more attempts allowed in  Hard mode.`;
//         }
//     }
// }


// function checkAnswer(taskIndex, questionIndex) {
//     const question = tasks[taskIndex].quiz[questionIndex];
//     const feedback = document.getElementById(`task${taskIndex}_q${questionIndex}_feedback`);
//     const inputType = Array.isArray(question.correctAnswer) ? "checkbox" : "radio";
//     let selected = [];

//     // Auto-assign attempts for Intermediate
//     if (currentDifficulty === "Intermediate" && !question.hasOwnProperty("__attemptsInit")) {
//         const numOptions = question.options.length;
//         const maxAttempts = Math.min(3, numOptions);
//         attemptsLeft[taskIndex][questionIndex] = maxAttempts;
//         question.__attemptsInit = true; // mark to avoid resetting on re-check
//     }

//     const remaining = attemptsLeft[taskIndex][questionIndex];

//     // HARD: block silently
//     if (currentDifficulty === "Hard" && remaining <= 0) return;

//     // INTERMEDIATE: block if attempts exhausted
//     if (currentDifficulty === "Intermediate" && remaining <= 0) {
//         feedback.innerHTML = `<i class="fas fa-ban me-1 text-danger"></i>Wrong answer. You've run out of attempts for Intermediate mode.`;
//         feedback.className = "text-danger fw-semibold mb-1";
//         return;
//     }

//     if (inputType === "radio") {
//         const selectedOption = document.querySelector(`input[name="task${taskIndex}_q${questionIndex}"]:checked`);
//         if (!selectedOption) {
//             feedback.innerHTML = `<i class="fas fa-exclamation-circle me-1 text-danger"></i>Please select an answer.`;
//             feedback.className = "text-danger fw-semibold mb-1";
//             return;
//         }
//         selected = [parseInt(selectedOption.value)];
//     } else {
//         const selectedBoxes = document.querySelectorAll(`input[name="task${taskIndex}_q${questionIndex}"]:checked`);
//         if (selectedBoxes.length === 0) {
//             feedback.innerHTML = `<i class="fas fa-exclamation-circle me-1 text-danger"></i>Please select at least one answer.`;
//             feedback.className = "text-danger fw-semibold mb-1";
//             return;
//         }
//         selected = Array.from(selectedBoxes).map(cb => parseInt(cb.value)).sort((a, b) => a - b);
//     }

//     const correct = Array.isArray(question.correctAnswer)
//         ? [...question.correctAnswer].sort((a, b) => a - b)
//         : [question.correctAnswer];

//     const isCorrect = selected.length === correct.length &&
//         selected.every((val, idx) => val === correct[idx]);

//     if (isCorrect) {
//         answeredCorrectly[taskIndex][questionIndex] = true;
//         feedback.innerHTML = `<i class="fas fa-check-circle me-1 text-success"></i>Correct answer.`;
//         feedback.className = "text-success fw-semibold mb-1";

//         document.querySelectorAll(`input[name="task${taskIndex}_q${questionIndex}"]`).forEach(input => input.disabled = true);

//         if (answeredCorrectly[taskIndex].every(val => val)) {
//             if (!taskCompletion[taskIndex]) {
//                 taskCompletion[taskIndex] = true;
//                 score += 10;
//                 currentStep++;
//                 document.getElementById(`taskStatus${taskIndex}`).textContent = "Completed";
//                 document.getElementById(`taskStatus${taskIndex}`).className = "badge bg-success";
//                 updateProgress();
//             }
//         }
//     } else {
//         if (currentDifficulty === "Hard") {
//             attemptsLeft[taskIndex][questionIndex] = 0;
//             document.querySelectorAll(`input[name="task${taskIndex}_q${questionIndex}"]`).forEach(input => input.disabled = true);
//             feedback.innerHTML = `<i class="fas fa-times-circle me-1 text-danger"></i>Wrong answer. No more attempts allowed in Hard mode.`;
//             feedback.className = "text-danger fw-semibold mb-1";
//         } else if (currentDifficulty === "Intermediate") {
//             attemptsLeft[taskIndex][questionIndex]--;
//             const rem = attemptsLeft[taskIndex][questionIndex];

//             if (rem > 0) {
//                 feedback.innerHTML = `<i class="fas fa-times-circle me-1 text-danger"></i>Wrong answer. You have ${rem} attempt${rem > 1 ? "s" : ""} left for Intermediate mode.`;
//                 feedback.className = "text-danger fw-semibold mb-1";
//             } else {
//                 document.querySelectorAll(`input[name="task${taskIndex}_q${questionIndex}"]`).forEach(input => input.disabled = true);
//                 feedback.innerHTML = `<i class="fas fa-times-circle me-1 text-danger"></i>Wrong answer. You've used all attempts allowed in Intermediate mode.`;
//                 feedback.className = "text-danger fw-semibold mb-1";
//             }
//         } else {
//             feedback.innerHTML = `<i class="fas fa-times-circle me-1 text-danger"></i>Wrong answer. Try again.`;
//             feedback.className = "text-danger fw-semibold mb-1";
//         }
//     }
// }


// function checkAnswer(taskIndex, questionIndex) {
//     const question = tasks[taskIndex].quiz[questionIndex];
//     const feedback = document.getElementById(`task${taskIndex}_q${questionIndex}_feedback`);
//     const inputType = Array.isArray(question.correctAnswer) ? "checkbox" : "radio";
//     let selected = [];

//     // Auto-assign attempts for Intermediate
//     if (currentDifficulty === "Intermediate" && !question.hasOwnProperty("__attemptsInit")) {
//         const numOptions = question.options.length;
//         const maxAttempts = Math.min(3, numOptions);
//         attemptsLeft[taskIndex][questionIndex] = maxAttempts;
//         question.__attemptsInit = true;
//     }

//     const remaining = attemptsLeft[taskIndex][questionIndex];

//     // HARD: block silently
//     if (currentDifficulty === "Hard" && remaining <= 0) return;

//     // INTERMEDIATE: block if attempts exhausted
//     if (currentDifficulty === "Intermediate" && remaining <= 0) {
//         feedback.innerHTML = `<i class="fas fa-ban me-1 text-danger"></i>Wrong answer. You've used all attempts allowed in Intermediate mode.`;
//         feedback.className = "text-danger fw-semibold mb-1";
//         return;
//     }

//     // Get selected input(s)
//     if (inputType === "radio") {
//         const selectedOption = document.querySelector(`input[name="task${taskIndex}_q${questionIndex}"]:checked`);
//         if (!selectedOption) {
//             feedback.innerHTML = `<i class="fas fa-exclamation-circle me-1 text-danger"></i>Please select an answer.`;
//             feedback.className = "text-danger fw-semibold mb-1";
//             return;
//         }
//         selected = [parseInt(selectedOption.value)];
//     } else {
//         const selectedBoxes = document.querySelectorAll(`input[name="task${taskIndex}_q${questionIndex}"]:checked`);
//         if (selectedBoxes.length === 0) {
//             feedback.innerHTML = `<i class="fas fa-exclamation-circle me-1 text-danger"></i>Please select at least one answer.`;
//             feedback.className = "text-danger fw-semibold mb-1";
//             return;
//         }
//         selected = Array.from(selectedBoxes).map(cb => parseInt(cb.value)).sort((a, b) => a - b);
//     }

//     const correct = Array.isArray(question.correctAnswer)
//         ? [...question.correctAnswer].sort((a, b) => a - b)
//         : [question.correctAnswer];

//     const isCorrect = selected.length === correct.length &&
//         selected.every((val, idx) => val === correct[idx]);

//     if (isCorrect) {
//         answeredCorrectly[taskIndex][questionIndex] = true;
//         feedback.innerHTML = `<i class="fas fa-check-circle me-1 text-success"></i>Correct answer.`;
//         feedback.className = "text-success fw-semibold mb-1";

//         document.querySelectorAll(`input[name="task${taskIndex}_q${questionIndex}"]`).forEach(input => input.disabled = true);

//         if (answeredCorrectly[taskIndex].every(val => val)) {
//             if (!taskCompletion[taskIndex]) {
//                 taskCompletion[taskIndex] = true;
//                 score += 10;
//                 currentStep++;
//                 document.getElementById(`taskStatus${taskIndex}`).textContent = "Completed";
//                 document.getElementById(`taskStatus${taskIndex}`).className = "badge bg-success";
//                 updateProgress();
//             }
//         }
//     } else {
//         if (currentDifficulty === "Hard") {
//             attemptsLeft[taskIndex][questionIndex] = 0;
//             document.querySelectorAll(`input[name="task${taskIndex}_q${questionIndex}"]`).forEach(input => input.disabled = true);
//             feedback.innerHTML = `<i class="fas fa-times-circle me-1 text-danger"></i>Wrong answer. No more attempts allowed in Hard mode.`;
//             feedback.className = "text-danger fw-semibold mb-1";

//             // Mark task as incomplete immediately
//             if (!taskCompletion[taskIndex]) {
//                 const badge = document.getElementById(`taskStatus${taskIndex}`);
//                 badge.textContent = "Incomplete";
//                 badge.className = "badge bg-danger";
//             }
//         } else if (currentDifficulty === "Intermediate") {
//             attemptsLeft[taskIndex][questionIndex]--;
//             const rem = attemptsLeft[taskIndex][questionIndex];

//             if (rem > 0) {
//                 feedback.innerHTML = `<i class="fas fa-times-circle me-1 text-danger"></i>Wrong answer. You have ${rem} attempt${rem > 1 ? "s" : ""} left for Intermediate mode.`;
//                 feedback.className = "text-danger fw-semibold mb-1";
//             } else {
//                 document.querySelectorAll(`input[name="task${taskIndex}_q${questionIndex}"]`).forEach(input => input.disabled = true);
//                 feedback.innerHTML = `<i class="fas fa-times-circle me-1 text-danger"></i>Wrong answer. You've used all attempts allowed in Intermediate mode.`;
//                 feedback.className = "text-danger fw-semibold mb-1";

//                 // Mark task as incomplete immediately
//                 if (!taskCompletion[taskIndex]) {
//                     const badge = document.getElementById(`taskStatus${taskIndex}`);
//                     badge.textContent = "Incomplete";
//                     badge.className = "badge bg-danger";
//                 }
//             }
//         } else {
//             feedback.innerHTML = `<i class="fas fa-times-circle me-1 text-danger"></i>Wrong answer. Try again.`;
//             feedback.className = "text-danger fw-semibold mb-1";
//         }
//     }
// }

// function checkAnswer(taskIndex, questionIndex) {
//     const question = tasks[taskIndex].quiz[questionIndex];
//     const feedback = document.getElementById(`task${taskIndex}_q${questionIndex}_feedback`);
//     const inputType = Array.isArray(question.correctAnswer) ? "checkbox" : "radio";
//     let selected = [];

//     // Auto-assign attempts for Intermediate
//     if (currentDifficulty === "Intermediate" && !question.hasOwnProperty("__attemptsInit")) {
//         const numOptions = question.options.length;
//         const maxAttempts = Math.min(3, numOptions);
//         attemptsLeft[taskIndex][questionIndex] = maxAttempts;
//         question.__attemptsInit = true;
//     }

//     const remaining = attemptsLeft[taskIndex][questionIndex];

//     // HARD: block silently
//     if (currentDifficulty === "Hard" && remaining <= 0) return;

//     // INTERMEDIATE: prevent duplicate message when attempts exhausted
//     if (currentDifficulty === "Intermediate" && remaining <= 0) {
//         if (!feedback.innerHTML.includes("used all attempts")) {
//             feedback.innerHTML = `<i class="fas fa-ban me-1 text-danger"></i>Wrong answer. You've used all attempts allowed in Intermediate mode.`;
//             feedback.className = "text-danger fw-semibold mb-1";
//         }
//         return;
//     }

//     // Get selected input(s)
//     if (inputType === "radio") {
//         const selectedOption = document.querySelector(`input[name="task${taskIndex}_q${questionIndex}"]:checked`);
//         if (!selectedOption) {
//             feedback.innerHTML = `<i class="fas fa-exclamation-circle me-1 text-danger"></i>Please select an answer.`;
//             feedback.className = "text-danger fw-semibold mb-1";
//             return;
//         }
//         selected = [parseInt(selectedOption.value)];
//     } else {
//         const selectedBoxes = document.querySelectorAll(`input[name="task${taskIndex}_q${questionIndex}"]:checked`);
//         if (selectedBoxes.length === 0) {
//             feedback.innerHTML = `<i class="fas fa-exclamation-circle me-1 text-danger"></i>Please select at least one answer.`;
//             feedback.className = "text-danger fw-semibold mb-1";
//             return;
//         }
//         selected = Array.from(selectedBoxes).map(cb => parseInt(cb.value)).sort((a, b) => a - b);
//     }

//     const correct = Array.isArray(question.correctAnswer)
//         ? [...question.correctAnswer].sort((a, b) => a - b)
//         : [question.correctAnswer];

//     const isCorrect = selected.length === correct.length &&
//         selected.every((val, idx) => val === correct[idx]);

//     if (isCorrect) {
//         answeredCorrectly[taskIndex][questionIndex] = true;
//         feedback.innerHTML = `<i class="fas fa-check-circle me-1 text-success"></i>Correct answer.`;
//         feedback.className = "text-success fw-semibold mb-1";

//         document.querySelectorAll(`input[name="task${taskIndex}_q${questionIndex}"]`).forEach(input => input.disabled = true);

//         if (answeredCorrectly[taskIndex].every(val => val)) {
//             if (!taskCompletion[taskIndex]) {
//                 taskCompletion[taskIndex] = true;
//                 score += 10;
//                 currentStep++;
//                 document.getElementById(`taskStatus${taskIndex}`).textContent = "Completed";
//                 document.getElementById(`taskStatus${taskIndex}`).className = "badge bg-success";
//                 updateProgress();
//             }
//         }
//     } else {
//         if (currentDifficulty === "Hard") {
//             attemptsLeft[taskIndex][questionIndex] = 0;
//             document.querySelectorAll(`input[name="task${taskIndex}_q${questionIndex}"]`).forEach(input => input.disabled = true);
//             if (!feedback.innerHTML.includes("Hard mode")) {
//                 feedback.innerHTML = `<i class="fas fa-times-circle me-1 text-danger"></i>Wrong answer. No more attempts allowed in Hard mode.`;
//                 feedback.className = "text-danger fw-semibold mb-1";
//             }
//             const badge = document.getElementById(`taskStatus${taskIndex}`);
//             if (!taskCompletion[taskIndex]) {
//                 badge.textContent = "Incomplete";
//                 badge.className = "badge bg-danger";
//             }
//         } else if (currentDifficulty === "Intermediate") {
//             attemptsLeft[taskIndex][questionIndex]--;
//             const rem = attemptsLeft[taskIndex][questionIndex];

//             if (rem > 0) {
//                 feedback.innerHTML = `<i class="fas fa-times-circle me-1 text-danger"></i>Wrong answer. You have ${rem} attempt${rem > 1 ? "s" : ""} left for Intermediate mode.`;
//                 feedback.className = "text-danger fw-semibold mb-1";
//             } else {
//                 document.querySelectorAll(`input[name="task${taskIndex}_q${questionIndex}"]`).forEach(input => input.disabled = true);
//                 feedback.innerHTML = `<i class="fas fa-times-circle me-1 text-danger"></i>Wrong answer. You've used all attempts allowed in Intermediate mode.`;
//                 feedback.className = "text-danger fw-semibold mb-1";

//                 const badge = document.getElementById(`taskStatus${taskIndex}`);
//                 if (!taskCompletion[taskIndex]) {
//                     badge.textContent = "Incomplete";
//                     badge.className = "badge bg-danger";
//                 }
//             }
//         } else {
//             feedback.innerHTML = `<i class="fas fa-times-circle me-1 text-danger"></i>Wrong answer. Try again.`;
//             feedback.className = "text-danger fw-semibold mb-1";
//         }
//     }
// }
// function checkAnswer(taskIndex, questionIndex) {
//     const question = tasks[taskIndex].quiz[questionIndex];
//     const feedback = document.getElementById(`task${taskIndex}_q${questionIndex}_feedback`);
//     const inputType = Array.isArray(question.correctAnswer) ? "checkbox" : "radio";
//     let selected = [];

//     // 🔁 Clear all existing red error messages first (only red ones)
//     document.querySelectorAll('[id$="_feedback"].text-danger').forEach(el => {
//         el.innerHTML = '';
//         el.className = 'small';
//     });

//     // Auto-assign attempts for Intermediate
//     if (currentDifficulty === "Intermediate" && !question.hasOwnProperty("__attemptsInit")) {
//         const numOptions = question.options.length;
//         const maxAttempts = Math.min(3, numOptions);
//         attemptsLeft[taskIndex][questionIndex] = maxAttempts;
//         question.__attemptsInit = true;
//     }

//     const remaining = attemptsLeft[taskIndex][questionIndex];

//     if (currentDifficulty === "Hard" && remaining <= 0) return;

//     if (currentDifficulty === "Intermediate" && remaining <= 0) {
//         feedback.innerHTML = `<i class="fas fa-ban me-1 text-danger"></i>Wrong answer. You've used all attempts allowed in Intermediate mode.`;
//         feedback.className = "text-danger fw-semibold mb-1";
//         return;
//     }

//     // Get selected input(s)
//     if (inputType === "radio") {
//         const selectedOption = document.querySelector(`input[name="task${taskIndex}_q${questionIndex}"]:checked`);
//         if (!selectedOption) {
//             feedback.innerHTML = `<i class="fas fa-exclamation-circle me-1 text-danger"></i>Please select an answer.`;
//             feedback.className = "text-danger fw-semibold mb-1";
//             return;
//         }
//         selected = [parseInt(selectedOption.value)];
//     } else {
//         const selectedBoxes = document.querySelectorAll(`input[name="task${taskIndex}_q${questionIndex}"]:checked`);
//         if (selectedBoxes.length === 0) {
//             feedback.innerHTML = `<i class="fas fa-exclamation-circle me-1 text-danger"></i>Please select at least one answer.`;
//             feedback.className = "text-danger fw-semibold mb-1";
//             return;
//         }
//         selected = Array.from(selectedBoxes).map(cb => parseInt(cb.value)).sort((a, b) => a - b);
//     }

//     const correct = Array.isArray(question.correctAnswer)
//         ? [...question.correctAnswer].sort((a, b) => a - b)
//         : [question.correctAnswer];

//     const isCorrect = selected.length === correct.length &&
//         selected.every((val, idx) => val === correct[idx]);

//     if (isCorrect) {
//         answeredCorrectly[taskIndex][questionIndex] = true;
//         feedback.innerHTML = `<i class="fas fa-check-circle me-1 text-success"></i>Correct answer.`;
//         feedback.className = "text-success fw-semibold mb-1";

//         document.querySelectorAll(`input[name="task${taskIndex}_q${questionIndex}"]`).forEach(input => input.disabled = true);

//         if (answeredCorrectly[taskIndex].every(val => val)) {
//             if (!taskCompletion[taskIndex]) {
//                 taskCompletion[taskIndex] = true;
//                 score += 10;
//                 currentStep++;
//                 document.getElementById(`taskStatus${taskIndex}`).textContent = "Completed";
//                 document.getElementById(`taskStatus${taskIndex}`).className = "badge bg-success";
//                 updateProgress();
//             }
//         }
//     } else {
//         if (currentDifficulty === "Hard") {
//             attemptsLeft[taskIndex][questionIndex] = 0;
//             document.querySelectorAll(`input[name="task${taskIndex}_q${questionIndex}"]`).forEach(input => input.disabled = true);
//             feedback.innerHTML = `<i class="fas fa-times-circle me-1 text-danger"></i>Wrong answer. No more attempts allowed in Hard mode.`;
//             feedback.className = "text-danger fw-semibold mb-1";

//             const badge = document.getElementById(`taskStatus${taskIndex}`);
//             if (!taskCompletion[taskIndex]) {
//                 badge.textContent = "Incomplete";
//                 badge.className = "badge bg-danger";
//             }
//         } else if (currentDifficulty === "Intermediate") {
//             attemptsLeft[taskIndex][questionIndex]--;
//             const rem = attemptsLeft[taskIndex][questionIndex];

//             if (rem > 0) {
//                 feedback.innerHTML = `<i class="fas fa-times-circle me-1 text-danger"></i>Wrong answer. You have ${rem} attempt${rem > 1 ? "s" : ""} left for Intermediate mode.`;
//                 feedback.className = "text-danger fw-semibold mb-1";
//             } else {
//                 document.querySelectorAll(`input[name="task${taskIndex}_q${questionIndex}"]`).forEach(input => input.disabled = true);
//                 feedback.innerHTML = `<i class="fas fa-times-circle me-1 text-danger"></i>Wrong answer. You've used all attempts allowed in Intermediate mode.`;
//                 feedback.className = "text-danger fw-semibold mb-1";

//                 const badge = document.getElementById(`taskStatus${taskIndex}`);
//                 if (!taskCompletion[taskIndex]) {
//                     badge.textContent = "Incomplete";
//                     badge.className = "badge bg-danger";
//                 }
//             }
//         } else {
//             feedback.innerHTML = `<i class="fas fa-times-circle me-1 text-danger"></i>Wrong answer. Try again.`;
//             feedback.className = "text-danger fw-semibold mb-1";
//         }
//     }
// }
// function checkAnswer(taskIndex, questionIndex) {
//     const question = tasks[taskIndex].quiz[questionIndex];
//     const feedback = document.getElementById(`task${taskIndex}_q${questionIndex}_feedback`);
//     const inputType = Array.isArray(question.correctAnswer) ? "checkbox" : "radio";
//     let selected = [];

//     // Clear red messages
//     document.querySelectorAll('[id$="_feedback"].text-danger').forEach(el => {
//         el.innerHTML = '';
//         el.className = 'small';
//     });

//     // Auto-assign attempts for Intermediate
//     if (currentDifficulty === "Intermediate" && !question.hasOwnProperty("__attemptsInit")) {
//         const numOptions = question.options.length;
//         const maxAttempts = Math.min(3, numOptions);
//         attemptsLeft[taskIndex][questionIndex] = maxAttempts;
//         question.__attemptsInit = true;
//     }

//     const remaining = attemptsLeft[taskIndex][questionIndex];

//     if (currentDifficulty === "Hard" && remaining <= 0) return;

//     if (currentDifficulty === "Intermediate" && remaining <= 0) {
//         feedback.innerHTML = `<i class="fas fa-ban me-1 text-danger"></i>Wrong answer. You've used all attempts allowed in Intermediate mode.`;
//         feedback.className = "text-danger fw-semibold mb-1";
//         return;
//     }

//     if (inputType === "radio") {
//         const selectedOption = document.querySelector(`input[name="task${taskIndex}_q${questionIndex}"]:checked`);
//         if (!selectedOption) {
//             feedback.innerHTML = `<i class="fas fa-exclamation-circle me-1 text-danger"></i>Please select an answer.`;
//             feedback.className = "text-danger fw-semibold mb-1";
//             return;
//         }
//         selected = [parseInt(selectedOption.value)];
//     } else {
//         const selectedBoxes = document.querySelectorAll(`input[name="task${taskIndex}_q${questionIndex}"]:checked`);
//         if (selectedBoxes.length === 0) {
//             feedback.innerHTML = `<i class="fas fa-exclamation-circle me-1 text-danger"></i>Please select at least one answer.`;
//             feedback.className = "text-danger fw-semibold mb-1";
//             return;
//         }
//         selected = Array.from(selectedBoxes).map(cb => parseInt(cb.value)).sort((a, b) => a - b);
//     }

//     const correct = Array.isArray(question.correctAnswer)
//         ? [...question.correctAnswer].sort((a, b) => a - b)
//         : [question.correctAnswer];

//     const isCorrect = selected.length === correct.length &&
//         selected.every((val, idx) => val === correct[idx]);

//     if (isCorrect) {
//         answeredCorrectly[taskIndex][questionIndex] = true;
//         feedback.innerHTML = `<i class="fas fa-check-circle me-1 text-success"></i>Correct answer.`;
//         feedback.className = "text-success fw-semibold mb-1";

//         // ✅ INCREMENT streak
//         answerStreak++;
//         document.getElementById("currentStreak").textContent = answerStreak;

//         document.querySelectorAll(`input[name="task${taskIndex}_q${questionIndex}"]`).forEach(input => input.disabled = true);

//         if (answeredCorrectly[taskIndex].every(val => val)) {
//             if (!taskCompletion[taskIndex]) {
//                 taskCompletion[taskIndex] = true;
//                 score += 10;
//                 currentStep++;
//                 document.getElementById(`taskStatus${taskIndex}`).textContent = "Completed";
//                 document.getElementById(`taskStatus${taskIndex}`).className = "badge bg-success";
//                 updateProgress();
//             }
//         }
//     } else {
//         // ✅ RESET streak on wrong
//         answerStreak = 0;
//         document.getElementById("currentStreak").textContent = answerStreak;

//         if (currentDifficulty === "Hard") {
//             attemptsLeft[taskIndex][questionIndex] = 0;
//             document.querySelectorAll(`input[name="task${taskIndex}_q${questionIndex}"]`).forEach(input => input.disabled = true);
//             feedback.innerHTML = `<i class="fas fa-times-circle me-1 text-danger"></i>Wrong answer. No more attempts allowed in Hard mode.`;
//             feedback.className = "text-danger fw-semibold mb-1";

//             const badge = document.getElementById(`taskStatus${taskIndex}`);
//             if (!taskCompletion[taskIndex]) {
//                 badge.textContent = "Incomplete";
//                 badge.className = "badge bg-danger";
//             }
//         } else if (currentDifficulty === "Intermediate") {
//             attemptsLeft[taskIndex][questionIndex]--;
//             const rem = attemptsLeft[taskIndex][questionIndex];

//             if (rem > 0) {
//                 feedback.innerHTML = `<i class="fas fa-times-circle me-1 text-danger"></i>Wrong answer. You have ${rem} attempt${rem > 1 ? "s" : ""} left for Intermediate mode.`;
//                 feedback.className = "text-danger fw-semibold mb-1";
//             } else {
//                 document.querySelectorAll(`input[name="task${taskIndex}_q${questionIndex}"]`).forEach(input => input.disabled = true);
//                 feedback.innerHTML = `<i class="fas fa-times-circle me-1 text-danger"></i>Wrong answer. You've used all attempts allowed in Intermediate mode.`;
//                 feedback.className = "text-danger fw-semibold mb-1";

//                 const badge = document.getElementById(`taskStatus${taskIndex}`);
//                 if (!taskCompletion[taskIndex]) {
//                     badge.textContent = "Incomplete";
//                     badge.className = "badge bg-danger";
//                 }
//             }
//         } else {
//             feedback.innerHTML = `<i class="fas fa-times-circle me-1 text-danger"></i>Wrong answer. Try again.`;
//             feedback.className = "text-danger fw-semibold mb-1";
//         }
//     }
// }

// function checkAnswer(taskIndex, questionIndex) {
//     const question = tasks[taskIndex].quiz[questionIndex];
//     const feedback = document.getElementById(`task${taskIndex}_q${questionIndex}_feedback`);
//     const inputType = Array.isArray(question.correctAnswer) ? "checkbox" : "radio";
//     let selected = [];

//     // Clear red messages
//     document.querySelectorAll('[id$="_feedback"].text-danger').forEach(el => {
//         el.innerHTML = '';
//         el.className = 'small';
//     });

//     // Auto-assign attempts for Intermediate
//     if (currentDifficulty === "Intermediate" && !question.hasOwnProperty("__attemptsInit")) {
//         const numOptions = question.options.length;
//         const maxAttempts = Math.min(3, numOptions);
//         attemptsLeft[taskIndex][questionIndex] = maxAttempts;
//         question.__attemptsInit = true;
//     }

//     const remaining = attemptsLeft[taskIndex][questionIndex];

//     if (currentDifficulty === "Hard" && remaining <= 0) return;
//     if (currentDifficulty === "Intermediate" && remaining <= 0) {
//         feedback.innerHTML = `<i class="fas fa-ban me-1 text-danger"></i>Wrong answer. You've used all attempts allowed in Intermediate mode.`;
//         feedback.className = "text-danger fw-semibold mb-1";
//         return;
//     }

//     if (inputType === "radio") {
//         const selectedOption = document.querySelector(`input[name="task${taskIndex}_q${questionIndex}"]:checked`);
//         if (!selectedOption) {
//             feedback.innerHTML = `<i class="fas fa-exclamation-circle me-1 text-danger"></i>Please select an answer.`;
//             feedback.className = "text-danger fw-semibold mb-1";
//             return;
//         }
//         selected = [parseInt(selectedOption.value)];
//     } else {
//         const selectedBoxes = document.querySelectorAll(`input[name="task${taskIndex}_q${questionIndex}"]:checked`);
//         if (selectedBoxes.length === 0) {
//             feedback.innerHTML = `<i class="fas fa-exclamation-circle me-1 text-danger"></i>Please select at least one answer.`;
//             feedback.className = "text-danger fw-semibold mb-1";
//             return;
//         }
//         selected = Array.from(selectedBoxes).map(cb => parseInt(cb.value)).sort((a, b) => a - b);
//     }

//     const correct = Array.isArray(question.correctAnswer)
//         ? [...question.correctAnswer].sort((a, b) => a - b)
//         : [question.correctAnswer];

//     const isCorrect = selected.length === correct.length &&
//         selected.every((val, idx) => val === correct[idx]);

//     if (isCorrect) {
//         answeredCorrectly[taskIndex][questionIndex] = true;
//         feedback.innerHTML = `<i class="fas fa-check-circle me-1 text-success"></i>Correct answer.`;
//         feedback.className = "text-success fw-semibold mb-1";

//         document.querySelectorAll(`input[name="task${taskIndex}_q${questionIndex}"]`).forEach(input => input.disabled = true);

//         // ✅ STREAK LOGIC
//         answerStreak++;
//         document.getElementById("currentStreak").textContent = answerStreak;

//         // ✅ Fire streak badge alert at milestones
//         const streakBadgeMap = {
//             3: { text: "🔥 Quick Thinker", alert: "💥 3-answer streak! You're getting sharp!" },
//             5: { text: "🚀 Sharp Streaker", alert: "🚀 5-answer streak! You're on fire!" },
//             7: { text: "⚡️ Ultimate streak Master", alert: "⚡️ 7-answer streak! Unstoppable!" }
//         };

//         if ([3, 5, 7].includes(answerStreak)) {
//             const streakBadge = streakBadgeMap[answerStreak];
//             const badgeDisplay = document.getElementById("badgesDisplay");

//             // Determine if any tier badge is already shown (🥉🥈🥇)
//             const tierBadgeMatch = badgeDisplay.innerHTML.match(/🥇|🥈|🥉/);
//             const tierBadge = tierBadgeMatch ? badgeDisplay.innerHTML.split("|")[0].trim() : "";

//             // Show only streak badge if no tier badge, otherwise keep tier badge only
//             if (tierBadge) {
//                 badgeDisplay.innerHTML = tierBadge;
//             } else {
//                 badgeDisplay.innerHTML = `
//                     <span class="badge rounded-pill bg-warning text-dark small">${streakBadge.text}</span>
//                 `;
//             }

//             showAlert(streakBadge.alert, "warning");
//         }

//         // ✅ Mark task complete if all questions correct
//         if (answeredCorrectly[taskIndex].every(val => val)) {
//             if (!taskCompletion[taskIndex]) {
//                 taskCompletion[taskIndex] = true;
//                 score += 10;
//                 currentStep++;
//                 document.getElementById(`taskStatus${taskIndex}`).textContent = "Completed";
//                 document.getElementById(`taskStatus${taskIndex}`).className = "badge bg-success";
//                 updateProgress();
//             }
//         }

//     } else {
//         answerStreak = 0;
//         document.getElementById("currentStreak").textContent = answerStreak;

//         if (currentDifficulty === "Hard") {
//             attemptsLeft[taskIndex][questionIndex] = 0;
//             document.querySelectorAll(`input[name="task${taskIndex}_q${questionIndex}"]`).forEach(input => input.disabled = true);
//             feedback.innerHTML = `<i class="fas fa-times-circle me-1 text-danger"></i>Wrong answer. No more attempts allowed in Hard mode.`;
//             feedback.className = "text-danger fw-semibold mb-1";

//             const badge = document.getElementById(`taskStatus${taskIndex}`);
//             if (!taskCompletion[taskIndex]) {
//                 badge.textContent = "Incomplete";
//                 badge.className = "badge bg-danger";
//             }
//         } else if (currentDifficulty === "Intermediate") {
//             attemptsLeft[taskIndex][questionIndex]--;
//             const rem = attemptsLeft[taskIndex][questionIndex];

//             if (rem > 0) {
//                 feedback.innerHTML = `<i class="fas fa-times-circle me-1 text-danger"></i>Wrong answer. You have ${rem} attempt${rem > 1 ? "s" : ""} left for Intermediate mode.`;
//                 feedback.className = "text-danger fw-semibold mb-1";
//             } else {
//                 document.querySelectorAll(`input[name="task${taskIndex}_q${questionIndex}"]`).forEach(input => input.disabled = true);
//                 feedback.innerHTML = `<i class="fas fa-times-circle me-1 text-danger"></i>Wrong answer. You've used all attempts allowed in Intermediate mode.`;
//                 feedback.className = "text-danger fw-semibold mb-1";

//                 const badge = document.getElementById(`taskStatus${taskIndex}`);
//                 if (!taskCompletion[taskIndex]) {
//                     badge.textContent = "Incomplete";
//                     badge.className = "badge bg-danger";
//                 }
//             }
//         } else {
//             feedback.innerHTML = `<i class="fas fa-times-circle me-1 text-danger"></i>Wrong answer. Try again.`;
//             feedback.className = "text-danger fw-semibold mb-1";
//         }
//     }
// }

// no badge just fire icon above one is badge
// function checkAnswer(taskIndex, questionIndex) {
//     const question = tasks[taskIndex].quiz[questionIndex];
//     const feedback = document.getElementById(`task${taskIndex}_q${questionIndex}_feedback`);
//     const inputType = Array.isArray(question.correctAnswer) ? "checkbox" : "radio";
//     let selected = [];

//     // Clear previous error feedback
//     document.querySelectorAll('[id$="_feedback"].text-danger').forEach(el => {
//         el.innerHTML = '';
//         el.className = 'small';
//     });

//     // Auto-assign attempts for Intermediate
//     if (currentDifficulty === "Intermediate" && !question.hasOwnProperty("__attemptsInit")) {
//         const numOptions = question.options.length;
//         const maxAttempts = Math.min(3, numOptions);
//         attemptsLeft[taskIndex][questionIndex] = maxAttempts;
//         question.__attemptsInit = true;
//     }

//     const remaining = attemptsLeft[taskIndex][questionIndex];

//     if (currentDifficulty === "Hard" && remaining <= 0) return;
//     if (currentDifficulty === "Intermediate" && remaining <= 0) {
//         feedback.innerHTML = `<i class="fas fa-ban me-1 text-danger"></i>Wrong answer. You've used all attempts allowed in Intermediate mode.`;
//         feedback.className = "text-danger fw-semibold mb-1";
//         return;
//     }

//     if (inputType === "radio") {
//         const selectedOption = document.querySelector(`input[name="task${taskIndex}_q${questionIndex}"]:checked`);
//         if (!selectedOption) {
//             feedback.innerHTML = `<i class="fas fa-exclamation-circle me-1 text-danger"></i>Please select an answer.`;
//             feedback.className = "text-danger fw-semibold mb-1";
//             return;
//         }
//         selected = [parseInt(selectedOption.value)];
//     } else {
//         const selectedBoxes = document.querySelectorAll(`input[name="task${taskIndex}_q${questionIndex}"]:checked`);
//         if (selectedBoxes.length === 0) {
//             feedback.innerHTML = `<i class="fas fa-exclamation-circle me-1 text-danger"></i>Please select at least one answer.`;
//             feedback.className = "text-danger fw-semibold mb-1";
//             return;
//         }
//         selected = Array.from(selectedBoxes).map(cb => parseInt(cb.value)).sort((a, b) => a - b);
//     }

//     const correct = Array.isArray(question.correctAnswer)
//         ? [...question.correctAnswer].sort((a, b) => a - b)
//         : [question.correctAnswer];

//     const isCorrect = selected.length === correct.length &&
//         selected.every((val, idx) => val === correct[idx]);

//     if (isCorrect) {
//         answeredCorrectly[taskIndex][questionIndex] = true;
//         feedback.innerHTML = `<i class="fas fa-check-circle me-1 text-success"></i>Correct answer.`;
//         feedback.className = "text-success fw-semibold mb-1";

//         document.querySelectorAll(`input[name="task${taskIndex}_q${questionIndex}"]`).forEach(input => input.disabled = true);

//         // ✅ Update streak
//         answerStreak++;
//         const flameIcons = "🔥".repeat(answerStreak > 10 ? 10 : answerStreak); // max 10 flames
//         document.getElementById("currentStreak").innerHTML = `${answerStreak} ${flameIcons}`;

//         // ✅ Complete task if all questions are correct
//         if (answeredCorrectly[taskIndex].every(val => val)) {
//             if (!taskCompletion[taskIndex]) {
//                 taskCompletion[taskIndex] = true;
//                 score += 10;
//                 currentStep++;
//                 document.getElementById(`taskStatus${taskIndex}`).textContent = "Completed";
//                 document.getElementById(`taskStatus${taskIndex}`).className = "badge bg-success";
//                 updateProgress();
//             }
//         }

//     } else {
//         // ❌ Reset streak
//         answerStreak = 0;
//         document.getElementById("currentStreak").innerHTML = "0";

//         if (currentDifficulty === "Hard") {
//             attemptsLeft[taskIndex][questionIndex] = 0;
//             document.querySelectorAll(`input[name="task${taskIndex}_q${questionIndex}"]`).forEach(input => input.disabled = true);
//             feedback.innerHTML = `<i class="fas fa-times-circle me-1 text-danger"></i>Wrong answer. No more attempts allowed in Hard mode.`;
//             feedback.className = "text-danger fw-semibold mb-1";

//             const badge = document.getElementById(`taskStatus${taskIndex}`);
//             if (!taskCompletion[taskIndex]) {
//                 badge.textContent = "Incomplete";
//                 badge.className = "badge bg-danger";
//             }
//         } else if (currentDifficulty === "Intermediate") {
//             attemptsLeft[taskIndex][questionIndex]--;
//             const rem = attemptsLeft[taskIndex][questionIndex];

//             if (rem > 0) {
//                 feedback.innerHTML = `<i class="fas fa-times-circle me-1 text-danger"></i>Wrong answer. You have ${rem} attempt${rem > 1 ? "s" : ""} left for Intermediate mode.`;
//                 feedback.className = "text-danger fw-semibold mb-1";
//             } else {
//                 document.querySelectorAll(`input[name="task${taskIndex}_q${questionIndex}"]`).forEach(input => input.disabled = true);
//                 feedback.innerHTML = `<i class="fas fa-times-circle me-1 text-danger"></i>Wrong answer. You've used all attempts allowed in Intermediate mode.`;
//                 feedback.className = "text-danger fw-semibold mb-1";

//                 const badge = document.getElementById(`taskStatus${taskIndex}`);
//                 if (!taskCompletion[taskIndex]) {
//                     badge.textContent = "Incomplete";
//                     badge.className = "badge bg-danger";
//                 }
//             }
//         } else {
//             feedback.innerHTML = `<i class="fas fa-times-circle me-1 text-danger"></i>Wrong answer. Try again.`;
//             feedback.className = "text-danger fw-semibold mb-1";
//         }
//     }
// }

function checkAnswer(taskIndex, questionIndex) {
    const question = tasks[taskIndex].quiz[questionIndex];
    const feedback = document.getElementById(`task${taskIndex}_q${questionIndex}_feedback`);
    const inputType = Array.isArray(question.correctAnswer) ? "checkbox" : "radio";
    let selected = [];

    // Clear previous error feedback
    document.querySelectorAll('[id$="_feedback"].text-danger').forEach(el => {
        el.innerHTML = '';
        el.className = 'small';
    });

    // Auto-assign attempts for Intermediate
    if (currentDifficulty === "Intermediate" && !question.hasOwnProperty("__attemptsInit")) {
        const numOptions = question.options.length;
        const maxAttempts = Math.min(3, numOptions);
        attemptsLeft[taskIndex][questionIndex] = maxAttempts;
        question.__attemptsInit = true;
    }

    const remaining = attemptsLeft[taskIndex][questionIndex];

    if (currentDifficulty === "Hard" && remaining <= 0) return;
    if (currentDifficulty === "Intermediate" && remaining <= 0) {
        feedback.innerHTML = `<i class="fas fa-ban me-1 text-danger"></i>Wrong answer. You've used all attempts allowed in Intermediate mode.`;
        feedback.className = "text-danger fw-semibold mb-1";
        return;
    }

    if (inputType === "radio") {
        const selectedOption = document.querySelector(`input[name="task${taskIndex}_q${questionIndex}"]:checked`);
        if (!selectedOption) {
            feedback.innerHTML = `<i class="fas fa-exclamation-circle me-1 text-danger"></i>Please select an answer.`;
            feedback.className = "text-danger fw-semibold mb-1";
            return;
        }
        selected = [parseInt(selectedOption.value)];
    } else {
        const selectedBoxes = document.querySelectorAll(`input[name="task${taskIndex}_q${questionIndex}"]:checked`);
        if (selectedBoxes.length === 0) {
            feedback.innerHTML = `<i class="fas fa-exclamation-circle me-1 text-danger"></i>Please select at least one answer.`;
            feedback.className = "text-danger fw-semibold mb-1";
            return;
        }
        selected = Array.from(selectedBoxes).map(cb => parseInt(cb.value)).sort((a, b) => a - b);
    }

    const correct = Array.isArray(question.correctAnswer)
        ? [...question.correctAnswer].sort((a, b) => a - b)
        : [question.correctAnswer];

    const isCorrect = selected.length === correct.length &&
        selected.every((val, idx) => val === correct[idx]);

    if (isCorrect) {
        answeredCorrectly[taskIndex][questionIndex] = true;
        feedback.innerHTML = `<i class="fas fa-check-circle me-1 text-success"></i>Correct answer.`;
        feedback.className = "text-success fw-semibold mb-1";

        document.querySelectorAll(`input[name="task${taskIndex}_q${questionIndex}"]`).forEach(input => input.disabled = true);

        // ✅ Update streak
        answerStreak++;
        const flameIcons = "🔥".repeat(answerStreak > 10 ? 10 : answerStreak); // max 10 flames
        // document.getElementById("currentStreak").innerHTML = `${answerStreak} ${flameIcons}`;
        const cappedStreak = answerStreak > 10 ? "10+" : answerStreak;
        const cappedFlames = "🔥".repeat(Math.min(answerStreak, 10));
        document.getElementById("currentStreak").innerHTML = `${cappedStreak} ${cappedFlames}`;


        // ✅ Show motivational streak alerts only
        const milestoneAlerts = {
            3: "🔥 You're on a 3-answer streak! Keep it going!",
            5: "🚀 5-answer streak! Incredible focus!",
            7: "⚡ 7 in a row! You're a streak master!",
            10: "🏆 10-answer streak! Legendary accuracy!"
        };

        if (milestoneAlerts[answerStreak]) {
            showAlert(milestoneAlerts[answerStreak], "info");
        }

        // ✅ Complete task if all questions are correct
        if (answeredCorrectly[taskIndex].every(val => val)) {
            if (!taskCompletion[taskIndex]) {
                taskCompletion[taskIndex] = true;
                score += 10;
                currentStep++;
                document.getElementById(`taskStatus${taskIndex}`).textContent = "Completed";
                document.getElementById(`taskStatus${taskIndex}`).className = "badge bg-success";
                updateProgress();
            }
        }

    } else {
        // ❌ Reset streak
        answerStreak = 0;
        document.getElementById("currentStreak").innerHTML = "0";

        if (currentDifficulty === "Hard") {
            attemptsLeft[taskIndex][questionIndex] = 0;
            document.querySelectorAll(`input[name="task${taskIndex}_q${questionIndex}"]`).forEach(input => input.disabled = true);
            feedback.innerHTML = `<i class="fas fa-times-circle me-1 text-danger"></i>Wrong answer. No more attempts allowed in Hard mode.`;
            feedback.className = "text-danger fw-semibold mb-1";

            const badge = document.getElementById(`taskStatus${taskIndex}`);
            if (!taskCompletion[taskIndex]) {
                badge.textContent = "Incomplete";
                badge.className = "badge bg-danger";
            }
        } else if (currentDifficulty === "Intermediate") {
            attemptsLeft[taskIndex][questionIndex]--;
            const rem = attemptsLeft[taskIndex][questionIndex];

            if (rem > 0) {
                feedback.innerHTML = `<i class="fas fa-times-circle me-1 text-danger"></i>Wrong answer. You have ${rem} attempt${rem > 1 ? "s" : ""} left for Intermediate mode.`;
                feedback.className = "text-danger fw-semibold mb-1";
            } else {
                document.querySelectorAll(`input[name="task${taskIndex}_q${questionIndex}"]`).forEach(input => input.disabled = true);
                feedback.innerHTML = `<i class="fas fa-times-circle me-1 text-danger"></i>Wrong answer. You've used all attempts allowed in Intermediate mode.`;
                feedback.className = "text-danger fw-semibold mb-1";

                const badge = document.getElementById(`taskStatus${taskIndex}`);
                if (!taskCompletion[taskIndex]) {
                    badge.textContent = "Incomplete";
                    badge.className = "badge bg-danger";
                }
            }
        } else {
            feedback.innerHTML = `<i class="fas fa-times-circle me-1 text-danger"></i>Wrong answer. Try again.`;
            feedback.className = "text-danger fw-semibold mb-1";
        }
    }
}



// function showHint(taskIndex, questionIndex, buttonEl) {
//     const feedback = document.getElementById(`task${taskIndex}_q${questionIndex}_feedback`);
//     const hintText = tasks[taskIndex].quiz[questionIndex].hint;

//     if (currentDifficulty === "Easy") {
//         feedback.innerHTML = `<i class="fas fa-lightbulb me-1 text-info"></i>${hintText}`;
//         feedback.className = "text-info fw-semibold mb-1";
//         return;
//     }

//     if (currentDifficulty === "Intermediate") {
//         // Prevent recounting if already shown for this question
//         const wasHintShown = feedback.getAttribute("data-hint-shown") === "true";
//         if (wasHintShown) return;

//         if (usedHints >= maxHintsAllowed) {
//             // Reached max limit: block hint
//             buttonEl.disabled = true;
//             buttonEl.classList.add("disabled", "btn-outline-secondary");
//             buttonEl.classList.remove("btn-outline-info");

//             const tooltipInstance = bootstrap.Tooltip.getOrCreateInstance(buttonEl.parentElement);
//             tooltipInstance.setContent({
//                 '.tooltip-inner': "Hint limit reached for Intermediate difficulty."
//             });
//             tooltipInstance.show();
//             return;
//         }

//         // ✅ Show hint and increment only once per question
//         feedback.innerHTML = `<i class="fas fa-lightbulb me-1 text-info"></i>${hintText}`;
//         feedback.className = "text-info fw-semibold mb-1";
//         feedback.setAttribute("data-hint-shown", "true");

//         usedHints++;
//         document.getElementById("usedHintCount").textContent = usedHints;

//         if (usedHints >= maxHintsAllowed) {
//             // Disable remaining buttons
//             document.querySelectorAll(".hint-btn").forEach(btn => {
//                 if (!btn.disabled && !btn.closest(".disabled")) {
//                     btn.disabled = true;
//                     btn.classList.add("disabled", "btn-outline-secondary");
//                     btn.classList.remove("btn-outline-info");

//                     const tooltipParent = btn.parentElement;
//                     const tooltipInstance = bootstrap.Tooltip.getOrCreateInstance(tooltipParent);
//                     tooltipInstance.setContent({
//                         '.tooltip-inner': "Hint limit reached for Intermediate difficulty."
//                     });
//                 }
//             });
//         }
//     }
// }
// function showHint(taskIndex, questionIndex, buttonEl) {
//     const feedback = document.getElementById(`task${taskIndex}_q${questionIndex}_feedback`);
//     const hintText = tasks[taskIndex].quiz[questionIndex].hint;

//     // ✅ Block hint if already answered correctly
//     if (answeredCorrectly[taskIndex][questionIndex]) {
//         buttonEl.disabled = true;
//         buttonEl.classList.add("disabled", "btn-outline-secondary");
//         buttonEl.classList.remove("btn-outline-info");

//         const tooltipInstance = bootstrap.Tooltip.getOrCreateInstance(buttonEl.parentElement);
//         tooltipInstance.setContent({
//             '.tooltip-inner': "Hint unavailable – question already answered correctly."
//         });
//         tooltipInstance.show();
//         return;
//     }

//     if (currentDifficulty === "Easy") {
//         feedback.innerHTML = `<i class="fas fa-lightbulb me-1 text-info"></i>${hintText}`;
//         feedback.className = "text-info fw-semibold mb-1";
//         return;
//     }

//     if (currentDifficulty === "Intermediate") {
//         const wasHintShown = feedback.getAttribute("data-hint-shown") === "true";
//         if (wasHintShown) return;

//         if (usedHints >= maxHintsAllowed) {
//             buttonEl.disabled = true;
//             buttonEl.classList.add("disabled", "btn-outline-secondary");
//             buttonEl.classList.remove("btn-outline-info");

//             const tooltipInstance = bootstrap.Tooltip.getOrCreateInstance(buttonEl.parentElement);
//             tooltipInstance.setContent({
//                 '.tooltip-inner': "Hint limit reached for Intermediate difficulty."
//             });
//             tooltipInstance.show();
//             return;
//         }

//         feedback.innerHTML = `<i class="fas fa-lightbulb me-1 text-info"></i>${hintText}`;
//         feedback.className = "text-info fw-semibold mb-1";
//         feedback.setAttribute("data-hint-shown", "true");

//         usedHints++;
//         document.getElementById("usedHintCount").textContent = usedHints;

//         if (usedHints >= maxHintsAllowed) {
//             document.querySelectorAll(".hint-btn").forEach(btn => {
//                 if (!btn.disabled && !btn.closest(".disabled")) {
//                     btn.disabled = true;
//                     btn.classList.add("disabled", "btn-outline-secondary");
//                     btn.classList.remove("btn-outline-info");

//                     const tooltipParent = btn.parentElement;
//                     const tooltipInstance = bootstrap.Tooltip.getOrCreateInstance(tooltipParent);
//                     tooltipInstance.setContent({
//                         '.tooltip-inner': "Hint limit reached for Intermediate difficulty."
//                     });
//                 }
//             });
//         }
//     }
// }

// function showHint(taskIndex, questionIndex, buttonEl) {
//     const feedback = document.getElementById(`task${taskIndex}_q${questionIndex}_feedback`);
//     const hintText = tasks[taskIndex].quiz[questionIndex].hint;

//     // ✅ Disable if already answered correctly
//     if (answeredCorrectly[taskIndex][questionIndex]) {
//         buttonEl.disabled = true;
//         buttonEl.classList.add("disabled", "btn-outline-secondary");
//         buttonEl.classList.remove("btn-outline-info");

//         const tooltipInstance = bootstrap.Tooltip.getOrCreateInstance(buttonEl.parentElement);
//         tooltipInstance.setContent({
//             '.tooltip-inner': "Hint unavailable – question already answered correctly."
//         });
//         tooltipInstance.show();
//         return;
//     }

//     // ✅ Disable if no more attempts allowed (Intermediate mode)
//     if (currentDifficulty === "Intermediate" && attemptsLeft[taskIndex][questionIndex] === 0) {
//         buttonEl.disabled = true;
//         buttonEl.classList.add("disabled", "btn-outline-secondary");
//         buttonEl.classList.remove("btn-outline-info");

//         const tooltipInstance = bootstrap.Tooltip.getOrCreateInstance(buttonEl.parentElement);
//         tooltipInstance.setContent({
//             '.tooltip-inner': "Hint unavailable – all answer attempts are used."
//         });
//         tooltipInstance.show();
//         return;
//     }

//     // ✅ Disable for Hard mode after incorrect attempt
//     if (currentDifficulty === "Hard" && attemptsLeft[taskIndex][questionIndex] === 0) {
//         buttonEl.disabled = true;
//         buttonEl.classList.add("disabled", "btn-outline-secondary");
//         buttonEl.classList.remove("btn-outline-info");

//         const tooltipInstance = bootstrap.Tooltip.getOrCreateInstance(buttonEl.parentElement);
//         tooltipInstance.setContent({
//             '.tooltip-inner': "Hint unavailable – question is locked after first wrong answer in Hard mode."
//         });
//         tooltipInstance.show();
//         return;
//     }

//     // ✅ Easy mode: unlimited hints
//     if (currentDifficulty === "Easy") {
//         feedback.innerHTML = `<i class="fas fa-lightbulb me-1 text-info"></i>${hintText}`;
//         feedback.className = "text-info fw-semibold mb-1";
//         return;
//     }

//     // ✅ Intermediate: enforce limit + prevent duplicate count
//     if (currentDifficulty === "Intermediate") {
//         const wasHintShown = feedback.getAttribute("data-hint-shown") === "true";
//         if (wasHintShown) return;

//         if (usedHints >= maxHintsAllowed) {
//             buttonEl.disabled = true;
//             buttonEl.classList.add("disabled", "btn-outline-secondary");
//             buttonEl.classList.remove("btn-outline-info");

//             const tooltipInstance = bootstrap.Tooltip.getOrCreateInstance(buttonEl.parentElement);
//             tooltipInstance.setContent({
//                 '.tooltip-inner': "Hint limit reached for Intermediate difficulty."
//             });
//             tooltipInstance.show();
//             return;
//         }

//         feedback.innerHTML = `<i class="fas fa-lightbulb me-1 text-info"></i>${hintText}`;
//         feedback.className = "text-info fw-semibold mb-1";
//         feedback.setAttribute("data-hint-shown", "true");

//         usedHints++;
//         document.getElementById("usedHintCount").textContent = usedHints;

//         // Disable all remaining hint buttons if limit now reached
//         if (usedHints >= maxHintsAllowed) {
//             document.querySelectorAll(".hint-btn").forEach(btn => {
//                 if (!btn.disabled && !btn.closest(".disabled")) {
//                     btn.disabled = true;
//                     btn.classList.add("disabled", "btn-outline-secondary");
//                     btn.classList.remove("btn-outline-info");

//                     const tooltipParent = btn.parentElement;
//                     const tooltipInstance = bootstrap.Tooltip.getOrCreateInstance(tooltipParent);
//                     tooltipInstance.setContent({
//                         '.tooltip-inner': "Hint limit reached for Intermediate difficulty."
//                     });
//                 }
//             });
//         }
//     }
// }

function showHint(taskIndex, questionIndex, buttonEl) {
    const feedback = document.getElementById(`task${taskIndex}_q${questionIndex}_feedback`);
    const hintText = tasks[taskIndex].quiz[questionIndex].hint;

    // ✅ Always disable if already answered correctly
    if (answeredCorrectly[taskIndex][questionIndex]) {
        buttonEl.disabled = true;
        buttonEl.classList.add("disabled", "btn-outline-secondary");
        buttonEl.classList.remove("btn-outline-info");

        const tooltipInstance = bootstrap.Tooltip.getOrCreateInstance(buttonEl.parentElement);
        tooltipInstance.setContent({
            '.tooltip-inner': "Hint unavailable – question already answered correctly."
        });
        tooltipInstance.show();
        return;
    }

    // ✅ Block hint if question is no longer answerable
    if (currentDifficulty === "Intermediate" && attemptsLeft[taskIndex][questionIndex] === 0) {
        buttonEl.disabled = true;
        buttonEl.classList.add("disabled", "btn-outline-secondary");
        buttonEl.classList.remove("btn-outline-info");

        const tooltipInstance = bootstrap.Tooltip.getOrCreateInstance(buttonEl.parentElement);
        tooltipInstance.setContent({
            '.tooltip-inner': "Hint unavailable – all answer attempts are used."
        });
        tooltipInstance.show();
        return;
    }

    if (currentDifficulty === "Hard" && attemptsLeft[taskIndex][questionIndex] === 0) {
        buttonEl.disabled = true;
        buttonEl.classList.add("disabled", "btn-outline-secondary");
        buttonEl.classList.remove("btn-outline-info");

        const tooltipInstance = bootstrap.Tooltip.getOrCreateInstance(buttonEl.parentElement);
        tooltipInstance.setContent({
            '.tooltip-inner': "Hint unavailable – question is locked after first wrong answer in Hard mode."
        });
        tooltipInstance.show();
        return;
    }

    // ✅ Easy mode – always show hint freely
    if (currentDifficulty === "Easy") {
        feedback.innerHTML = `<i class="fas fa-lightbulb me-1 text-info"></i>${hintText}`;
        feedback.className = "text-info fw-semibold mb-1";
        return;
    }

    // ✅ Intermediate mode
    if (currentDifficulty === "Intermediate") {
        const wasHintShown = feedback.getAttribute("data-hint-shown") === "true";

        // ✅ If already shown before, allow reuse without using limit
        if (wasHintShown) {
            feedback.innerHTML = `<i class="fas fa-lightbulb me-1 text-info"></i>${hintText}`;
            feedback.className = "text-info fw-semibold mb-1";
            return;
        }

        // ✅ If max reached, block new hint
        if (usedHints >= maxHintsAllowed) {
            buttonEl.disabled = true;
            buttonEl.classList.add("disabled", "btn-outline-secondary");
            buttonEl.classList.remove("btn-outline-info");

            const tooltipInstance = bootstrap.Tooltip.getOrCreateInstance(buttonEl.parentElement);
            tooltipInstance.setContent({
                '.tooltip-inner': "Hint limit reached for Intermediate difficulty."
            });
            tooltipInstance.show();
            return;
        }

        // ✅ First-time hint usage
        feedback.innerHTML = `<i class="fas fa-lightbulb me-1 text-info"></i>${hintText}`;
        feedback.className = "text-info fw-semibold mb-1";
        feedback.setAttribute("data-hint-shown", "true");

        usedHints++;
        document.getElementById("usedHintCount").textContent = usedHints;

        if (usedHints >= maxHintsAllowed) {
            document.querySelectorAll(".hint-btn").forEach(btn => {
                if (!btn.disabled && !btn.closest(".disabled")) {
                    btn.disabled = true;
                    btn.classList.add("disabled", "btn-outline-secondary");
                    btn.classList.remove("btn-outline-info");

                    const tooltipParent = btn.parentElement;
                    const tooltipInstance = bootstrap.Tooltip.getOrCreateInstance(tooltipParent);
                    tooltipInstance.setContent({
                        '.tooltip-inner': "Hint limit reached for Intermediate difficulty."
                    });
                }
            });
        }
    }
}



// ===========================
// Toggle Task Accordion
// ===========================



// function toggleTask(i) {
//     const currentBody = document.getElementById(`taskBody${i}`);
//     const currentStatus = document.getElementById(`taskStatus${i}`);
//     const isOpen = currentBody.classList.contains("show");

//     // Close all other tasks
//     document.querySelectorAll("[id^=taskBody]").forEach((el, index) => {
//         if (index !== i) el.classList.remove("show");
//     });

//     // Update all other statuses (not completed)
//     document.querySelectorAll("[id^=taskStatus]").forEach((badge, index) => {
//         if (index !== i && !taskCompletion[index]) {
//             const wasAttempted = attemptsLeft[index].some((left, qIdx) => {
//                 const total = tasks[index].quiz[qIdx].attemptsAllowed;
//                 return left < total;
//             });

//             if (!wasAttempted) {
//                 badge.textContent = "Pending";
//                 badge.className = "badge bg-secondary";
//             } else {
//                 badge.textContent = "Incomplete";
//                 badge.className = "badge bg-danger";
//             }
//         }
//     });

//     // Toggle current task
//     currentBody.classList.toggle("show");

//     // Update current task status if not completed
//     if (!isCompleted(i)) {
//         const wasAttempted = attemptsLeft[i].some((left, qIdx) => {
//             const total = tasks[i].quiz[qIdx].attemptsAllowed;
//             return left < total;
//         });

//         // ✅ Maintain "Incomplete" if attempted but not fully correct
//         if (!wasAttempted) {
//             currentStatus.textContent = currentBody.classList.contains("show") ? "In Progress" : "Pending";
//             currentStatus.className = currentBody.classList.contains("show")
//                 ? "badge bg-info"
//                 : "badge bg-secondary";
//         } else {
//             currentStatus.textContent = "Incomplete";
//             currentStatus.className = "badge bg-danger";
//         }
//     }
// }
// function toggleTask(i) {
//     const currentBody = document.getElementById(`taskBody${i}`);
//     const currentStatus = document.getElementById(`taskStatus${i}`);
//     const isOpen = currentBody.classList.contains("show");

//     // Close all other tasks
//     document.querySelectorAll("[id^=taskBody]").forEach((el, index) => {
//         if (index !== i) el.classList.remove("show");
//     });

//     // Update all other statuses (not completed)
//     document.querySelectorAll("[id^=taskStatus]").forEach((badge, index) => {
//         if (index !== i && !taskCompletion[index]) {
//             const exhausted = attemptsLeft[index].some((left) => left === 0);
//             const attempted = attemptsLeft[index].some((left, qIdx) => {
//                 const total = tasks[index].quiz[qIdx].attemptsAllowed;
//                 return left < total;
//             });

//             if (exhausted) {
//                 badge.textContent = "Incomplete";
//                 badge.className = "badge bg-danger";
//             } else if (attempted) {
//                 badge.textContent = "Incomplete";
//                 badge.className = "badge bg-danger";
//             } else {
//                 badge.textContent = "Pending";
//                 badge.className = "badge bg-secondary";
//             }
//         }
//     });

//     // Toggle current task open/close
//     currentBody.classList.toggle("show");

//     // Update status badge of current task if not completed
//     if (!taskCompletion[i]) {
//         const exhausted = attemptsLeft[i].some((left) => left === 0);
//         const attempted = attemptsLeft[i].some((left, qIdx) => {
//             const total = tasks[i].quiz[qIdx].attemptsAllowed;
//             return left < total;
//         });

//         if (exhausted || attempted) {
//             currentStatus.textContent = "Incomplete";
//             currentStatus.className = "badge bg-danger";
//         } else {
//             currentStatus.textContent = currentBody.classList.contains("show") ? "In Progress" : "Pending";
//             currentStatus.className = currentBody.classList.contains("show")
//                 ? "badge bg-info"
//                 : "badge bg-secondary";
//         }
//     }
// }

function toggleTask(i) {
    const currentBody = document.getElementById(`taskBody${i}`);
    const currentStatus = document.getElementById(`taskStatus${i}`);
    const isOpen = currentBody.classList.contains("show");

    // Close all other tasks
    document.querySelectorAll("[id^=taskBody]").forEach((el, index) => {
        if (index !== i) el.classList.remove("show");
    });

    // Update all other statuses (not completed)
    document.querySelectorAll("[id^=taskStatus]").forEach((badge, index) => {
        if (index !== i && !taskCompletion[index]) {
            const exhausted = attemptsLeft[index].some((left) => left === 0);
            const attempted = attemptsLeft[index].some((left, qIdx) => {
                const total = tasks[index].quiz[qIdx].attemptsAllowed;
                return left < total;
            });

            const hasSelected = Array.from(document.querySelectorAll(`input[name^=task${index}_]`)).some(input => input.checked); // ✅ NEW

            if (exhausted || attempted) {
                badge.textContent = "Incomplete";
                badge.className = "badge bg-danger";
            } else if (hasSelected) { // ✅ NEW
                badge.textContent = "In Progress"; // ✅ NEW
                badge.className = "badge bg-info"; // ✅ NEW
            } else {
                badge.textContent = "Pending";
                badge.className = "badge bg-secondary";
            }
        }
    });

    // Toggle current task open/close
    currentBody.classList.toggle("show");

    // Update status badge of current task if not completed
    if (!taskCompletion[i]) {
        const exhausted = attemptsLeft[i].some((left) => left === 0);
        const attempted = attemptsLeft[i].some((left, qIdx) => {
            const total = tasks[i].quiz[qIdx].attemptsAllowed;
            return left < total;
        });

        const hasSelected = Array.from(document.querySelectorAll(`input[name^=task${i}_]`)).some(input => input.checked); // ✅ NEW

        if (exhausted || attempted) {
            currentStatus.textContent = "Incomplete";
            currentStatus.className = "badge bg-danger";
        } else if (hasSelected || currentBody.classList.contains("show")) { // ✅ MODIFIED
            currentStatus.textContent = "In Progress";
            currentStatus.className = "badge bg-info";
        } else {
            currentStatus.textContent = "Pending";
            currentStatus.className = "badge bg-secondary";
        }
    }
}



// function isCompleted(i) {
//     const btn = document.querySelector(`#taskBody${i} .btn-success`);
//     return btn.disabled;
// }
function isCompleted(i) {
    return taskCompletion[i] === true;
}


// ===========================
// Mark Task as Complete
// ===========================
function completeTask(i) {
    const btn = document.querySelector(`#taskBody${i} .btn-success`);
    const status = document.getElementById(`taskStatus${i}`);

    if (!btn.disabled) {
        btn.disabled = true;
        score += 10;
        currentStep++;
        updateProgress();

        status.textContent = "Completed";
        status.className = "badge bg-success";
    }
}

// ===========================
// Update Progress Bar
// ===========================

// function updateProgress() {
//     const percent = (currentStep / totalSteps) * 100;
//     const bar = document.getElementById("progressBar");

//     bar.style.width = `${percent}%`;
//     bar.classList.toggle("bg-success", percent === 100);
//     bar.classList.toggle("bg-warning", percent < 100);

//     document.querySelector(".progress-label").textContent = `Step ${currentStep} of ${totalSteps}`;
//     document.getElementById("progressText").textContent = `${Math.round(percent)}% Complete`;
//     document.getElementById("pointsDisplay").textContent = score;



//     if (score >= 80 && !document.getElementById("badgesDisplay").innerHTML.includes("Phishing Investigator")) {
//         document.getElementById("badgesDisplay").innerHTML =
//             '<span class="badge rounded-pill bg-primary text-white small">Phishing Investigator</span>';

//         showAlert("🎉 Congrats! You unlocked the ‘Phishing Investigator’ badge!", "info");

//     }


//     // 🎉 Show confetti when all tasks complete
//     if (currentStep === totalSteps && !hasCelebrated) {
//         hasCelebrated = true; // prevent repeat
//         confetti({
//             particleCount: 150,
//             spread: 90,
//             origin: { y: 0.6 }
//         });
//     }
// }
// function updateProgress() {
//     const progressPercent = (currentStep / totalSteps) * 100;
//     const bar = document.getElementById("progressBar");

//     // Dynamically calculate score as 100 / totalSteps
//     const pointsPerTask = 100 / totalSteps;
//     score = Math.round(currentStep * pointsPerTask);

//     // Update progress visuals
//     bar.style.width = `${progressPercent}%`;
//     bar.classList.toggle("bg-success", progressPercent === 100);
//     bar.classList.toggle("bg-warning", progressPercent > 0 && progressPercent < 100);

//     document.querySelector(".progress-label").textContent = `Step ${currentStep} of ${totalSteps}`;
//     document.getElementById("progressText").textContent = `${Math.round(progressPercent)}% Complete`;
//     document.getElementById("pointsDisplay").textContent = score;

//     // Show only one badge (highest earned)
//     const badgesContainer = document.getElementById("badgesDisplay");
//     badgesContainer.innerHTML = ""; // Clear previous

//     if (progressPercent >= 100) {
//         badgesContainer.innerHTML =
//             '<span class="badge rounded-pill bg-success text-white small">🥇 Phishing Investigator</span>';
//         showAlert("🎉 Congrats! You unlocked the ‘🥇 Phishing Investigator’ badge!", "info");

//     } else if (progressPercent >= 70) {
//         badgesContainer.innerHTML =
//             '<span class="badge rounded-pill bg-warning text-dark small">🥈 Cyber Detective</span>';
//         showAlert("🎉 Congrats! You unlocked the ‘🥈 Cyber Detective’ badge!", "info");
//     } else if (progressPercent >= 50) {
//         badgesContainer.innerHTML =
//             '<span class="badge rounded-pill bg-info text-white small">🥉 Rookie Analyst</span>';
//         showAlert("🎉 Congrats! You unlocked the '🥉 Rookie Analyst’ badge!", "info");
//     } else {
//         badgesContainer.textContent = "No badges";
//     }

//     // 🎉 Confetti on full completion
//     if (progressPercent === 100 && !hasCelebrated) {
//         hasCelebrated = true;
//         confetti({
//             particleCount: 150,
//             spread: 90,
//             origin: { y: 0.6 }
//         });
//     }
// }

function updateProgress() {
    const progressPercent = (currentStep / totalSteps) * 100;
    const bar = document.getElementById("progressBar");

    // Dynamically calculate score based on number of tasks
    const pointsPerTask = 100 / totalSteps;
    score = Math.round(currentStep * pointsPerTask);

    // Update visuals
    bar.style.width = `${progressPercent}%`;
    bar.classList.toggle("bg-success", progressPercent === 100);
    bar.classList.toggle("bg-warning", progressPercent > 0 && progressPercent < 100);

    document.querySelector(".progress-label").textContent = `Step ${currentStep} of ${totalSteps}`;
    document.getElementById("progressText").textContent = `${Math.round(progressPercent)}% Complete`;
    document.getElementById("pointsDisplay").textContent = score;

    // Track which badge level has already been awarded
    const badgesContainer = document.getElementById("badgesDisplay");
    const previousBadge = badgesContainer.getAttribute("data-badge-earned");

    // Determine current badge level
    let newBadge = "";
    let badgeHTML = "";

    if (progressPercent >= 100) {
        newBadge = "gold";
        badgeHTML = '<span class="badge rounded-pill bg-primary text-white small">🥇 Phishing Forensics Expert</span>';
    } else if (progressPercent >= 70) {
        newBadge = "silver";
        badgeHTML = '<span class="badge rounded-pill bg-info text-white small">🥈 Phishing Forensics Specialist</span>';
    } else if (progressPercent >= 50) {
        newBadge = "bronze";
        badgeHTML = '<span class="badge rounded-pill bg-secondary text-white small">🥉 Phishing Forensics Rookie</span>';
    } else {
        newBadge = "";
        badgeHTML = "No badges";
    }

    // Only update badge + alert if badge is new
    if (newBadge !== previousBadge) {
        badgesContainer.setAttribute("data-badge-earned", newBadge);
        badgesContainer.innerHTML = badgeHTML;

        if (newBadge === "bronze") {
            showAlert("🎉 Congrats! You unlocked the ‘🥉 Phishing Forensics Rookie’ badge!", "info");
        } else if (newBadge === "silver") {
            showAlert("🎉 Congrats! You unlocked the ‘🥈 Phishing Forensics Specialist’ badge!", "info");
        } else if (newBadge === "gold") {
            // showAlert("🎉 Congrats! You unlocked the ‘🥇 Phishing Forensics Expert’ badge!", "info");
            showAlert("🎉 Congrats! You unlocked the ‘🥇 Phishing Forensics Expert’ badge! You've aslo completed the entire Phishing Forensics module.", "info");

        }
    }

    // 🎉 Confetti only once on full completion
    if (progressPercent === 100 && !hasCelebrated) {
        hasCelebrated = true;
        confetti({
            particleCount: 150,
            spread: 90,
            origin: { y: 0.6 }
        });
    }
}


// ===========================
// Difficulty Modal Logic
// ===========================






// function applyDifficulty() {
//     const selectedDiff = document.getElementById("difficultySelect").value;

//     if (selectedDiff === currentDifficulty) {
//         showAlert("You are already on this difficulty. No changes applied.", "danger");
//         bootstrap.Modal.getInstance(document.getElementById("difficultyModal")).hide();
//         return;
//     }

//     // Update difficulty badge
//     const badge = document.getElementById("difficultyBadge");
//     badge.innerHTML = `<i class="fas fa-graduation-cap me-1"></i> ${selectedDiff}`;
//     badge.classList.remove("bg-success", "bg-warning", "bg-danger");
//     badge.classList.add(
//         selectedDiff === "Easy" ? "bg-success" :
//             selectedDiff === "Intermediate" ? "bg-warning" :
//                 "bg-danger"
//     );

//     // ✅ Set the new difficulty first
//     currentDifficulty = selectedDiff;

//     // Reset everything
//     score = 0;
//     currentStep = 0;
//     resetAllTasksState(); // This also calls renderTasks()
//     document.getElementById("badgesDisplay").textContent = "No badges";
//     updateProgress();

//     // ✅ Re-render after setting difficulty
//     renderTasks();

//     // Close modal and notify
//     bootstrap.Modal.getInstance(document.getElementById("difficultyModal")).hide();
//     showAlert("Difficulty changed. Progress has been reset.", "info");
// }

function applyDifficulty() {
    hasCelebrated = false;
    const selectedDiff = document.getElementById("difficultySelect").value;

    if (selectedDiff === currentDifficulty) {
        showAlert("You are already on this difficulty. No changes applied.", "danger");
        bootstrap.Modal.getInstance(document.getElementById("difficultyModal")).hide();
        return;
    }

    // Update difficulty badge
    const badge = document.getElementById("difficultyBadge");
    badge.innerHTML = `<i class="fas fa-graduation-cap me-1"></i> ${selectedDiff}`;
    badge.classList.remove("bg-success", "bg-warning", "bg-danger");
    badge.classList.add(
        selectedDiff === "Easy" ? "bg-success" :
            selectedDiff === "Intermediate" ? "bg-warning" :
                "bg-danger"
    );

    // ✅ Set the new difficulty first
    currentDifficulty = selectedDiff;

    // ✅ Reset everything
    score = 0;
    currentStep = 0;
    resetAllTasksState(); // This also calls renderTasks()
    document.getElementById("badgesDisplay").textContent = "No badges";
    updateProgress();

    // ✅ Reset streak
    answerStreak = 0;
    document.getElementById("currentStreak").innerHTML = "0";

    // ✅ Re-render after setting difficulty
    renderTasks();

    // Close modal and notify
    bootstrap.Modal.getInstance(document.getElementById("difficultyModal")).hide();
    showAlert("Difficulty changed. Progress has been reset.", "info");
}






// ===========================
// Reset All Progress
// ===========================
function resetAllTasksState() {
    // Reset tracking arrays
    taskCompletion.fill(false);
    for (let i = 0; i < answeredCorrectly.length; i++) {
        answeredCorrectly[i].fill(false);
        attemptsLeft[i] = tasks[i].quiz.map(q => q.attemptsAllowed);
    }

    // Enable and clear all inputs
    // document.querySelectorAll('.form-check-input').forEach(input => {
    document.querySelectorAll('.quiz-input').forEach(input => {
        input.disabled = false;
        input.checked = false;
    });

    // Clear all feedback
    document.querySelectorAll('[id$="_feedback"]').forEach(fb => {
        fb.innerHTML = '';
        fb.className = 'small';
    });

    // Reset all task status badges
    document.querySelectorAll("[id^=taskStatus]").forEach(badge => {
        badge.textContent = "Pending";
        badge.className = "badge bg-secondary";
    });

    renderTasks();

}



function resetProgress() {
    if (confirm("Reset all progress?")) {
        score = 0;
        currentStep = 0;
        resetAllTasksState(); // ⬅️ reset the questions & feedback
        document.getElementById("badgesDisplay").textContent = "No badges";
        updateProgress();
    }
}



// function confirmReset() {
//     const modal = bootstrap.Modal.getInstance(document.getElementById('resetModal'));
//     modal.hide();

//     score = 0;
//     currentStep = 0;
//     resetAllTasksState(); // ⬅️ reset the questions & feedback
//     document.getElementById("badgesDisplay").textContent = "No badges";
//     updateProgress();
//     showAlert("Progress has been reset.", "info");
// }
// function confirmReset() {
//     // Reset key variables
//     currentStep = 0;
//     score = 0;
//     hasCelebrated = false;
//     usedHints = 0;
//     answerStreak = 0;

//     // Reset arrays
//     taskCompletion.fill(false);
//     tasks.forEach((task, i) => {
//         answeredCorrectly[i] = Array(task.quiz.length).fill(false);
//         attemptsLeft[i] = task.quiz.map(q => q.attemptsAllowed);
//     });

//     // Reset flame streak UI
//     document.getElementById("currentStreak").innerHTML = "0";

//     // Reset hint counter display (if applicable)
//     document.getElementById("usedHintCount").textContent = "0";

//     // Reset badges
//     document.getElementById("badgesDisplay").textContent = "No badges";

//     // Reset progress bar visuals
//     updateProgress();

//     // Re-render task cards
//     renderTasks();

//     // Close modal
//     const resetModal = bootstrap.Modal.getInstance(document.getElementById('resetModal'));
//     resetModal.hide();
// }
function confirmReset() {
    hasCelebrated = false;
    // Reset all core variables
    score = 0;
    currentStep = 0;
    usedHints = 0;
    answerStreak = 0;
    hasCelebrated = false;

    // Recreate tracking arrays
    for (let i = 0; i < tasks.length; i++) {
        taskCompletion[i] = false;
        answeredCorrectly[i] = Array(tasks[i].quiz.length).fill(false);
        attemptsLeft[i] = tasks[i].quiz.map(q => {
            // Reapply attemptsAllowed fresh from data
            return q.attemptsAllowed;
        });

        // Remove temporary __attemptsInit property for Intermediate mode questions
        tasks[i].quiz.forEach(q => {
            if (q.hasOwnProperty("__attemptsInit")) {
                delete q.__attemptsInit;
            }
        });
    }

    // Reset UI
    document.getElementById("currentStreak").innerHTML = "0";
    document.getElementById("pointsDisplay").textContent = "0";
    document.getElementById("badgesDisplay").textContent = "No badges";

    updateProgress();
    renderTasks();

    // Close modal
    const modal = bootstrap.Modal.getInstance(document.getElementById("resetModal"));
    modal.hide();

    // Alert user
    showAlert("Progress has been reset.", "info");
}



// ===========================
// Toolkit Functions
// ===========================
function analyzeEmail() {
    document.getElementById("emailAnalysisResult").innerText = "Header mismatch: Return-Path differs. Domain registered 2 days ago. Attachment is suspicious.";
}

function lookupDomain() {
    const domain = document.getElementById("domainInput").value.trim();
    document.getElementById("whoisResult").innerText = domain ?
        `WHOIS: ${domain} registered recently via shadyhost.net` :
        "Enter a domain to check.";
}

function scanFile() {
    const file = document.getElementById("fileInput").value.trim();
    document.getElementById("fileScanResult").innerText = file ?
        `Scan: ${file} contains an obfuscated PowerShell script.` :
        "Enter a filename to scan.";
}

// ===========================
// Theme Mode Loader
// ===========================




function toggleDarkMode() {
    const toggle = document.getElementById("darkModeToggle");
    const isDark = toggle.checked;

    document.body.classList.toggle("dark-mode", isDark);
    localStorage.setItem("theme", isDark ? "dark" : "light");
}


// Init

// Sync dark mode toggle on page load


document.addEventListener("DOMContentLoaded", () => {
    const toggle = document.getElementById("darkModeToggle");
    const theme = localStorage.getItem("theme");

    const enableDark = theme === "dark";
    document.body.classList.toggle("dark-mode", enableDark);
    if (toggle) toggle.checked = enableDark;

    toggle?.addEventListener("change", toggleDarkMode);

    // Enable Bootstrap tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
});



renderTasks();
updateProgress();

// ===========================
// Show Bootstrap Alert (Reusable)
// ===========================
// function showAlert(message, type = 'success') {
//     const alertArea = document.getElementById("alertArea");

//     // Remove previous alert
//     alertArea.innerHTML = '';

//     const alert = document.createElement("div");
//     alert.className = `alert alert-${type} alert-dismissible fade show`;
//     alert.role = "alert";
//     alert.innerHTML = `
//         ${message}
//         <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
//     `;

//     alertArea.appendChild(alert);

//     // Auto-close after 5 seconds
//     setTimeout(() => {
//         const alertInstance = bootstrap.Alert.getOrCreateInstance(alert);
//         alertInstance.close();
//     }, 5000);
// }

let alertQueue = [];
let isShowingAlert = false;

function showAlert(message, type = "info") {
    alertQueue.push({ message, type });
    if (!isShowingAlert) showNextAlert();
}

function showNextAlert() {
    if (alertQueue.length === 0) {
        isShowingAlert = false;
        return;
    }

    isShowingAlert = true;
    const { message, type } = alertQueue.shift();

    const alertArea = document.getElementById("alertArea");
    const alertId = `alert-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

    const alertDiv = document.createElement("div");
    alertDiv.id = alertId;
    alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
    alertDiv.setAttribute("role", "alert");
    alertDiv.style.marginTop = "0.5rem"; // slight vertical gap
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;

    alertArea.appendChild(alertDiv);

    // Auto-dismiss and show next after delay
    setTimeout(() => {
        const alertEl = bootstrap.Alert.getOrCreateInstance(alertDiv);
        alertEl.close();
        alertDiv.addEventListener("closed.bs.alert", () => {
            setTimeout(showNextAlert, 600); // ~0.6s between alerts
        });
    }, 5000); // show duration
}



function updateDifficultyDescription() {
    const selected = document.getElementById("difficultySelect").value;
    const desc = document.getElementById("difficultyDescription");

    const descriptions = {
        Easy: "Easy: Unlimited attempts and unlimited hints for all questions.",
        Intermediate: "Intermediate: Limited attempts per question, and limited hint usage.",
        Hard: "Hard: Only one attempt per question. Hints are disabled."
    };

    desc.textContent = descriptions[selected];
}

// Ensure difficulty modal reflects current state on open (not previous cancelled selection)
document.getElementById("difficultyModal").addEventListener("show.bs.modal", function () {
    const select = document.getElementById("difficultySelect");
    select.value = currentDifficulty; // Set to actual active difficulty
    updateDifficultyDescription();    // Update the description accordingly
});

