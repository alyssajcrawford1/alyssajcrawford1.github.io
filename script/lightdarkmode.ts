var darkModeButton: HTMLElement = document.querySelector(".darkModeButton") as HTMLElement;
var prefersDarkScheme: MediaQueryList = window.matchMedia("(prefers-color-scheme: dark)") as MediaQueryList;

var currentTheme: string = localStorage.getItem("theme") as string;
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

var newTheme: string = "dark"
darkModeButton.addEventListener("click", function() {
    if (prefersDarkScheme) {
        document.body.classList.toggle("lightMode");
        if (document.body.classList.contains("lightMode")) {
            newTheme = "light";
            darkModeButton.innerText = "dark mode";
        } else {
            newTheme = "dark";
            darkModeButton.innerText = "light mode";
        }
    } else {
        document.body.classList.toggle("darkMode");
        if (document.body.classList.contains("darkMode")) {
            newTheme = "dark";
            darkModeButton.innerText = "light mode";
        } else {
            newTheme = "light";
            darkModeButton.innerText = "dark mode";
        }
    }
    localStorage.setItem("theme", newTheme);
});