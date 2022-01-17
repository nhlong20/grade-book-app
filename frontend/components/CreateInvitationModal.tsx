import { useInput } from '@utils/hooks/useInput'
import { createInvitation as createInvitationService } from '@utils/service/class'
import { Modal, notification } from 'antd'
import { useCallback, useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { useRouter } from 'next/router'
import { useTeacher } from '@utils/hooks/useTeacher'
import { useAuth } from '@utils/hooks/useAuth'
import { Class } from '@utils/models/class'
// import { CodeType } from '@utils/models/invitation'
export enum CodeType {
  Student = 'student',
  Teacher = 'teacher',
}

interface Props {
  visible: boolean
  close: () => void
}

export default function CreateInvitation({ close, visible }: Props) {
  const { query } = useRouter()
  const { data: clas } = useQuery<Class>(['class', query.id], {
    enabled: false,
  })

  const [emails, setEmails] = useState([])
  const [type, changeType] = useInput('')
  const client = useQueryClient()
  const { isStudent, isTeacher } = useAuth()

  const { mutateAsync, isLoading } = useMutation(
    'create-invitation',
    createInvitationService(query.id as string),
    {
      onSuccess(_) {
        notification.success({ message: `Create invitation successfully` })
        client.invalidateQueries('user')
        close()
      },
      onError() {
        notification.error({ message: 'Failed to create invitation' })
      },
    },
  )

  function changeEmails(e: any) {
    e.preventDefault()
    const inputEmails = e.target.value.split(',')
    setEmails(inputEmails)
  }

  useEffect(() => {
    changeType({ target: { value: CodeType.Student } } as any)
  }, [visible])

  const createInvitation = useCallback(async () => {
    await mutateAsync({
      emails,
      type,
    })
  }, [emails, type])

  return (
    <Modal visible={visible} onCancel={close} footer={null} centered>
      <div className="text-semibold text-2xl mb-6">Create Invitation</div>

      <div className='mb-4'>
        Invite Code:
        <span className="inline-block border p-1 ml-2  rounded-[4px] border-blue-600 text-blue-600">
          {clas?.inviteToken}
        </span>
      </div>

      <div className='mb-4 border-b'  />

      <div className="mb-4">
        <label htmlFor="email" className="cr-label">
          Email
        </label>
        <input
          autoFocus
          type="email"
          value={emails}
          onChange={changeEmails}
          id="email"
          className="cr-input w-full"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="type" className="cr-label">
          Invite As
        </label>
        <select
          className="cr-input w-full"
          id="type"
          defaultValue={CodeType.Student}
          onChange={changeType}
        >
          {Object.values(CodeType).map((code) => (
            <option
              disabled={!isTeacher && code === CodeType.Teacher}
              className="capitalize"
              key={code}
              value={code}
            >
              {code}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4 flex gap-2">
        <button
          onClick={createInvitation}
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
