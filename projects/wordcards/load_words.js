var wl_file = null;
var wordlist = [];
wordlist.columns = ["DE", "EN"];
wordlist.push({"DE": "der Test, -e", "EN": "test"});

function update_word_count() {
    document.getElementById("wordcount").innerHTML = wordlist.length.toString();
}

function csv_to_wordlist(csv_file) {
    d3.csv(csv_file).then(function(result) {
        wordlist = result;
        update_word_count();
        load_next_word();
    }, () => {
        alert("Something is wrong with your file! Is it CSV?");
    });
}

function csv_string_to_wordlist(csv_string) {
    let wordlist_temp = d3.csvParse(csv_string);
    if(wordlist_temp["columns"].includes("DE") & wordlist_temp["columns"].includes("EN")) {
        wordlist = wordlist_temp;
        update_word_count();
        load_next_word();
    } else {
        alert("Your file has to have columns DE and EN. Try again.");
    }
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

function determineGender(word) {
    let classname = "noun-";
    switch(word.substr(0,3)) {
        case "der": classname=classname.concat("m"); break;
        case "die": classname=classname.concat("f"); break;
        case "das": classname=classname.concat("n"); break;
    }
    return classname;
}

function load_next_word() {
    if(document.getElementById("flipBeforeNext").checked) {
        if(document.getElementsByClassName("flip-card-inner")[0].classList.contains("flip-card-anim")){
            flip_card();
        }
    }

    german_side = 'back';
    english_side = 'front';

    let german_card = document.getElementsByClassName('flip-card-'.concat(german_side))[0];
    let english_card = document.getElementsByClassName('flip-card-'.concat(english_side))[0];

    english_card.getElementsByTagName('h3')[0].innerHTML = "";
    german_card.getElementsByTagName('h3')[0].innerHTML = "";

    setTimeout(() => {

    let i = getRandomInt(wordlist.length);
    let word = wordlist[i];

    english_card.getElementsByTagName('h3')[0].innerHTML = word["EN"];
    german_card.getElementsByTagName('h3')[0].innerHTML = word["DE"];

    german_card.classList = ['flip-card-'.concat(german_side)];
    german_card.classList.add(determineGender(word["DE"]));
    }, 400);
}

// Add event listener on keydown
document.addEventListener('keyup', (event) => {
    // var name = event.key;
    var code = event.code;
    switch(code) {
        case "KeyN": load_next_word(); break;
        case "KeyF": flip_card(); break;
    }
  }, false);

function use_file(file_input) {
    wl_file = file_input.files[0];
    fr = new FileReader();
    fr.onload = function(e) {
        csv_string_to_wordlist(e.target.result);
    };
    fr.readAsBinaryString(wl_file);
}

function load_default_file(filename = "words.csv") {
    csv_to_wordlist(filename);
}

load_default_file();