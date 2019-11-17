



function saveEvent(time, input){
    alert("You saved your event!"); 
    
    savedDayPlans.push({"time":time,
    "event": input
    }); 

    // $(this).attr("data-event", "yes"); 

    localStorage.setItem("savedDayPlans", JSON.stringify(savedDayPlans));
}
