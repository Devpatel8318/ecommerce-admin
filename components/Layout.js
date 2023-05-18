import Nav from "@/components/Nav"
import { useSession, signIn, signOut } from "next-auth/react"
import { useState } from "react";
import Logo from "./Logo";


export default function Layout({ children }) {

  const { data: session } = useSession();
  const [showNav, setShowNav] = useState(false);

  if (!session) {
    return (
      <div className="bg-[#5542F6] flex justify-center items-center h-screen w-screen">
        <div>
          <button onClick={() => signIn('google')} className='rounded-lg bg-white py-2 px-4 '>Login with Google</button>
        </div>
      </div>
    )
  }

  return (

    <div className="bg-bgGray min-h-screen">
      <div className="md:hidden flex items-center p-4">
        <button onClick={() => setShowNav(true)}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </button>
        <div className="flex grow justify-center mr-6">
          <Logo />
        </div>
      </div>
      <div className="flex">
        <Nav show={showNav} />
        <div className=" flex-grow mt-2 mr-2 mb-2 h-screen rounded-md p-4 bg-white">
          {children}
        </div>
      </div>
    </div>

  )


}
