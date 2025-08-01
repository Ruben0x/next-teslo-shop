'use client'


import { getStockBySlug } from "@/actions/products/get-stock-by-slug"
import { useEffect, useState } from "react"

interface Props {
    slug: string
}

export const StockLabel = ({ slug }: Props) => {

    const [stock, setStock] = useState(0)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {

        getStock()

    }, [])

    const getStock = async () => {
        const inStock = await getStockBySlug(slug)

        setStock(inStock)
        setIsLoading(false)
    }

    return (
        <>

            {isLoading ?

                <h1 className="antialiased font-bold text-lg animate-pulse bg-gray-200">&nbsp;</h1>
                :
                <h1 className="antialiased font-bold text-lg">Stock: {stock}</h1>

            }
        </>
    )
}