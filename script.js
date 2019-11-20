//automatically refresh the web page on the hour

$(document).ready(function(){
    let time= moment().format("h:mm:ss");
    let timeSplit = time.split(":"); 
    let minutesToRefresh= 59 - parseInt(timeSplit[1]); 
    let secondsToRefresh= 60- parseInt(timeSplit[2]); 
    let timeToRefresh= minutesToRefresh*60 + secondsToRefresh; 
    let secondsElapsed=0; 
    let timerUntilStartReloading= setInterval(function(){ 
        secondsElapsed++
        if (secondsElapsed === timeToRefresh){
            console.log(moment()); 
            let isReloading= confirm("It's a new hour! Would you like to reload the page?"); 
            if (isReloading) {
                window.location.reload(true);
            } else {
                alert("Automatic hourly reloading will no longer occur unless you reload the page."); 
            }
        }
    },1000);
}); 

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
    newTimeBlockEL.appendTo(".container"); 

}; 

// Get previously saved items to populate planner
let savedDayPlans;
let locationArr = []; 

function populateSavedEvents(){
    savedDayPlans= localStorage.getItem("savedDayPlans"); 
    locationArr=[]; 
    if (savedDayPlans === null || savedDayPlans=== "") {
        savedDayPlans = []; 
    } else {
        savedDayPlans = JSON.parse(savedDayPlans); 
        for (i=0; i<savedDayPlans.length; i++) {
            locationArr.push(savedDayPlans[i].time); 
        }
    }
    
    for (let i=0; i<locationArr.length; i++) {
        let timeBlockElid = "#"+locationArr[i]; 
        let timeBlockEl = $(timeBlockElid).children(".row").children("textarea"); 
        $(timeBlockElid).children(".row").children("button").attr("data-event", "yes"); 
        timeBlockEl.text(savedDayPlans[i].event); 
    }    
}

populateSavedEvents(); 

//clear local storage

function clearLocalStorage() {
    savedDayPlans=[]; 
    localStorage.setItem("savedDayPlans", savedDayPlans); 
}

// Save entries in the planner to local storage

function saveEvent(time,input){
    alert("You saved your event!"); 
    savedDayPlans.push({"time":time,
    "event": input
    }); 
    localStorage.setItem("savedDayPlans", JSON.stringify(savedDayPlans)); 
}

function removeEvent(index){
    locationArr.splice([index], 1); 
    savedDayPlans.splice([index],1); 
}

function clearEvent(isClear,index,location){
    if (isClear) {
        alert("You cleared this event");
        removeEvent(index); 
        $(this).attr("data-event", "none");  
        localStorage.setItem("savedDayPlans", JSON.stringify(savedDayPlans));
    }  else {
        location.val(savedDayPlans[index].event); 
        alert("Event was not cleared"); 
    } 
}

$(".time-block").delegate("button", "click", function(){
    event.preventDefault();
    let eventInput= $(this).siblings("textarea").val(); 
    let eventTime= $(this).siblings("p").text(); 
    let location = $(this).siblings("textarea"); 
    let isPopulated= $(this).attr("data-event"); 
    let indexSavedTime= locationArr.indexOf(eventTime);
    
    if(eventInput.trim() !==""){
       if (isPopulated === "none"){
            saveEvent(eventTime, eventInput); 
       } else if (isPopulated === "yes"){
            if (savedDayPlans[indexSavedTime].event === eventInput){
                return; 
            }
            removeEvent(indexSavedTime); 
            saveEvent(eventTime, eventInput); 
       }  
    } else if (eventInput.trim() === "" && isPopulated=== "yes") { 
        let isClear= confirm("Do you want to clear this event?");
        clearEvent(isClear, indexSavedTime, location,); 
    }
    populateSavedEvents(); 
}); 
        
//Changing colors based on time functions and code 

    //getting the current time of day
let timeOfDay= moment().format("hA"); 

    //Need to get class and select past/present/future and change based on time of day
let allTimeBlockEl= $(".time-block"); 

 for (let i=0; i<allTimeBlockEl.length; i++){
    let timeBlock= $(allTimeBlockEl[i]); 
    let timeBlockId= timeBlock.attr("id");
    let timeBlockTextarea=timeBlock.children(".row").children("textarea");  
    if (timeBlockId === timeOfDay){
        timeBlockTextarea.addClass("present"); 
    } else if (moment(timeBlockId, "hA").isBefore()) {
        timeBlockTextarea.addClass("past"); 
    } else if (moment(timeBlockId, "hA").isAfter()) {
        timeBlockTextarea.addClass("future"); 
    }
}
   
//clear button remove events

$("#clear").on("click",function(){
    if(confirm("Are you sure you want to clear all saved events?")){
       clearLocalStorage(); 
       $(".time-block").find("textarea").val("");
       $(".time-block").find("button").attr("data-event", "none"); 
       locationArr=[];   
      }
})

// Save all- I feel like I should have made some of this into functions to avoid repetition  but its hard to wrap my mind around now after the fact 
 $("#saveAll").on("click", function(){   
     for( let i=0; i < allTimeBlockEl.length; i++) {
        let timeBlock= $(allTimeBlockEl[i]); 
        let timeBlockId= timeBlock.attr("id");
        let timeBlockTextarea=timeBlock.children(".row").children("textarea"); 
        let timeBlockButton=timeBlock.children(".row").children("button");
        let eventInput= timeBlockTextarea.val(); 
        let isPopulated= timeBlockButton.attr("data-event");
        let indexSavedTime= locationArr.indexOf(timeBlockId);
        console.log("for timeblock " + timeBlockId + " it has the event " +eventInput+ " and the attribute " + isPopulated ); 
    
        if (eventInput.trim() === "" && isPopulated === "yes"){
            let isSaved= confirm("At "+timeBlockId+": Would you like to clear the event '"+savedDayPlans[indexSavedTime].event+"' ?"); 
            clearEvent(isSaved,indexSavedTime,timeBlockTextarea); 
        } else if (eventInput.trim() !== "" && isPopulated ==="none"){
            let isSaved= confirm("At "+timeBlockId+": Would you like to add the event '"+eventInput+ "'?"); 
            if(isSaved) {
                saveEvent(timeBlockId, eventInput); 
            } else {
                timeBlockTextarea.val(""); 
            }
        } else if (eventInput.trim() !== "" && isPopulated=== "yes"){
            if (savedDayPlans[indexSavedTime].event !== eventInput){     
                let isSaved= confirm("At "+timeBlockId+": Would you like to change the event from '"+savedDayPlans[indexSavedTime].event+"' to '"+eventInput+"'?"); 
                if(isSaved) {
                    removeEvent(indexSavedTime); 
                    saveEvent(timeBlockId, eventInput); 
                } else{
                    alert("Change was not saved."); 
                    timeBlockTextarea.val(savedDayPlans[indexSavedTime].event); 
                }
            }
         }
    }
    populateSavedEvents(); 
    alert("There are no unsaved changes"); 
 }); 



