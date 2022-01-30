var random_country_i = 0;
var random_country_name = null;
var selected_country_name = null;

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

var g;

function get_name(feature) {
    var res = feature.properties.name;
    return res;
}

function clear_colors() {
    g.selectAll("path").classed("cc", null);
    g.selectAll("path").classed("wc", null);
}

function pick_country() {
    clear_colors();
    var n_c = g.selectAll("path").nodes().length;
    random_country_i = getRandomInt(n_c);
    random_country_name = g.selectAll("path").nodes()[random_country_i].id;
    d3.select("#find-country").node().innerHTML = "Find";
    d3.select("#country-name").node().innerHTML = random_country_name;
    d3.select("#country-name").classed("correct-country-name", null);
    d3.select("#wrong-country-note").classed("invisible-note", true);
}

function check_country(country_name) {
    var won = country_name == random_country_name;
    var class_name = won ? 'cc' : 'wc';
    g.selectAll("path").filter((d,i) => {
        return d.properties.name == country_name;
    }).classed(class_name, true);
    if(won) {
        d3.select("#find-country").node().innerHTML = "Found";
        d3.select("#country-name").classed("correct-country-name", true);
        d3.select("#wrong-country-note").classed("invisible-note", true);
    } else {
        d3.select("#wrong-country-note").classed("invisible-note", null);
        d3.select("#wrong-country-name").node().innerHTML = country_name;
    }
    return won;
}

function help() {
    check_country(random_country_name);
}

window.onload = function() {
    const width = d3.select('#map').node().clientWidth;
    const height = d3.select('#map').node().clientHeight;

    const svg = d3.select('#map').append('svg').attr('width', width).attr('height', height);

    const projection = d3.geoMercator().scale(90)
        .translate([width / 2, height / 2]);
    const path = d3.geoPath(projection);

    g = svg.append('g');

    d3.json('countries-110m.json')
        .then(data => {

            const countries = topojson.feature(data, data.objects.countries);
            g.selectAll('path').data(countries.features).enter().append('path').attr('class', 'country').attr('d', path).attr('id', get_name);
            g.selectAll('path').on("click", w => {
                selected_country_name = w.target.id;
                var won = check_country(selected_country_name);
            });
            pick_country();
        });

    let zoom = d3.zoom()
        .on('zoom', handleZoom);

    function handleZoom(e) {
        d3.select('svg g')
        .attr('transform', e.transform);
    }

    d3.select('svg').call(zoom);
};

// Add event listener on keydown
document.addEventListener('keyup', (event) => {
    // var name = event.key;
    var code = event.code;
    switch(code) {
        case "KeyN": pick_country(); break;
        case "KeyH": help(); break;
    }
  }, false);