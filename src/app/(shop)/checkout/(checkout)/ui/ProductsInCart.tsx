'use client'

import { useCartStore } from "@/store"
import Image from "next/image"
import { useEffect, useState } from "react"
import { currencyFormat } from '../../../../../utils/currencyFormat';

export const ProductsInCart = () => {

    const [loaded, setLoaded] = useState(false)
    const productsInCart = useCartStore(state => state.cart)

    useEffect(() => {
        setLoaded(true)
    }, [])

    if (!loaded) { return <p>Cargando...</p> }
    return (

        <>
            {
                productsInCart.map(p => (
                    <div key={`${p.slug}-${p.size}`} className="flex mb-5">
                        <Image
                            src={`/products/${p.image}`}
                            width={100}
                            height={100}
                            style={{
                                width: '100px',
                                height: '100px'
                            }}
                            alt={p.title}
                            className="mr-5 rounded"
                        />
                        <div>
                            <span >
                                <p>{p.size} - {p.title} ({p.quantity})</p>
                            </span>

                            <p className="font-bold">{currencyFormat(p.price * p.quantity)}</p>
                        </div>
                    </div>
                ))
            }
        </>
    )
}