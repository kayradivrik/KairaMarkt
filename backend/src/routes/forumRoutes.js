import express from 'express';
import { getTopics, getTopicBySlug, createTopic, createPost } from '../controllers/forumController.js';

const router = express.Router();
router.get('/topics', getTopics);
router.get('/topics/:slug', getTopicBySlug);
router.post('/topics', createTopic);
router.post('/posts', createPost);

export default router;
