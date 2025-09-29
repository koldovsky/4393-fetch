const headerTitle = document.querySelector(".header__title");

const greetings = [
  "Hello!",
  "Привіт!",
  "Bonjour!",
  "Hola!",
  "Ciao!",
  "Hallo!",
  "Olá!",
];

const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];
headerTitle.innerText = randomGreeting;
const randomColor = `hsl(${Math.floor(Math.random() * 360)}, 70%, 60%)`;
headerTitle.style.color = randomColor;
