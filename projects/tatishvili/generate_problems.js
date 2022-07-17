const resistors = document.querySelectorAll('.resistor');
var symbols = {
    "r": "R",
    "r1": "R_1",
    "r2": "R_2"
}

function make_unknown(resistor) {
    resistor.classList.add('unknown');
    resistor.querySelector('.resistor-label').innerHTML = '$ '+symbols[resistor.id]+' = ? $';
}

resistors.forEach(clicked => clicked.addEventListener('click', event => {
    resistors.forEach(el => {
        el.classList.remove('unknown');
        el.querySelector('.resistor-label').innerHTML = '$ '+symbols[el.id]+' $';
    });
    make_unknown(clicked);
    MathJax.typeset();
}))

make_unknown(document.getElementById("r"));


function getRandomInt(max) {
    return 1 + Math.floor(Math.random() * max);
  }

function series_2(unknown) {
    r1_value = getRandomInt(10);
    r2_value = getRandomInt(10);
    r_value  = r1_value + r2_value;
    problem_text_object = document.getElementById("problem-text");
    problem_text = "$R_1 = "+ r1_value +"$ ომი.";
    problem_text_object.innerHTML = problem_text;
    MathJax.typeset();
}