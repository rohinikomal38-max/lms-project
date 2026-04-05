import { clerkClient } from '@clerk/express';
import Course from '../models/Course.js';
import { v2 as cloudinary } from "cloudinary";
import { Purchase } from '../models/Purchase.js';
import User from '../models/User.js';

// Update role to educator
export const updateRoleToEducator = async (req, res) => {
    try {
        const { userId } = req.auth();

        await clerkClient.users.updateUserMetadata(userId, {
            publicMetadata: {
                role: 'educator',
            }
        });

        res.json({ success: true, message: 'You can publish a course now' });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};


// Add New Course
export const addCourse = async (req, res) => {  
    console.log("Uploading to Cloudinary...");  
    try {
        const { courseData } = req.body;
        const imageFile = req.file;
       
        const { userId } = req.auth();
        const educatorId = userId;

        if (!imageFile) {
            return res.status(400).json({
                success: false,
                message: 'Thumbnail Not Attached'
            });
        }

        let imageUpload = null;

        try {
         const imageUpload = await cloudinary.uploader.upload(req.file.path, {
            resource_type: 'image'
         });
    
            console.log("Cloudinary Upload Success:", imageUpload.secure_url);

        } catch (error) {
            console.log("Cloudinary Error:", error.message);
            return res.status(500).json({
                success: false,
                message: 'Cloudinary upload failed: ' + error.message
            });
        }

        const parsedCourseData = JSON.parse(courseData);

        parsedCourseData.educator = educatorId;

        parsedCourseData.courseThumbnail =
            imageUpload.secure_url;

        const newCourse = await Course.create(parsedCourseData);

        res.status(201).json({
            success: true,
            message: 'Course Added',
            course: newCourse
        });

    } catch (error) {
        console.log("OUTER ERROR:", error.message);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// Get Educator Courses
export const getEducatorCourses = async (req, res) => {
    try {
        const { userId } = req.auth();

        const courses = await Course.find({ educator: userId });

        res.json({ success: true, courses });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};


// Educator Dashboard Data
export const educatorDashboardData = async (req, res) => {
    try {
        const { userId } = req.auth();

        const courses = await Course.find({ educator: userId });
        const totalCourses = courses.length;

        const courseIds = courses.map(course => course._id);

        const purchases = await Purchase.find({
            courseId: { $in: courseIds },
            status: 'completed'
        });

        const totalEarnings = purchases.reduce(
            (sum, purchase) => sum + purchase.amount, 0
        );

        const enrolledStudentsData = [];

        for (const course of courses) {
            const students = await User.find(
                { _id: { $in: course.enrolledStudents } },
                'name imageUrl'
            );

            students.forEach(student => {
                enrolledStudentsData.push({
                    courseTitle: course.courseTitle,
                    student
                });
            });
        }

        res.json({
            success: true,
            dashboardData: {
                totalEarnings,
                enrolledStudentsData,
                totalCourses
            }
        });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};


// Get Enrolled Students Data
export const getEnrolledStudentsData = async (req, res) => {
    try {
        const { userId } = req.auth();

        const courses = await Course.find({ educator: userId });
        const courseIds = courses.map(course => course._id);

        const purchases = await Purchase.find({
            courseId: { $in: courseIds },
            status: 'completed'
        })
            .populate('userId', 'name imageUrl')
            .populate('courseId', 'courseTitle');

        const enrolledStudents = purchases.map(purchase => ({
            student: purchase.userId,
            courseTitle: purchase.courseId.courseTitle,
            purchaseDate: purchase.createdAt
        }));

        res.json({ success: true, enrolledStudents });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};
