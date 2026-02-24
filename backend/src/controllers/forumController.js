import ForumTopic from '../models/ForumTopic.js';
import ForumPost from '../models/ForumPost.js';

export const getTopics = async (_req, res, next) => {
  try {
    const topics = await ForumTopic.find().sort({ createdAt: -1 }).lean();
    const withCount = await Promise.all(
      topics.map(async (t) => {
        const postCount = await ForumPost.countDocuments({ topic: t._id });
        return { ...t, postCount };
      })
    );
    res.json({ success: true, topics: withCount });
  } catch (err) {
    next(err);
  }
};

export const getTopicBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const isId = /^[a-f0-9]{24}$/i.test(slug);
    const topic = await ForumTopic.findOne(isId ? { _id: slug } : { slug }).lean();
    if (!topic) return res.status(404).json({ success: false, message: 'Konu bulunamadı' });
    const posts = await ForumPost.find({ topic: topic._id }).sort({ createdAt: 1 }).lean();
    res.json({ success: true, topic, posts });
  } catch (err) {
    next(err);
  }
};

export const createTopic = async (req, res, next) => {
  try {
    const { title } = req.body || {};
    if (!title?.trim()) return res.status(400).json({ success: false, message: 'Başlık gerekli' });
    const topic = await ForumTopic.create({ title: title.trim() });
    res.status(201).json({ success: true, topic });
  } catch (err) {
    next(err);
  }
};

export const createPost = async (req, res, next) => {
  try {
    const { topicId, authorName, content } = req.body || {};
    if (!topicId || !authorName?.trim() || !content?.trim())
      return res.status(400).json({ success: false, message: 'Konu, isim ve mesaj gerekli' });
    const topic = await ForumTopic.findById(topicId);
    if (!topic) return res.status(404).json({ success: false, message: 'Konu bulunamadı' });
    const post = await ForumPost.create({ topic: topicId, authorName: authorName.trim(), content: content.trim() });
    res.status(201).json({ success: true, post });
  } catch (err) {
    next(err);
  }
};
