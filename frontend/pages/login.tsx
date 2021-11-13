import { signin, signIn } from 'next-auth/client'
import { useForm } from 'react-hook-form'
import { useCallback, useEffect } from 'react'
import { toast } from 'react-toastify';
import { useRouter } from 'next/dist/client/router'
import Head from 'next/head'
import SignUp from './signup'
import Link from 'next/link'


type FormData = {
    email: string
    password: string
}
const errorMapping: Record<string, string> = {
    AccessDenied: 'Your account has not existed in the system yet!',
    CredentialsSignin: 'Your provided credentials are not correct!',
    Callback: 'System failure!',
  }

export default function Login() {
    const { query } = useRouter()
    const { register, handleSubmit } = useForm<FormData>()

    useEffect(() => {
        if (!('error' in query)) return
        toast.error(errorMapping[query.error as string])
      }, [query])
    
    const login = useCallback(
        (data: Record<string, any>) => {
            signIn('login', {
                callbackUrl: (query.callbackUrl as string) || '/',
                ...data,
            })
        },
        [query],
    )
    
    const loginWithGoogle = useCallback(() => {
        signin('google')
      }, [])
    
    return (
        <div>
            <Head>
                <title>Login | Gradebooks</title>
            </Head>
            <div className="shadow-md py-2 fixed min-w-full">
                <div className="flex justify-around items-center">
                    <Link href="/">
                        <h1 className="text-2xl cursor-pointer font-bold text-green-500 uppercase">Gradebooks</h1>
                    </Link>
                    <div>
                        <button className="py-2 px-4 font-semibold shadow-md text-black hover:text-green-700 mx-1">
                            Đăng nhập
                        </button>
                        <SignUp />
                    </div>
                </div>
            </div>

            <div className="container h-screen min-h-full min-w-full">
                <main className="flex flex-col text-center min-h-full justify-center">
                    <div>
                        <form
                            noValidate
                            className="w-96 rounded-md bg-white dark:bg-gray-600 inline-block p-8 shadow-md"
                            onSubmit={handleSubmit(login)}>
                            <h3 className="text-4xl font-bold text-green-500 py-4">
                                Login to GRADEBOOKS
                            </h3>
                            <p className="mb-8">Một nền tảng dễ dàng sử dụng và bảo mật</p>
                            <input
                                id="email"
                                type="email"
                                className="block border border-grey-light w-full p-3 rounded mb-4"
                                placeholder="Email của bạn *"
                                {...register('email', {
                                    required: {
                                        value: true,
                                        message: 'Email is required',
                                    },
                                    maxLength: {
                                        value: 30,
                                        message: 'Email must be at most 30 characters',
                                    },
                                })} />

                            <input
                                type="password"
                                className="block border border-grey-light w-full p-3 rounded mb-4"
                                placeholder="Mật khẩu *"
                                {...register('password', {
                                    required: {
                                        value: true,
                                        message: 'Password is required',
                                    },
                                    maxLength: {
                                        value: 30,
                                        message: 'Password must be at most 30 characters',
                                    },
                                })} />

                            <button
                                type="submit"
                                className="w-full text-center py-3 rounded bg-green-500 text-white hover:bg-green-dark focus:outline-none my-1 uppercase font-bold"
                            >Đăng nhập</button>
                            <button
                                type="submit"
                                className="w-full text-center py-3 rounded bg-red-500 text-white hover:bg-red-dark focus:outline-none my-1 uppercase font-bold"
                                onClick={loginWithGoogle}
                            >  <span className="fab fa-google mr-2" />Đăng nhập với Google</button>

                            <p className="mt-8">Bạn chưa có tài khoản?  <span className="underline cursor-pointer">Đăng ký</span> </p>

                        </form>

                    </div>
                </main>
            </div>
        </div>


    )

}