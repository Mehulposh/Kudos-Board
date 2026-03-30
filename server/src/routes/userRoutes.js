import express from 'express'
import  {
    GetUsername,
    GetStats
} from '../controller/userController.js'
import {optionalAuth} from '../middleware/authMiddleware.js'

const router = express.Router()

router.use(optionalAuth)

//route to get publec profile
router.get('/:username', GetUsername)

//route to get the stats of the user
router.get('/:username/stats', GetStats)

export default router