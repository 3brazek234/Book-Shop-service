import React from 'react'
import logo from "../../assets/favicon.ico"
import Image from 'next/image'
import Link from 'next/link'
function Logo() {
  return (

    <Link href='/' className='flex items-center gap-2'>
      <Image src={logo.src} alt="logo" width={40} height={40} />
        <span className='text-2xl font-semibold text-white'>Book 
        <span className='text-light-200 ms-1 text-amber-400'>Shelf</span>
        </span>
    </Link> 
  )
}

export default Logo