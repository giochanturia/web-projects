var country_data = null;
var country_codes = [];
var country_names = [];
var default_gray   = "#3d3d3d";
var default_red    = "#FF6464";
var default_green  = "#91C483";
var default_orange = "#FFE162";

var random_country = null;
var selected_country = null;

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

var map = null;
window.addEventListener("load", function() {
    map = document.getElementById("map").contentWindow.document;

    d3.json("country-data.json").then(function(result) {
        country_data = result;
        for(var c in country_data) {
            if(c == "World")    continue;
            country_codes.push(c);
            country_names.push(country_data[c].name);
            color_country(c, default_gray);
        }
    }, () => {
        console.log("Something is wrong with the json file.");
    });

});

function color_country(country_code, color) {
    var gc = map.getElementById(country_code);
    if (gc == null) return 0;
    
    for(var i in gc.querySelectorAll("*")) {
        var child = gc.querySelectorAll("*")[i];
        if(child.tagName == "path") child.setAttribute("fill", color);
    }
}

function randomize_country() {
    random_country = country_codes[getRandomInt(country_codes.length)];
    if(map.getElementById(random_country) == null) randomize_country();
}

function next_round() {
    color_country(random_country, default_gray);
    color_country(selected_country, default_gray);
    randomize_country();
}