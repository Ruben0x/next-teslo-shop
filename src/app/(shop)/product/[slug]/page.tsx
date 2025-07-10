import { ProductMobileSlideshow, ProductSlideshow, QuantitySelector, SizeSelector } from "@/components";
import { initialData } from "@/seed/seed";
import { notFound } from "next/navigation";

interface Props {
  params: {
    slug: string
  }
}

export default async function ({ params }: Props) {

  const { slug } = await params
  const product = initialData.products.find(p => p.slug === slug)

  if (!product) {
    notFound()
  }
  return (
    <div className="mt-5 mb-20 grid md:grid-cols-3 gap-3">
      <div className="col-span-1 md:col-span-2">

        <ProductMobileSlideshow title={product.title} images={product.images} className="block md:hidden" />
        <ProductSlideshow title={product.title} images={product.images} className="hidden md:block" />
      </div>
      <div className="col-span-1 px-5">
        <h1 className="antialiased font-bold text-xl">{product.title}</h1>

        <p className="text-lg mb-5">${product.price}</p>


        <SizeSelector selectedSize={product.sizes[0]} availableSizes={product.sizes} />

        <QuantitySelector quantity={1} />

        <button className="btn-primary my-5">Agregar al carrito</button>

        <h3 className="font-bold text-sm">Descripción</h3>

        <p className="font-light">{product.description}</p>
      </div>

    </div>
  );
}
