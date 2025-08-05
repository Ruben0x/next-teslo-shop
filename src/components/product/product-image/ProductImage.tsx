import Image from "next/image"

interface Props {
    src?: string
    alt: string
    className?: React.StyleHTMLAttributes<HTMLImageElement>['className']
    width: number
    height: number
    style?: React.StyleHTMLAttributes<HTMLImageElement>['style']
    onMouseEnter?: () => void
    onMouseLeave?: () => void

}

export const ProductImage = ({ alt, height, width, className, src, style, onMouseEnter, onMouseLeave }: Props) => {

    const localSrc = (src)
        ? src.startsWith('http')
            ? src
            : `/products/${src}`
        : '/imgs/placeholder.jpg'
    return (
        <Image
            src={localSrc}
            className={className}
            width={width}
            height={height}
            alt={alt}
            style={style}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
        />

    )
}