const video = document.getElementById('video');
const choices = document.getElementById('choices');

video.addEventListener('timeupdate', () => {
  // At 10 seconds, pause and show choices
  if (video.currentTime >= 10 && video.currentTime < 11) {
    video.pause();
    choices.classList.remove('hidden');
  }
});

function chooseOption(option) {
  choices.classList.add('hidden');

  if (option === 'A') {
    // Go to 20s mark where phishing link is clicked
    video.currentTime = 20;
  } else if (option === 'B') {
    // Go to 40s mark where phishing is reported
    video.currentTime = 40;
  }

  video.play();
}
