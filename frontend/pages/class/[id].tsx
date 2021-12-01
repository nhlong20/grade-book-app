import CreateAssigment from '@components/CreateAssignmentModal'
import CreateGradeStructModal from '@components/CreateGradeStruct'
import CreateInvitationModal from '@components/CreateInvitationModal'
import Layout from '@utils/components/Layout'
import { useModal } from '@utils/hooks/useModal'
import { useTeacher } from '@utils/hooks/useTeacher'
import { getSessionToken } from '@utils/libs/getToken'
import { Assignment } from '@utils/models/assignment'
import { deleteAssignment, getClass, updateOrder } from '@utils/service/class'
import { getUser } from '@utils/service/user'
import { notification, Dropdown, Menu } from 'antd'
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import { useCallback, useState } from 'react'
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
  OnDragStartResponder,
} from 'react-beautiful-dnd'

const MenuItem = Menu.Item

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const token = getSessionToken(ctx.req.cookies)

  const id = ctx.query.id
  const client = new QueryClient()

  if (token) {
    await Promise.all([
      client.prefetchQuery('class', getClass(id as string, token)),
      client.prefetchQuery('user', getUser(token)),
    ])
  }

  return {
    props: {
      dehydratedState: dehydrate(client),
    },
  }
}

export default function ClassDetail() {
  const { query } = useRouter()
  const { data: clas } = useQuery('class', getClass(query.id as string))
  const { data: user } = useQuery('user', getUser())

  const isTeacher = useTeacher()

  const [createAssignment, openAssignment, closeAssignment] = useModal()
  const [createInvitation, openInvitation, closeInvitation] = useModal()
  const [gradeStruct, openGradeStruct, closeGradeStruct] = useModal()

  const [selectedAssignment, setSelectedAssignment] = useState<Assignment>()
  const [selectedStruct, setSelectedStruct] = useState('')

  const client = useQueryClient()

  const { mutateAsync } = useMutation('delete assignment', deleteAssignment, {
    onSuccess() {
      client.invalidateQueries('class')
      notification.success({ message: `Delete assignment successfully` })
    },
    onError() {
      notification.error({ message: 'Delete assignment unsuccessfully' })
    },
  })

  const removeAssignment = useCallback(
    (id: string) => () => {
      mutateAsync(id)
    },
    [],
  )

  const { mutateAsync: updateMutate, isLoading: isUpdate } = useMutation(
    'update-order',
    updateOrder,
    {
      onSuccess(res) {
        client.invalidateQueries('class')
        notification.success({ message: `Update order successfully` })
      },
      onError() {
        notification.error({ message: 'Update order unsuccessfully' })
      },
    },
  )

  const handleDragEnd: OnDragEndResponder = useCallback(
    (res) => {
      updateMutate({
        id1:
          clas?.gradeStructure
            .find((g) => g.id === res.source.droppableId)
            ?.assignments.find((_, index) => index === res.destination?.index)
            ?.id || '',
        id2:
          clas?.gradeStructure
            .find((g) => g.id === res.source.droppableId)
            ?.assignments.find((_, index) => index === res.source.index)?.id ||
          '',
      })
    },
    [clas],
  )

  return (
    <Layout classTitle={clas?.name} requireLogin>
      <CreateAssigment
        structId={selectedStruct}
        assignmentData={selectedAssignment}
        visible={createAssignment}
        close={closeAssignment}
      />
      <CreateInvitationModal
        visible={createInvitation}
        close={closeInvitation}
      />
      <CreateGradeStructModal visible={gradeStruct} close={closeGradeStruct} />

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
                  <div className="hover:bg-gray-300 rounded-md p-2" key={id}>
                    {name}
                  </div>
                ))}
            </div>
          </div>
        </div>
        <div className="p-4">
          <div className="border-b pb-2">Description: {clas?.description}</div>

          <div className="mt-4 flex justify-between items-center">
            <div />
            <button
              onClick={() => {
                setSelectedAssignment(undefined)
                openAssignment()
              }}
              className="cr-button"
            >
              Create Assignment
            </button>
          </div>

          <div className="mt-6 flex flex-col gap-4">
            {clas?.gradeStructure.map(
              ({ assignments, title, id: structId }) => (
                <DragDropContext onDragEnd={handleDragEnd} key={structId}>
                  <Droppable droppableId={structId}>
                    {(provided) => (
                      <div {...provided.droppableProps} ref={provided.innerRef}>
                        <div className="text-xl">Grade: {title}</div>
                        <div className="mt-3 flex flex-col gap-2">
                          {assignments
                            .sort((a, b) => a.order - b.order)
                            .map(({ id, name, point, ...rest }, index) => (
                              <Draggable
                                key={id}
                                index={index}
                                draggableId={id}
                              >
                                {(provided, snapshot) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    className="rounded-md border p-4 flex justify-between"
                                  >
                                    <div>
                                      <div>Assignment: {name}</div>
                                      <span className="italic">
                                        {point} points
                                      </span>
                                    </div>
                                    {isTeacher && (
                                      <Dropdown
                                        trigger={['click']}
                                        overlay={
                                          <Menu>
                                            <MenuItem
                                              onClick={() => {
                                                setSelectedAssignment({
                                                  id,
                                                  name,
                                                  point,
                                                  ...rest,
                                                })
                                                setSelectedStruct(structId)
                                                openAssignment()
                                              }}
                                            >
                                              Update
                                            </MenuItem>
                                            <MenuItem
                                              danger
                                              onClick={removeAssignment(id)}
                                            >
                                              Delete
                                            </MenuItem>
                                          </Menu>
                                        }
                                      >
                                        <button className="w-8 h-8 rounded-full hover:bg-gray-300">
                                          <span className="fa fa-ellipsis-v" />
                                        </button>
                                      </Dropdown>
                                    )}
                                  </div>
                                )}
                              </Draggable>
                            ))}
                          {provided.placeholder}
                          {!assignments.length && (
                            <div>
                              There has not been any assignment in this grade
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
              ),
            )}
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
            <div className="font-medium">Grade Structure</div>
            <div className="flex flex-col gap-2 mt-3">
              {clas?.gradeStructure.map(({ id, title, detail }) => (
                <div
                  className="hover:bg-gray-300 rounded-md p-2 flex justify-between"
                  key={id}
                >
                  <div>{title}</div>
                  <div>{detail}</div>
                </div>
              ))}
              {!clas?.gradeStructure.length && (
                <div>You haven't defined the grade struct of this class</div>
              )}
            </div>
          </div>

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
