const SALT_WORK_FACTOR = 10;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

//  User Schema
const UserSchema = mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },

    username: {
        type: String,
        required: true,
        unique: true,
    },

    password: {
        type: String,
    },

    givenName: {
        type: String,
        required: true
    },

    familyName: {
        type: String,
        required: true
    },

    isActivated: {
        type: Boolean
    },

    isClosed: {
        type: Boolean
    },

    token: {
        type: String
    },

    lastLoginTime: {
        type: Date
    },

    created: {
        type: Date
    },

    lastProfileUpdateTime: {
        type: Date
    }
});
UserSchema.pre('save', function (next) {
    const user = this;

    if (user.isModified('password') === false) {
        return next();
    }
    bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
        if (err) {
            return next(err);
        }
        // the new salt hashes the new password
        bcrypt.hash(user.password, salt, (error, hash) => {
            if (error) {
                return next(error);
            }

            // the clear text password overidden
            user.password = hash;
            return next();
        });
    });
});

UserSchema.statics = {
    valueExists(query) {
        return this.findOne(query).then(result => result);
    }
};

module.exports = mongoose.model('User', UserSchema);
