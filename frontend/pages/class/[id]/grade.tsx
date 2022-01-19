import Layout from '@utils/components/Layout'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { GetServerSideProps } from 'next'
import {
  dehydrate,
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from 'react-query'
import { getSessionToken } from '@utils/libs/getToken'
import { Divider, Dropdown, Menu, notification } from 'antd'
import { getClass, getStudents } from '@utils/service/class'
import { useCallback, useState } from 'react'
import {
  downloadGrade,
  downloadScoreTemplate,
  downloadTemplate,
} from '@utils/service/download'
import { uploadScore, uploadStudent } from '@utils/service/upload'
import UploadButton from '@components/Upload'
import GradeInput from '@components/GradeInput'
import axios from 'axios'
import { API } from 'environment'
import { useAuth } from '@utils/hooks/useAuth'
import { useTypedSession } from '@utils/hooks/useTypedSession'
import ViewGradeDetail from '@components/ViewGradeDetail'
import { useModal } from '@utils/hooks/useModal'
import CreateReviewModal from '@components/CreateReviewModal'

const MenuItem = Menu.Item

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const client = new QueryClient()
  const token = getSessionToken(ctx.req.cookies)

  const id = ctx.query.id as string

  if (token) {
    await Promise.all([
      client.prefetchQuery(['class', id], getClass(id, token)),
      client.prefetchQuery(['students', id], getStudents(id, token)),
    ])
  }

  return {
    props: {
      dehydratedState: dehydrate(client),
    },
  }
}

