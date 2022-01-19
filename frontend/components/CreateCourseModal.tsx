import { createCourse as createCourseService } from '@utils/service/class'
import { Modal, notification } from 'antd'
import { useCallback } from 'react'
import { useMutation, useQueryClient } from 'react-query'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'

interface Props {
  visible: boolean
  close: () => void
}

const schema = yup.object().shape({
  name: yup
    .string()
    .typeError('Name has to be a string')
    .required('Name is required'),
  description: yup
    .string()
    .typeError('Description has to be a string')
    .optional(),
})

export default function CreateCourseModal({ close, visible }: Props) {
  const client = useQueryClient()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  })

  const { mutateAsync, isLoading } = useMutation(
    'create-course',
    createCourseService,
    {
      onSuccess(_, { name }) {
        notification.success({ message: `Create course ${name} successfully` })
        client.invalidateQueries('user')
        close()
      },
      onError() {
        notification.error({ message: 'Create course unsuccessfully' })
      },
    },
  )

  const createCourse = useCallback(
    handleSubmit((data) => {
      mutateAsync(data)
    }),
    [],
  )

  return (
    <Modal visible={visible} onCancel={close} footer={null} centered>
      <div className="text-semibold text-2xl mb-6">Create Class</div>

      <div className="mb-4">
        <label htmlFor="name" className="cr-label">
          Name
        </label>
        <input
          autoFocus
          type="text"
          {...register('name')}
          id="name"
          className="cr-input w-full"
        />
        {errors.name && (
          <div className="mt-2 text-red-600">{errors.name?.message}</div>
        )}
      </div>

      <div className="mb-4">
        <label htmlFor="desc" className="cr-label">
          Description
        </label>
        <input
          type="text"
          {...register('description')}
          id="desc"
          className="cr-input w-full"
        />
        {errors.description && (
          <div className="mt-2 text-red-600">{errors.description?.message}</div>
        )}
      </div>

      <div className="mb-4 flex gap-2">
        <button
          onClick={createCourse}
          disabled={isLoading}
          className="cr-button"
        >
          {isLoading ? 'Creating' : 'Create'}
        </button>

        <button onClick={close} className="cr-button-outline">
          Cancel
        </button>
      </div>
    </Modal>
  )
}
