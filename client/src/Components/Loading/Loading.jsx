import React from 'react';
import loadIcon from "../icons/loading.gif";

export default function Loading() {
  return (
    <div className='fixed inset-0 flex justify-center items-center bg-black opacity-50 z-30'>
      <img src={loadIcon} className='w-20 h-20' alt="loading" /> <span className='text-white text-2xl'>Loading...</span>
    </div>
  );
}
