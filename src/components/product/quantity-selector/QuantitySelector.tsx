'use client'

import { IoAddCircleOutline, IoRemoveCircleOutline } from "react-icons/io5"

interface Props {
    quantity: number
    onChangedQuantity: (quantity: number) => void
}

export const QuantitySelector = ({ quantity, onChangedQuantity }: Props) => {


    const onValueChanged = (value: number) => {
        if (quantity + value < 1 || quantity + value > 10) return

        onChangedQuantity(quantity + value)

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