function performOperations() {
    // Get the full name from input
    const fullName = document.getElementById('fullName').value.trim();

    // Check if input is not empty
    if (!fullName) {
        alert('Please enter a full name');
        return;
    }

    // String length
    document.getElementById('stringLength').value = fullName.length;

    // First index value
    document.getElementById('firstIndex').value = fullName[0];

    // Last index value
    document.getElementById('lastIndex').value = fullName[fullName.length - 1];

    // Split the name into parts
    const nameParts = fullName.split(' ').filter(part => part.length > 0);

    // Check if we have at least a first and last name
    if (nameParts.length < 2) {
        alert('Please enter at least first and last name');
        return;
    }

    // Get first letter of last name
    document.getElementById('lastNameFirst').value = nameParts[nameParts.length - 1][0];

    // Assign name parts to respective fields
    document.getElementById('firstName').value = nameParts[0];
    
    // Handle middle name(s)
    if (nameParts.length > 2) {
        const middleNames = nameParts.slice(1, -1).join(' ');
        document.getElementById('middleName').value = middleNames;
    } else {
        document.getElementById('middleName').value = '';
    }
    
    document.getElementById('lastName').value = nameParts[nameParts.length - 1];

    // Convert to uppercase
    document.getElementById('upperName').value = fullName.toUpperCase();
}

// Add event listener for Enter key
document.getElementById('fullName').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        performOperations();
    }
});