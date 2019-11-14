//Element names

let timeBlockContainer = $(".container"); 
let todaysDateEl= $("#currentDay"); 


//Code generating the current date 
todaysDateEl.text(moment().format("dddd, MMMM Do")); 

//Code to generate time blocks
let timesArr= ["9AM","10AM", "11AM", "12PM", "1PM", "2PM", "3PM", "4PM", "5PM"]; 

for (i=1; i<timesArr.length; i++){
    let newTimeBlockEL= $("#9AM").clone();
    newTimeBlockEL.attr("id", timesArr[i]); 
    newTimeBlockEL.children(".row").attr("style", "white-space: pre-Wrap"); 
    newTimeBlockEL.children(".row").children(".hour").text(timesArr[i]); 
    newTimeBlockEL.children(".row").children("button").attr("id", timesArr[i]+"B"); 
    newTimeBlockEL.appendTo(".container"); 

}; 

// Get previously saved items to populate planner

let savedDayPlans= JSON.parse(localStorage.getItem("savedDayPlans")); 
if (savedDayPlans === null) {
    savedDayPlans = []; 
}

console.log(savedDayPlans); 

// Save entries in the planner to local storage

$(".time-block").delegate("button", "click", function(){
    event.preventDefault();

    let eventInput= $(this).siblings("textarea").val(); 
    let eventTime= $(this).siblings("h3").text(); 
    let location = $(this).siblings("textarea"); 
   
    console.log(eventTime); 
    if(eventInput.trim() !==""){
        alert("You saved your event!"); 
    }

    savedDayPlans.push({"time":eventTime,
                        "event": eventInput,
                        "location": location, 
                    }); 
    
    localStorage.setItem("savedDayPlans", JSON.stringify(savedDayPlans));
   
})

// $(".time-block").on("click", function(event){
//     debugger; 
//     event.preventDefault();

//     console.log(event); 
//     if (event.target=== "button" || event.target===".far fa-save") {
//         alert("You saved your event"); 
//     }
//     // if event.target= "button"; 
//     // let timeBlock=$(this).id
//     // savedDayPlans.push({"time": 

//     // })
// });