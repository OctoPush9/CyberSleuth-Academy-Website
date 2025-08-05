const video = document.getElementById('video');
const choices1 = document.getElementById('choices1');
const choices2 = document.getElementById('choices2');
const choices3 = document.getElementById('choices3');

// Track which choices have been shown
let shownChoices = {
  first: false,
  second: false,
  third: false
};

// Store the furthest point the user has reached
let furthestTimeReached = 0;

let isJumpingDueToChoice = false;

// Prevent seeking forward beyond watched content
video.addEventListener('seeking', () => {
  if (!isJumpingDueToChoice && video.currentTime > furthestTimeReached + 1) {
    video.currentTime = furthestTimeReached;
  }
});

// Update furthest time on normal playback
video.addEventListener('timeupdate', () => {
  if (!video.seeking) {
    furthestTimeReached = Math.max(furthestTimeReached, video.currentTime);
  }
});

// Watch the video timeline
video.addEventListener('timeupdate', () => {
  const time = video.currentTime;

  // Pause at first decision point (21s)
  if (time >= 21 && time < 21.5 && !shownChoices.first) {
    video.pause();
    choices1.classList.remove('hidden');
    shownChoices.first = true;
  }

  // Pause at second decision point (30s)
  if (time >= 30 && time < 31 && !shownChoices.second) {
    video.pause();
    choices2.classList.remove('hidden');
    shownChoices.second = true;
  }

  // Pause at third decision point (48s)
  if (time >= 48 && time < 48.5 && !shownChoices.third) {
    video.pause();
    choices3.classList.remove('hidden');
    shownChoices.third = true;
  }
});

// Reset choices when user rewinds
video.addEventListener('seeked', () => {
  const time = video.currentTime;

  // Reset flags if user rewinds before decision points
  if (time < 21) {
    shownChoices.first = false;
    choices1.classList.add('hidden');
  }
  if (time < 30) {
    shownChoices.second = false;
    choices2.classList.add('hidden');
  }
  if (time < 59) {
    shownChoices.third = false;
    choices3.classList.add('hidden');
  }
});

// When a user clicks a choice
function chooseOption(step, option) {
  console.log(`Step ${step}, Option ${option}`);

  isJumpingDueToChoice = true;

  // Jump to different parts of the video based on choice
  if (step === 1 && option === 'A') {
    video.currentTime = 26; // Contact Employee
  } else if (step === 1 && option === 'C') {
    video.currentTime = 34; // Ignore Alert
  }

  // Hide choices
  if (step === 1) choices1.classList.add('hidden');
  if (step === 2) choices2.classList.add('hidden');
  if (step === 3) choices3.classList.add('hidden');

  video.play();

  // Allow seeking restriction again after jump is done
  setTimeout(() => {
    isJumpingDueToChoice = false;
  }, 200);
}