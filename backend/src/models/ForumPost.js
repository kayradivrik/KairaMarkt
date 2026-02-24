import mongoose from 'mongoose';

const forumPostSchema = new mongoose.Schema(
  {
    topic: { type: mongoose.Schema.Types.ObjectId, ref: 'ForumTopic', required: true },
    authorName: { type: String, required: true, trim: true },
    content: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

export default mongoose.model('ForumPost', forumPostSchema);
