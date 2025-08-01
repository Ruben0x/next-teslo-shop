import Image from "next/image";

import { PayPalButton, Title } from "@/components";
import { getOrderById } from "@/actions/order";
import { redirect } from "next/navigation";
import { currencyFormat } from "@/utils";
import { PayButton } from "./ui/PayButton";

interface Props {
  params: Promise<{
    id: string
  }>
}

export default async function ({ params }: Props) {

  const { id } = await params
  const { order, ok } = await getOrderById(id)

  if (!ok) { redirect('/') }

  const address = order?.OrderAddress

  return (
    <div className="flex justify-center items-center mb-72 px-10 sm:px-0">
      <div className="flex flex-col w-[1000px]">
        <Title title={`Orden #${(id.split('-', 1))}`} />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">

          {/* Carrito */}

          <div className="flex flex-col mt-5">
            <PayButton isPaid={order?.isPaid} />

            {/* Items */}

            {
              order!.OrderItem.map(item => (
                <div key={item.product.slug + '-' + item.size} className="flex mb-5">
                  <Image
                    src={`/products/${item.product.ProductImage[0].url}`}
                    width={100}
                    height={100}
                    style={{
                      width: '100px',
                      height: '100px'
                    }}
                    alt={item.product.title}
                    className="mr-5 rounded"

                  />

                  <div>
                    <p>{item.product.title}</p>
                    <p>{currencyFormat(item.price)} x {item.quantity}</p>
                    <p className="font-bold">Subtotal: {currencyFormat(item.price * item.quantity)}</p>

                  </div>
                </div>
              ))
            }
          </div>
          {/* Checkout */}
          <div className="bg-white rounded-xl shadow-xl p-7 h-fit">
            <h2 className="font-bold">Dirección de entrega</h2>
            <div className="mb-10">
              <p>{address?.firstName} {address?.lastName}</p>
              <p>{address?.address}</p>
              <p>{address?.city}, {address?.countryId}</p>
              <p>{address?.phone}</p>
            </div>

            {/* Divider */}

            <div className="w-full h-0.5 rounded bg-gray-200 mb-10" />

            <h2 className="text-2xl mb-2 font-bold">Resumen de orden</h2>
            <div className="grid grid-cols-2">
              <span>No. Productos</span>
              <span className="text-right">
                {order?.itemsInOrder === 1 ? '1 artículo' : `${order?.itemsInOrder} artículos`}</span>
              <span>Subtotal</span>
              <span className="text-right">{currencyFormat(order!.subTotal)}</span>
              <span>Impuestos (15%)</span>
              <span className="text-right">{currencyFormat(order!.tax)}</span>
              <span className="text-2xl mt-5">Total:</span>
              <span className="text-2xl mt-5 text-right">{currencyFormat(order!.total)}</span>
            </div>
            <div className="mt-5 mb-2 w-full">
              {/* <PayButton isPaid={order?.isPaid} /> */}

              {
                order?.isPaid ?
                  <PayButton isPaid={order?.isPaid} />
                  :
                  <PayPalButton amount={order!.total} orderId={order!.id} />
              }

            </div>
          </div>
        </div>
      </div>
    </div >
  );
}
