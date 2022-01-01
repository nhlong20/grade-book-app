import { useInput } from '@utils/hooks/useInput'
import { GradeStruct } from '@utils/models/gradeStruct'
import { createGradeStruct, updateGradeStruct } from '@utils/service/class'
import { Modal, notification } from 'antd'
import { useRouter } from 'next/router'
import { useCallback, useEffect } from 'react'
import { useMutation, useQueryClient } from 'react-query'

type Props = {
  visible: boolean
  close: () => void
  update?: boolean
  data?: GradeStruct
}

export default function CreateGradeStruct({
  close,
  visible,
  update,
  data,
}: Props) {
  const { query } = useRouter()
  const [title, changeTitle] = useInput(data?.title || '')
  const [detail, changeDetail] = useInput(data?.detail || '')

  const client = useQueryClient()

  const { mutateAsync, isLoading } = useMutation(
    'create-grade-struct',
    createGradeStruct(query.id as string),
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

  const { mutateAsync: updateMutateAsync, isLoading: isUpating } = useMutation(
    'update-struct',
    updateGradeStruct(data?.id || ''),
    {
      onSuccess() {
        notification.success({ message: 'Update struct successfully' })
        client.invalidateQueries('class')
        close()
      },
      onError() {
        notification.error({ message: 'Update struct unsuccessfully' })
      },
    },
  )

  useEffect(() => {
    changeTitle({ target: { value: '' } } as any)
    changeDetail({ target: { value: '' } } as any)
  }, [visible])

  useEffect(() => {
    changeTitle({ target: { value: data?.title } } as any)
    changeDetail({ target: { value: data?.detail } } as any)
  }, [data])

  const create = useCallback(() => {
    if (update) {
      updateMutateAsync({ title, detail })
      return
    }

    mutateAsync({ title, detail })
  }, [title, detail])

  return (
    <Modal visible={visible} onCancel={close} footer={null} centered>
      <div className="text-semibold text-2xl mb-6">
        {update ? 'Update' : 'Create A Struct'}
      </div>

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
          {!update && (isLoading ? 'Creating' : 'Create')}
          {update && (isUpating ? 'Updating' : 'Update')}
        </button>

        <button onClick={close} className="cr-button-outline">
          Cancel
        </button>
      </div>
    </Modal>
  )
}
