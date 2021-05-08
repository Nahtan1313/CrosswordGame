let months = $('#months_div');
let days = $('#days_div');
const firebaseConfig = {
    apiKey: "AIzaSyDYmz46x6-qXPAoK9iBMdyYQQXUJYpgTQ0",
    authDomain: "daily-crossword-ec7e4.firebaseapp.com",
    databaseURL: "https://daily-crossword-ec7e4-default-rtdb.firebaseio.com",
    projectId: "daily-crossword-ec7e4",
    storageBucket: "daily-crossword-ec7e4.appspot.com",
    messagingSenderId: "509234491342",
    appId: "1:509234491342:web:5c9591b2798dbda5dc459f",
    measurementId: "G-P4Q7XJ3W1Z"
};
firebase.initializeApp(firebaseConfig);
$("#years_div").css("display", "block");
$(".year").css("display", "block");
$("#months_div").css("display", "none");
$("#days_div").css("display", "none");


const storage = firebase.storage();
const storageRef = firebase.storage().ref();

let year_buttons = document.getElementsByClassName("year");
let len  = year_buttons.length;
for (i = 0; i < len; i++) {
    let y = year_buttons[i].innerHTML;
    year_buttons[i].addEventListener("click", function() {

        createMonths(y);
    });
}

createMonths = function(y){
    let iString;
    let idString;
    let month_button;
    let row1 = $("<div id = 'month_row_1' class = 'month_row'></div>");
    let row2 = $("<div id = 'month_row_1' class = 'month_row'></div>");
    let row3 = $("<div id = 'month_row_1' class = 'month_row'></div>");
    let monthArr = ["January","February","March","April","May","June","July",
            "August","September","October","November","December"];
    let year = parseInt(y);
    for(let i = 1; i <= 12;i++){
        iString = (""+i).padStart(2,"0");

        idString = year + "_" + iString;
        if((year === 1978 && (i === 9 || i === 10)) ||  (year === 2015 && i > 8)){
            month_button = $("<button disabled class = 'month_"+i+"' id = '"+idString+"'>"+monthArr[i-1]+"</button>")
        }
        else{
            month_button = document.createElement('button');
            month_button.id = idString;
            month_button.classList.add("month_"+i);
            month_button.innerHTML = monthArr[i-1];
            month_button.addEventListener("click", function() {
                createDays(year, i);
            });
        }
        if(i <= 4){
            row1.append(month_button)
        }
        else if(i <= 8){
            row2.append(month_button)
        }
        else{
            row3.append(month_button)
        }
        months.append(row1, row2, row3);
        $(".month_"+i).css("background-color", "rgb("+100+","+(150)+","+(17*i));
        $(".month_"+i).css("width","25%")
        $(".month_"+i).css("height","230px")
        $(".month_"+i).css("font-size","30px")
    }
    $(".year").css("display", "none");
    $("#months_div").css("display", "block");
}

createDays = function(year, month){
    let leapYears = [1976, 1980, 1984,1988,1992,1996,2000,2004, 2008,2012]
    console.log(year, month)
    let start;
    let end;
    if(month === 2){
        start = 1;
        if(leapYears.includes(year)){
            end = 29;
        }
        else{
            end = 28;
        }
    }
    else if(month === 4 || month === 6 || month === 9 || month === 11){
        if(year === 1978 && month === 11){
            start = 6;
        }else{
            start = 1;
        }
        end = 30;
    }
    else{
        start = 1;
        if(year === 1978 && month === 8){
            end = 9;
        }
        if(year === 2015 && month === 8){
            end = 29;
        }
        else{
            end = 31;
        }
    }
    let dString;
    let mString;
    let idString;
    let dayRef;
    let date;
    let dow;
    let DayOfWeek;
    let dowDiv;
    let first = "first";
    let stringDOWs = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
    for(let d = start; d <= end; d++){
        date = new Date(year, month-1, d)
        dow = date.getUTCDay();
        if(d - start >= 7){
            first = "";
        }
        DayOfWeek = stringDOWs[dow];
        dowDiv = $("#"+DayOfWeek);
        dString = (""+d).padStart(2,"0");
        mString = (""+month).padStart(2,"0");
        idString = year + "_" + mString + "_" + dString;
        dayRef = $("<a href = 'game.html?"+idString+"'class = 'day_reference button "+ first+"' id = '"+idString+"'>"+dString+"</a>");
        dowDiv.append(dayRef);
    }
    $("#months_div").css("display", "none");
    $("#days_div").css("display", "block");
    $(".day_reference").css("margin", "70px");
    $("a").css("text-decoration","none");
    $("a").css("border","solid");
    $("a").css("padding","22px 30px 22px 30px");
    $("a").css("line-height","50px");
    $(".first").css("margin-left", "200px")
}