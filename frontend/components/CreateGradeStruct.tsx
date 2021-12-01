import { useInput } from '@utils/hooks/useInput'
import { createGradeStruct } from '@utils/service/class'
import { Modal, notification } from 'antd'
import { useCallback, useEffect } from 'react'
import { useMutation, useQueryClient } from 'react-query'

type Props = {
  visible: boolean
  close: () => void
}

export default function CreateAssigment({ close, visible }: Props) {
  const [title, changeTitle] = useInput('')
  const [detail, changeDetail] = useInput('')

  const client = useQueryClient()

  const { mutateAsync, isLoading } = useMutation(
    'create-grade-struct',
    createGradeStruct,
    {
      onSuccess() {
        client.invalidateQueries('class')
        notification.success({ message: `Create grade structure successfully` })
        close()
      },
      onError() {
        notification.error({ message: 'Create grade structure unsuccessfully' })
      },
    },
  )

  useEffect(() => {
    changeTitle({ target: { value: '' } } as any)
    changeDetail({ target: { value: 0 } } as any)
  }, [visible])

  const create = useCallback(() => {
    mutateAsync({ title, detail })
  }, [title, detail])

  return (
    <Modal visible={visible} onCancel={close} footer={null} centered>
      <div className="text-semibold text-2xl mb-6">Create A Grade Struct</div>

      <div className="mb-4">
        <label htmlFor="name" className="cr-label">
          Title
        </label>
        <input
          autoFocus
          type="text"
          value={title}
          onChange={changeTitle}
          id="name"
          className="cr-input w-full"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="detail" className="cr-label">
          Detail
        </label>
        <input
          type="text"
          value={detail}
          onChange={changeDetail}
          id="detail"
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
