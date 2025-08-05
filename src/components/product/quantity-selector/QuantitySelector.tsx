'use client'

import { getStockBySlug } from "@/actions/products/get-stock-by-slug"
import { useEffect, useState } from "react"
import { IoAddCircleOutline, IoRemoveCircleOutline } from "react-icons/io5"

interface Props {
    quantity: number
    onChangedQuantity: (quantity: number) => void
    slug: string
}

export const QuantitySelector = ({ quantity, onChangedQuantity, slug }: Props) => {

    const [stock, setStock] = useState(0)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {

        const getStock = async () => {
            const inStock = await getStockBySlug(slug)

            setStock(inStock)
            setIsLoading(false)
        }
        getStock()

    }, [])




    const onValueChanged = (value: number) => {

        if (quantity + value < 1 || quantity + value > stock) return

        onChangedQuantity(quantity + value)

    }

    if (isLoading) return <p>Cargando...</p>


    if (stock === 0) {
        return <p className="text-red-600 font-semibold">Sin stock disponible</p>
    }



    return (

        <div className="flex">
            <button onClick={() => onValueChanged(-1)}>
                <IoRemoveCircleOutline size={30} />
            </button>
            <span className="w-20 mx-3 px-5 bg-gray-100 text-center rounded">{quantity}</span>
            <button onClick={() => onValueChanged(+1)}>
                <IoAddCircleOutline size={30} />
            </button>
        </div>
    )
}