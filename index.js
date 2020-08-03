let model, webcam, withOver, withoutOver;
const maskOn = "mask overlay";
const maskOff = "mask overlay hidden";
const URL = "https://teachablemachine.withgoogle.com/models/N-OAGZBZa/";

async function init() {
  const modelURL = URL + "model.json";
  const metadataURL = URL + "metadata.json";

  model = await tmImage.load(modelURL, metadataURL);

  const flip = true;
  webcam = new tmImage.Webcam(720, 724, flip); // width, height, flip
  await webcam.setup();
  await webcam.play();
  window.requestAnimationFrame(loop);

  document.getElementById("webcam-container").appendChild(webcam.canvas);
  document.getElementById("submit-btn").classList = "hidden";
  withOver = document.getElementById("with-mask");
  withoutOver = document.getElementById("without-mask");
}

async function loop() {
  webcam.update(); // update the webcam frame
  await predict();
  window.requestAnimationFrame(loop);
}

function toggleOverlay(withMask) {
  const tol = 0.95
  if (withMask > tol) {
    withOver.className = maskOn
    withoutOver.className = maskOff

  } else {
    withOver.className = maskOff
    withoutOver.className = maskOn
  }
}

async function predict() {
  const prediction = await model.predict(webcam.canvas);
  const withMask = prediction[0].probability
  toggleOverlay(withMask)
}