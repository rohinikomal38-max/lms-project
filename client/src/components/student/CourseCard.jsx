import React, { useContext } from 'react'
import { assets } from '../../assets/assets'
import courseImg from '../../assets/course_1.png'
import { AppContext } from '../../context/AppContext'
import { Link } from 'react-router-dom'

const CourseCard = ({ course }) => {
  const { currency, calculateRating, backendUrl } = useContext(AppContext)

  // --- Safe image URL handling ---
  const imgSrc =
    course?.courseThumbnail && course.courseThumbnail.trim() !== ''
      ? course.courseThumbnail.startsWith('http')
        ? course.courseThumbnail // full external URL
        : `${backendUrl}/uploads/${course.courseThumbnail}` // relative backend path
      : courseImg // local fallback

  // --- Safe rating calculation ---
  const rating = calculateRating(course)
  const ratingCount = Array.isArray(course.courseRatings) ? course.courseRatings.length : 0

  // --- Safe price calculation ---
  const finalPrice =
    typeof course.coursePrice === 'number' && typeof course.discount === 'number'
      ? (course.coursePrice - (course.discount * course.coursePrice) / 100).toFixed(2)
      : '0.00'

  // --- Safe educator ---
  const educatorName = course?.educator?.name || 'Educator'

  return (
    <Link
      to={`/course/${course._id}`}
      onClick={() => scrollTo(0, 0)}
      className='border border-gray-500/0 pb-6 overflow-hidden rounded-lg'
    >
      <img
        className='w-full'
        src={imgSrc}
        onError={(e) => {
          e.target.src = courseImg
        }}
        alt={course.courseTitle || 'Course Image'}
      />

      <div className='p-3 text-left'>
        <h3 className='text-base font-semibold'>{course.courseTitle || 'Untitled Course'}</h3>
        <p className='text-gray-500'>{educatorName}</p>

        <div className='flex items-center space-x-2 mt-1'>
          <p>{rating}</p>
          <div className='flex'>
            {[...Array(5)].map((_, i) => (
              <img
                key={i}
                src={i < Math.floor(rating) ? assets.star : assets.star_blank}
                alt=''
                className='w-3.5 h-3.5'
              />
            ))}
          </div>
          <p className='text-gray-500'>({ratingCount})</p>
        </div>

        <p className='text-base font-semibold text-gray-800 mt-2'>
          {currency}{finalPrice}
        </p>
      </div>
    </Link>
  )
}

export default CourseCard
