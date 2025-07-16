import { CartProduct } from "@/interfaces";
import { create } from "zustand";
import {persist} from 'zustand/middleware'

interface State {
    cart: CartProduct[]

    getTotalItems: ()=> number

    getSummaryInformation :()=>{
            subTotal: number;
            tax: number;
            total: number;
            itemsInCart: number;
    }

    addPropductToCart: (product:CartProduct) => void

    updateProductQuantity: (product: CartProduct, quantity:number) => void

    removeProduct: (product: CartProduct)=>void

}


export const useCartStore = create<State>()(
    persist(
        (set, get)=>({

        cart:[],

        getTotalItems:()=>{
            const {cart} = get()

            return cart.reduce((total, item)=>total + item.quantity, 0)
        },

        getSummaryInformation:()=>{
            const {cart} = get()
            const subTotal = cart.reduce(((subTotal, product)=> (product.price * product.quantity) + subTotal),0)

            const tax = subTotal * 0.15

            const total = subTotal + tax

            const itemsInCart = cart.reduce((total, item)=>total + item.quantity, 0)


            return {
                subTotal, tax, total, itemsInCart
            }


        },

     
        
        
        addPropductToCart:(product:CartProduct)=>{
            const {cart} = get()

            // 1.- Revisar si el producto esta en carrito con la talla seleccionada
            const productInCart = cart.some(
                item => item.id === product.id && item.size === product.size
            )

            if(!productInCart){
                set({cart: [...cart, product]})
                return
            }

            // 2.- Se que el producto con la talla existen, por lo que debo incremendar la cantidad del mismo

            const updatedCartProducts = cart.map(item =>{
                if(item.id === product.id && item.size === product.size){
                    return {...item, quantity: item.quantity + product.quantity}
                }
                return item
            })

            set({cart: updatedCartProducts})
        },

        updateProductQuantity:(product:CartProduct, quantity:number)=>{

            const {cart} = get()
            const updatedCartProducts = cart.map(item=>{
                if(item.id === product.id && item.size === product.size){
                    return {...item, quantity}
                }

                return item
            })

            set({cart: updatedCartProducts})
        },
        removeProduct:(product:CartProduct)=>{
            const {cart} = get()

            const updatedCartProducts = cart.filter(item => product.id !== item.id || product.size !== item.size )

            set({cart: updatedCartProducts})
        }
})


        ,{
            name: 'shopping-cart',
        }

    )
    )