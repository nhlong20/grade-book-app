import { useInput } from '@utils/hooks/useInput'
import { createCourse as createCourseService } from '@utils/service/class'
import { Modal, notification } from 'antd'
import { useCallback, useEffect } from 'react'
import { useMutation, useQueryClient } from 'react-query'

interface Props {
  visible: boolean
  close: () => void
}

export default function CreateCourseModal({ close, visible }: Props) {
  const [name, changeName] = useInput('')
  const [description, changeDescription] = useInput('')
  const client = useQueryClient()

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

  useEffect(() => {
    changeName({ target: { value: '' } } as any)
    changeDescription({ target: { value: '' } } as any)
  }, [visible])

  const createCourse = useCallback(async () => {
    await mutateAsync({ name, description })
  }, [name, description])

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
          value={name}
          onChange={changeName}
          id="name"
          className="cr-input w-full"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="desc" className="cr-label">
          Description
        </label>
        <input
          type="text"
          value={description}
          onChange={changeDescription}
          id="desc"
          className="cr-input w-full"
        />
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
