function getRandomInt(max) {
    return 1 + Math.floor(Math.random() * max);
  }

  function gcd(x, y) {
    if ((typeof x !== 'number') || (typeof y !== 'number')) 
      return false;
    x = Math.abs(x);
    y = Math.abs(y);
    while(y) {
      var t = y;
      y = x % y;
      x = t;
    }
    return x;
  }

function set_theme(theme) {
    d3.select("body").node().classList = [theme]
}

var problem_counter = 0;

class Problem {
    constructor(name, container_id="problems") {
        problem_counter++;
        this.name = name;
        this.container = d3.select("#"+container_id).append("div").attr("id", "problem-" + problem_counter).attr("class", "problem");
        this.diagram_container = this.container.append("div").attr("id", "diagram-container");
        this.diagram_container.append("h4").attr("id", "problem-title").text(problem_counter + ". " + name + " ")
        .append("button").attr("id", "change-numbers").text("რიცხვების შეცვლა")
        .node().addEventListener('click', event => {
            this.change_numbers();
        });

        this.diagram_w = 360;
        this.diagram_h = 240;
        this.diagram_svg = this.diagram_container.append("div").attr("id", "svg-container").append("svg").attr("id", "diagram")
        .attr("width", this.diagram_w).attr("height", this.diagram_h).attr("viewBox", "0 0 360 240");

        this.text_container = this.container.append("div").attr("id", "text-fields");
        this.text_container.append("p").attr("id", "problem-text");
        this.text_container.append("p").attr("id", "problem-question");
        this.text_container.append("p").attr("id", "answer-text").attr("class", "hidden");

        this.resistor_w = 100;
        this.resistor_h = 40;
        this.resistor_corner_radius = 5;

        this.label_w = 100;
        this.label_h = 40;

    }

    plot_resistor(r, rx, ry, rw=this.resistor_w, rh=this.resistor_h, label_below=false) {
        var diagram_r = this.diagram_svg.append("g").attr("id",r).attr("class","resistor");
        diagram_r.append("rect").attr("x", rx).attr("y", ry).attr("width", rw).attr("height", rh).attr("rx", this.resistor_corner_radius);
        var label_x = rx;
        var label_y = ry;
        if(label_below==true) {
            label_x = rx + rw/2 - this.label_w/2;
            label_y = ry + rh;
        }
        diagram_r
        .append("foreignObject")
        .attr("x", label_x).attr("y", label_y).attr("width", this.label_w).attr("height", this.label_h)
        .append("xhtml:div")
        .attr("xmlns", "http://www.w3.org/1999/xhtml").attr("class", "resistor-label")
        .text("$"+this.symbols[r]+"$");

        return diagram_r.node();
    }

    plot_wire(x1, x2, y1, y2) {
        this.diagram_svg.append("line").attr("class", "wire").attr("x1",x1).attr("x2",x2).attr("y1",y1).attr("y2",y2);
    }

    plot_source(cx, cy, r=4) {
        this.diagram_svg.append("circle").attr("class", "source").attr("cx",cx).attr("cy",cy).attr("r",r);
        this.diagram_svg.append("line").attr("class", "source").attr("x1",cx-10).attr("x2",cx+10).attr("y1",cy-10).attr("y2",cy+10);
    }

    clear_unknown() {
        Object.values(this.svg_resistors).forEach(el => {
            el.classList.remove('unknown');
            el.querySelector('.resistor-label').innerHTML = '$ '+this.symbols[el.id]+' $';
        })
    }

    make_unknown(resistor) {
        resistor.classList.add('unknown');
        resistor.querySelector('.resistor-label').innerHTML = '$ '+this.symbols[resistor.id]+' = ? $';
        this.unknown = resistor.id;
        Object.keys(this.known).forEach(key => {
            this.known[key] = key != resistor.id;
        })
        this.update_text_fields();
    }

    add_event_listeners_to_resistors() {
        Object.values(this.svg_resistors).forEach(clicked => clicked.addEventListener('click', event => {
            this.clear_unknown()
            this.make_unknown(clicked);
            MathJax.typeset();
        }))
    }

    generate_symbol(key, include_value=false) {
        var text = "$"+this.symbols[key]
        if(include_value==true) {
            text+= "="+this.values[key];
        }
        text += "$"
        if(include_value==true) {
            text+=" "+this.units[key];
        }
        return text;
    }

