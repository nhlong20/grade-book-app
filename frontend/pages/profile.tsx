import { API } from '../environment'
import { toast } from 'react-toastify';
import Loading from '@components/Loading'

import { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useMutation} from 'react-query'
import axios from 'axios'
import { GetServerSideProps } from 'next'
import { getSession,useSession, signin, signout } from 'next-auth/client'
import Head from 'next/head'

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getSession(ctx)

  if ('uuid' in (session?.user || {}))
    return { redirect: { destination: '/404', permanent: false } }

  return { props: {} }
}
type FormData = {
    name: string;
    studentId: string;
    google: string;
    emailsv:string;
    phone:string

}
export default function Profile() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>()

  const [session] = useSession()

  const { mutateAsync, isLoading } = useMutation(
    'update-information',
    (data: Partial<FormData>) => axios.post(`${API}/auth/`, data),
    {
      onSuccess() {
        signout().then(() => signin(undefined, { callbackUrl: '/' }))
      },
    },
  )

  const updateInformation = useCallback(
    (data: FormData) => {
        console.log(session)
        console.log(data)

      mutateAsync({
        ...data,
        email: session!.email,
        googleId: session!.id as string,
      })
    },
    [session],
  )

  return (
    <div className="min-h-screen grid place-content-center">
      <Head>
        <title>GradeBook | {}</title>
      </Head>
      <form className="w-96" onSubmit={handleSubmit(updateInformation)}>
        <h1 className="text-center text-2xl text-black-600 dark:text-white font-semibold mb-8">
          Thông tin của bạn
        </h1>

        <div className="mb-4">
          <label htmlFor="name" className="hcmus-label">
            Họ và tên
          </label>
          <input
            type="text"
            id="name"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            {...register('name', {
              required: {
                value: true,
                message: 'This field is required',
              },
            })}
          />
          {errors.name && (
            <div className="mt-2 text-red-600">{errors.name.message}</div>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="student-id" className="hcmus-label">
            Mã số sinh viên
          </label>
          <input
            type="text"
            id="student-id"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            {...register('studentId', {
              required: { value: true, message: 'This field is required' },
            })}
          />
          {errors.studentId && (
            <div className="mt-2 text-red-600">{errors.studentId.message}</div>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="google" className="hcmus-label">
            Liên kết Google
          </label>
          <input
            type="text"
            id="google"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            {...register('google', {
              required: { value: true, message: 'This field is required' },
            })}
          />
          {errors.google && (
            <div className="mt-2 text-red-600">{errors.google.message}</div>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="emailsv" className="hcmus-label">
            Email sinh viên
          </label>
          <input
            type="text"
            id="emailsv"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            {...register('emailsv', {
              required: { value: true, message: 'This field is required' },
            })}
          />
          {errors.emailsv && (
            <div className="mt-2 text-red-600">{errors.emailsv.message}</div>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="phone" className="hcmus-label">
            Số điện thoại
          </label>
          <input
            type="text"
            id="phone"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            {...register('phone', {
              required: { value: true, message: 'This field is required' },
            })}
          />
          {errors.phone && (
            <div className="mt-2 text-red-600">{errors.phone.message}</div>
          )}
        </div>
        
        
        <div>
          <button
            disabled={isLoading}
            className="bg-green-500 w-full hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            <Loading on={isLoading}>Submit</Loading>
          </button>
        </div>
      </form>
    </div>
  )
}
