import Layout from '@utils/components/Layout'
import { getSessionToken } from '@utils/libs/getToken'
import { getUser, updateUserInfo } from '@utils/service/user'
import { notification } from 'antd'
import { GetServerSideProps } from 'next'
import { useForm } from 'react-hook-form'
import { useCallback, useEffect, useMemo } from 'react'
import {
  dehydrate,
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from 'react-query'
import { signOut } from 'next-auth/client'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const token = getSessionToken(ctx.req.cookies)
  const client = new QueryClient()

  if (token) {
    await Promise.all([client.prefetchQuery('user', getUser(token))])
  }

  return {
    props: {
      dehydratedState: dehydrate(client),
    },
  }
}

type FormData = {
  name: string
  phone: string
  mssv: string
}

const schema = yup.object().shape({
  name: yup
    .string()
    .typeError('Name has to be a string')
    .required("Name is required")
    .max(100, 'Name has to be at max 100 characters'),
  phone: yup
    .string()
    .optional()
    .typeError('Phone number has to be a string')
    .matches(
      /(([03+[2-9]|05+[6|8|9]|07+[0|6|7|8|9]|08+[1-9]|09+[1-4|6-9]]){3})+[0-9]{7}\b/,
      'Phone number is not valid',
    ),
  mssv: yup
    .string()
    .typeError('MSSV has to be a string')
    .optional()
    .max(8, 'MSSV has to be at max 8 characters'),
})

export default function Profile() {
  const { data } = useQuery('user', getUser())
  const client = useQueryClient()

  const defaultValues = useMemo(
    () => ({ name: data?.name, phone: data?.phone, mssv: data?.mssv }),
    [data],
  )

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues,
    resolver: yupResolver(schema),
  })

  useEffect(() => {
    reset(defaultValues)
  }, [defaultValues])

  const { mutateAsync, isLoading } = useMutation(
    'update-information',
    (data: FormData) => {
      return updateUserInfo(data)
    },
    {
      onSuccess() {
        notification.success({
          message: 'Update information successfully.',
        })

        client.invalidateQueries('user')
        signOut()
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
    <Layout title="Profile - Classroom" requireLogin>
      <div className="min-h-screen flex w-full mt-9 mx-auto mb-0 max-w-2xl">
        <div className="flex flex-grow flex-shrink flex-col min-w-3 m-0 p-0">
          <div className="flex mt-8">
            <div className="flex mr-8 ml-32">
              <img
                className="w-12 h-12 rounded-full bg-gray-300"
                src={`https://avatars.dicebear.com/api/bottts/${Math.random()}.svg`}
              />
            </div>
            <div>
              <div className="font-semibold">{data?.name}</div>
              <div className="font-semibold">{data?.email}</div>
            </div>
          </div>

          <form
            onSubmit={updateInformation}
            className="flex flex-col my-4 ml-8"
          >
            <div className="flex flex-row mb-4 content-start">
              <div className="cr-label text-right text-base mx-8 mt-2 font-medium">
                <label htmlFor="name">Name</label>
              </div>

              <input
                type="text"
                id="name"
                className="cr-input w-full"
                {...register('name')}
              />
              {errors.name && (
                <div className="mt-2">{errors.name?.message}</div>
              )}
            </div>
            <div className="flex flex-row my-4 content-start">
              <div className="cr-label text-right text-base mx-8 mt-2 font-medium">
                <label htmlFor="email">Email</label>
              </div>
              <input
                type="email"
                id="email"
                className="cr-input w-full bg-gray-200"
                value={data?.email}
                disabled
              />
            </div>
            <div className="flex flex-row my-4">
              <div className="text-right text-base mx-8 mt-2 font-medium">
                <label htmlFor="phone">Phone</label>
              </div>
              <div className="w-full">
                <input
                  type="text"
                  id="phone"
                  className="cr-input block w-full"
                  {...register('phone')}
                />
                {errors.phone && (
                  <div className="mt-2 text-red-600">
                    {errors.phone?.message}
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-row my-4">
              <div className="text-right text-base mx-8 mt-2 font-medium">
                <label htmlFor="mssv">MSSV</label>
              </div>
              <div className="w-full">
                <input
                  type="text"
                  id="mssv"
                  className={
                    data?.mssv
                      ? 'cr-input w-full bg-gray-200'
                      : 'cr-input w-full'
                  }
                  disabled={!!data?.mssv}
                  {...register('mssv')}
                />
                {errors.mssv && (
                  <div className="mt-2 text-red-600">
                    {errors.mssv?.message}
                  </div>
                )}
              </div>
            </div>

            <div className="col-span-2 flex gap-3 mt-2 justify-center">
              <button
                type="submit"
                disabled={isLoading}
                className="cr-button w-64 text-base"
              >
                Save
              </button>
            </div>
          </form>

          <div></div>
        </div>
      </div>
    </Layout>
  )
}
