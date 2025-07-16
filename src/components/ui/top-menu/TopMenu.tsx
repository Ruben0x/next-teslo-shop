'use client'

import { monserratAlternative } from '@/config';
import { useUiStore } from '@/store';
import Link from 'next/link';
import { IoCartOutline, IoSearchOutline } from 'react-icons/io5';
import { useCartStore } from '../../../store/cart/cart-store';
import { useEffect, useState } from 'react';

export const TopMenu = () => {

  const openMenu = useUiStore(state => state.openSideMenu)
  const totalItemsInCart = useCartStore(state => state.getTotalItems())

  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    setLoaded(true)
  }, [])


  return (
    <nav className="flex px-5 justify-between items-center w-full">
      <div>
        <Link href={'/'}>
          <span className={`${monserratAlternative} antialiased font-bold`}>Teslo</span>
          <span className=""> | Shop</span>
        </Link>
      </div>

      <div className="hidden sm:block">
        <Link href="/gender/men" className="m-2 p-2 rounded-md transition-all hover:bg-gray-100">
          Hombres
        </Link>
        <Link
          href="/gender/women"
          className="m-2 p-2 rounded-md transition-all hover:bg-gray-100"
        >
          Mujeres
        </Link>
        <Link href="/gender/kid" className="m-2 p-2 rounded-md transition-all hover:bg-gray-100">
          Niños
        </Link>
      </div>

      <div className="flex items-center">
        <Link href={'/search'} className="mx-2">
          <IoSearchOutline className="w-5 h-5" />
        </Link>
        <Link href={
          (totalItemsInCart === 0) && loaded
            ? '/empty'
            : '/cart'

        } className="mx-2">
          <div className="relative">
            {loaded && (totalItemsInCart > 0) &&
              <span className="fade-in absolute text-xs rounded-full px-1 font-bold -top-2 -right-2 bg-blue-700 text-white">
                {totalItemsInCart}
              </span>
            }
            <IoCartOutline className="w-5 h-5" />
          </div>
        </Link>

        <button className="m-2 p-2 rounded-md transition-all hover:bg-gray-100" onClick={openMenu}>Menú</button>
      </div >
    </nav >
  );
};
