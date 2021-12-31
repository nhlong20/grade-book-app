import Link from 'next/link'
import CreateGradeStructModal from '@components/CreateGradeStruct'
import CreateInvitationModal from '@components/CreateInvitationModal'
import Layout from '@utils/components/Layout'
import { useModal } from '@utils/hooks/useModal'
import { getSessionToken } from '@utils/libs/getToken'
import { getClass, updateOrder } from '@utils/service/class'
import { getUser } from '@utils/service/user'
import { notification } from 'antd'
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import { useCallback } from 'react'
import {
  dehydrate,
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from 'react-query'
import {
  DragDropContext,
  Droppable,
  Draggable,
  OnDragEndResponder,
} from 'react-beautiful-dnd'
import { useAuth } from '@utils/hooks/useAuth'

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const token = getSessionToken(ctx.req.cookies)

  const id = ctx.query.id
  const client = new QueryClient()

  if (token) {
    await Promise.all([
      client.prefetchQuery(['class', id], getClass(id as string, token)),
      client.prefetchQuery('user', getUser(token)),
    ])
  }

  return {
    notFound: !client.getQueryData(['class', id]),
    props: {
      dehydratedState: dehydrate(client),
    },
  }
}

export default function ClassDetail() {
  const { query } = useRouter()
  const { data: clas } = useQuery(
    ['class', query.id],
    getClass(query.id as string),
  )
  const { data: user } = useQuery('user', getUser())
  const { isStudent, isTeacher } = useAuth()

  const [createInvitation, openInvitation, closeInvitation] = useModal()
  const [gradeStruct, openGradeStruct, closeGradeStruct] = useModal()

  const client = useQueryClient()

  const { mutateAsync: updateMutate } = useMutation(
    'update-order',
    updateOrder,
    {
      onSuccess() {
        client.invalidateQueries(['class', query.id])
        notification.success({ message: 'Update order successfully' })
      },
      onError() {
        notification.error({ message: 'Update order unsuccessfully' })
      },
    },
  )

  const handleDragEnd: OnDragEndResponder = useCallback(
    (res) => {
      if (!res?.destination) return

      const temp = [...(clas?.gradeStructure || [])].sort(
        (a, b) => (a.order = b.order),
      )

      isTeacher &&
        updateMutate({
          id1: temp[res.source.index].id,
          id2: temp[res.destination?.index].id,
        })
    },
    [clas, isTeacher],
  )

  return (
    <Layout classTitle={clas?.name} requireLogin>
      <CreateInvitationModal
        visible={createInvitation}
        close={closeInvitation}
      />
      <CreateGradeStructModal visible={gradeStruct} close={closeGradeStruct} />

      <div className="cr-container pt-4 flex gap-2">
        <button className="cr-button">
          <Link href={`/class/${query.id}`}>
            <a className="text-current">Overview</a>
          </Link>
        </button>
        <button className="cr-button-outline">
          <Link href={`/class/${query.id}/grade`}>
            <a className="text-current">Grade</a>
          </Link>
        </button>
      </div>

      <div className="cr-container py-4 mb-6 grid grid-cols-[250px,1fr,250px] gap-4">
        <div>
          <div className="border rounded-md shadow-md p-4 mb-4">
            <div className="font-medium">Teachers</div>
            <div className="flex flex-col gap-2 mt-3">
              {clas?.teachers.map(({ id, name }) => (
                <div className="hover:bg-gray-300 rounded-md p-2" key={id}>
                  {name}
                </div>
              ))}
            </div>
          </div>

          <div className="border rounded-md shadow-md p-4">
            <div className="font-medium">Your other classes</div>
            <div className="flex flex-col gap-2 mt-3">
              {[
                ...(user?.ownerClasses || []),
                ...(user?.subscriptedClasses || []),
              ]
                .filter(({ id }) => id !== query.id)
                .map(({ id, name }) => (
                  <Link href={`/class/${id}`}>
                    <div className="hover:bg-gray-300 rounded-md p-2" key={id}>
                      {name}
                    </div>
                  </Link>
                ))}
            </div>
          </div>
        </div>
        <div className="p-4">
          <div className="border-b pb-2">Description: {clas?.description}</div>

          <div className="mt-6 flex flex-col gap-4">
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId={'droppable'}>
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="flex flex-col gap-3"
                  >
                    {clas?.gradeStructure
                      .sort((a, b) => a.order - b.order)
                      .map(({ title, id: structId }, index) => (
                        <Draggable
                          key={structId}
                          index={index}
                          draggableId={structId}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <div className="text-xl">Grade: {title}</div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </div>
        </div>

        <div>
          <button className="cr-button w-full" onClick={openInvitation}>
            Invite
          </button>

          {isTeacher && (
            <button className="cr-button w-full mt-2" onClick={openGradeStruct}>
              Create Grade Structure
            </button>
          )}

          <div className="border rounded-md shadow-md p-4 my-4">
            <div className="font-medium">Students</div>
            <div className="flex flex-col gap-2 mt-3">
              {clas?.students.map(({ id, name }) => (
                <div className="hover:bg-gray-300 rounded-md p-2" key={id}>
                  {name}
                </div>
              ))}
              {!clas?.students.length && (
                <div>No one has ever joined this class</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
