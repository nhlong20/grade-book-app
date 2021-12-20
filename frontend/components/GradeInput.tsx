import { createPoint, updatePoint } from '@utils/service/class'
import { useRouter } from 'next/router'
import { useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useMutation, useQueryClient } from 'react-query'

type Props = {
  point: number
  id?: string
  studentId: string
  structId: string
}

export default function GradeInput({ id, point, studentId, structId }: Props) {
  const { query } = useRouter()
  const client = useQueryClient()
  const { register, handleSubmit } = useForm<
    { point: number } & Pick<Props, 'structId' | 'studentId'>
  >({
    defaultValues: {
      point,
      structId,
      studentId,
    },
  })

  const [input, setInput] = useState(false)

  const { mutateAsync } = useMutation(
    'update-point',
    id ? updatePoint(id) : createPoint,
    {
      onSuccess() {
        client.invalidateQueries(['students', query.id])
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

  return (
    <form onSubmit={onSubmit()} className="mr-2">
      <input
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
    </form>
  )
}
