//automatically refresh the web page on the hour

let timerUntilStartReloading; 

$(document).ready(function(){
    let time= moment().format("h:mm:ss");
    console.log(time); 
    let timeSplit = time.split(":"); 
    console.log(timeSplit); 
    let minutesToRefresh= 59 - parseInt(timeSplit[1]); 
    let secondsToRefresh= 60- parseInt(timeSplit[2]); 
    let timeToRefresh= minutesToRefresh*60 + secondsToRefresh; 
    console.log(timeToRefresh); 
    console.log(moment().add(timeToRefresh,"s")); 

    let secondsElapsed=0; 

    timerUntilStartReloading= setInterval(function(){ 
        secondsElapsed++
        if (secondsElapsed === timeToRefresh){
            let isReloading= confirm("It's a new hour! Would you like to reload the page?"); 
            if (isReloading) {
                console.log("reloading page!");
                reload_page(); 
            } else {
                alert("Automatic hourly reloading will no longer occur unless you reload the page."); 
            }
        }
    },1000);
}); 

    
function reload_page(){
    
   window.location.reload(true);

}

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
    // newTimeBlockEL.children(".row").children("button").attr("id", timesArr[i]+"B"); 
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
        console.log("Locations with saved events are " + locationArr);   
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

$(".time-block").delegate("button", "click", function(){
    event.preventDefault();

    let eventInput= $(this).siblings("textarea").val(); 
    let eventTime= $(this).siblings("p").text(); 
    let location = $(this).siblings("textarea"); 

   
    let isPopulated= $(this).attr("data-event"); 
    console.log(eventTime); 
    console.log(isPopulated); 

    let indexSavedTime= locationArr.indexOf(eventTime);
    if(eventInput.trim() !==""){
        
       if (isPopulated === "none"){
            alert("You saved your event!"); 
    
            savedDayPlans.push({"time":eventTime,
            "event": eventInput,
            "location": location, 
            }); 

            // $(this).attr("data-event", "yes"); 

            localStorage.setItem("savedDayPlans", JSON.stringify(savedDayPlans));
         

       } else if (isPopulated === "yes"){

            if (savedDayPlans[indexSavedTime].event === eventInput){
                return; 
            }

            locationArr.splice([indexSavedTime], 1); 
            savedDayPlans.splice([indexSavedTime],1); 

            alert("You saved your event!"); 
    
            savedDayPlans.push({"time":eventTime,
            "event": eventInput,
            "location": location, 
            }); 

            // $(this).attr("data-event", "yes"); 

            localStorage.setItem("savedDayPlans", JSON.stringify(savedDayPlans));
       }
       
    } else if (eventInput.trim() === "" && isPopulated=== "yes") {
            console.log(indexSavedTime); 
            let isClear= confirm("Do you want to clear this event?"); 
            if (isClear) {
                alert("You cleared this event");
                
                locationArr.splice([indexSavedTime], 1); 
                savedDayPlans.splice([indexSavedTime],1); 
                $(this).attr("data-event", "none");  
                
            
                localStorage.setItem("savedDayPlans", JSON.stringify(savedDayPlans));
            }  else {
                location.val(savedDayPlans[indexSavedTime].event); 
            }
        
         
    }
    populateSavedEvents(); 
    

}); 
        


//Changing colors based on time functions and code 

    //getting the current time of day
let timeOfDay= moment().format("hA"); 
console.log(timeOfDay); 

    //Need to get class and select past/present/future and change based on time of day

let allTimeBlockEl= $(".time-block"); 
console.log(allTimeBlockEl); 

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
            let isSaved= confirm("At "+timeBlockId+": Are you sure you want to clear the event '"+savedDayPlans[indexSavedTime].event+"' ?"); 
            if(isSaved) {
                alert("You cleared this event");
                
                locationArr.splice([indexSavedTime], 1); 
                savedDayPlans.splice([indexSavedTime],1); 
                timeBlockButton.attr("data-event", "none");  
                
            
                localStorage.setItem("savedDayPlans", JSON.stringify(savedDayPlans));
            } else {
                alert("Change was not saved."); 
                timeBlockTextarea.val(savedDayPlans[indexSavedTime].event); 
                
            }

        } else if (eventInput.trim() !== "" && isPopulated ==="none"){
            let isSaved= confirm("At "+timeBlockId+": Are you sure you want to add the event '"+eventInput+ "'?"); 
            if(isSaved) {
                alert("You saved your event!"); 
    
                savedDayPlans.push({"time":timeBlockId,
                "event": eventInput,
                "location": location, 
                }); 
                localStorage.setItem("savedDayPlans", JSON.stringify(savedDayPlans));
            } else {
                timeBlockTextarea.val(""); 
            }
        } else if (eventInput.trim() !== "" && isPopulated=== "yes"){
            if (savedDayPlans[indexSavedTime].event !== eventInput){
                
                let isSaved= confirm("At "+timeBlockId+": Are you sure you want to change the event from '"+savedDayPlans[indexSavedTime].event+"' to '"+eventInput+"'?"); 
                if(isSaved) {

                    locationArr.splice([indexSavedTime], 1); 
                    savedDayPlans.splice([indexSavedTime],1); 

                    alert("You saved your event!"); 
            
                    savedDayPlans.push({"time":timeBlockId,
                    "event": eventInput,
                    "location": location, 
                    }); 

                    localStorage.setItem("savedDayPlans", JSON.stringify(savedDayPlans));
                } else{
                    alert("Change was not saved."); 
                    timeBlockTextarea.val(savedDayPlans[indexSavedTime].event); 
                }

            }
         }
    }
    alert("There are no unsaved changes"); 
 }); 



