import Image from "next/image";

import { Title } from "@/components";
import { initialData } from "@/seed/seed";
import clsx from "clsx";
import { IoCardOutline } from "react-icons/io5";

const productsInCart = [
  initialData.products[0],
  initialData.products[1],
  initialData.products[2],
];


interface Props {
  params: Promise<{
    id: string
  }>
}

export default async function ({ params }: Props) {

  const { id } = await params

  //Todo verificar

  //redirect()


  return (
    <div className="flex justify-center items-center mb-72 px-10 sm:px-0">
      <div className="flex flex-col w-[1000px]">
        <Title title={`Orden #${id}`} />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">

          {/* Carrito */}

          <div className="flex flex-col mt-5">
            <div className={
              clsx(
                "flex items-center rounded-lg py-2 px-3.5 text-xs font-bold text-white mb-5",
                {
                  'bg-red-500': false,
                  'bg-green-700': true,
                }
              )
            }>

              <IoCardOutline size={30} />
              {/* <span className="mx-2">Pendiente de pago</span> */}
              <span className="mx-2">Pagada</span>
            </div>

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



              <div className={
                clsx(
                  "flex items-center rounded-lg py-2 px-3.5 text-xs font-bold text-white mb-5",
                  {
                    'bg-red-500': false,
                    'bg-green-700': true,
                  }
                )
              }>
                <IoCardOutline size={30} />
                {/* <span className="mx-2">Pendiente de pago</span> */}
                <span className="mx-2">Pagada</span>
              </div>

            </div>
          </div>

        </div>

      </div>
    </div >
  );
}
