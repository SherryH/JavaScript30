const video = document.querySelector('video');
const toggleButton = document.querySelector('button.toggle');

console.dir(video);
// One problem when following along the course video is that, I don't know where to find the list of methods available.
// for video, it has the "paused" property and "play()", "pause()" method
// It is not all that obvious to find the MDN doc that lists all methods

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

// Hook up event listeners
video.addEventListener('click', togglePlay);
toggleButton.addEventListener('click', togglePlay);
video.addEventListener('play', (e) => {
  // when play event is fired. ie. video is playing, change UI to pause
  toggleButton.innerHTML = '▐▐';
});
video.addEventListener('pause', () => {
  toggleButton.innerHTML = '►';
});

// UI changes

// toggleFunction, change the play button icon to pause and vice versa
function togglePlayUI() {
  // get play button
  toggleButton.innerHTML;
}
