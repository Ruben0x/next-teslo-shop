'use client'

import { ProductImage, QuantitySelector } from "@/components"
import { useCartStore } from "@/store"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"

export const ProductsInCart = () => {

    const updateProductQuantity = useCartStore(state => state.updateProductQuantity)
    const removeProduct = useCartStore(state => state.removeProduct)
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
                        <ProductImage
                            src={p.image}
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
                            <Link className="hover:underline cursor-pointer" href={`/product/${p.slug}`}>
                                <p>{p.size} - {p.title}</p>
                            </Link>

                            <p>${p.price}</p>
                            <QuantitySelector quantity={p.quantity} onChangedQuantity={quantity => updateProductQuantity(p, quantity)} slug={p.slug} />

                            <button className="underline mt-3" onClick={() => removeProduct(p)}>
                                Remover
                            </button>
                        </div>
                    </div>
                ))
            }
        </>
    )
}