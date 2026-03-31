import express from 'express'
import {
    Register,
    Login,
    GetUser,
    Profile
} from '../controller/authController.js'
import {protect} from '../middleware/authMiddleware.js'

const router = express.Router()

router.post('/register', Register)
        .post('/login', Login)
        .get('/me', protect,GetUser)
        .patch('/profile', protect, Profile)

export default router