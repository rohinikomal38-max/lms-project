import React from 'react'
import { Outlet } from 'react-router-dom'
import NavBar from '../../components/educator/NavBar'
import Sidebar from '../../components/educator/Sidebar'
import Footer from '../../components/educator/Footer'

const Educator = () => {
  return (
    <div className='text-default min-h-screen bg-white'>
      <NavBar />
      <div className='flex'>
        <Sidebar />
        <div className='flex-1'>
        {<Outlet/>}
     </div>
      </div>
      <Footer/>
    </div>
  )
}

export default Educator
