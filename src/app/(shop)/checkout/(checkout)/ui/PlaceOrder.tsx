'use client'

import { placeOrder } from "@/actions/order"
import { useAddressStore, useCartStore } from "@/store"
import { currencyFormat } from "@/utils"
import clsx from "clsx"
import { useRouter } from "next/navigation"
import { useEffect, useMemo, useState } from "react"


export const PlaceOrder = () => {

    const router = useRouter()

    const [loaded, setLoaded] = useState(false)
    const [isPlacingOrder, setIsPlacingOrder] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')

    const address = useAddressStore(state => state.address)
    const cart = useCartStore(state => state.cart)
    const clearCart = useCartStore(state => state.clearCart)
    const getSummaryInformation = useCartStore(state => state.getSummaryInformation)
    const { itemsInCart, subTotal, tax, total } = useMemo(() => getSummaryInformation(), [cart]) // recalcula cuando cart cambia


    useEffect(() => {
        setLoaded(true)
    }, [])

    const onPlaceOrder = async () => {

        setIsPlacingOrder(true)

        const productsToOrder = cart.map(product => ({
            productId: product.id,
            quantity: product.quantity,
            size: product.size
        }))

        const resp = await placeOrder(productsToOrder, address)

        if (!resp.ok) {
            setIsPlacingOrder(false)
            setErrorMessage(resp.message!)
            return
        }

        clearCart()

        router.replace('/orders/' + resp.order?.id)
    }

    if (!loaded) { return <p>Cargando...</p> }

    return (
        <div className="bg-white rounded-xl shadow-xl p-7 h-fit">
            <h2 className="font-bold">Dirección de entrega</h2>
            <div className="mb-10">
                <p className="text-xl">{address.firstName} {address.lastName}</p>
                <p>{address.address}</p>
                <p>{address.address2}</p>
                <p>{address.postalCode}</p>
                <p>{address.city}, {address.country}</p>
                <p>{address.phone}</p>
            </div>

            {/* Divider */}

            <div className="w-full h-0.5 rounded bg-gray-200 mb-10" />

            <h2 className="text-2xl mb-2 font-bold">Resumen de orden</h2>
            <div className="grid grid-cols-2">
                <span>No. Productos</span>
                <span className="text-right"> {itemsInCart === 1 ? '1 articulo' : `${itemsInCart} articulos`}</span>

                <span>Subtotal</span>
                <span className="text-right">{currencyFormat(subTotal)}</span>

                <span>Impuestos (15%)</span>
                <span className="text-right">{currencyFormat(tax)}</span>

                <span className="text-2xl mt-5">Total:</span>
                <span className="text-2xl mt-5 text-right">{currencyFormat(total)}</span>

            </div>

            <div className="mt-5 mb-2 w-full">

                <p className="mb-5">
                    {/* Disclaimer */}
                    <span className="text-xs">
                        Al hacer clic en "Colocar orden", aceptas nuestros <a href="#" className="underline">términos y condiciones</a> y <a href="#" className="underline">política de privacidad</a>
                    </span>
                </p>

                <p className="text-red-500">{errorMessage}</p>

                <button
                    // href={'/orders/123'}
                    onClick={onPlaceOrder}
                    className={
                        clsx({
                            'btn-primary': !isPlacingOrder,
                            'btn-disabled': isPlacingOrder

                        })}>
                    Colocar orden</button>

            </div>
        </div>
    )
}