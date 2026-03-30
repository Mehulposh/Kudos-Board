import express from 'express'
import {
    getKudos,
    postKudos,
    patchKudos,
    deleteKudos,
    hideKudos
} from '../controller/kudosController.js'

import {protect, optionalAuth} from '../middleware/authMiddleware.js'

const router = express.Router()

//get kudos for the user
router.get('/:username',optionalAuth,getKudos)

//post kudos
router.post('/:username', postKudos)

//patch the kudos
router.patch('/:username/:kudoId/pin', protect, patchKudos)

//hide kudos
router.patch('/:username/:kudoId/hide', protect, hideKudos)

//delete kudos
router.delete('/:username/:kudoId', protect, deleteKudos)


export default router