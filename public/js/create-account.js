document.getElementById('account-creation').addEventListener('submit', function(event) {
    // Grab all input values
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const confirm = document.getElementById('confirm').value;
    const email = document.getElementById('email').value.trim();

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

    if (confirm !== password || confirm === "") {
        toggleErr('err-confirm', true);
        isValid = false;
    } else {
        toggleErr('err-confirm', false);
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        toggleErr('err-email', true);
        isValid = false;
    } else {
        toggleErr('err-email', false);
    }

    if (!isValid) {
        event.preventDefault();
    }
});