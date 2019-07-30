// Helper Function - to check if any of the data fields is empty
const isEmpty = (someText) => {
    if (someText.trim() === '') {
        return true;
    }
    else {
        return false;
    }
};

// Helper Function - to check if email is of the correct valid format (can also use a validating JS library)
const isEmail = (email) => {
    const regEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (email.match(regEx)) { // .match - check if string matches a regular expression
        return true;
    }
    else {
        return false;
    }
};

const validateSignUp = (data) => {
    // Things to Validate: 1) All 4 Fields are Entered & Valid; 2) password & confirmPassword are the Same
    let errors = {};
    
    if (isEmpty(data.email)) {
        errors.email = 'Must Not Be Empty';
    }
    else if (!isEmail(data.email)) {
        errors.email = 'Email Address is Invalid';
    }

    if (isEmpty(data.password)) {
        errors.password = 'Must Not Be Empty';
    } 

    if (data.password !== data.confirmPassword) {
        errors.confirmPassword = 'Passwords Must Match';
    }

    if (isEmpty(data.handle)) {
        errors.handle = 'Must Not Be Empty';
    } 

    return {
        errors,
        valid: Object.keys(errors).length === 0 
    };
};

const validateLogin = (data) => {
    let errors = {};

    if (isEmpty(data.email)) {
        errors.email = 'Must Not Be Empty';
    }
    else if (!isEmail(data.email)) {
        errors.email = 'Email Address is Invalid';
    }

    if (isEmpty(data.password)) {
        errors.password = 'Must Not Be Empty';
    }

    return ({
        errors,
        valid: Object.keys(errors).length === 0 ? true : false
    });
};

const reduceUserDetails = (data) => {
    let userDetails = {};

    if (!isEmpty(data.bio.trim())) { // .trim - to remove any whitespace
        userDetails.bio = data.bio;
    }

    if (!isEmpty(data.website.trim())) { // .trim - to remove any whitespace
        if (data.website.trim().substring(0, 4) !== 'http') { // if user enter website without http
            userDetails.website = `http://${data.website.trim()}`;
        }
        else {
            userDetails.website = data.website;
        }
    }

    if (!isEmpty(data.location.trim())) { // .trim - to remove any whitespace
        userDetails.location = data.location;
    }

    return userDetails;
};

module.exports = { isEmpty, isEmail, validateSignUp, validateLogin, reduceUserDetails };