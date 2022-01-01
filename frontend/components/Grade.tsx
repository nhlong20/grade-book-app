import { useAuth } from '@utils/hooks/useAuth'
import { useModal } from '@utils/hooks/useModal'
import { GradeStruct } from '@utils/models/gradeStruct'
import { deleteGradeStruct, updateGradeStruct } from '@utils/service/class'
import { notification, Tooltip } from 'antd'
import { useMutation, useQueryClient } from 'react-query'
import CreateGradeStruct from './CreateGradeStruct'

type Props = {
  data: GradeStruct
}

export default function Grade({ data: { detail, title, id, ...rest } }: Props) {
  const client = useQueryClient()
  const { isTeacher } = useAuth()

  const { mutateAsync, isLoading } = useMutation(
    'delete-grade',
    deleteGradeStruct(id),
    {
      onSuccess() {
        notification.success({ message: 'Delete struct successfully' })
        client.invalidateQueries('class')
      },
      onError() {
        notification.error({ message: 'Delete struct unsuccessfully' })
      },
    },
  )

  const [visible, open, close] = useModal()

  return (
    <div className="p-4 border rounded-md flex items-center justify-between">
      <div>
        <div className="text-xl">Grade: {title}</div>
        <div>{detail}</div>
      </div>
      {isTeacher && (
        <div className="pr-2 flex gap-3">
          <Tooltip title="Update this struct">
            <button disabled={isLoading} onClick={open}>
              <span className="fa fa-edit" />
            </button>
          </Tooltip>

          <Tooltip title="Delete this struct">
            <button disabled={isLoading} onClick={() => mutateAsync()}>
              <span className="fa fa-times text-red-600" />
            </button>
          </Tooltip>

          <CreateGradeStruct
            visible={visible}
            close={close}
            update
            data={{ id, detail, title, ...rest }}
          />
        </div>
      )}
    </div>
  )
}
