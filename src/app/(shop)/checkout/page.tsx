import { QuantitySelector, Title } from "@/components";
import { initialData } from "@/seed/seed";
import Image from "next/image";
import Link from "next/link";

const productsInCart = [
  initialData.products[0],
  initialData.products[1],
  initialData.products[2],
];


export default function () {
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

            {
              productsInCart.map(p => (
                <div key={p.slug} className="flex mb-5">
                  <Image
                    src={`/products/${p.images[0]}`}
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
                    <p>{p.title}</p>
                    <p>${p.price} x 3</p>
                    <p className="font-bold">Subtotal: ${p.price * 3}</p>

                  </div>
                </div>
              ))
            }


          </div>


          {/* Checkout */}

          <div className="bg-white rounded-xl shadow-xl p-7 h-fit">
            <h2 className="font-bold">Dirección de entrega</h2>
            <div className="mb-10">
              <p>Son Goku</p>
              <p>Kame house 123</p>
              <p>Tierra 2</p>
              <p>Telefono: 19199191</p>
            </div>

            {/* Divider */}

            <div className="w-full h-0.5 rounded bg-gray-200 mb-10" />

            <h2 className="text-2xl mb-2 font-bold">Resumen de orden</h2>
            <div className="grid grid-cols-2">
              <span>No. Productos</span>
              <span className="text-right"> 3 artículos</span>

              <span>Subtotal</span>
              <span className="text-right">$ 100</span>

              <span>Impuestos (15%)</span>
              <span className="text-right">$ 100</span>

              <span className="text-2xl mt-5">Total:</span>
              <span className="text-2xl mt-5 text-right">$ 100</span>

            </div>

            <div className="mt-5 mb-2 w-full">

              <p className="mb-5">
                {/* Disclaimer */}
                <span className="text-xs">
                  Al hacer clic en "Colocar orden", aceptas nuestros <a href="#" className="underline">términos y condiciones</a> y <a href="#" className="underline">política de privacidad</a>
                </span>
              </p>

              <Link href={'/orders/123'} className="flex btn-primary justify-center">Colocar orden</Link>

            </div>
          </div>

        </div>

      </div>
    </div >
  );
}
