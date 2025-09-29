const clockElement = document.querySelector(".header__clock");

function updateClock() {
  const now = new Date();
  clockElement.innerText = now.toLocaleTimeString("uk");
}

updateClock();
setInterval(updateClock, 1000);
