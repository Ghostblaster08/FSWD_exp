function updateTime() {
    // Get current date
    const currentDate = new Date();
    
    // Convert to IST (UTC+5:30)
    const istDate = new Date(currentDate.getTime() + (5.5 * 60 * 60 * 1000));
    
    // Array of month names
    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    
    // Array of day names
    const dayNames = [
        "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
    ];
    
    // Format IST time
    const formatTime = (date) => {
        return date.getFullYear() + '-' + 
               String(date.getMonth() + 1).padStart(2, '0') + '-' + 
               String(date.getDate()).padStart(2, '0') + ' ' + 
               String(date.getHours()).padStart(2, '0') + ':' + 
               String(date.getMinutes()).padStart(2, '0') + ':' + 
               String(date.getSeconds()).padStart(2, '0');
    };
    
    // Display IST time
    document.getElementById('istTime').value = formatTime(istDate) + ' IST';
    
    // Display individual components
    document.getElementById('year').value = istDate.getFullYear();
    document.getElementById('month').value = monthNames[istDate.getMonth()];
    document.getElementById('date').value = istDate.getDate();
    document.getElementById('day').value = dayNames[istDate.getDay()];
}

// Update time immediately when page loads
updateTime();

// Update time every second
setInterval(updateTime, 1000);