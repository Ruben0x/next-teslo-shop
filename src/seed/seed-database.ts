import { prisma } from '../lib/prisma';
import { initialData } from './seed';

async function main() {

    // await Promise.all([
        await prisma.productImage.deleteMany(),
        await prisma.product.deleteMany(),
        await prisma.category.deleteMany()
    // ])

const {categories, products} = initialData

const categoriesData = categories.map(category=>({
    name: category
}))

await prisma.category.createMany({
    data: categoriesData
})

const categoriesDB = await prisma.category.findMany()

const categoriesMap = categoriesDB.reduce((map, category)=>{
    map[category.name.toLocaleLowerCase()] = category.id

    return map
}, {} as Record<string, string>)


products.forEach(async(product)=>{
    const {type, images, ...rest} = product

    const dbProduct = await prisma.product.create({
        data:{
            ...rest,
            categoryId: categoriesMap[type]
        }
    })
    const imagesData = images.map(image=>({
        url:image,
        productId:dbProduct.id
    }))

    await prisma.productImage.createMany({
        data:imagesData
    })
})


    console.log('Seed ejecutado correctamente');
}

(()=>{

    if(process.env.NODE_ENV === 'production') return

    main()
})()