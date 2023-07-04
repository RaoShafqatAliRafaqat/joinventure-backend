const Joi = require('joi');
const User = require('../models/user');
var bcrypt = require('bcryptjs');
const { response } = require('express');
const UserDTO = require('../dto/user');
const JWTService = require('../services/JWTService');
const RefreshToken = require('../models/token');


const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,25}$/;

const authController = {
    async register(req, res, next) {
        //1. validate user input
        const userRegisterSchema = Joi.object({
            customerName: Joi.string().min(5).max(30).required(),
            customerAddress: Joi.string().required(),
            customerPhone: Joi.number().required(),
            customerEmail: Joi.string().email().required(),
            password: Joi.string().pattern(passwordPattern).required(),
            confirmPassword: Joi.ref('password')
        });

        const { error } = userRegisterSchema.validate(req.body);
        //2. if the error in validation -> return error via middlewre 
        if (error) {
            return next(error);
        }
        //3. if email or username already register -> return an error
        const { customerName, customerPhone, customerEmail, customerAddress, password } = req.body;
        try {
            const emailInUse = await User.exists({ customerEmail });
            if (emailInUse) {
                const error = {
                    status: 409,
                    message: 'Email already registered, use another email!'
                }
                return next(error);
            }
        } catch (error) {
            return next(error);
        }
        //4. password hash
        const hashPassword = await bcrypt.hash(password, 10);

        let accessToken;
        let refreshToken;
        let user;
        try {
            //5. store user data in database
            const userToRegister = new User({
                // customerName (key): customerName(value),
                customerName,
                customerPhone,
                customerEmail,
                customerAddress,
                password: hashPassword
            });

            user = await userToRegister.save();

            //token generation
            accessToken = JWTService.signAccessToken({ _id: user._id }, '30m');
            refreshToken = JWTService.signRefreshToken({ _id: user._id }, '60m');

        } catch (error) {
            return next(error);
        }

        //store refresh token in db
        await JWTService.storeRefreshToken(refreshToken, user._id);

        //send tokens in cookie
        res.cookie('accessToken', accessToken, {
            maxAge: 1000 * 60 * 60 * 24,
            httpOnly: true
        });

        res.cookie('refreshToken', refreshToken, {
            maxAge: 1000 * 60 * 60 * 24,
            httpOnly: true
        });


        const userDto = new UserDTO(user);
        //6. response send
        return res.status(201).json({ user: userDto, auth: true });

    },


    async login(req, res, next) {
        //1. validate user input
        const userLoginSchema = Joi.object({
            customerName: Joi.string().min(5).max(30).required(),
            password: Joi.string().pattern(passwordPattern).required(),
        });

        const { error } = userLoginSchema.validate(req.body);
        //2. if validation error -> return error 
        if (error) {
            return next(error);
        }
        //3. match username and password 
        const { customerName, password } = req.body;
        let user;
        try {
            //match username
            user = await User.findOne({ customerName: customerName });
            if (!user) {
                const error = {
                    status: 401,
                    message: 'Invalid username'
                }
                return next(error);
            }
            //match password
            const match = await bcrypt.compare(password, user.password);
            if (!match) {
                const error = {
                    status: 401,
                    message: 'Invalid password'
                }
                return next(error);
            }

        } catch (error) {
            return next(error);
        }

        //token generation
        const accessToken = JWTService.signAccessToken({ _id: user._id }, '30m');
        const refreshToken = JWTService.signRefreshToken({ _id: user._id }, '60m');

        try {
            // update refresh token in db
            await RefreshToken.updateOne({
                _id: user._id
            },
                { token: refreshToken },
                { upsert: true }
            )
        } catch (error) {
            return next(error);
        }

        //send tokens in cookie
        res.cookie('accessToken', accessToken, {
            maxAge: 1000 * 60 * 60 * 24,
            httpOnly: true
        });

        res.cookie('refreshToken', refreshToken, {
            maxAge: 1000 * 60 * 60 * 24,
            httpOnly: true
        });

        const userDto = new UserDTO(user);
        //4. return response 
        return res.status(200).json({ user: userDto, auth: true });
    },

    async logout(req, res, next) {
        //1. delete refresh token from db
        const { refreshToken } = req.cookies;
        try {
            await RefreshToken.deleteOne({ token: refreshToken });
        } catch (error) {
            return next(error);
        }
        //delete cookies
        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');

        //2. response
        return res.status(200).json({ user: null, auth: false });
    },
    async refresh(req, res, next) {
        //1. get refreshtoken from cookie
        //2. verify refreshtoken
        //3. generate newtoken
        //4. update db and return response 
        const originalRefreshToken = req.cookies.refreshToken;
        let id;
        try {
            id = JWTService.verifyRefreshToken(originalRefreshToken)._id;
        } catch (e) {
            const error = {
                status: 401,
                message: 'unautherized'
            }
            return next(error);
        }

        try {
            const match = RefreshToken.findOne({ _id: id, token: originalRefreshToken });

            if (!match) {
                const error = {
                    status: 401,
                    message: 'unautherized'
                }
                return next(error);
            }
        } catch (e) {
            return next(e);
        }

        try {
                    //token generation
        const accessToken = JWTService.signAccessToken({ _id: id }, '30m');
        const refreshToken = JWTService.signRefreshToken({ _id: id }, '60m');

        await RefreshToken.updateOne({_id: id}, {token:refreshToken});

             //send tokens in cookie
        res.cookie('accessToken', accessToken, {
            maxAge: 1000 * 60 * 60 * 24,
            httpOnly: true
        });

        res.cookie('refreshToken', refreshToken, {
            maxAge: 1000 * 60 * 60 * 24,
            httpOnly: true
        });
        } catch (e) {
       return next(e);
        }

        const user = await User.findOne({_id: id});
        const userDto = new UserDTO(user);

        return res.status(200).json({user: userDto, auth: true});
    }
}

module.exports = authController;