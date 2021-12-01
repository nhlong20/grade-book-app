import Layout from '@utils/components/Layout'
import { getSessionToken } from '@utils/libs/getToken'
import { getUser, updateUserInfo } from '@utils/service/user'
import { notification } from 'antd'
import { GetServerSideProps } from 'next'
import { useForm } from 'react-hook-form'
import { useCallback, useEffect } from 'react'

import {
  dehydrate,
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from 'react-query'


export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const token = getSessionToken(ctx.req.cookies)
  const client = new QueryClient()

  if (token) {
    await Promise.all([
      client.prefetchQuery('user', getUser(token)),
    ])
  }

  return {
    props: {
      dehydratedState: dehydrate(client),
    },
  }
}

type FormData = {
  name: string,
  phone: string,
  mssv: string
}

export default function Profile() {
  const { data } = useQuery('user', getUser())
  const { email, name, role, phone, mssv } = data || {}
  console.log(data)
  const client = useQueryClient()

  const {
    register,
    handleSubmit,
    reset,
  } = useForm<FormData>({ defaultValues: { name, phone, mssv } })

  const { mutateAsync, isLoading } = useMutation(
    'update-information',
    (data: FormData) => {
      console.log(data)
      return updateUserInfo(data)
    },
    {
      onSuccess(data) {
        notification.success({
          message: 'Update information successfully.',
        })
        reset({ name: data.name })
        reset({ phone: data.phone })
        reset({ mssv: data.mssv })
        
        client.invalidateQueries('user')
      },
      onError() {
        notification.error({
          message: 'Update information unsuccessfully.',
        })
      },
    },
  )

  const updateInformation = useCallback(
    handleSubmit((data) => {
      mutateAsync(data)
    }),
    [],
  )
  return (
    <Layout
      title="Profile - Classroom"
      requireLogin>
      <div className="min-h-screen flex w-full mt-9 mx-auto mb-0 max-w-2xl">
        <div className="flex flex-grow flex-shrink flex-col min-w-3 m-0 p-0">
          <div className="flex mt-8">
            <div className="flex mr-8 ml-32">
              <img className="w-12 h-12 rounded-full bg-gray-300" src={`https://avatars.dicebear.com/api/bottts/${Math.random()}.svg`} />
            </div>
            <div>
              <div className="font-semibold">{name}</div>
              <div className="font-semibold">{email}</div>
              <div className="font-semibold">{role}</div>
            </div>
          </div>


          <form
            onSubmit={updateInformation}
            className="flex flex-col my-4 ml-8"
          >
            <div className="flex flex-row mb-4 content-start">
              <div className="cr-label text-right text-base mx-8 mt-2 font-medium">
                <label htmlFor="name" >
                  Name
                </label>
              </div>

              <input
                type="text"
                id="name"
                className="cr-input w-full"
                {...register('name')}
                defaultValue={name}
              />
            </div>
            <div className="flex flex-row my-4 content-start">
              <div className="cr-label text-right text-base mx-8 mt-2 font-medium">
                <label htmlFor="email" >
                  Email
                </label>
              </div>
              <input
                type="email"
                id="email"
                className="cr-input w-full bg-gray-200"
                value={email}
                disabled
              />

            </div>
            <div className="flex flex-row my-4">
              <div className="text-right text-base mx-8 mt-2 font-medium">
                <label htmlFor="phone" >
                  Phone
                </label>
              </div>
              <input
                type="text"
                id="phone"
                defaultValue={phone}
                className="cr-input w-full"
                {...register('phone')}
              />
            </div>

            <div className="flex flex-row my-4">
              <div className="text-right text-base mx-8 mt-2 font-medium">
                <label htmlFor="mssv" >
                  MSSV
                </label>
              </div>
              <input
                type="text"
                id="mssv"
                defaultValue={mssv}
                className="cr-input w-full"
                {...register('mssv')}
              />
            </div>

            <div className="col-span-2 flex gap-3 mt-2 justify-center">
              <button type="submit" disabled={isLoading} className="cr-button w-64 text-base">
                Save
              </button>
            </div>

          </form>

          <div>

          </div>
        </div>
      </div>
    </Layout>
  )
}
