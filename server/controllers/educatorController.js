
import { clerkClient } from '@clerk/express';
import Course from '../models/Course.js';
import { v2 as cloudinary } from "cloudinary";
import { Purchase } from '../models/Purchase.js';


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

        let imageUpload;

        // 🔥 Cloudinary Upload (with full debug)
        try {
            imageUpload = await cloudinary.uploader.upload(
                imageFile.path // 👉 real file upload
            );

            console.log("✅ Upload Result:", imageUpload);

        } catch (error) {
            console.log("❌ FULL ERROR OBJECT:", error);
            console.log("❌ ERROR MESSAGE:", error.message);
            console.log("❌ ERROR RESPONSE:", error?.response);
        }

        // Parse course data
        const parsedCourseData = JSON.parse(courseData);
        parsedCourseData.educator = educatorId;

        // ✅ Fallback (safe handling)
        parsedCourseData.courseThumbnail =
            imageUpload?.secure_url || "https://via.placeholder.com/150";

        // Create course in MongoDB
        const newCourse = await Course.create(parsedCourseData);

        res.status(201).json({
            success: true,
            message: 'Course Added',
            course: newCourse
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get Educator Courses
export const getEducatorCourses = async (req, res)=>{
    try {
        const { educator } = req.auth();

        const courses = await Course.find({educator})
        res.json({ success: true, courses })
    } catch (errror) {
        res.json({ success: false, message: error.message })

    }
}

// Get Educator Dashboard Data (Total Earning, Enrolled Students, No. of Courses)

export const educatorDashboardData = async (req, res)=>{
    try {
       const { educator } = req.auth();
       const courses = await Course.find({educator});
       const totalCourses = courses.length;

       const courseIds = courses.map(course => course._id);

       // Calculate total earnings from purchases
       const purchases = await Purchase.find({
        courseId: {$in: courseIds},
        status: 'completed'
       });

       const totalEarnings = purchases.reduce((sum, purchase)=> sum + purchase.amount, 0);

       // Collect unique enrolled student IDs with their course titles
       const enrolledStudentsData = [];
       for(const course of courses){
        const students = await User.find({
            _id: {$in: course.enrolledStudents}
        }, 'name imageUrl')

        students.forEach(student => {
            enrolledStudentsData.push({
                courseTitle: course.courseTitle,
                student
            });
        });
       }

       res.json({success: true, dashboardData: {
        totalEarnings, enrolledStudentsData, totalCourses
       }})



    } catch (error) {
       res.json({ success: false, message: error.message });
    }
}

// Get Enrolled Students Data with Purchase Data
export const getEnrolledStudentsData = async (req, res)=>{
   try {
       const { educator } = req.auth();
       const courses = await Course.find({educator});
       const courseIds = courses.map(course => course._id);

       const purchases = await Purchase.find({
        courseId: { $in: courseIds },
        status: 'completed'
       }).populate('userId', 'name imageUrl').populate('courseId', 'courseTitle')

       const enrolledStudents = purchases.map(purchase => ({
        student: purchase.userId,
        courseTitle: purchase.courseId.courseTitle,
        purchaseData: purchase.createdAt
       }));

       res.json({success: true, enrolledStudents})

   } catch (error) {
       res.json({ success: false, message: error.message });
   }
}