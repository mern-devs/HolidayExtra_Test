const Validator = require('../helpers/validate');

const signup = (req, res, next) => {
    const validationRule = {
        "fbEmail": "required|string|exist:User,fbEmail",
        "fbId": "required|string|exist:User,fbId",
        'fbFirstName': "required|string",
        'fbLastName': 'required|string',
        'fbImageUrl': 'required|string',
    }

    Validator(req.body, validationRule, {}, (err, status) => {
        if (!status) {
            req.body.isLogin = true;
        }
        console.log('validation check', status, err)
        next();
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