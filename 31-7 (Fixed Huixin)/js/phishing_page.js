const video = document.getElementById('video');
const choices1 = document.getElementById('choices1');
const choices2 = document.getElementById('choices2');

// Track which choices have been shown at specific times
let shownChoices = {
  first: false,
  second: false
};

// Define decision points in seconds
const DECISION_POINTS = {
  FIRST: 27,
  SECOND: 40
};

// Store the furthest point the user has reached (to prevent skipping ahead)
let furthestTimeReached = 0;

// Block seeking forward beyond the furthest point watched
video.addEventListener('seeking', () => {
  if (video.currentTime > furthestTimeReached + 0.5) {
    video.currentTime = furthestTimeReached;
  }
});

// Update furthest time on normal playback
video.addEventListener('timeupdate', () => {
  if (!video.seeking) {
    furthestTimeReached = Math.max(furthestTimeReached, video.currentTime);
  }
});

// Watch the video timeline for decision points
video.addEventListener('timeupdate', () => {
  const time = video.currentTime;

  // Check if we've passed the first decision point
  if (time >= DECISION_POINTS.FIRST && time < DECISION_POINTS.FIRST + 1 && !shownChoices.first) {
    video.pause();
    choices1.classList.remove('hidden');
    shownChoices.first = true;
  }

  // Check if we've passed the second decision point
  if (time >= DECISION_POINTS.SECOND && time < DECISION_POINTS.SECOND + 1 && !shownChoices.second) {
    video.pause();
    choices2.classList.remove('hidden');
    shownChoices.second = true;
  }
});

// Reset choices when user rewinds
video.addEventListener('seeked', () => {
  const time = video.currentTime;

  // If user rewinds before first decision point, reset first choice
  if (time < DECISION_POINTS.FIRST) {
    shownChoices.first = false;
    choices1.classList.add('hidden');
  }

  // If user rewinds before second decision point, reset second choice
  if (time < DECISION_POINTS.SECOND) {
    shownChoices.second = false;
    choices2.classList.add('hidden');
  }

  // Prevent showing stale choices
  if (time < DECISION_POINTS.FIRST || time >= DECISION_POINTS.FIRST + 1) {
    if (!shownChoices.first) choices1.classList.add('hidden');
  }
  if (time < DECISION_POINTS.SECOND || time >= DECISION_POINTS.SECOND + 1) {
    if (!shownChoices.second) choices2.classList.add('hidden');
  }
});

// When a user clicks a choice
function chooseOption(step, option) {
  console.log(`Step ${step}, Option ${option}`);

  // Jump to different parts of the video based on choice
  if (step === 1 && option === 'A') {
    video.currentTime = 30; // Clicked link
  }

  if (step === 2 && option === 'A') {
    video.currentTime = 42; // Opened attachment
  }

  // Hide choices and resume video
  if (step === 1) {
    choices1.classList.add('hidden');
    shownChoices.first = true; // Mark as completed
  }
  if (step === 2) {
    choices2.classList.add('hidden');
    shownChoices.second = true; // Mark as completed
  }

  video.play();
}