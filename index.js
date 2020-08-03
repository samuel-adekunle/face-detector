let model, webcam, withOver, withoutOver, label;
const maskOn = "mask overlay";
const maskOff = "mask overlay hidden";
const URL = "https://teachablemachine.withgoogle.com/models/N-OAGZBZa/";

async function init() {
  const modelURL = URL + "model.json";
  const metadataURL = URL + "metadata.json";

  model = await tmImage.load(modelURL, metadataURL);

  const flip = true;
  const width = Math.min(window.innerWidth, 720)

  webcam = new tmImage.Webcam(width, width, flip); // width, height, flip
  await webcam.setup();
  await webcam.play();
  window.requestAnimationFrame(loop);

  document.getElementById("webcam-container").appendChild(webcam.canvas);
  document.getElementById("submit-btn").classList = "hidden";
  withOver = document.getElementById("with-mask");
  withoutOver = document.getElementById("without-mask");
  label = document.getElementById("label-container")

  withOver.style.width = `${width}px`;
  withOver.style.height = `${width}px`;
  withoutOver.style.width = `${width}px`;
  withoutOver.style.height = `${width}px`;
  label.style.width = `${width}px`;
}

async function loop() {
  webcam.update(); // update the webcam frame
  await predict();
  window.requestAnimationFrame(loop);
}

function toggleOverlay(withMask) {
  const tol = 0.80
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
  label.innerHTML = `${(withMask * 100).toFixed(2)}%`
  toggleOverlay(withMask)
}