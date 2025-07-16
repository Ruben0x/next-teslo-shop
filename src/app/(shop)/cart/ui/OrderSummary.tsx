'use client'

import { useCartStore } from "@/store"
import { currencyFormat } from "@/utils"
import { useEffect, useMemo, useState } from "react"

export const OrderSummary = () => {

    const cart = useCartStore(state => state.cart)
    const getSummaryInformation = useCartStore(state => state.getSummaryInformation)

    const [loaded, setLoaded] = useState(false)


    const { itemsInCart, subTotal, tax, total } = useMemo(() => getSummaryInformation(), [cart]) // recalcula cuando cart cambia


    // const { itemsInCart, subTotal, tax, total } = getSummaryInformation()


    useEffect(() => {
        setLoaded(true)
    }, [getSummaryInformation])

    if (!loaded) { return <p>Loading...</p> }



    return (
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
    )
}