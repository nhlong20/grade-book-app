import NextAuth, { Session, User } from 'next-auth'
import Providers from 'next-auth/providers'
import { JWT } from 'next-auth/jwt'
import { asyncTryCatch } from '@utils/asyncTryCatch'
import axios from 'axios'
import jwt from 'jsonwebtoken'
import { API } from './../../../environment'

import { User as IUser } from '@models/user'

type Token = JWT & Pick<IUser, 'uuid' | 'name' | 'email'>

export type JWTPayload = Token & {
    iat?: number
    exp?: number
    token?: string
}


export default NextAuth({
    providers: [
        Providers.Credentials({
            id: 'login',
            name: 'Credentials',
            async authorize(credentials: Record<string, string>) {
                const [res] = await asyncTryCatch(() =>
                    axios
                        .put(`${API}/auth`, {
                            email: credentials.email,
                            password: credentials.password,
                        })
                        .then((res) => res.data),
                )

                return res
            },
        })

    ],
    secret: process.env.SECRET,
    session: {
        jwt: true,
        maxAge: 1 * 24 * 60 * 60, // in seconds // 1 day
    },
    callbacks: {
        async redirect(url) {
          if (url.includes('callbackUrl')) {
            return url.split('=')[1]
          }
    
          return url
        },
        async signIn(user, account, profile) {    
          return true
        },
        jwt(payload, user: User, account) {
          if (user) {
            Object.assign(payload, user)
          }
    
          return payload
        },
        session: async (session: Session, user) => {
          Object.assign(session.user, user)
    
          return Promise.resolve(session)
        },
      },
    jwt: {
        secret: process.env.SECRET,
        encode: async (params) => {
            const secret = params?.secret || ''
            const token = params?.token as Token

            const payload = Object.assign({}, token)

            const encodedToken = jwt.sign(payload, secret, {
                algorithm: 'HS256',
            })

            return encodedToken
        },

        decode: async (params) => {
            if (!params?.token) {
                return {}
            }

            const secret = params?.secret as string
            const decodedToken = jwt.verify(params?.token, secret, {
                algorithms: ['HS256'],
            }) as JWT

            return decodedToken
        },
    },
    pages: {
        signIn: '/login',
        error: '/login',
    },

    events: {},
    debug: false,
})