    gs(key) {
        return this.generate_symbol(key, this.known[key]);
    }

    update_text_fields() {
        this.container.select("#problem-text").text(this.generate_text());
        this.container.select("#problem-question").text(this.generate_question());
        this.container.select("#answer-text").text(this.generate_answer());
    }
}


class Series2 extends Problem {
    constructor(container_id="problems", name="მიმდევრობით შეერთებული რეზისტორები", r1=getRandomInt(50), r2=getRandomInt(50), r_units="ომი") {
        super(name, container_id);
        
        this.r1 = r1;
        this.r2 = r2;
        this.calculate_answer();
        this.unknown = 'r';
        this.r_units = r_units

        this.symbols = {
            "r": "R",
            "r1": "R_1",
            "r2": "R_2"
        }
        this.values = {
            "r": this.r,
            "r1": this.r1,
            "r2": this.r2
        }
        this.units = {
            "r": this.r_units,
            "r1": this.r_units,
            "r2": this.r_units
        }
        this.known = {
            "r": false,
            "r1": true,
            "r2": true
        }

        this.svg_resistors = {
            "r":  this.plot_resistor("r", 40, 80, 280, 80, true),
            "r1": this.plot_resistor("r1", 60, 100),
            "r2": this.plot_resistor("r2", 200, 100)
        }

        this.plot_wire(20,60,120,120);
        this.plot_wire(160,200,120,120);
        this.plot_wire(300,340,120,120);
        this.plot_source(20,120);
        this.plot_source(340,120);

        this.add_event_listeners_to_resistors();
        this.make_unknown(this.svg_resistors['r']);

        this.update_text_fields();
    }

    calculate_answer() {
        this.r  = this.r1+this.r2;
    }

    change_numbers(r1=getRandomInt(50), r2=getRandomInt(50)) {
        this.r1 = r1;
        this.r2 = r2;
        this.calculate_answer();
        this.values = {
            "r": this.r,
            "r1": this.r1,
            "r2": this.r2
        }
        this.update_text_fields();
        MathJax.typeset();
    }

    generate_text() {
        var text = `რეზისტორები
        ${this.gs("r1")} და ${this.gs("r2")} შეერთებულია მიმდევრობით.
        სრული წინაღობაა ${this.gs("r")}.`
        return text;
    }

    generate_question() {
        return `იპოვეთ ${this.generate_symbol(this.unknown)}.`
    }

    generate_answer() {
        return `პასუხი: ${this.generate_symbol(this.unknown, true)}.`
    }
}

class Parallel2 extends Problem {
    constructor(container_id="problems", name="პარალელურად შეერთებული რეზისტორები", r1=getRandomInt(50), r2=getRandomInt(50), r_units="ომი") {
        super(name, container_id);
        
        this.r1 = r1;
        this.r2 = r2;
        this.calculate_answer();
        this.unknown = 'r';
        this.r_units = r_units

        this.symbols = {
            "r": "R",
            "r1": "R_1",
            "r2": "R_2"
        }
        this.values = {
            "r": this.r_tex,
            "r1": this.r1,
            "r2": this.r2
        }
        this.units = {
            "r": this.r_units,
            "r1": this.r_units,
            "r2": this.r_units
        }
        this.known = {
            "r": false,
            "r1": true,
            "r2": true
        }

        this.svg_resistors = {
            "r":  this.plot_resistor("r", 40, 50, 280, 140, true),
            "r1": this.plot_resistor("r1", 130, 70),
            "r2": this.plot_resistor("r2", 130, 130)
        }

        this.plot_wire(20,80,120,120);
        
        this.plot_wire(80,80,90,150);
        this.plot_wire(80,130,90,90);
        this.plot_wire(80,130,150,150);

        this.plot_wire(280,280,90,150);
        this.plot_wire(230,280,90,90);
        this.plot_wire(230,280,150,150);

        this.plot_wire(280,340,120,120);
        this.plot_source(20,120);
        this.plot_source(340,120);

        this.add_event_listeners_to_resistors();
        this.make_unknown(this.svg_resistors['r']);

        this.update_text_fields();
    }

