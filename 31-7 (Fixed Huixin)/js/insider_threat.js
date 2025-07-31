const video = document.getElementById('video');
const choices1 = document.getElementById('choices1');
const choices2 = document.getElementById('choices2');
const choices3 = document.getElementById('choices3');

// Track which choices have been shown at specific times
let shownChoices = {
  first: false,
  second: false,
  third: false
};

// Define decision points in seconds
const DECISION_POINTS = {
  FIRST: 22,
  SECOND: 30,
  THIRD: 48
};

// Store the furthest point the user has reached
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

  // Pause at first decision point
  if (time >= DECISION_POINTS.FIRST && time < DECISION_POINTS.FIRST + 1 && !shownChoices.first) {
    video.pause();
    choices1.classList.remove('hidden');
    shownChoices.first = true;
  }

  // Pause at second decision point
  if (time >= DECISION_POINTS.SECOND && time < DECISION_POINTS.SECOND + 1 && !shownChoices.second) {
    video.pause();
    choices2.classList.remove('hidden');
    shownChoices.second = true;
  }

  // Pause at third decision point
  if (time >= DECISION_POINTS.THIRD && time < DECISION_POINTS.THIRD + 1 && !shownChoices.third) {
    video.pause();
    choices3.classList.remove('hidden');
    shownChoices.third = true;
  }
});

// Reset choices when user rewinds
video.addEventListener('seeked', () => {
  const time = video.currentTime;

  // Reset choices based on rewind position
  if (time < DECISION_POINTS.FIRST) {
    shownChoices.first = false;
    choices1.classList.add('hidden');
  }
  if (time < DECISION_POINTS.SECOND) {
    shownChoices.second = false;
    choices2.classList.add('hidden');
  }
  if (time < DECISION_POINTS.THIRD) {
    shownChoices.third = false;
    choices3.classList.add('hidden');
  }

  // Prevent showing stale choices
  if (time < DECISION_POINTS.FIRST || time >= DECISION_POINTS.FIRST + 1) {
    if (!shownChoices.first) choices1.classList.add('hidden');
  }
  if (time < DECISION_POINTS.SECOND || time >= DECISION_POINTS.SECOND + 1) {
    if (!shownChoices.second) choices2.classList.add('hidden');
  }
  if (time < DECISION_POINTS.THIRD || time >= DECISION_POINTS.THIRD + 1) {
    if (!shownChoices.third) choices3.classList.add('hidden');
  }
});

// When a user clicks a choice
function chooseOption(step, option) {
  console.log(`Step ${step}, Option ${option}`);

  // Jump to different parts of the video based on choice
  if (step === 1 && option === 'A') {
    video.currentTime = 25.35; // Contact Employee
  } else if (step === 1 && option === 'C') {
    video.currentTime = 34; // Ignore Alert
  }

  // Hide choices and resume video
  if (step === 1) {
    choices1.classList.add('hidden');
    shownChoices.first = true;
  }
  if (step === 2) {
    choices2.classList.add('hidden');
    shownChoices.second = true;
  }
  if (step === 3) {
    choices3.classList.add('hidden');
    shownChoices.third = true;
  }

  video.play();
}