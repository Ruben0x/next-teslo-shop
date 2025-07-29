import NextAuth, { NextAuthConfig } from "next-auth";
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import bcrypt from "bcryptjs";
import { prisma } from "./lib/prisma";


const authenticatedRoutes = [
  "/auth/login",
  "/auth/new-account"
]

const checkoutAddressRoute = [
  "/checkout/address",
  "/checkout/",
]


export const authConfig: NextAuthConfig = {
  pages: {
    signIn: '/auth/login',
    newUser: '/auth/new-account'
  },

  callbacks: {
    authorized({ auth, request: { nextUrl } }) {


      const isLoggedIn = !!auth?.user;
      const pathname = nextUrl.pathname;

      const isAuthPage = ['/auth/login', '/auth/new-account'].some(path => pathname.startsWith(path));
      const isCheckout = pathname.startsWith('/checkout');

      // Si está logueado y va al login, redirigir al home
      if (isAuthPage && isLoggedIn) {
        return Response.redirect(new URL('/', nextUrl));
      }

      // Si no está logueado y va a /checkout
      if (isCheckout && !isLoggedIn) {
        return Response.redirect(new URL(`/auth/login?origin=${pathname}`, nextUrl));
      }

      return true;
    },

    jwt({ token, user }) {

      if (user) {
        token.data = user
      }
      return token
    },

    session({ session, token, user }) {

      session.user = token.data as any
      return session
    },
  },
  providers: [

    Credentials({
      async authorize(credentials) {

        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (!parsedCredentials.success) return null

        const { email, password } = parsedCredentials.data

        const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } })

        if (!user) return null

        if (!bcrypt.compareSync(password, user.password)) return null

        const { password: _, ...rest } = user


        return rest
      },
    }),

  ]
}

export const { signIn, signOut, auth, handlers } = NextAuth(authConfig)