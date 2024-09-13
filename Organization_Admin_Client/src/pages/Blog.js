import React from 'react'
import {motion} from 'framer-motion';

const Blog = () => {
  return (
    <motion.div
       initial = {{opacity:0}} 
    animate = {{opacity:1}}
    exit = {{opacity:0}}
    transition = {{duration:3}}
   > </motion.div>
  )
}

export default Blog