//Element names

let timeBlockContainer = $(".container"); 
let todaysDateEl= $("#currentDay"); 


//Code generating the current date 
todaysDateEl.text(moment().format("dddd, MMMM Do")); 

//Code to generate time blocks
let timesArr= ["9AM","10AM", "11AM", "12PM", "1PM", "2PM", "3PM", "4PM", "5PM"]; 

for (let i=1; i<timesArr.length; i++){
    let newTimeBlockEL= $("#9AM").clone();
    newTimeBlockEL.attr("id", timesArr[i]); 
    newTimeBlockEL.children(".row").attr("style", "white-space: pre-Wrap"); 
    newTimeBlockEL.children(".row").children(".hour").text(timesArr[i]); 
    newTimeBlockEL.children(".row").children("button").attr("id", timesArr[i]+"B"); 
    newTimeBlockEL.appendTo(".container"); 

}; 

// Get previously saved items to populate planner
let savedDayPlans; 
savedDayPlans= localStorage.getItem("savedDayPlans"); 
let locationArr = []; 

populateSavedEvents(); 

function populateSavedEvents(){
    if (savedDayPlans === null || savedDayPlans=== "") {
        savedDayPlans = []; 
    } else {
        savedDayPlans = JSON.parse(savedDayPlans); 
        for (i=0; i<savedDayPlans.length; i++) {
            locationArr.push(savedDayPlans[i].time); 
        }
        console.log("Locations with saved events are " + locationArr);   
    }
    
    for (let i=0; i<locationArr.length; i++) {
        let timeBlockElid = "#"+locationArr[i]; 
        let timeBlockEl = $(timeBlockElid).children(".row").children("textarea"); 
        console.log(timeBlockEl); 
        timeBlockEl.text(savedDayPlans[i].event); 
    }    

}

//clear local storage

function clearLocalStorage() {
    savedDayPlans=[]; 
    localStorage.setItem("savedDayPlans", savedDayPlans); 
}

// Save entries in the planner to local storage

$(".time-block").delegate("button", "click", function(){
    event.preventDefault();

    let eventInput= $(this).siblings("textarea").val(); 
    let eventTime= $(this).siblings("h3").text(); 
    let location = $(this).siblings("textarea"); 
   
    console.log(eventTime); 
    if(eventInput.trim() !==""){
        alert("You saved your event!"); 
    
    //need to add code to overwrite old entries- it does this because it adds to the end and takes the last value. Too much space used? 
        savedDayPlans.push({"time":eventTime,
                            "event": eventInput,
                            "location": location, 
                        }); 
        
        localStorage.setItem("savedDayPlans", JSON.stringify(savedDayPlans));
    } 
})

//Changing colors based on time functions and code 

    //getting the current time of day
let timeOfDay= moment().format("hA"); 
console.log(timeOfDay); 

    //Need to get class and select past/present/future and change based on time of day

let allTimeBlockEl= $(".time-block"); 
console.log(allTimeBlockEl[0]); 

 for (let i=0; i<allTimeBlockEl.length; i++){
     let timeBlock= $(allTimeBlockEl[i]); 
    let timeBlockId= timeBlock.attr("id");
    let timeBlockTextarea=timeBlock.children(".row").children("textarea");  
    console.log(timeBlockId);
    if (timeBlockId === timeOfDay){
        timeBlockTextarea.removeClass("past"); 
        timeBlockTextarea.removeClass("future"); 
        timeBlockTextarea.addClass("present"); 

    } else if (moment(timeBlockId, "hA").isBefore()) {
        timeBlockTextarea.removeClass("present"); 
        timeBlockTextarea.removeClass("future"); 
        timeBlockTextarea.addClass("past"); 
    } else if (moment(timeBlockId, "hA").isAfter()) {
        timeBlockTextarea.removeClass("present"); 
        timeBlockTextarea.removeClass("past"); 
        timeBlockTextarea.addClass("future"); 
    }
}
   
//clear button remove events

$("#clear").on("click",function(){
    if(confirm("Are you sure you want to clear all saved events?")){
       clearLocalStorage(); 
       $(".time-block").find("textarea").text(""); 
      }
   
})

