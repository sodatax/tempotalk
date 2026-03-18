export function validateNewAccount(data) {
    console.log(data);

    const errors = [];

    if (data.username == "") {
        errors.push("Please type in a username");
    }

    if (data.password == "") {
        errors.push("Please type in a password");
    }
    
    if (data.password != "" && data.confirm == "") {
        errors.push("Please type your password again");
    }
    
    
    if (data.password != "" && data.confirm != "" && data.password != data.confirm) {
        errors.push("Passwords don't match");
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (data.email == "") {
        errors.push("Please type in an email");
    } else if (!emailPattern.test(data.email)) {
        errors.push("Email is invalid");
    }

    console.log(errors);

    return {
        isValid: errors.length === 0,
        errors
    };
}

export function validateAccount(data) {
    console.log(data);

    const errors = [];

    if (data.username == "") {
        errors.push("Please type in your username");
    }

    if (data.password == "") {
        errors.push("Please type in your password");
    }

    console.log(errors);

    return {
        isValid: errors.length === 0,
        errors
    };
}

export function validatePost(data){
    console.log(data);

    const errors = [];
    
    if (!data.title || data.title.trim() === "") {
        errors.push("*title is required*");
    }

    if (!data.bodyText || data.bodyText.trim() === "") {
        errors.push("*body text is required*");
    }

    console.log(errors);

    return {
        isValid: errors.length === 0,
        errors
    };
    
}