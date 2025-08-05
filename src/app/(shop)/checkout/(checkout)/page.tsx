'use client'

import { Title } from "@/components";
import Link from "next/link";
import { ProductsInCart } from "./ui/ProductsInCart";
import { PlaceOrder } from "./ui/PlaceOrder";
import { useCartStore } from "@/store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";



export default function () {

  const router = useRouter();
  const cart = useCartStore(state => state.cart);

  useEffect(() => {
    if (cart.length === 0) {
      router.replace('/');
    }
  }, []);

  if (cart.length === 0) return null;


  return (
    <div className="flex justify-center items-center mb-72 px-10 sm:px-0">
      <div className="flex flex-col w-[1000px]">
        <Title title="Verificar Orden" />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">

          {/* Carrito */}
          <div className="flex flex-col mt-5">
            <span className="text-xl">Ajustar Elementos</span>

            <Link href="/cart" className="underline mb-5">
              Editar carrito
            </Link>

            {/* Items */}
            <ProductsInCart />
          </div>

          {/* Checkout */}
          <PlaceOrder />
        </div>
      </div>
    </div >
  );
}
