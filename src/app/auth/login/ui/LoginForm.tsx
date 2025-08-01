'use client'

import { authenticate } from "@/actions/auth/login"
import clsx from "clsx"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useActionState, useEffect } from "react"
import { IoInformationOutline } from "react-icons/io5"

export const LoginForm = () => {

    const [state, dispatch, isPending] = useActionState(authenticate, undefined)
    // const router = useRouter()


    useEffect(() => {
        if (state === 'Success') {
            // router.replace('/')
            window.location.replace('/')
        }
    }, [state])

    return (

        <form action={dispatch} className="flex flex-col">

            <label htmlFor="email">Correo electrónico</label>
            <input
                className="px-5 py-2 border bg-gray-200 rounded mb-5"
                type="email"
                name="email" />


            <label htmlFor="password">Contraseña</label>
            <input
                className="px-5 py-2 border bg-gray-200 rounded mb-5"
                type="password" name="password" />


            <div
                className="flex h-8 items-end space-x-1"
                aria-live="polite"
                aria-atomic="true"
            >
                {state === 'CredentialsSignin' && (
                    <div className="flex flex-row mb-2">
                        <IoInformationOutline className="h-5 w-5 text-red-500" />
                        <p className="text-sm text-red-500">Credenciales incorrectas</p>
                    </div>
                )}
            </div>

            <button
                aria-disabled={isPending}
                disabled={isPending}
                type="submit"
                className={clsx(
                    {
                        'btn-primary': !isPending,
                        'btn-disabled': isPending
                    }
                )}>
                Ingresar
            </button>


            {/* divisor l ine */}
            <div className="flex items-center my-5">
                <div className="flex-1 border-t border-gray-500"></div>
                <div className="px-2 text-gray-800">O</div>
                <div className="flex-1 border-t border-gray-500"></div>
            </div>

            <Link
                href="/auth/new-account"
                className="btn-secondary text-center">
                Crear una nueva cuenta
            </Link>

        </form>
    )
}