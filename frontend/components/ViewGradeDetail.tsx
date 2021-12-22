import { useAuth } from '@utils/hooks/useAuth'
import { Class } from '@utils/models/class'
import { Student } from '@utils/models/student'
import { Modal } from 'antd'
import { useRouter } from 'next/router'
import { useMemo } from 'react'
import { useQuery } from 'react-query'

type Props = {
  visible: boolean
  close: () => void
  selectedStudentId: string
}

export default function ViewGradeDetail({
  visible,
  close,
  selectedStudentId,
}: Props) {
  const { query } = useRouter()
  const id = query.id as string

  const { data: clas } = useQuery<Class>(['class', id], { enabled: false })
  const { data: students } = useQuery<Student[]>(['students', id], {
    enabled: false,
  })

  const student = useMemo(
    () => students?.find((s) => s.id === selectedStudentId),
    [students, selectedStudentId],
  )

  const user = useMemo(
    () => clas?.students.find((s) => s.mssv === student?.academicId),
    [student, clas],
  )

  const {isTeacher} = useAuth()

  return (
    <Modal visible={visible} onCancel={close} centered footer={null}>
      <div>
        <div>
          <span className="font-medium mr-2">Name:</span>
          {student?.name}
        </div>
        <div>
          <span className="font-medium mr-2">Id:</span>
          {student?.academicId}
        </div>
        <div>
          <span className="font-medium mr-2">Email:</span>
          {user?.email}
        </div>

        <div className="mt-4">
          <span className="font-medium mr-2">Grade:</span>
          <div className="pl-3">
            {clas?.gradeStructure.map((struct) => (
              <div key={struct.id} className="grid grid-cols-2 gap-4 w-full">
                <span>Struct: {struct.title}</span>
                <span>
                  {(student?.grades[struct.id].expose || isTeacher) ? (
                    <span>{student?.grades[struct.id].point} points</span>
                  ) : (
                    'NA'
                  )}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  )
}
