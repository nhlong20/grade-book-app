import { useInput } from '@utils/hooks/useInput'
import { createAssignment } from '@utils/service/class'
import { Modal, notification } from 'antd'
import { useRouter } from 'next/router'
import { useCallback, useEffect } from 'react'
import { useMutation, useQueryClient } from 'react-query'

type Props = {
  visible: boolean
  close: () => void
}

export default function CreateAssigment({ close, visible }: Props) {
  const { query } = useRouter()
  const [name, changeName] = useInput('')
  const [point, changePoint] = useInput(0)

  const client = useQueryClient()

  const { mutateAsync, isLoading } = useMutation(
    'add-assignment',
    createAssignment(query.id as string),
    {
      onSuccess() {
        client.invalidateQueries('class')
        notification.success({ message: `Create assignment successfully` })
        close()
      },
      onError() {
        notification.error({ message: 'Create assignment unsuccessfully' })
      },
    },
  )

  useEffect(() => {
    changeName({ target: { value: '' } } as any)
    changePoint({ target: { value: 0 } } as any)
  }, [visible])

  const create = useCallback(() => {
    //@ts-ignore
    mutateAsync({ name, point })
  }, [name, point])

  return (
    <Modal visible={visible} onCancel={close} footer={null} centered>
      <div className="text-semibold text-2xl mb-6">Create Course</div>

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
        <label htmlFor="point" className="cr-label">
          Description
        </label>
        <input
          type="number"
          value={point}
          onChange={changePoint}
          id="point"
          className="cr-input w-full"
        />
      </div>

      <div className="mb-4 flex gap-2">
        <button onClick={create} disabled={isLoading} className="cr-button">
          {isLoading ? 'Creating' : 'Create'}
        </button>

        <button onClick={close} className="cr-button-outline">
          Cancel
        </button>
      </div>
    </Modal>
  )
}
