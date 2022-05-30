import React from 'react';
import ReactTypingEffect from 'react-typing-effect';
import { motion } from "framer-motion"

export default function Home() {
  return (
    <div className='bg-gradient-to-tr from-indigo-600 via-violet-600 to-purple-600 flex flex-col h-screen w-full text-center'>
      <div className='m-auto flex flex-col'>
        {/* <motion.div  animate={{ scale: 2 }}> */}
          <img src="NoText.png" alt="crypt-logo" className='animate-spin-slow m-auto mb-3 h-36'/>
        {/* </motion.div> */}
        <ReactTypingEffect
          className='text-white font-sans font-bold text-2xl md:text-3xl lg:text-5xl'
          speed={200}
          eraseSpeed={100}
          text={["Join the completely FREE crypto community.", "Click down below!", "Find like-minded individuals."]}
        />
        <div className='flex flex-row mt-10'>
          <a href="https://discord.gg/3bZDVq84cP"><button className="btn btn-primary mx-1">JOIN NOW</button></a>
          <a href="https://upgrade.chat/980516915258753084/upgrades?productId=03b4532f-f27c-4d58-ae4d-f8370003ca07"><button className="btn btn-secondary mx-1">UPGRADE NOW</button></a>
        </div>
      </div>
      {/* <div>
        <div className="carousel carousel-center max-w-md p-4 space-x-4 bg-neutral rounded-box">
          <div className="carousel-item">
            <img src="https://api.lorem.space/image/furniture?w=250&h=180&hash=8B7BCDC2" class="rounded-box" />
          </div> 
        </div>
      </div> */}
    </div>
  )
}
