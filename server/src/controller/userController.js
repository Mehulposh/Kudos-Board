import User from '../model/userModel.js'
import Kudos from '../model/kudosModel.js'

//GET /api/user/:username
const GetUsername = async(req,res) => {
    try {
        const username = req.params.username

        const user = await User.findOne({username: username})

        if(!user){
            return res.status(400).json({message: "User not found"})
        }

        //return public profile data
        res.json({
            user: user,
            isOwner: req.user ? req.user.username === user.username : false,
        })
    } catch (error) {
        console.error('Get user error:', err);
        res.status(500).json({ error: 'Failed to fetch user profile.' });
    }
}


//GET /api/user/:username/stats
const GetStats = async(req,res)=> {
    try {
        const username = req.params.username

        const user = await User.findOne({username: username})

        if(!user){
            return res.status(400).json({message: "User not found"})
        }

        const isOwner = req.user ? req.user.username === user.username : false;

        const query = { recipient: user._id };
        if (!isOwner) query.isHidden = false;

        const [total, pinned] = await Promise.all([
            Kudos.countDocuments(query),
            Kudos.countDocuments({ ...query, isPinned: true }),
        ]);

        res.json({
            total,
            pinned
        })

    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch stats.' });
    }
}


export {
    GetUsername,
    GetStats
}