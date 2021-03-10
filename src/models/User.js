const SALT_WORK_FACTOR = 10;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

//  User Schema
const UserSchema = mongoose.Schema({
    fbEmail: {
        type: String,
        required: true,
        unique: true,
    },

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

    fbFirstName: {
        type: String,
        required: true
    },

    fbId: {
        type: String,
        required: true,
        unique: true
    },

    fbLastName: {
        type: String,
        required: true
    },

    fbImageUrl: {
        type: String
    },

    profileItems: {
        type: Array,
        of: Map
    },

    gender: {
        type: String
    },

    favoriteGender: {
        type: String
    },

    fcmToken: {
        type: String
    },

    token: {
        type: String
    },

    lastLoginTime: {
        type: Date
    },

    DateOfBirth: {
        type: Date
    },

    activated: {
        type: Boolean
    },

    closed: {
        type: Boolean
    },

    latitude: {
        type: Number
    },

    longitude: {
        type: Number
    },

    lastProfileUpdateTime: {
        type: Date
    },

    lastLocationUpdateTime: {
        type: Date
    },

    lastProfileItemsUpdateTime: {
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
