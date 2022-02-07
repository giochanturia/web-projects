var canvas = document.getElementById('thermal');
var testdiv = document.getElementById('testdiv');

thermal_image = new Image();
thermal_image.src = 'giochanturia_square.png';

thermal_image.onload = function(){
    canvas.setAttribute("width", String(thermal_image.width)+"px");
    canvas.setAttribute("height", String(thermal_image.height)+"px");
    context = canvas.getContext('2d');
    context.drawImage(thermal_image, 0, 0);
}

function offset(el) {
    var rect = el.getBoundingClientRect(),
    scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
    scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    return { top: rect.top + scrollTop, left: rect.left + scrollLeft }
}

canvas.addEventListener('mousemove', function(e) {
    var canvasOffset = canvas.getBoundingClientRect();//offset(canvas);
    var x = e.clientX - canvasOffset.left;
    var y = e.clientY - canvasOffset.top;
    var p = context.getImageData(x, y, 1, 1).data;
    testdiv.style.backgroundColor = "rgb("+String(p[0])+", "+String(p[1])+", "+String(p[2])+")";
    var t = rgb_to_temp(p[0], p[1], p[2]);
    var t_s = String(t);
    if((10*t)%10==0) t_s = t_s+".0";
    testdiv.innerHTML = t_s+"°C";
    if(t>=28.0) {
        testdiv.classList.add("light-bg");
    } else {
        testdiv.classList.remove("light-bg");
    }
});

// --------

var coeff_r = [-3.47488673e-03,  5.00506624e-01, -2.84775890e+01,  7.97751187e+02, -1.09568289e+04,  5.89016505e+04];
var coeff_g = [ 1.44480072e-03, -2.06304111e-01,  1.14256027e+01, -3.06278163e+02,  3.98504151e+03, -2.02068533e+04];
var coeff_b = [-8.41296065e-03,  1.10679221e+00, -5.68802849e+01,  1.42532774e+03, -1.73877950e+04,  8.25623829e+04];

var temp_low  = 19.0;
var temp_high = 34.4;

var temp_rgb = [];
for(var t=temp_low; t<=temp_high; t+=0.1) {
    var temp_i = Math.round(t*10)/10;
    temp_rgb.push({"temp": temp_i,
                    "r": red_p(temp_i),
                    "g": green_p(temp_i),
                    "b": blue_p(temp_i)});
}

function polynomial(x, coeff) {
    var res = 0.0;
    for(var i in coeff) {
        res += coeff[i]*(x**(coeff.length-1-i));
    }
    return res;
}

function red_p(t) {
    return polynomial(t, coeff_r);
}

function green_p(t) {
    return polynomial(t, coeff_g);
}

function blue_p(t) {
    return polynomial(t, coeff_b);
}

function rgb_to_temp(r, g, b) {
    var t  = temp_rgb[0]["temp"];
    var d2 = (r - temp_rgb[0]["r"])**2 + (g - temp_rgb[0]["g"])**2 + (b - temp_rgb[0]["b"])**2;
    for(var i in temp_rgb) {
        var d2_new = (r - temp_rgb[i]["r"])**2 + (g - temp_rgb[i]["g"])**2 + (b - temp_rgb[i]["b"])**2;
        if(d2_new < d2) {
            t = temp_rgb[i]["temp"];
            d2 = d2_new;
        }
    }
    return t;
}