import { getProductBySlug } from "@/actions";
import { Title } from "@/components";
import { redirect } from "next/navigation";
import { ProductForm } from "./ui/ProductForm";
import { getCategories } from "@/actions/products";

interface Props {
    params: {
        slug: string
    }
}

export default async function ProductPage({ params }: Props) {

    const { slug } = await params

    const [product, categories] = await Promise.all([
        getProductBySlug(slug),
        getCategories()
    ])




    // if ((!product || !categories) && slug !== 'new') {
    //     redirect('/admin/products')
    // }
    if (!product && slug !== 'new') {
        redirect('/admin/products')
    }


    const title = (slug === 'new') ? 'Nuevo producto' : 'Editar producto'

    return (
        <>
            <Title title={'Editar producto'} />
            <ProductForm product={product ?? {}} categories={categories} />
        </>
    );
}