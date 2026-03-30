import Kudos from '../model/kudosModel.js'
import User from '../model/userModel.js'
import { sanitizeKudosInput, hashIP } from '../helper/sanitize.js'

// GET /api/kudos/:username - Get kudos for a user
const getKudos = async(req,res)=> {
    try {
        const name = req.params.username.toLowerCase()
        const user = await User.findOne({username: name})

        if(!user) return res.json({message: "user not found"})

        const isOwner = req.user ? req.user.username === user.username : false;
        const page = Math.max(1, parseInt(req.query.page) || 1);
        const limit = Math.min(50, parseInt(req.query.limit) || 20);
        const skip = (page - 1) * limit;

        // Build query
        const query = { recipient: user._id };
        if (!isOwner) {
            query.isHidden = false;
        }

        // Filter: pinned / all / hidden (owner only)
        const filter = req.query.filter;
        if (filter === 'pinned') {
            query.isPinned = true;
        } else if (filter === 'hidden' && isOwner) {
            query.isHidden = true;
        }

        // Sort: pinned first, then newest
        const kudos = await Kudos.find(query)
        .sort({ isPinned: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select('-ipHash');
    
        const total = await Kudos.countDocuments(query);

        res.json({
            kudos,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total/page)
                
            },
            isOwner,
        })
    } catch (error) {
        console.log('Get kudos error', error);
        res.status(500).json({message: 'failed to fetch kudos'})
        
    }
}


// POST /api/kudos/:username - Post a kudo (no auth required)
const postKudos = async(req,res)=> {
    try {
        const user = await User.findOne({ username: req.params.username.toLowerCase() });
        if (!user) return res.status(404).json({ error: 'User not found.' });
    
        if (!user.isPublic) {
            return res.status(403).json({ error: 'This board is private.' });
        }
    
        // Sanitize input
        const sanitized = sanitizeKudosInput(req.body);
    
        if (!sanitized.message || sanitized.message.length < 5) {
            return res.status(400).json({ error: 'Message must be at least 5 characters.' });
        }
    
        if (sanitized.message.length > 500) {
            return res.status(400).json({ error: 'Message cannot exceed 500 characters.' });
        }
    
        // Hash IP for spam tracking (private, never returned)
        const ip = req.headers['x-forwarded-for']?.split(',')[0] || req.socket?.remoteAddress || 'unknown';
        const ipHash = hashIP(ip);
    
        const kudo = await Kudos.create({
            recipient: user._id,
            message: sanitized.message,
            emoji: sanitized.emoji,
            senderNickname: sanitized.senderNickname || 'Anonymous',
            ipHash,
        });
    
        // Update user kudos count
        await User.findByIdAndUpdate(user._id, { $inc: { kudosCount: 1 } });
    
        // Don't return ipHash
        const kudoResponse = kudo.toObject();
        delete kudoResponse.ipHash;
    
        res.status(201).json({
            message: 'Kudos sent! 🎉',
            kudo: kudoResponse,
        });
    } catch (error) {
        console.error('Post kudos error:', err);
        if (err.name === 'ValidationError') {
            const messages = Object.values(err.errors).map((e) => e.message);
            return res.status(400).json({ error: messages[0] });
        }
        res.status(500).json({ error: 'Failed to send kudos.' });
    }
}


// PATCH /api/kudos/:username/:kudoId/pin - Toggle pin (owner only)
const patchKudos = async(req,res)=>{
    try {
        if (req.user.username !== req.params.username) {
            return res.status(403).json({ error: 'Forbidden.' });
        }
        
        const name = req.params.username.toLowerCase()
        const user = await User.findOne({ username: name });
        if (!user) return res.status(404).json({ error: 'User not found.' });
        
        const kudosId = req.params.kudoId
        const kudo = await Kudos.findOne({ _id: kudosId, recipient: user._id });
        if (!kudo) return res.status(404).json({ error: 'Kudos not found.' });
    
        kudo.isHidden = !kudo.isHidden;
        if (kudo.isHidden) kudo.isPinned = false; // unpin hidden
        await kudo.save();
    
        res.json({ message: kudo.isHidden ? 'Kudos hidden.' : 'Kudos visible again.', kudo });

    } catch (error) {
        res.status(500).json({ error: 'Failed to toggle visibility.' });
    }
}


// DELETE /api/kudos/:username/:kudoId - Delete (owner only)
const deleteKudos = async(req,res)=> {
    try {
        if (req.user.username !== req.params.username) {
            return res.status(403).json({ error: 'Forbidden.' });
        }
        
        const name = req.params.username.toLowerCase()
        const user = await User.findOne({ username: name });
        if (!user) return res.status(404).json({ error: 'User not found.' });
        
        const kudosId = req.params.kudoId
        const kudo = await Kudos.findOneAndDelete({ _id: kudosId, recipient: user._id });
        if (!kudo) return res.status(404).json({ error: 'Kudos not found.' });
    
        // Decrement count
        await User.findByIdAndUpdate(user._id, { $inc: { kudosCount: -1 } });
    
        res.json({ message: 'Kudos deleted.' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete kudos.' });
    }
}

export {
    getKudos,
    postKudos,
    patchKudos,
    deleteKudos
}