export const formatNumber = (number:any) => {
    return number?.toLocaleString();
}

export function dateFormat(date:any){
    var currentDate = new Date(date);
    
    // Set it to Jan 12, 2022 15:32
    currentDate.getFullYear();
    currentDate.getMonth(); // Month is 0-indexed, so January is 0
    currentDate.getDate();
    currentDate.getHours();
    currentDate.getMinutes();
    
    // Format the date
    var formattedDate = currentDate.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false // 24-hour format
    });
    
    return formattedDate;
}
