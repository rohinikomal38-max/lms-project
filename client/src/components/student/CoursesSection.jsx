import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { AppContext } from '../../context/AppContext'
import CourseCard from './CourseCard'

const CoursesSection = () => {

const {allCourses} = useContext(AppContext)
console.log("allCourses:", allCourses)
  return (
    <div className='py-16 md:px-40 px-8'>
      <h2 className='text-3xl font-medium text-gray-800'>Learn from the best</h2>
      <p className='text-sm md:text-base text-gray-500 mt-3'>Discover our top-rated courses across various categories.
         From coding and design to <br/> business and wellness, 
        our courses are crafted to deliver results. </p>
      
     
    <div className='grid grid-cols-auto px-4 md:px-0 md:my-16 my-10 gap-4'>

  {[...new Map(allCourses.map(c => [c._id, c])).values()]
    .slice(0,4)
    .map((course)=>(
      <CourseCard key={course._id} course={course}/>
  ))}

</div>
    <Link to={'/course-list'} onClick={()=> scrollTo(0,0)}
    className='text-gray-500 border border-gray-500/30 px-10 py-3 rounded'
    >Show all courses</Link>
    
    
    </div>
  )
}

export default CoursesSection
