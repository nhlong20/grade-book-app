import NextAuth, { Session, User } from 'next-auth'
import Providers from 'next-auth/providers'
import { JWT } from 'next-auth/jwt'
import { asyncTryCatch } from '@utils/asyncTryCatch'
import axios from 'axios'
import jwt from 'jsonwebtoken'
import { API } from 'environment'

import { User as IUser } from '@models/user'

type Token = JWT & Pick<IUser,  'name' | 'email'>

export type JWTPayload = Token & {
    iat?: number
    exp?: number
    token?: string
}


export default NextAuth({
    providers: [
        Providers.Google({
            id: 'google',
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
        Providers.Credentials({
            id: 'login',
            name: 'Credentials',
            async authorize(credentials: Record<string, string>) {
                const [res] = await asyncTryCatch(() =>
                    axios
                        .post(`${API}/auth/login`, {
                            email: credentials.email,
                            password: credentials.password,
                        })
                        .then((res) => res.data),
                )
                return res?.user
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
            if (account.provider === 'google') {
                const [res, err] = await asyncTryCatch(() =>
                    axios.put(`${API}/auth/by-google-id`, {
                        email: profile.email,
                        googleId: profile.id,
                    }),
                )

                if (err) {
                    return false
                }

                Object.assign(user, res?.data)
            }

            if (account.provider === 'google-signup') {
                const [_res, err] = await asyncTryCatch(() =>
                    axios.get(`${API}/auth/user/by-email`, {
                        params: {
                            email: profile.email,
                        },
                    }),
                )

                if (!err) return '/signup?error=EmailExisted'
            }

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