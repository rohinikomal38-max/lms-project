import express from 'express'
import { getAllCourse, getCourseId, addReview } from '../controllers/courseController.js';
import { protectUser } from '../middlewares/authMiddleware.js';

const courseRouter = express.Router()

courseRouter.get('/all', getAllCourse)
courseRouter.get('/:id', getCourseId)

// Add Review
courseRouter.post('/review', protectUser, addReview);

export default courseRouter;
