function submitForm(){
    document.myForm.submit();
}

function validateForm(event) {
    event.preventDefault(); 
    let password = document.getElementById('password').value;
    let passwordCriteria = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,20}$/;

    if (!password.match(passwordCriteria)) {
        alert('Password must be between 8-20 characters, and include at least one numeric digit, one uppercase, and one lowercase letter.');
        return false;
    }

    document.myForm.submit();
    return true;
}

function clearForm() {
    document.myForm.reset();
}
