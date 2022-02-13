$("#theme-switch").load("/templates/theme-switch.html");

const stored_theme = localStorage.getItem("theme");
if(stored_theme) {
    set_theme(stored_theme);
}

function set_theme(theme) {
    var body = document.getElementsByTagName("body")[0];
    body.className = theme;
    localStorage.setItem("theme", theme);
}