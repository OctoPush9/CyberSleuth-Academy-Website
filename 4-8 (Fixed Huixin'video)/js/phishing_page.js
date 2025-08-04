const video = document.getElementById('video');
const choices1 = document.getElementById('choices1');
const choices2 = document.getElementById('choices2');

// Track which choices have been shown
let shownChoices = {
  first: false,
  second: false,
  third: false
};

// Store the furthest point the user has reached
let furthestTimeReached = 0;

// Prevent seeking forward beyond watched content
video.addEventListener('seeking', () => {
  if (video.currentTime > furthestTimeReached + 1) {
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

  // Pause at first decision point (27s)
  if (time >= 27 && time < 28 && !shownChoices.first) {
    video.pause();
    choices1.classList.remove('hidden');
    shownChoices.first = true;
  }

  // Pause at second decision point (39.5s)
  if (time >= 39.5 && time < 40 && !shownChoices.second) {
    video.pause();
    choices2.classList.remove('hidden');
    shownChoices.second = true;
  }

  // Pause at third decision point (53.5s)
  if (time >= 53.5 && time < 54 && !shownChoices.third) {
    video.pause();
    choices3.classList.remove('hidden');
    shownChoices.third = true;
  }
});

// Reset choices when user rewinds
video.addEventListener('seeked', () => {
  const time = video.currentTime;

  // Reset flags if user rewinds before decision points
  if (time < 27) {
    shownChoices.first = false;
    choices1.classList.add('hidden');
  }
  if (time < 39.5) {
    shownChoices.second = false;
    choices2.classList.add('hidden');
  }
  if (time < 53.5) {
    shownChoices.third = false;
    choices3.classList.add('hidden');
  }
});

// When a user clicks a choice
function chooseOption(step, option) {
  console.log(`Step ${step}, Option ${option}`);

  // Jump to different parts of the video based on choice
  if (step === 1 && option === 'A') {
    video.currentTime = 30.5; // Clicked link
  } else if (step === 1 && option === 'B') {
    video.currentTime = 40; // Reported email
  }

  if (step === 2 && option === 'A') {
    video.currentTime = 42.5; // Opened attachment
  } else if (step === 2 && option === 'B') {
    video.currentTime = 60; // Deleted email
  }

  // Hide choices and resume video
  if (step === 1) choices1.classList.add('hidden');
  if (step === 2) choices2.classList.add('hidden');
  if (step === 3) choices3.classList.add('hidden');

  video.play();
}
