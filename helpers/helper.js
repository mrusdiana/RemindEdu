function timeRemaining(dateInput) {
    const deadline = new Date(dateInput);
    const today = new Date();
    
    today.setHours(0, 0, 0, 0);
    deadline.setHours(0, 0, 0, 0);
    
    const diffTime = deadline - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
}

function checkUrgency(dateInput) {
    const deadline = new Date(dateInput);
    const today = new Date();
    
    today.setHours(0, 0, 0, 0);
    deadline.setHours(0, 0, 0, 0);
    
    const diffTime = deadline - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 3) {
        return "Urgent";
    } else if (diffDays <= 5) {
        return "Warning";
    } else {
        return "Safe";
    }

}

function countUrgentTasks(statusList) {
    let urgentCount = 0;
    
    for (const status of statusList) {
        if (status === "Urgent") {
            urgentCount++;
        }
    }
    
    return urgentCount;
}

module.exports = {timeRemaining, checkUrgency, countUrgentTasks}