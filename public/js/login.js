document.getElementById('account-creation').addEventListener('submit', function(event) {
    // Grab all input values
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();

    let isValid = true;

    const toggleErr = (id, show) => {
        document.getElementById(id).style.display = show ? 'inline' : 'none';
    };

    // --- VALIDATION LOGIC ---

    if (username === "") {
        toggleErr('err-username', true);
        isValid = false;
    } else {
        toggleErr('err-username', false);
    }

    if (password === "") {
        toggleErr('err-password', true);
        isValid = false;
    } else {
        toggleErr('err-password', false);
    }

    if (!isValid) {
        event.preventDefault();
    }
});