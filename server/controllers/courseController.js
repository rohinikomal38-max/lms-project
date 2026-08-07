import Course from "../models/Course.js";
import User from "../models/User.js";

// Get All Courses
export const getAllCourse = async (req, res)=>{
    try {
        const courses = await Course.find({isPublished: true}).select(['-courseContent', '-enrolledStudents']).populate({path: 'educator'})

        res.json({ success: true, courses })
    } catch (error) {
        res.json({ success: false, message: error.message})

    }
}

// Get Course by Id
export const getCourseId = async (req, res)=>{
    const {id} = req.params

    try {
       const courseData = await Course.findById(id).populate({path: 'educator'})

       // Remove lectureUrl if isPreviewFree is false
       courseData.courseContent.forEach(chapter => {
        chapter.chapterContent.forEach(lecture => {
            if(!lecture.isPreviewFree){
                lecture.lectureUrl = ""
            }
        })
       })

       res.json({ success: true, courseData })

    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

export const addReview = async (req, res) => {
  try {
    const { courseId, rating, comment } = req.body;
    const { userId } = req.auth();

    const user = await User.findById(userId);
    const course = await Course.findById(courseId);

    if (!course) {
      return res.json({
        success: false,
        message: "Course not found"
      });
    }

    const alreadyReviewed = course.courseRatings.find(
      review => review.userId === userId
    );

    if (alreadyReviewed) {
      return res.json({
        success: false,
        message: "You have already reviewed this course."
      });
    }

    course.courseRatings.push({
      userId,
      userName: user.name,
      rating,
      comment
    });

    await course.save();

    res.json({
      success: true,
      message: "Review Added Successfully"
    });

  } catch (error) {
    res.json({
      success: false,
      message: error.message
    });
  }
};


