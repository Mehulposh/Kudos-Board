import User from '../model/userModel.js'
import validator from 'validator'
import jwt from 'jsonwebtoken'

const signToken = (id)=> {
    return jwt.sign(
        {id},
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRES_IN 
        }    
    );
}


// POST /api/auth/register
const Register = async (req,res,next) => {
    try {
        const {username, email, password} = req.body

        //validation
        if(!username || !email || !password){
            return res.status(400).json({message: 'Username , email and password are required'})
        }

        if(!validator.isEmail(email)){
            return res.status(400).json({message: 'Enter a valid email'})
        }

        if(password.length < 8){
            return res.status(400).json({message: 'Password should have minimum 8 characters'})
        }


        //check for existing user
        const existing = await User.findOne({
            $or: [{email: email} , {username: username}]
        })

        if(existing){
            const field = existing.email === email ? "Email" : "Username"
            return res.status(409).json({message: `${field} is already in use`})
        }

        const user = await User.create({
            username: username,
            email: email,
            password
        })

        const token = signToken(user._id)

        res.status(201).json({
            message: 'Account created successfully',
            token,
            user: user
        })
        
    } catch (error) {
        if (err.code === 11000) {
            return res.status(409).json({ error: 'Username or email already exists.' });
            }
        if (err.name === 'ValidationError') {
            const messages = Object.values(err.errors).map((e) => e.message);
            return res.status(400).json({ error: messages[0] });
        }
        console.error('Register error:', err);
        res.status(500).json({ error: 'Registration failed. Please try again.' });
    }
            
}


//POST/api/auth/login
const Login = async(req,res)=> {
    try {
        const {email, password} = req.body

        if(!email || !password){
            return res.status(400).json({message: 'Email and password are required'})
        }

        const user  = await User.findOne({email}).select('+password')

        if(!user || !(await user.comparePassword(password))) {
            return res.status(401).json({message: "Invalid email or password"})
        }

        const token = signToken(user._id)

        res.status(200).json({
            message: 'Loggedin successfuly',
            token,
            user: user
        })
    } catch (error) {
        console.log('Login error', error);
        res.status(500).json({
            message: 'Login failed . Please try again'
        })       
    }
}


//GET/api/auth/me
const GetUser = async(req,res)=> {
    res.json({user : req.user})
}

//PATCH /api/auth/profile
const Profile = async(req,res)=> {
    try {
        const {bio, isPublic, avatarColor} = req.body

        const id = req.user._id

        const updateData = {}

        if (bio !== undefined) updateData.bio = bio.substring(0, 200);
        if (isPublic !== undefined) updateData.isPublic = Boolean(isPublic);
        if (avatarColor !== undefined) updateData.avatarColor = avatarColor;

        const user  = await User.findByIdAndUpdate(id,updateData,{
            new: true,
            runValidators: true
        })

        res.json({message: 'Profile updated successfuly', user})
    } catch (error) {
        console.error('Profile update error:', err);
        res.status(500).json({ error: 'Failed to update profile.' });
    }
}
export {
    Register,
    Login,
    GetUser,
    Profile
}