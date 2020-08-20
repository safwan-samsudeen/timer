const form = document.querySelector("form");
const minsInput = document.querySelector(".mins-input");
const secondsInput = document.querySelector(".seconds-input");
const time = document.querySelector(".time-left");
const beforeStart = document.querySelector(".before-start");
const afterStart = document.querySelector(".after-start");
const toggleButton = document.querySelector("button.toggle");
const stopButton = document.querySelector("button.stop");
const holder = document.querySelector("div.h1holder");
const body = document.body;
const title = document.querySelector("title");

let currentSeconds, interval;

function toTime(mins) {
  const timeArray = [Math.floor(mins / 60), mins % 60];
  timeArray[1] =
    `${timeArray[1]}`.length === 1 ? `0${timeArray[1]}` : `${timeArray[1]}`;
  return timeArray.join(":");
}

function setTime(value) {
  time.innerHTML = value;
  if (beforeStart.classList.contains("hidden"))
    title.innerHTML = "Time Left: " + value;
}

function reset() {
  currentSeconds = 0;
  setTime("0:00");
  afterStart.classList.add("hidden");
  beforeStart.classList.remove("hidden");
}

function flash(func = () => {}, wait = 100) {
  holder.classList.toggle("paused");
  body.classList.toggle("paused");
  func();
  setTimeout(() => {
    holder.classList.toggle("paused");
    body.classList.toggle("paused");
  }, wait);
}

function startTimer(mins, seconds, e) {
  if (e) e.preventDefault();
  let startSeconds = parseInt(mins || 0) * 60 + parseInt(seconds || 0);
  if (startSeconds <= 0) return;
  if (startSeconds > 3600) startSeconds = 3600;
  currentSeconds = startSeconds;
  setTime(toTime(currentSeconds));
  beforeStart.classList.add("hidden");
  afterStart.classList.remove("hidden");
  interval = setInterval(() => {
    setTime(toTime(--currentSeconds));
    if (currentSeconds === 0) {
      clearInterval(interval);
      flash(() => new Audio("end.wav").play());
      reset();
    }
  }, 1000);
}

function toggleTimer(e) {
  if (toggleButton.dataset.action === "pause") {
    clearInterval(interval);
    toggleButton.setAttribute("data-action", "resume");
    toggleButton.textContent = "Resume";
  } else {
    startTimer(Math.floor(currentSeconds / 60), currentSeconds % 60);
    toggleButton.setAttribute("data-action", "pause");
    toggleButton.textContent = "Pause";
  }
  holder.classList.toggle("paused");
  body.classList.toggle("paused");
}

function stopTimer() {
  if (toggleButton.dataset.action === "resume") toggleTimer();
  if (confirm("Are you sure you want to stop the timer? Click Ok to stop.")) {
    clearInterval(interval);
    reset();
  }
  title.innerHTML = "Infinite Timer";
}
function setTimeOnChange(e) {
  const seconds =
    parseInt(minsInput.value || 0) * 60 + parseInt(secondsInput.value || 0);
  if (seconds > 3600) setTime("60:00");
  else if (seconds <= 0) setTime("0:00");
  else setTime(toTime(seconds));
}
function jump(jumper) {
  currentSeconds += jumper;
  clearInterval(interval);
  startTimer(Math.floor(currentSeconds / 60), currentSeconds % 60);
}
function keydownHandler(e) {
  if (e.key === " ") {
    if (!beforeStart.classList.contains("hidden")) {
      document.querySelector(".start").click();
    } else {
      toggleButton.click();
    }
  } else if (
    e.key === "s" &&
    e.ctrlKey &&
    beforeStart.classList.contains("hidden")
  ) {
    stopButton.click();
  } else if (e.key === "ArrowRight") {
    e.preventDefault();
    jump(5);
  } else if (e.key === "ArrowLeft") {
    e.preventDefault();
    jump(-5);
  }
}

form.addEventListener("submit", (e) =>
  startTimer(minsInput.value, secondsInput.value, e)
);

toggleButton.addEventListener("click", toggleTimer);
stopButton.addEventListener("click", stopTimer);

minsInput.addEventListener("keyup", setTimeOnChange);
secondsInput.addEventListener("keyup", setTimeOnChange);
document.addEventListener("keydown", keydownHandler);
