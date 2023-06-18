const darkModeButton = document.querySelector(".darkModeButton");
const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");

var currentTheme = localStorage.getItem("theme");
if (currentTheme == "dark") {
    document.body.classList.toggle("darkMode");
    darkModeButton.innerText = "light mode";
} else if (currentTheme == "light") {
    document.body.classList.toggle("lightMode");
    darkModeButton.innerText = "dark mode";
} else {
    if (prefersDarkScheme) {
        darkModeButton.innerText = "light mode";
    } else {
        darkModeButton.innerText = "dark mode";
    }
}

darkModeButton.addEventListener("click", function() {
    if (prefersDarkScheme) {  //.matches ??
        document.body.classList.toggle("lightMode");
        if (document.body.classList.contains("lightMode")) {
            theme = "light";
            darkModeButton.innerText = "dark mode";
        } else {
            theme = "dark";
            darkModeButton.innerText = "light mode";
        }
    } else {
        document.body.classList.toggle("darkMode");
        if (document.body.classList.contains("darkMode")) {
            theme = "dark";
            darkModeButton.innerText = "light mode";
        } else {
            theme = "light";
            darkModeButton.innerText = "dark mode";
        }
    }
    localStorage.setItem("theme", theme);
});