// Set the date we're counting down to
var birthday = new Date("Apr 13, 1995 05:00 GMT+04");

// Update the count down every 1 second
var x = setInterval(function() {

// Get today's date and time
var now = new Date();
var last_birthday = new Date("Apr 13, 1995 05:00 GMT+04");
last_birthday.setFullYear(now.getFullYear());
while(now.getTime() - last_birthday.getTime() < 0) {
    last_birthday.setFullYear(last_birthday.getFullYear()-1);
}

// Find the distance between now and the count down date
var distance = now.getTime() - last_birthday.getTime();

// Time calculations for days, hours, minutes and seconds
var seconds_unit = 1000;
var minutes_unit = seconds_unit * 60;
var hours_unit   = minutes_unit * 60;
var days_unit    = hours_unit * 24;

var years = last_birthday.getFullYear() - birthday.getFullYear();
var days = Math.floor(distance / (days_unit));
var hours = Math.floor((distance % (days_unit)) / (hours_unit));
var minutes = Math.floor((distance % (hours_unit)) / (minutes_unit));
var seconds = Math.floor((distance % (minutes_unit)) / seconds_unit);

var years_text = (years != 1) ? " years, " : " year, ";
var days_text = (days != 1) ? " days, " : " day, ";
var hours_text = (hours != 1) ? " hours, " : " hour, ";
var minutes_text = (minutes != 1) ? " minutes, " : " minute, ";
var seconds_text = (seconds != 1) ? " seconds" : " second";

// Display the result in the element with id="demo"
document.getElementById("exactage").innerHTML = years + years_text
+ days + days_text
+ hours + hours_text
+ minutes + minutes_text
+ seconds + seconds_text;

}, 1000);