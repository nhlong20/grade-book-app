import Layout from '@utils/components/Layout'
import Input from '@utils/components/Input'
import Loading from '@utils/components/Loading'
import { useModal } from '@utils/hooks/useModal'
import { getSessionToken } from '@utils/libs/getToken'
import { getUser, updateUserInformation } from '@utils/service/user'
import { notification } from 'antd'
import { GetServerSideProps } from 'next'
import { useForm } from 'react-hook-form'
import { AnimatePresence, motion } from 'framer-motion'
import { useCallback } from 'react'

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
  phone: string
}

export default function Profile() {
  const { data } = useQuery('user', getUser())
  console.log(data)
  const { email, name, role, phone } = data || {}

  const [edit, turnOn, turnOff] = useModal()
  const client = useQueryClient()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({ defaultValues: { name, phone } })


  const { mutateAsync, isLoading } = useMutation(
    'update-information',
    (data: FormData) => updateUserInformation(data),
    {
      onSuccess(data) {
        notification.success({
          message: 'Update information successfully.',
        })
        turnOff()
        reset({ name: data.name })
        client.invalidateQueries('self-info')
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
    <Layout classTitle={"Profile"} requireLogin>
      <div className="cr-container py-4 mb-6 flex-rows justify-center justify-items-center content-center items-center gap-4">

        <div className="flex gap-3 justify-center items-center  mb-6">
          <img className="w-24 h-24 rounded-full bg-gray-300" src={`https://avatars.dicebear.com/api/bottts/${Math.random()}.svg`} />
          <div>
            <div className="font-semibold">{name}</div>
            <div className="font-semibold">{email}</div>
            <div className="font-semibold">{role}</div>
          </div>
        </div>

        <div className="flex-rows justify-center items-center mb-6">
          <div className="flex justify-center items-center">
            <h1 className="font-medium text-xl inline">User Information</h1>
            <button className="ml-2" onClick={turnOn} disabled={edit}>
              <span className="fa fa-pen" />
            </button>
          </div>
          <div  className="flex justify-center items-center">
            <form
              onSubmit={updateInformation}
              className="grid grid-cols-2 gap-y-2 gap-x-3 w-3/5 mt-3"
            >
              <label
                htmlFor="name"
                className="text-right font-medium my-[9px]"
              >
                Name
              </label>
              <Input
                error={errors.name?.message}
                editable={edit}
                props={{
                  type: 'text',
                  value: name,
                  ...register('name', {
                    required: { value: true, message: 'Name is required' },
                  }),
                }}
              />

              <label className="cr-label text-right font-medium my-auto">
                Email
              </label>
              <Input
                error=""
                showError={false}
                editable={edit}
                props={{
                  type: 'text',
                  disabled: true,
                  value: email,
                }}
              />
              <label
                htmlFor="phone"
                className="cr-label text-right font-medium my-[9px]"
              >
                Phone
              </label>
              <Input
                error=""
                editable={edit}
                props={{
                  type: 'text',
                  value: phone,
                  ...register("phone"),
                }}
              />

              <label className="cr-label text-right font-medium my-auto">
                Role
              </label>
              <Input
                error=""
                showError={false}
                editable={edit}
                props={{
                  type: 'text',
                  disabled: true,
                  value: role,
                }}
              />
              <AnimatePresence presenceAffectsLayout>
                {edit && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    exit={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                    className="col-span-2 flex gap-3 justify-center mt-2"
                  >
                    <button disabled={isLoading} className="crm-button">
                      <Loading on={isLoading}>Save</Loading>
                    </button>
                    <button
                      onClick={turnOff}
                      type="button"
                      className="cr-button-outline"
                    >
                      Cancel
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  )
}
