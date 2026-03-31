import mongoose from "mongoose";

const KudosSchema = new mongoose.Schema({
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    },
    message: {
        type: String,
        required: [true, 'Message is required'],
        minlength: [5, 'Message must be at least 5 characters'],
        maxlength: [500, 'Message cannot exceed 500 characters'],
        trim: true,
    },
    emoji: {
        type: String,
        default: '🌟',
        maxlength: [10, 'Emoji too long']
    },
    senderNickname: {
      type: String,
      trim: true,
      maxlength: [30, 'Nickname cannot exceed 30 characters'],
      default: 'Anonymous',
    },
    isPinned: {
        type: Boolean,
        default: false,
    },
    isHidden: {
        type: Boolean,
        default: false
    },
    ipHash: {
        type: Boolean,
        default: false
    },
    isApproved: {
        type: Boolean,
        default: true
    },
    reactions: {
      type: Map,
      of: Number,
      default: {},
    },
},
{
    timestamps: true
}
)


// Index for efficient querying
KudosSchema.index({ recipient: 1, isPinned: -1, createdAt: -1 });
KudosSchema.index({ recipient: 1, isHidden: 1 });
 

export default mongoose.model('kudos', KudosSchema)