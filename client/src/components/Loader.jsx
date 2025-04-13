import { Spinner } from '@material-tailwind/react'
import React from 'react'

const Loader = () => {
  return (
    <div className='flex items-center justify-center w-full min-h-[80vh] dark:bg-[#121212]'>
      <Spinner className="h-10 w-10 " />
    </div>
  )
}

export default Loader