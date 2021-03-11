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
    const {email, password} = req.body;
    User.valueExists({email})
        .then(result => {
            result.comparePassword(password, async (err, isMatch) => {
                if (!isMatch) throw err;
                else {
                    const token = crypto.randomBytes(64).toString('hex')
                    let doc = await User.findOneAndUpdate(
                        {_id: result._id},
                        {token: token, lastLoginTime: new Date()},
                        {new: true, useFindAndModify: false})
                    return res.status(200).json({
                        success: true,
                        message: "Sign in successful",
                        userData: doc
                    });
                }                
            })
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

        const {email, username, password, givenName, familyName} = req.body;
        const newUserObj = {
            email,
            givenName,
            familyName,
            username,
            password,
            isActivated: true,
            isClosed: false,
            created: new Date()
        };
        const newUser = new User(newUserObj);

        newUser.save((saveErr) => {
            if (saveErr) {
                return res.status(200).send({
                    success: false,
                    message: 'Storing user data failed',
                    error: saveErr
                })
            }
            User.valueExists({email})
                .then(result => {
                    result.comparePassword(password, async (err, isMatch) => {
                        if (!isMatch) throw err;
                        else {
                            let doc = await User.findOneAndUpdate(
                                {_id: result._id},
                                {token: crypto.randomBytes(64).toString('hex'), lastLoginTime: new Date()},
                                {new: true, useFindAndModify: false})
                            console.log('userdoc', doc);
                            return res.status(200).json({
                                success: true,
                                message: "Sign up successful",
                                userData: doc
                            });
                        }
                    })
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
        
    },

    login: (req, res) => {

        return loginProcess(req, res);

    },

    deleteUser: (req, res) => {
        const {token} = req.body;
        User.valueExists({token})
        .then(async result => {
            if (result != null) {
                User.deleteOne({token}).then(()=>{
                    return res.status(200).send({
                        success: true,
                        message: 'Deleted user successfully'
                    })
                })
            } else {
                throw 'Can not find user'
            }
        }).catch(error => {
            if (error) {
                return res.status(200).send({
                    success: false,
                    message: 'Invalid Token',
                    error: error
                })
            }
        })
    },

    updateUser: (req, res) => {
        const {token, email, username, password, givenName, familyName} = req.body;
        if (!email && !username && !password && !givenName && !familyName) {
            return res.status(200).send({
                success: false,
                message: 'No update data',
                error: error
            })
        }
        User.valueExists({token})
        .then(async result => {
            if (email) result.email = email
            if (username) result.username = username
            if (password) result.password = password
            if (givenName) result.givenName = givenName
            if (familyName) result.familyName = familyName
            result.lastProfileUpdateTime = new Date();
            result.save(async (saveErr) => {
                if (saveErr) {
                    return res.status(200).send({
                        success: false,
                        message: 'Storing user data failed',
                        error: saveErr
                    })
                }
                const doc = await User.findOne({email})
                return res.status(200).json({
                    success: true,
                    message: "Updated profile successfully",
                    userData: doc
                });
            })
        }).catch(error => {
            if (error) {
                return res.status(200).send({
                    success: false,
                    message: 'Invalid Token',
                    error: error
                })
            }
        })
    }
}
