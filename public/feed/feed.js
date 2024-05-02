// SIDEBAR
const menuItems = document.querySelectorAll(".menu-item");
//THEME
const theme = document.querySelector("#theme");
const themeBlock = document.querySelector("#themeBlock");
var root = document.querySelector(":root");
const bg1 = document.querySelector(".bg-1");
const bg2 = document.querySelector(".bg-2");
const h2 = document.getElementsByTagName("h2");
const h3 = document.getElementsByTagName("h3");
const h4 = document.getElementsByTagName("h4");
const h5 = document.getElementsByTagName("h5");
const h6 = document.getElementsByTagName("h6");

//REMOVE ACTIVE CLASS FROM ALL MENU ITEMS

const changeActiveItem = () => {
  menuItems.forEach((item) => {
    item.classList.remove("active");
  });
};

menuItems.forEach((item) => {
  item.addEventListener("click", () => {
    changeActiveItem();
    item.classList.add("active");
  });
});

// THEME CUSTOMIZATION
const showBlock = () => {
  themeBlock.style.display = "grid";
};
const closeTheme = (e) => {
  if (e.target.classList.contains("customize-theme")) {
    e.target.style.display = "none";
  }
};
themeBlock.addEventListener("click", closeTheme);

theme.addEventListener("click", showBlock);

//BACKGROUND
let backgroundWhite;
let backgroundLight;
let buttonsBackground;
let buttonsText;
let black;

const changeBg = () => {
  root.style.setProperty("--background-white", backgroundWhite);
  root.style.setProperty("--background-light", backgroundWhite);
  root.style.setProperty("--buttons-background", buttonsBackground);
  root.style.setProperty("--buttons-text", buttonsText);
  root.style.setProperty("--black", black);
};

//BACKGROUND DARK
bg2.addEventListener("click", (e) => {
  e.preventDefault();
  backgroundWhite = "black";
  backgroundLight = "hsl(252, 30%, 17%)";
  buttonsBackground = "white";
  buttonsText = "black";
  black = "white";

  let savedDark = true;
  localStorage.setItem("darkModeEnabled", savedDark);

  changeBg();
});

bg1.addEventListener("click", (e) => {
  e.preventDefault();
  backgroundWhite = "white";
  backgroundLight = "hsl(252, 30%, 95%)";
  buttonsBackground = "black";
  buttonsText = "white";
  black = "black";

  let savedDark = false;
  localStorage.setItem("darkModeEnabled", savedDark);

  changeBg();
});

//LOAD FUNCTION FOR THEME
window.onload = function () {
  var darkModeEnabled = localStorage.getItem("darkModeEnabled");
  if (darkModeEnabled === "true") {
    backgroundWhite = "black";
    backgroundLight = "hsl(252, 30%, 17%)";
    buttonsBackground = "white";
    buttonsText = "black";
    black = "white";

    changeBg();
  } else {
    backgroundWhite = "white";
    backgroundLight = "hsl(252, 30%, 95%)";
    buttonsBackground = "black";
    buttonsText = "white";
    black = "black";

    changeBg();
  }
};

//MESSAGE CLICK
const message = document.getElementById("messages");
message.addEventListener("click", (e) => {
  e.preventDefault();
  window.location.href = "/message/message.html";
});
