import type { FC } from 'react'

export const Footer: FC = () => {
  return (
    <div className='border-4 border-indigo-500'>
      <footer className='bg-lightsalmon p-20 text-black'>
      Powered by Nextra {new Date().getFullYear()}
      </footer>
    </div>
  )
}
