import React,{useState} from 'react'
import Link from 'next/link'
import { useRouter } from "next/router";

import MonitorWeightIcon from '@mui/icons-material/MonitorWeight';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';

function Header() {
  const router = useRouter()
  const [toggle, setToggle] = useState(false)

    const handleLogout = () => {
        router.push("/auth/logout")
    }
  return (
    <div className='flex justify-around'>
        <Link className="basis-0 grow flex justify-center" href="/weights"><p><MonitorWeightIcon />Weight</p></Link>
        <Link className="basis-0 grow flex justify-center" href="/kalorien"><p><RestaurantIcon />Meals</p></Link>
        <Link className="basis-0 grow flex justify-center" href="/exercises"><p><FitnessCenterIcon />Exercises</p></Link>
        <div className="basis-0 grow flex justify-center" onClick={() => setToggle((prev) => !prev)}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 hover:cursor-pointer">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </div>

        <div className={toggle === true ? "absolute w-[25%] right-0 translate-y-6 transition " : "absolute w-[25%] h-[0px] top-0 right-0 overflow-hidden "}>
          <div className='rounded-b border-b-[1px] border-r-[1px] border-l-[1px] h-20 bg-[#18181b]'>
            <ul className='flex flex-col items-center justify-around h-full'>
              <li><Link href="/settings" onClick={() => setToggle((prev) => !prev)}>Einstellungen</Link></li>
              <li><button onClick={handleLogout}><p className='hover:cursor-pointer border-[1px] px-2 rounded"'>Logout</p></button></li>
            </ul>
          </div>
        </div>
    </div>
  )
}

export default Header