    calculate_answer() {
        this.r_num = (this.r1*this.r2);
        this.r_den = (this.r1+this.r2);
        this.r_gcd = gcd(this.r_num, this.r_den);
        this.r_num = this.r_num / this.r_gcd;
        this.r_den = this.r_den / this.r_gcd;
        this.r  = this.r_num/this.r_den;
        this.r_tex = "\\frac{"+this.r_num+"}{"+this.r_den+"}";
        if(this.r_den == 1) {
            this.r_tex = this.r_num;
        }
    }

    change_numbers(r1=getRandomInt(50), r2=getRandomInt(50)) {
        this.r1 = r1;
        this.r2 = r2;
        this.calculate_answer();
        this.values = {
            "r": this.r_tex,
            "r1": this.r1,
            "r2": this.r2
        }
        this.update_text_fields();
        MathJax.typeset();
    }

    generate_text() {
        var text = `რეზისტორები
        ${this.gs("r1")} და ${this.gs("r2")} შეერთებულია პარალელურად.
        სრული წინაღობაა ${this.gs("r")}.`
        return text;
    }

    generate_question() {
        return `იპოვეთ ${this.generate_symbol(this.unknown)}.`
    }

    generate_answer() {
        return `პასუხი: ${this.generate_symbol(this.unknown, true)}.`
    }
}


class Series2Parallel extends Problem {
    constructor(container_id="problems", name="მიმდევრობით და პარალელურად შეერთებული რეზისტორები", r1=getRandomInt(50), r2=getRandomInt(50), r3=getRandomInt(50), r_units="ომი") {
        super(name, container_id);
        
        this.r1 = r1;
        this.r2 = r2;
        this.r3 = r3;
        this.calculate_answer();
        this.unknown = 'r';
        this.r_units = r_units

        this.symbols = {
            "r": "R",
            "r1": "R_1",
            "r2": "R_2",
            "r3": "R_3"
        }
        this.values = {
            "r": this.r_tex,
            "r1": this.r1,
            "r2": this.r2,
            "r3": this.r3,
        }
        this.units = {
            "r": this.r_units,
            "r1": this.r_units,
            "r2": this.r_units,
            "r3": this.r_units
        }
        this.known = {
            "r": false,
            "r1": true,
            "r2": true,
            "r3": false
        }

        this.svg_resistors = {
            "r":  this.plot_resistor("r", 40, 50, 280, 140, true),
            "r1": this.plot_resistor("r1", 70, 70),
            "r2": this.plot_resistor("r2", 190, 70),
            "r3": this.plot_resistor("r3", 130, 130)
        }

        this.plot_wire(20,60,120,120);
        
        this.plot_wire(60,60,90,150);
        this.plot_wire(60,70,90,90);
        this.plot_wire(60,130,150,150);

        this.plot_wire(170,190,90,90);

        this.plot_wire(300,300,90,150);
        this.plot_wire(290,300,90,90);
        this.plot_wire(230,300,150,150);

        this.plot_wire(300,340,120,120);

        this.plot_source(20,120);
        this.plot_source(340,120);

        this.add_event_listeners_to_resistors();
        this.make_unknown(this.svg_resistors['r']);

        this.update_text_fields();
    }

    calculate_answer() {
        this.r12 = this.r1+this.r2;
        this.r_num = (this.r12*this.r3);
        this.r_den = (this.r12+this.r3);
        this.r_gcd = gcd(this.r_num, this.r_den);
        this.r_num = this.r_num / this.r_gcd;
        this.r_den = this.r_den / this.r_gcd;
        this.r  = this.r_num/this.r_den;
        this.r_tex = "\\frac{"+this.r_num+"}{"+this.r_den+"}";
        if(this.r_den == 1) {
            this.r_tex = this.r_num;
        }
    }

    change_numbers(r1=getRandomInt(50), r2=getRandomInt(50), r3=getRandomInt(50)) {
        this.r1 = r1;
        this.r2 = r2;
        this.r3 = r3;
        this.calculate_answer();
        this.values = {
            "r": this.r_tex,
            "r1": this.r1,
            "r2": this.r2,
            "r3": this.r3
        }
        this.update_text_fields();
        MathJax.typeset();
    }

    generate_text() {
        var text = `რეზისტორები
        ${this.gs("r1")} და ${this.gs("r2")} შეერთებულია მიმდევრობით.
        ეს უბანი, თავის მხრივ, შეერთებულია ${this.generate_symbol("r3")} რეზისტორთან პარალელურად. `
        if(this.unknown != "r3") {
            text += `${this.gs("r3")}. `
        }
        text += `სრული წინაღობაა ${this.gs("r")}.`
        return text;
    }

