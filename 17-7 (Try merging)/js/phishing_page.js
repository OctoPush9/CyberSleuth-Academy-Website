const video = document.getElementById('video');
const choices1 = document.getElementById('choices1');
const choices2 = document.getElementById('choices2');

let shownChoices = {
  first: false,
  second: false
};

//document.addEventListener('keydown', (e) => {
    //const blockedKeys = [' ', 'ArrowLeft', 'ArrowRight'];
    //if (blockedKeys.includes(e.key)) {
      //e.preventDefault();
    //}
//});  


//let lastAllowedTime = 0;

//video.addEventListener('seeking', () => {
  //if (video.currentTime > lastAllowedTime + 0.1) {
    //video.currentTime = lastAllowedTime;
  //}
//});

// Watch the video timeline
video.addEventListener('timeupdate', () => {
  const time = video.currentTime;

  // Pause at first decision point (~10s)
  if (time >= 10 && time < 11 && !shownChoices.first) {
    video.pause();
    choices1.classList.remove('hidden');
    shownChoices.first = true;
  }

  // Pause at second decision point (~25s)
  if (time >= 60 && time < 61 && !shownChoices.second) {
    video.pause();
    choices2.classList.remove('hidden');
    shownChoices.second = true;
  }
});

// When a user clicks a choice
function chooseOption(step, option) {
  console.log(`Step ${step}, Option ${option}`);
  //console.log(`Jumping to ${video.currentTime}`);

  // Jump to different parts of the video based on choice
  if (step === 1 && option === 'A') {
    video.currentTime = 30; // Clicked link
  } else if (step === 1 && option === 'B') {
    video.currentTime = 40; // Reported email
  }

  if (step === 2 && option === 'A') {
    video.currentTime = 50; // Opened attachment
  } else if (step === 2 && option === 'B') {
    video.currentTime = 60; // Deleted email
  }

  // Hide choices and resume video
  if (step === 1) choices1.classList.add('hidden');
  if (step === 2) choices2.classList.add('hidden');

  video.play();
}
