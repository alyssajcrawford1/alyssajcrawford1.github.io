var darkModeButton = document.querySelector(".darkModeButton");
var prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");
var currentTheme = localStorage.getItem("theme");
if (currentTheme == "dark") {
    document.body.classList.toggle("darkMode");
    darkModeButton.innerText = "Light Mode";
}
else if (currentTheme == "light") {
    document.body.classList.toggle("lightMode");
    darkModeButton.innerText = "Dark Mode";
}
else {
    if (prefersDarkScheme) {
        darkModeButton.innerText = "Light Mode";
    }
    else {
        darkModeButton.innerText = "Dark Mode";
    }
}
var newTheme = "dark";
darkModeButton.addEventListener("click", function () {
    if (prefersDarkScheme) {
        document.body.classList.toggle("lightMode");
        if (document.body.classList.contains("lightMode")) {
            newTheme = "light";
            darkModeButton.innerText = "Dark Mode";
        }
        else {
            newTheme = "dark";
            darkModeButton.innerText = "Light Mode";
        }
    }
    else {
        document.body.classList.toggle("darkMode");
        if (document.body.classList.contains("darkMode")) {
            newTheme = "dark";
            darkModeButton.innerText = "Light Mode";
        }
        else {
            newTheme = "light";
            darkModeButton.innerText = "Dark Mode";
        }
    }
    localStorage.setItem("theme", newTheme);
});
