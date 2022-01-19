import { useAuth } from '@utils/hooks/useAuth'
import { Class } from '@utils/models/class'
import { Student } from '@utils/models/student'
import { Modal } from 'antd'
import Link from 'next/link'
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
  const classId = query.id as string

  const { data: clas } = useQuery<Class>(['class', classId], { enabled: false })
  const { data: students } = useQuery<Student[]>(['students', classId], {
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

  const { isTeacher } = useAuth()

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
                  {student?.grades[struct.id].expose || isTeacher ? (
                    <span>{student?.grades[struct.id].point} points</span>
                  ) : (
                    'NA'
                  )}

                  {student?.grades[struct.id].review && (
                    <Link
                      href={`/class/${classId}/review/${
                        student?.grades[struct.id].review.id
                      }`}
                    >
                      <button
                        title="This grade has a review request"
                        className="cr-button ml-2 !p-1 w-8 h-8 inline-grid place-content-center rounded-full"
                      >
                        <span className="fa fa-exclamation" />
                      </button>
                    </Link>
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