    generate_question() {
        return `იპოვეთ ${this.generate_symbol(this.unknown)}.`
    }

    generate_answer() {
        return `პასუხი: ${this.generate_symbol(this.unknown, true)}.`
    }
}


class Parallel2Series extends Problem {
    constructor(container_id="problems", name="პარალელურად და მიმდევრობით შეერთებული რეზისტორები", r1=getRandomInt(50), r2=getRandomInt(50), r3=getRandomInt(50), r_units="ომი") {
        super(name, container_id);
        
        this.r1 = r1;
        this.r2 = r2;
        this.r3 = r3;
        this.calculate_answer();
        this.unknown = 'r';
        this.r_units = r_units

        this.symbols = {
            "r": "R",
            "r1": "R_1",
            "r2": "R_2",
            "r3": "R_3"
        }
        this.values = {
            "r": this.r_tex,
            "r1": this.r1,
            "r2": this.r2,
            "r3": this.r3,
        }
        this.units = {
            "r": this.r_units,
            "r1": this.r_units,
            "r2": this.r_units,
            "r3": this.r_units
        }
        this.known = {
            "r": false,
            "r1": true,
            "r2": true,
            "r3": false
        }

        this.svg_resistors = {
            "r":  this.plot_resistor("r", 40, 50, 280, 140, true),
            "r1": this.plot_resistor("r1", 70, 70),
            "r2": this.plot_resistor("r2", 70, 130),
            "r3": this.plot_resistor("r3", 200, 100)
        }

        this.plot_wire(20,60,120,120);
        
        this.plot_wire(60,60,90,150);
        this.plot_wire(60,70,90,90);
        this.plot_wire(60,70,150,150);

        this.plot_wire(180,180,90,150);
        this.plot_wire(170,180,90,90);
        this.plot_wire(170,180,150,150);

        this.plot_wire(180,200,120,120);

        this.plot_wire(300,340,120,120);

        this.plot_source(20,120);
        this.plot_source(340,120);

        this.add_event_listeners_to_resistors();
        this.make_unknown(this.svg_resistors['r']);

        this.update_text_fields();
    }

    calculate_answer() {
        this.r12_num = this.r1*this.r2;
        this.r12_den = this.r1+this.r2;
        this.r_num = this.r12_num + this.r12_den*this.r3;
        this.r_den = this.r12_den;
        this.r_gcd = gcd(this.r_num, this.r_den);
        this.r_num = this.r_num / this.r_gcd;
        this.r_den = this.r_den / this.r_gcd;
        this.r  = this.r_num/this.r_den;
        this.r_tex = "\\frac{"+this.r_num+"}{"+this.r_den+"}";
        if(this.r_den == 1) {
            this.r_tex = this.r_num;
        }
    }

    change_numbers(r1=getRandomInt(50), r2=getRandomInt(50), r3=getRandomInt(50)) {
        this.r1 = r1;
        this.r2 = r2;
        this.r3 = r3;
        this.calculate_answer();
        this.values = {
            "r": this.r_tex,
            "r1": this.r1,
            "r2": this.r2,
            "r3": this.r3
        }
        this.update_text_fields();
        MathJax.typeset();
    }

    generate_text() {
        var text = `რეზისტორები
        ${this.gs("r1")} და ${this.gs("r2")} შეერთებულია პარალელურად.
        ეს უბანი, თავის მხრივ, შეერთებულია ${this.generate_symbol("r3")} რეზისტორთან მიმდევრობით. `
        if(this.unknown != "r3") {
            text += `${this.gs("r3")}. `
        }
        text += `სრული წინაღობაა ${this.gs("r")}.`
        return text;
    }

    generate_question() {
        return `იპოვეთ ${this.generate_symbol(this.unknown)}.`
    }

    generate_answer() {
        return `პასუხი: ${this.generate_symbol(this.unknown, true)}.`
    }
}


// Execution:

var p1 = new Series2();
var p2 = new Parallel2();
var p3 = new Series2Parallel();
var p4 = new Parallel2Series();
// var p5 = new Series2();
// var p6 = new Parallel2();
// var p7 = new Series2Parallel();
// var p8 = new Parallel2Series();