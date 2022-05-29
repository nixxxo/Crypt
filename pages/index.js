import Head from 'next/head'
import Image from 'next/image'
import React from 'react';
import ReactTypingEffect from 'react-typing-effect';
import { motion } from "framer-motion"

export default function Home() {
  return (
    <div className='bg-gradient-to-tr from-indigo-600 via-violet-600 to-purple-600 flex h-screen w-full text-center'>
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
        <a href="https://discord.gg/3bZDVq84cP"><button className="btn btn-primary mt-10">JOIN NOW</button></a>
      </div>
    </div>
  )
}
