import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../context/AppContext'
import { useParams } from 'react-router-dom'
import { assets } from '../../assets/assets'
import humanizeDuration from 'humanize-duration'
import YouTube from 'react-youtube'
import Footer from '../../components/student/Footer'
import Rating from '../../components/student/Rating'
import axios from 'axios'

const Player = () => {

  const {enrolledCourses,
  calculateChapterTime,
  getToken,
  backendUrl
} = useContext(AppContext)
  const { courseId } = useParams()
  const [courseData, setCourseData] = useState(null)
  const [openSections, setOpenSections] = useState({})
  const [playerData, setPlayerData] = useState(null)
  const [progressData, setProgressData] = useState(null)

  const getCourseData = () => {
    enrolledCourses.map((course) => {
      if (course._id === courseId) {
        setCourseData(course)
      }
    })
  }

  const toggleSection = (index) => {
    setOpenSections((prev) => (
      {
        ...prev,
        [index]: !prev[index],
      }
    ));
  };

  const fetchCourseProgress = async () => {
  try {
    const token = await getToken();

    const { data } = await axios.post(
      `${backendUrl}/api/user/get-course-progress`,
      {
        courseId
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    if (data.success) {
      setProgressData(data.progressData);
    }
  } catch (error) {
    console.log(error);
  }
};

  useEffect(() => {
    getCourseData()
  }, [enrolledCourses])

  useEffect(() => {
  if (courseId) {
    fetchCourseProgress();
  }
}, [courseId]);


  const markLectureAsCompleted = async () => {
  try {
    const token = await getToken();

    const { data } = await axios.post(
      `${backendUrl}/api/user/update-course-progress`,
      {
        courseId,
        lectureId: playerData.lectureId
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    if (data.success) {
      await fetchCourseProgress();
    }
  } catch (error) {
    console.log(error);
  }
};



  
  return (
    <>
      <div className='p-4 sm:p-10 flex flex-col-reverse md:grid md:grid-cols-2 gap-10 md:px-36'>
        {/* left column */}
        <div className='text-gray-800'>
          <h2 className='text-xl font-semibold'>Course Structure</h2>

          <div className='pt-5'>
            {courseData?.courseContent?.map((chapter, index) => (
              <div key={index} className='norder border-gray-300 bg-white mb-2 rounded'>

                <div
                  className='flex items-center justify-between px-4 py-3 cursor-pointer select-none'
                  onClick={() => toggleSection(index)}
                >
                  <div className='flex items-center gap-2'>
                    <img
                      className={`transform transition-transform ${openSections[index] ? 'rotate-180' : ''}`}
                      src={assets.down_arrow_icon} alt="arrow icon" />
                    <p className='font-medium md:text-base text-sm'>{chapter.chapterTitle}</p>
                  </div>
                  <p className='text-sm md:text-default'>
                    {chapter.chapterContent?.length || 0} lectures - {calculateChapterTime(chapter)}
                  </p>
                </div>

                <div className={`overflow-hidden transition-all duration-300 ${openSections[index] ? 'max-h-96' : 'max-h-0'}`}>
                  <ul className='list-disc md:pl-10 pl-4 pr-4 py-2 text-gray-600 border-t border-gray-300'>
                    {chapter.chapterContent?.map((lecture, i) => (
                      <li key={i} className='flex items-start gap-2 py-1'>
                       <img
  src={
    progressData?.lectureCompleted?.includes(lecture.lectureId)
      ? assets.blue_tick_icon
      : assets.play_icon
  }
  alt="lecture status"
  className='w-4 h-4 mt-1'
/>
                        <div className='flex items-center justify-between w-full text-gray-800 text-xs md:text-default'>
                          <p>{lecture.lectureTitle}</p>
                          <div className='flex gap-2'>
                            {lecture.lectureUrl && (
                              <p
                               onClick={() => setPlayerData({
  ...lecture,
  chapter: index + 1,
  lecture: i + 1,
  lectureId: lecture.lectureId
})}
                                className='text-blue-500 cursor-pointer'
                              >
                                Watch
                              </p>
                            )}
                            <p>
                              {humanizeDuration(lecture.lectureDuration * 60 * 1000, { units: ['h', 'm'] })}
                            </p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          <div className='flex items-center gap-2 py-3 mt-10'>
            <h1 className='text-xl font-bold'>Rate this Course:</h1>
            <Rating initialRating={0} />
          </div>
        </div>

        {/* right column */}
        <div className='md:mt-10'>
          {playerData ? (
            <div>
             <YouTube
  videoId={new URL(playerData.lectureUrl).searchParams.get("v")}
  iframeClassName='w-full aspect-video'
/>
              <div className='flex justify-between items-center mt-1'>
                <p>{playerData.chapter}.{playerData.lecture} {playerData.lectureTitle}</p>
             <button
  onClick={markLectureAsCompleted}
  className='text-blue-600'
>
  {progressData?.lectureCompleted?.includes(playerData.lectureId)
    ? 'Completed'
    : 'Mark Complete'}
</button>
              </div>
            </div>
          ) : (
            courseData && courseData.courseThumbnail ? (
              <img
                src={
                  courseData.courseThumbnail?.startsWith('http')
                    ? courseData.courseThumbnail
                    : 'http://127.0.0.1:5000/' + courseData.courseThumbnail
                }
                onError={(e) => { e.target.src = '/fallback.png' }}
                alt="course"
              />
            ) : null
          )}
        </div>
      </div>
      <Footer />
    </>
  )
}

export default Player
