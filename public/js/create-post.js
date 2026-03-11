document.getElementById('create-post-form').addEventListener('submit', function(event) {
    // Grab all input values
    const title = document.getElementById('title').value.trim();
    const body = document.getElementById('body-text').value;

    let isValid = true;

    const toggleErr = (id, show) => {
        document.getElementById(id).style.display = show ? 'inline' : 'none';
    };

    // --- VALIDATION LOGIC ---
    if (title === "") {
        toggleErr('err-title', true);
        isValid = false;
    } else {
        toggleErr('err-title', false);
    }

    if (body === "") {
        toggleErr('err-body', true);
        isValid = false;
    } else {
        toggleErr('err-body', false);
    }

    if (!isValid) {
        event.preventDefault();
    }
});