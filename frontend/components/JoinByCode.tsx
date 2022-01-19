import { yupResolver } from '@hookform/resolvers/yup'
import { joinByCode } from '@utils/service/class'
import { Modal, notification } from 'antd'
import { useRouter } from 'next/router'
import { useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { useMutation } from 'react-query'
import { object, string } from 'yup'

type Props = {
  visible: boolean
  close: () => void
}

type FormData = {
  code: string
}

export default function JoinByCode({ close, visible }: Props) {
  const { push } = useRouter()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(
      object().shape({
        code: string()
          .typeError('Code has to be a string')
          .required('Code is required'),
      }),
    ),
  })

  const { mutateAsync, isLoading } = useMutation('join-class', joinByCode, {
    onSuccess(res) {
      notification.success({ message: 'Join class successfully' })
      push(`/class/${res.id}`)
    },
    onError() {
      notification.error({ message: 'Join class unsuccessfully' })
    },
    onSettled() {
      close()
    },
  })

  const submitCode = useCallback(
    handleSubmit((data) => {
      mutateAsync(data)
    }),
    [],
  )

  return (
    <Modal visible={visible} onCancel={close} centered footer={null}>
      <div className="text-2xl font-semibold mb-6">Join A Class By Code</div>

      <form noValidate onSubmit={submitCode}>
        <label htmlFor="code" className="cr-label">
          Code
        </label>
        <input
          type="text"
          id="code"
          className="cr-input w-full"
          {...register('code')}
        />
        {errors.code && (
          <div className="mt-2 text-red-600">{errors.code?.message}</div>
        )}

        <div className="mt-4 flex gap-2 justify-end">
          <button className="cr-button">Submit</button>

          <button onClick={close} type="button" className="cr-button-outline">
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  )
}
