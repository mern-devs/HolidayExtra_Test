const Validator = require('../helpers/validate');

const signup = (req, res, next) => {
    const validationRule = {
        "email": "required|string|exist:User,email",
        'username': "required|string|exist:User,username",
        "givenName": "required|string",
        'familyName': "required|string",
        'password': "required|string|strict"
    }

    Validator(req.body, validationRule, {}, (err, status) => {
        if (!status) {
            res.status(200)
                .send({
                    success: false,
                    message: 'Validation Error',
                    error: err
                });
               console.log('validation check', status, err)
        } else {
            next();
        }        
    });
}

const checkToken = (req, res, next) => {
    const validationRule = {
        'token': 'required|string'
    }
    Validator(req.body, validationRule, {}, (err, status) => {
        if (!status || (req.body.token.length !== 128 && req.body.token.length !== 130)) {
            res.status(200)
                .send({
                    success: false,
                    message: 'Invalid Token',
                    error: err
                });
        } else {
            next();
        }
    })
}

module.exports = {
    signup,
    checkToken
};