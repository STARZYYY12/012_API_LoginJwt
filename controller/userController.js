const db = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = db.User;

async function register(req, res) {
    try {
        const { username, email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: 'Email and password are required'
            });
        }
        const existingUser = await User.findOne({
            where: { email }
        });

        if (existingUser) {
            return res.status(409).json({
                message: 'Email already exists'
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            email,
            password: hashedPassword
        });

        return res.status(201).json({
            message: 'User registered successfully',
            data: {
                id: newUser.id,
                email: newUser.email
            }
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
}

async function login(req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: 'Email and password are required'
            });
        }

        const user = await User.findOne({
            where: { email }
        });

        if (!user) {
            return res.status(401).json({
                message: 'Invalid email or password'
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({
                message: 'Invalid email or password'
            });
        }
        const token = jwt.sign(
            {
                id: user.id,
                email: user.email
            },
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_EXPIRES_IN
            }
        );
        return res.status(200).json({
            message: 'Login successful',
            token
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
}

module.exports = {
    register,
    login
};