$(function () {
    $('[data-toggle="tooltip"]').tooltip({
        trigger : 'hover'
    })
})

var gameon = true;
var gametype = true;
var red = -1;
var green = -1;
var blue = -1;
var gamedifficulty = "easy";
var correctchoice = "none";

function toggletype() {
    var btn = document.getElementById('color-rgb');
    if(btn.classList.contains('color')) {
        btn.classList.remove('color');
        btn.classList.add('rgb');
        btn.innerHTML = 'RGB';
        gametype = false;
    } else {
        btn.classList.remove('rgb');
        btn.classList.add('color');
        btn.innerHTML = 'COLOR';
        gametype = true;
    }
}

function cleargame() {
    red = -1;
    blue = -1;
    green = -1;
    correctchoice = "none";
    for(ans of ['a','b','c','d']) {
        document.getElementById(ans).parentElement.setAttribute("style","background-color: none;");
    }
}

function newgame() {
    cleargame();
    gameon = true;
    red   = Math.floor(Math.random()*256);
    blue  = Math.floor(Math.random()*256);
    green = Math.floor(Math.random()*256);
    var pickelement = document.getElementById('pick');
    if(gametype) {
        pickelement.innerHTML = "("+red+", "+green+", "+blue+")";
        pickelement.setAttribute("style", "background-color:none;");
    } else {
        pickelement.innerHTML = "color to guess";
        pickelement.setAttribute("style", "color: rgb("+red+","+green+","+blue+"); background-color:rgb("+red+","+green+","+blue+");");
    }
    var choices = ['a','b','c','d'];
    correctchoice = choices[Math.floor(Math.random()*4)];
    var redmin   = 0;
    var redmax   = 256;
    var bluemin  = 0;
    var bluemax  = 256;
    var greenmin = 0;
    var greenmax = 256;
    if(gamedifficulty == "norm") {
        redmin   = Math.max(0,     red-50);
        redmax   = Math.min(256,   red+50);
        bluemin  = Math.max(0,    blue-50);
        bluemax  = Math.min(256,  blue+50);
        greenmin = Math.max(0,   green-50);
        greenmax = Math.min(256, green+50);
    } else if(gamedifficulty == "diff") {
        redmin   = Math.max(0,     red-25);
        redmax   = Math.min(256,   red+25);
        bluemin  = Math.max(0,    blue-25);
        bluemax  = Math.min(256,  blue+25);
        greenmin = Math.max(0,   green-25);
        greenmax = Math.min(256, green+25);
    }
    for(ans of choices) {
        var tempred   = red + 0;
        var tempblue  = blue + 0;
        var tempgreen = green + 0;
        if(correctchoice != ans) {
            tempred   = redmin + Math.floor(Math.random()*(redmax-redmin));
            tempblue  = bluemin + Math.floor(Math.random()*(bluemax-bluemin));
            tempgreen = greenmin + Math.floor(Math.random()*(greenmax-greenmin));
        }
        if(gametype) {
            document.getElementById(ans).innerHTML = 'rgb(???, ???, ???)';
            document.getElementById(ans).setAttribute("style", "color: rgb("+tempred+","+tempgreen+","+tempblue+"); background-color:rgb("+tempred+","+tempgreen+","+tempblue+");");
        } else {
            document.getElementById(ans).innerHTML = "("+tempred+", "+tempgreen+", "+tempblue+")";
            document.getElementById(ans).setAttribute("style", "background-color:none;");
        }
    }
}

document.getElementById('color-rgb').addEventListener('click', function (event) {
    toggletype();
    newgame();
});

document.getElementById('togglemode').addEventListener('click', function (event) {
    toggletype();
    newgame();
});

document.getElementById('newgame').addEventListener('click', function (event) {
    newgame();
});

document.getElementById('pick').addEventListener('click', function (event) {
    newgame();
});

document.getElementById('easy').addEventListener('click', function (event) {
    gamedifficulty = 'easy';
    newgame();
});

document.getElementById('norm').addEventListener('click', function (event) {
    gamedifficulty = 'norm';
    newgame();
});

document.getElementById('diff').addEventListener('click', function (event) {
    gamedifficulty = 'diff';
    newgame();
});

function makechoice(choice) {
    if(!gameon) newgame();
    else {
        if(correctchoice !== choice) {
            document.getElementById(choice).parentElement.setAttribute("style","background-color: #ffc9c9;");
        }
        document.getElementById(correctchoice).parentElement.setAttribute("style","background-color: #cbffc3;");
        gameon = false;
    }
}

document.getElementById('a').parentElement.addEventListener('click', function (event) {
    makechoice('a');
});

document.getElementById('b').parentElement.addEventListener('click', function (event) {
    makechoice('b');
});

document.getElementById('c').parentElement.addEventListener('click', function (event) {
    makechoice('c');
});

document.getElementById('d').parentElement.addEventListener('click', function (event) {
    makechoice('d');
});

document.addEventListener("keyup", (e) => {
    if (e.keyCode === 84) {toggletype(); newgame();}    // 't' on keyboard.
    else if (e.keyCode === 78) newgame();               // 'n' on keyboard.
    else if (e.keyCode === 49) {
        if(gamedifficulty !== 'easy') {
            gamedifficulty = 'easy';
            document.getElementById('easy').parentElement.classList.add("active");
            document.getElementById('norm').parentElement.classList.remove("active");
            document.getElementById('diff').parentElement.classList.remove("active");
        }
        newgame();
    }
    else if (e.keyCode === 50) {
        if(gamedifficulty !== 'norm') {
            gamedifficulty = 'norm';
            document.getElementById('easy').parentElement.classList.remove("active");
            document.getElementById('norm').parentElement.classList.add("active");
            document.getElementById('diff').parentElement.classList.remove("active");
        }
        newgame();
    }
    else if (e.keyCode === 51) {
        if(gamedifficulty !== 'diff') {
            gamedifficulty = 'diff';
            document.getElementById('easy').parentElement.classList.remove("active");
            document.getElementById('norm').parentElement.classList.remove("active");
            document.getElementById('diff').parentElement.classList.add("active");
        }
        newgame();
    }
    else if (e.keyCode === 65) makechoice('a');
    else if (e.keyCode === 66) makechoice('b');
    else if (e.keyCode === 67) makechoice('c');
    else if (e.keyCode === 68) makechoice('d');
});

newgame();