export default function ClassGrade() {
  const [session] = useTypedSession()
  const { query } = useRouter()
  const id = query.id as string
  const client = useQueryClient()

  const { data: clas } = useQuery(['class', id], getClass(id))
  const { data: students } = useQuery(['students', id], getStudents(id))

  const { isTeacher } = useAuth()

  const downloadDefaultTemplate = useCallback(() => {
    downloadTemplate(clas?.name || 'Template')
  }, [clas])

  const { mutateAsync } = useMutation('upload-student', uploadStudent(id), {
    onSuccess() {
      client.invalidateQueries(['students', id])
      notification.success({ message: 'Upload successfully' })
    },
    onError() {
      notification.error({ message: 'Upload unsuccessfully' })
    },
  })

  const [reviewModal, openReviewModal, closeReviewModal] = useModal()

  const { mutateAsync: mutateUploadScore } = useMutation(
    'upload-score',
    uploadScore,
    {
      onSuccess() {
        client.invalidateQueries(['students', id])
        notification.success({ message: 'Upload successfully' })
      },
      onError() {
        notification.error({ message: 'Upload unsuccessfully' })
      },
    },
  )

  const { mutateAsync: mutateBatchExpose } = useMutation(
    'batch expose',
    (data: { ids: string[]; studentIds: string[]; structId: string }) =>
      axios.put(API + '/student/expose/batch', data).then((res) => res.data),
    {
      onSuccess() {
        client.invalidateQueries(['students', id])
        notification.success({ message: 'Batch expose successfully' })
      },
      onError() {
        notification.error({ message: 'Batch expose unsuccessfully' })
      },
    },
  )

  const [visible, open, close] = useModal()
  const [selectedId, setSelectedId] = useState<string>()

  return (
    <Layout requireLogin>
      <ViewGradeDetail
        visible={visible}
        close={close}
        selectedStudentId={selectedId!}
      />

      <div className="cr-container py-4">
        <div className="flex justify-between">
          <div className="flex gap-2">
            <button className="cr-button-outline">
              <Link href={`/class/${query.id}`}>
                <a className="text-current">Overview</a>
              </Link>
            </button>
            <button className="cr-button">
              <Link href={`/class/${query.id}/grade`}>
                <a className="text-current">Grade</a>
              </Link>
            </button>
            {isTeacher && (
              <button className="cr-button-outline">
                <Link href={`/class/${query.id}/review`}>
                  <a className="text-current">Review Requests</a>
                </Link>
              </button>
            )}
          </div>

          <div className="flex gap-2">
            {isTeacher && (
              <>
                <UploadButton
                  effect={(file) => mutateAsync(file)}
                  className="cr-button"
                >
                  <span className="fa fa-upload mr-2" /> Upload Student
                </UploadButton>

                <button onClick={downloadDefaultTemplate} className="cr-button">
                  Download Template
                </button>

                <button
                  onClick={() => downloadGrade(clas?.name || '', id)}
                  className="cr-button"
                >
                  Download Grade
                </button>
              </>
            )}
            {!isTeacher && (
              <button onClick={openReviewModal} className="cr-button">
                Request a review
              </button>
            )}
          </div>
        </div>

        <div className="mt-4 p-4 border rounded-md">
          <div
            style={{
              gridTemplateColumns: 'repeat(auto-fit, minmax(80px,180px))',
            }}
            className="grid gap-2 py-2 border-b"
          >
            <div className="border-r"> MSSV </div>
            <div className="border-r"> Fullname </div>
            <div className="border-r"> Overall Grade </div>
            {clas?.gradeStructure
              .sort((a, b) => a.order - b.order)
              .map(({ id: structId, title, detail }) => (
                <div
                  className="border-r flex justify-between items-center px-2"
                  key={structId}
                >
                  <div>
                    <div className="font-medium">{title}</div>
                    <div className="italic">{detail}</div>
                  </div>
                  <Dropdown
                    trigger={['click']}
                    disabled={!isTeacher}
                    overlay={
                      <Menu>
                        <MenuItem
                          onClick={() => downloadScoreTemplate(title, id)}
                          key="download-template"
                        >
                          <span className="fa fa-download mr-2" /> Download
                          Score Template
                        </MenuItem>
                        <MenuItem key="upload-score">
                          <UploadButton
                            effect={(file) =>
                              mutateUploadScore({ id: structId, file })
                            }
                          >
                            <span className="fa fa-upload mr-2" /> Upload Score
                          </UploadButton>
                        </MenuItem>
                        <MenuItem
                          onClick={() =>
                            mutateBatchExpose({
                              studentIds: students?.map((s) => s.id) || [],
                              structId,
                              ids:
                                students?.map((s) => s.grades[structId]?.id) ||
                                [],
                            })
                          }
                          key="batch-expose"
                        >
                          <span className="fa fa-share mr-2" /> Expose all
                          grades of this struct
                        </MenuItem>
                      </Menu>
                    }
                  >
                    <button className="w-8 h-8 rounded-full hover:bg-gray-200">
                      <span className="fa fa-ellipsis-v" />
                    </button>
                  </Dropdown>
                </div>
              ))}
          </div>

          <CreateReviewModal visible={reviewModal} close={closeReviewModal} />

          {students
            ?.filter((s) => isTeacher || s.academicId === session?.user.mssv)
            .map(({ id: studentId, name, grades, academicId, userId }) => (
              <div
                style={{
                  gridTemplateColumns: 'repeat(auto-fit, minmax(80px,180px))',
                }}
                className="grid gap-2 py-2 border-b"
                key={studentId}
              >
                <div className="border-r flex items-center">{academicId}</div>
                <div
                  onClick={
                    userId
                      ? () => {
                          open()
                          setSelectedId(studentId)
                        }
                      : undefined
                  }
                  className={`border-r flex items-center ${
                    userId ? 'underline hover:text-blue-600 cursor-pointer' : ''
                  }`}
                >
                  {name}
                </div>
                <div className="border-r flex items-center">
                  {Object.values(grades).reduce(
                    (sum, curr) => sum + (curr.expose ? Number(curr.point) : 0),
                    0,
                  ) / Object.values(grades).length || '0'}
                  %
                </div>

                {clas?.gradeStructure.map(({ id }) => (
                  <div key={grades[id]?.id} className="border-r">
                    <GradeInput
                      structId={id}
                      studentId={studentId}
                      id={grades[id]?.id}
                      point={Number(grades[id]?.point || '0')}
                      expose={grades[id]?.expose}
                    />
                    <Divider />
                    <div className="flex justify-between items-center">
                      <div></div>
                      <div className="italic pr-4">
                        {grades[id]?.expose ? 'Finalized' : 'Draft'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
        </div>
      </div>
    </Layout>
  )
}
