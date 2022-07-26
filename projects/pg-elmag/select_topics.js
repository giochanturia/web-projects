document.querySelector("#select-all").addEventListener('click', event => {
    document.querySelectorAll(".topic-link").forEach(button => {button.classList.toggle("selected", true)});
})

document.querySelector("#deselect-all").addEventListener('click', event => {
    document.querySelectorAll(".topic-link").forEach(button => {button.classList.toggle("selected", false)});
})

document.querySelectorAll(".topic-link").forEach(button => {
    if(!button.classList.contains("passive")) {
    button.addEventListener('click', event => {
    button.classList.toggle("selected")})
    }
})