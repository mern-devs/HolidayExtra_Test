// import TikTokAPI, { getRequestParams } from 'tiktok-api';
// const TikTokAPI = require('tiktok-api');
// const { getRequestParams } = require('tiktok-api');
const path = require("path")
const {User} = require("../models");
const pathConfig = require('../config');
const maxSize = 25 * 1000 * 1000;
const crypto = require('crypto')
const admin = require('firebase-admin');
const mongoose = require('mongoose');
const fs = require('fs');

const loginProcess = async (req, res) => {
    const {fbEmail, fbId} = req.body;
    User.valueExists({fbEmail, fbId})
        .then(async result => {
            const token = crypto.randomBytes(64).toString('hex')
            let doc = await User.findOneAndUpdate(
                {_id: result._id},
                {token: token, lastLoginTime: new Date()},
                {new: true, useFindAndModify: false})
            let filtered = filterProfileItems(doc.profileItems);
            doc.profileItems = undefined;
            doc = JSON.parse(JSON.stringify(doc));
            doc.profileItems = filtered;
            return res.status(200).json({
                success: true,
                message: "Sign in successful",
                userData: doc
            });
        }).catch(error => {
        if (error) {
            return res.status(200).send({
                success: false,
                message: 'Login failed',
                error: error
            })
        }
    })
}

module.exports = {
    index: (req, res) => {
        return res.status(200).json({
            success: true,
            message: ":)",
        })
    },

    signup: (req, res) => {

        const {fbEmail, fbFirstName, fbLastName, fbId, fbImageUrl, isLogin} = req.body;
        if (isLogin === true) {
            return loginProcess(req, res)
        } else {
            const newUserObj = {
                fbEmail,
                fbFirstName,
                fbLastName,
                fbId,
                fbImageUrl,
                email: fbEmail,
                username: `${fbFirstName} ${fbLastName}`,
                activated: true,
                closed: false
            };
            const newUser = new User(newUserObj);

            newUser.save((saveErr) => {
                if (saveErr) {
                    return res.status(200).send({
                        success: false,
                        message: 'Sign up failed',
                        error: saveErr
                    })
                }
                User.valueExists({fbEmail, fbId})
                    .then(async result => {
                        let doc = await User.findOneAndUpdate(
                            {_id: result._id},
                            {token: crypto.randomBytes(64).toString('hex'), lastLoginTime: new Date()},
                            {new: true, useFindAndModify: false})
                        return res.status(200).json({
                            success: true,
                            message: "Sign up successful",
                            userData: doc
                        });
                    }).catch(error => {
                    if (error) {
                        return res.status(200).send({
                            success: false,
                            message: 'Sign up failed',
                            error: error
                        })
                    }
                })
            });
        }
    },

    login: (req, res) => {

        return loginProcess(req, res);

    }
}
