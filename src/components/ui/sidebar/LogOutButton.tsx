'use client'

import { signOut } from "next-auth/react"
import { IoLogOutOutline } from "react-icons/io5"


export const LogOutButton = ({ closeMenu }: { closeMenu: () => void }) => {

    const handleLogout = async () => {
        closeMenu()
        await signOut({ callbackUrl: '/' })
    }
    return (
        <button className="flex w-full items-center mt-10 p-2 hover:bg-gray-100 rounded transition-all"
            onClick={handleLogout}>
            <IoLogOutOutline size={30} />
            <span className="ml-3 text-xl">Salir</span>
        </button>
    )
}