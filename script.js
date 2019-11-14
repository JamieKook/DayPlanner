//Element names

let timeBlockContainer = $(".container"); 
let todaysDateEl= $("#currentDay"); 


//Code generating the current date 
todaysDateEl.text(moment().format("dddd, MMMM Do")); 

//Code to generate time blocks
let timesArr= ["9AM","10AM", "11AM", "12PM", "1PM", "2PM", "3PM", "4PM", "5PM"]; 

for (i=1; i<timesArr.length; i++){
    let newTimeBlockEL= $("#9am").clone();
    newTimeBlockEL.attr("id", timesArr[i]); 
    newTimeBlockEL.children(".row").attr("style", "white-space: pre-Wrap"); 
    newTimeBlockEL.children(".row").children(".hour").text(timesArr[i]); 
    newTimeBlockEL.appendTo(".container"); 

}; 
