const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');

// getVideo Cam
function getVideo() {
  // https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices
  // https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
  navigator.mediaDevices
    .getUserMedia({ video: true, audio: true }) //getUserMedia grants permission and returns mediaStream
    .then((mediaStream) => {
      console.log(mediaStream);
      video.srcObject = mediaStream;
      video.play();
    })
    .catch((error) => {
      console.error('Oh No!', error);
    });
}

// video.src vs video.srcObject
/**
 * 
 * video.src

Takes a string URL that points to a media resource (like a video file)
Example: video.src = "https://example.com/video.mp4" or video.src = URL.createObjectURL(stream) (older method)
Primarily used for pre-recorded media files or resources that can be accessed via URL
In older code, developers used URL.createObjectURL() to convert MediaStream objects to URLs which could then be assigned to src

video.srcObject

Takes a direct reference to a media object like a MediaStream
Example: video.srcObject = stream (where stream is from getUserMedia)
Introduced specifically to handle live media streams more efficiently
Avoids the overhead of creating object URLs and the need to revoke them later
The recommended modern approach for working with MediaStream objects

Key Differences:

Performance: srcObject is more efficient for live streams as it avoids the unnecessary step of URL creation
Memory management: When using src with URL.createObjectURL(), you need to manually revoke the URL with URL.revokeObjectURL() to prevent memory leaks
Browser support: srcObject is supported in all modern browsers but wasn't available in older browsers (IE and older versions of other browsers)
 * 
 * 
 * 
 */

// draw video image on the canvas element so that we can set the width and height to be fullscreen
/**
   * video.width
  - This is an HTML attribute property that sets the display width of the video element in the webpage

  video.videoWidth
  - This is a read-only property that represents the intrinsic/natural width of the video in pixels
  - Useful for determining the actual dimensions of the video content

  *********************************
  NOTE:
  1. paintToCanvas() is triggered after the video "canplay" event is emitted. Else we cant get the video size
  2. setInterval has to be used to get the video frame to be displayed on screen evey 16ms. Then the video is painted on canvas non stop

 */
function paintToCanvas(filterCallback = filters.default) {
  // before video.width is set, it is 0
  // we can always read value og video.videoWidth and videoHeight. 640 x 480
  const width = video.videoWidth;
  const height = video.videoHeight;

  canvas.width = width;
  canvas.height = height;

  // https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/drawImage
  // context.drawImage() can be used on video too!

  return setInterval(() => {
    ctx.drawImage(video, 0, 0, width, height); // paint the video on canvas
    // pixels = [r,g,b,a,r,g,b,a,r....] 1D array of each pixel's
    let pixels = ctx.getImageData(0, 0, width, height);
    // apply redEffect filter on pixels
    pixels = filterCallback(pixels);

    // put pixels back on canvas
    ctx.putImageData(pixels, 0, 0);
  }, 16);
}

function takePhoto() {
  // start the snap audio for taking photo
  snap.currentTime = 0;
  snap.play();

  // save the current image from video
  // the video is already on canvas
  const dataURL = canvas.toDataURL('image/jpeg');
  console.log(dataURL);
  //create a link for people to save the image
  const link = document.createElement('a');
  link.href = dataURL;
  link.textContent = 'download photo';
  link.setAttribute('download', 'hihi');
  link.innerHTML = `<img src=${dataURL} alt="hihi" />`;
  strip.insertBefore(link, strip.firstChild);
}

// filters
function redEffect(pixels) {
  for (i = 0; i < pixels.data.length; i = i + 4) {
    pixels.data[i + 0] = pixels.data[i + 0] + 100; //r
    pixels.data[i + 1] = pixels.data[i + 1] - 50; //g
    pixels.data[i + 2] = pixels.data[i + 2] * 0.8; //b
    // the 4th is a
  }
  return pixels;
}

// yellow is increasing red and green and decreasing blue
function yellowEffect(pixels) {
  for (i = 0; i < pixels.data.length; i = i + 4) {
    pixels.data[i + 0] = pixels.data[i + 0] + 100;
    pixels.data[i + 1] = pixels.data[i + 1] + 100;
    pixels.data[i + 2] = pixels.data[i + 2] - 50;
  }
  return pixels;
}

// purple filtier is increasing red and blue and decreasing green
function purpleEffect(pixels) {
  for (i = 0; i < pixels.data.length; i = i + 4) {
    pixels.data[i + 0] = pixels.data[i + 0] * 1.5;
    pixels.data[i + 1] = pixels.data[i + 1] * 0.5;
    pixels.data[i + 2] = pixels.data[i + 2] * 1.5;
  }
  return pixels;
}

function rgbSplit(pixels) {
  for (let i = 0; i < pixels.data.length; i += 4) {
    pixels.data[i - 150] = pixels.data[i + 0]; // RED
    pixels.data[i + 500] = pixels.data[i + 1]; // GREEN
    pixels.data[i - 550] = pixels.data[i + 2]; // Blue
  }
  return pixels;
}

const filters = {
  default: (pixels) => pixels,
  red: redEffect,
  yellow: yellowEffect,
  purple: purpleEffect,
};

registerCustomFilter('rgbSplit', rgbSplit);

getVideo();

let intervalId = null;
video.addEventListener('canplay', () => {
  intervalId = paintToCanvas(filters.red);
});
document.getElementById('redBtn').addEventListener('click', () => {
  clearInterval(intervalId);
  intervalId = paintToCanvas(filters.red);
});
document.getElementById('yellowBtn').addEventListener('click', () => {
  clearInterval(intervalId);
  intervalId = paintToCanvas(filters.yellow);
});
document.getElementById('purpleBtn').addEventListener('click', () => {
  clearInterval(intervalId);
  intervalId = paintToCanvas(filters.purple);
});

// when 1 more filter is created, 1 more button is also created to handle event handler
function registerCustomFilter(filtername, filterFunction) {
  // add filter to the filters
  filters[filtername] = filterFunction;

  // create a button
  const button = document.createElement('button');
  button.textContent = filtername;
  button.addEventListener('click', () => {
    clearInterval(intervalId);
    intervalId = paintToCanvas(filters[filtername]);
  });

  document.getElementById('controls').appendChild(button);
}
