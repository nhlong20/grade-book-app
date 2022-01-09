import { useAuth } from '@utils/hooks/useAuth'
import { createPoint, updatePoint } from '@utils/service/class'
import { notification } from 'antd'
import axios from 'axios'
import { API } from 'environment'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useMutation, useQueryClient } from 'react-query'

type Props = {
  point: number
  id?: string
  studentId: string
  expose?: boolean
  structId: string
}

export default function GradeInput({
  id,
  point,
  studentId,
  expose,
  structId,
}: Props) {
  const { query } = useRouter()
  const client = useQueryClient()
  const { register, handleSubmit, reset } = useForm<
    { point: number } & Pick<Props, 'structId' | 'studentId'>
  >({
    defaultValues: {
      point,
      structId,
      studentId,
    },
  })

  useEffect(() => {
    reset({
      point,
      structId,
      studentId,
    })
  }, [point])

  const [input, setInput] = useState(false)
  const { isTeacher } = useAuth()

  const { mutateAsync } = useMutation(
    'update-point',
    id ? updatePoint(id) : createPoint,
    {
      onSuccess() {
        client.invalidateQueries('students')
        client.invalidateQueries('class')
        notification.success({ message: 'Update grade successfully' })
      },
      onError() {
        notification.error({ message: 'Update grade unsuccessfully' })
      },
    },
  )

  const props = register('point')

  const onSubmit = useCallback(
    (blur: boolean = true) =>
      handleSubmit((data) => {
        blur &&
          (document.getElementById(id + 'point') as HTMLInputElement)?.blur()

        setInput(false)

        if (!id) {
          data.studentId = studentId
          data.structId = structId
        }

        mutateAsync(data)
      }),
    [id],
  )

  const { mutateAsync: mutateExpose } = useMutation(
    'expose',
    (id?: string) =>
      axios
        .put(API + '/student/expose/' + id, { studentId, structId })
        .then((res) => res.data),
    {
      onSuccess() {
        client.invalidateQueries(['students', query.id])
        notification.success({ message: 'Mark as finallized successfully' })
      },
      onError() {
        notification.error({ message: 'Mark as finallized unsuccessfully' })
      },
    },
  )

  return (
    <div className="flex gap-2 px-2 justify-between items-center">
      <form onSubmit={onSubmit()} className="mr-2 w-full">
        {(isTeacher || expose) && (
          <input
            disabled={!isTeacher}
            onFocus={() => setInput(true)}
            onBlur={(e) => {
              props.onBlur(e)
              onSubmit(false)()
              setInput(false)
            }}
            type="number"
            id={id + 'point'}
            ref={props.ref}
            name={props.name}
            onChange={props.onChange}
            className={`cr-input w-full ${input ? '' : 'border-none'}`}
          />
        )}
      </form>

      {!expose && isTeacher && (
        <div>
          <button
            onClick={() => mutateExpose(id)}
            title="Mark this grade as finalized"
            className="w-8 h-8 rounded-full hover:bg-gray-200"
          >
            <span className="fa fa-share" />
          </button>
        </div>
      )}
    </div>
  )
}
