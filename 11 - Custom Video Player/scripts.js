const video = document.querySelector('video');
const toggleButton = document.querySelector('button.toggle');
const skipButtons = document.querySelectorAll('[data-skip]');
const rangeButtons = document.querySelectorAll('input.player__slider');
const progressbar = document.querySelector('.progress__filled');
const progress = document.querySelector('.progress');
let mousedown = false; // boolean to control drag&dcrub of the progressbar
// One problem when following along the course video is that, I don't know where to find the list of methods available.
// for video, it has the "paused" property and "play()", "pause()" method
// It is not all that obvious to find the MDN doc that lists all methods
console.dir(video);
// console.dir -> can list the properties that "video" has
// https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement lists the API available for video and audio

// build functions
function togglePlay() {
  if (video.paused) {
    video.play();
  } else {
    video.pause();
  }
}

// toggleFunction, change the play button icon to pause and vice versa
function togglePlayUI() {
  // get play button
  toggleButton.innerHTML = video.paused ? '►' : '▐▐';
}

// enable video to fast foreward/backward
function skipVideo() {
  video.currentTime = video.currentTime + parseFloat(this.dataset.skip);
  console.log(video.currentTime);
}

function handleRangeChange(e) {
  video[this.name] = e.target.value;
}

// update progressbar style and update video time should be placed in different functions for separation of responsibility
function handleProgressChange(e) {
  // Calculate the progress percentage based on the current time
  const percentage = (e.offsetX / progress.offsetWidth) * 100;
  video.currentTime = (video.duration * percentage) / 100;
}

// Make the progressbar style dependent on video time on timeupdate
function handleTimeupdate() {
  const percentage = (video.currentTime / video.duration) * 100;
  progressbar.style.flexBasis = `${percentage}%`;
}

// Hook up event listeners
video.addEventListener('click', togglePlay);
toggleButton.addEventListener('click', togglePlay);
video.addEventListener('play', togglePlayUI);
skipButtons.forEach((skipButton) => {
  skipButton.addEventListener('click', skipVideo);
});
rangeButtons.forEach((rangeButton) => {
  rangeButton.addEventListener('change', handleRangeChange);
});

progress.addEventListener('click', handleProgressChange);
// When user drags the progress bar on mousedown
progress.addEventListener('mousemove', (e) => {
  mousedown && handleProgressChange(e);
});
progress.addEventListener('mousedown', () => {
  mousedown = true;
});
progress.addEventListener('mouseup', () => {
  mousedown = false;
});

// The timeupdate event is fired when the current playback position of a media element (audio or video) changes
video.addEventListener('timeupdate', handleTimeupdate);
