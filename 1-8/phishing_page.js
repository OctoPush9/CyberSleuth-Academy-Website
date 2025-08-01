const video = document.getElementById('video');
const choices1 = document.getElementById('choices1');
const choices2 = document.getElementById('choices2');

let shownChoices = {
  first: false,
  second: false,
  third: false
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
  if (time >= 27 && time < 28 && !shownChoices.first) {
    video.pause();
    choices1.classList.remove('hidden');
    shownChoices.first = true;
  }

  // Pause at second decision point (~25s)
  if (time >= 39.5 && time < 40 && !shownChoices.second) {
    video.pause();
    choices2.classList.remove('hidden');
    shownChoices.second = true;
  }

  if (time >= 53.5 && time < 54 && !shownChoices.third) {
    video.pause();
    choices3.classList.remove('hidden');
    shownChoices.third = true;
  }
});

// When a user clicks a choice
function chooseOption(step, option) {
  console.log(`Step ${step}, Option ${option}`);
  //console.log(`Jumping to ${video.currentTime}`);

  // Jump to different parts of the video based on choice
  if (step === 1 && option === 'A') {
    video.currentTime = 30.5; // Clicked link
  } //else if (step === 1 && option === 'B') {
    //video.currentTime = 40; // Reported email
  //}

  if (step === 2 && option === 'A') {
    video.currentTime = 42.5; // Opened attachment
  } //else if (step === 2 && option === 'B') {
    //video.currentTime = 60; // Deleted email
  //}

  // Hide choices and resume video
  if (step === 1) choices1.classList.add('hidden');
  if (step === 2) choices2.classList.add('hidden');
  if (step === 3) choices3.classList.add('hidden');

  video.play();
}
