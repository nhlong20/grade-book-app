import { useInput } from '@utils/hooks/useInput'
import { Assignment } from '@utils/models/assignment'
import { Class } from '@utils/models/class'
import { createAssignment, updateAssignment } from '@utils/service/class'
import { Modal, notification } from 'antd'
import { useCallback, useEffect } from 'react'
import { useMutation, useQuery, useQueryClient } from 'react-query'

type Props = {
  visible: boolean
  close: () => void
  assignmentData: Assignment | undefined
  structId: string
}

export default function CreateAssigment({
  close,
  visible,
  assignmentData,
  structId,
}: Props) {
  const [name, changeName] = useInput('')
  const [gradeStructId, changeGradeStructId] = useInput('')
  const [point, changePoint] = useInput(0)

  const client = useQueryClient()

  const { data: clas } = useQuery<Class>('class', { enabled: false })

  const { mutateAsync, isLoading } = useMutation(
    'add-assignment',
    createAssignment,
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

  const { mutateAsync: mutateAsyncUpdate, isLoading: isUpdating } = useMutation(
    ['update-assignment', assignmentData?.id],
    updateAssignment(assignmentData?.id || ''),
    {
      onSuccess() {
        client.invalidateQueries('class')
        notification.success({ message: `Update assignment successfully` })
        close()
      },
      onError() {
        notification.error({ message: 'Update assignment unsuccessfully' })
      },
    },
  )

  useEffect(() => {
    changeName({ target: { value: assignmentData?.name || '' } } as any)
    changePoint({ target: { value: assignmentData?.point || 0 } } as any)
  }, [visible])

  const create = useCallback(() => {
    if (assignmentData) {
      mutateAsyncUpdate({ name, point, gradeStructId })
      return
    }

    mutateAsync({ name, point, gradeStructId })
  }, [name, point, assignmentData, gradeStructId])

  return (
    <Modal visible={visible} onCancel={close} footer={null} centered>
      <div className="text-semibold text-2xl mb-6">
        {assignmentData ? 'Update' : 'Create'} Assignment
      </div>

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
          Point
        </label>
        <input
          type="number"
          value={point}
          onChange={changePoint}
          id="point"
          className="cr-input w-full"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="grade" className="cr-label">
          Grade
        </label>
        <select
          value={gradeStructId}
          onChange={changeGradeStructId}
          id="grade"
          className="cr-input w-full"
        >
          {clas?.gradeStructure.map(({ id, title }, index) => (
            <option
              selected={assignmentData ? id === structId : index === 0}
              value={id}
              key={id}
            >
              {title}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4 flex gap-2">
        <button onClick={create} disabled={isLoading} className="cr-button">
          {!assignmentData && (isLoading ? 'Creating' : 'Create')}
          {assignmentData && (isUpdating ? 'Updating' : 'Update')}
        </button>

        <button onClick={close} className="cr-button-outline">
          Cancel
        </button>
      </div>
    </Modal>
  )
}
