var darkModeButton = document.querySelector(".darkModeButton");
var prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");
var currentTheme = localStorage.getItem("theme");
if (currentTheme == "dark") {
    document.body.classList.toggle("darkMode");
    darkModeButton.innerText = "light mode";
}
else if (currentTheme == "light") {
    document.body.classList.toggle("lightMode");
    darkModeButton.innerText = "dark mode";
}
else {
    if (prefersDarkScheme) {
        darkModeButton.innerText = "light mode";
    }
    else {
        darkModeButton.innerText = "dark mode";
    }
}
var newTheme = "dark";
darkModeButton.addEventListener("click", function () {
    if (prefersDarkScheme) {
        document.body.classList.toggle("lightMode");
        if (document.body.classList.contains("lightMode")) {
            newTheme = "light";
            darkModeButton.innerText = "dark mode";
        }
        else {
            newTheme = "dark";
            darkModeButton.innerText = "light mode";
        }
    }
    else {
        document.body.classList.toggle("darkMode");
        if (document.body.classList.contains("darkMode")) {
            newTheme = "dark";
            darkModeButton.innerText = "light mode";
        }
        else {
            newTheme = "light";
            darkModeButton.innerText = "dark mode";
        }
    }
    localStorage.setItem("theme", newTheme);
});
