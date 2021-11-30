import CreateAssigment from '@components/CreateAssignmentModal'
import Layout from '@utils/components/Layout'
import { useModal } from '@utils/hooks/useModal'
import { getSessionToken } from '@utils/libs/getToken'
import { getClass } from '@utils/service/class'
import { getUser } from '@utils/service/user'
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import { dehydrate, QueryClient, useQuery } from 'react-query'

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const token = getSessionToken(ctx.req.cookies)
  const id = ctx.query.id
  const client = new QueryClient()

  if (token) {
    await Promise.all([
      client.prefetchQuery('class', getClass(id as string)),
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
  const [createAssignment, openAssignment, closeAssignment] = useModal()

  return (
    <Layout classTitle={clas?.name} requireLogin>
      <CreateAssigment visible={createAssignment} close={closeAssignment} />
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

          <div className="mt-2 flex justify-between">
            <div className="font-medium">Assignments</div>
            <button onClick={openAssignment} className="cr-button">
              Create Assignment
            </button>
          </div>
          <div className="flex flex-col gap-2 mt-3">
            {clas?.assignments.map(({ id, name, point }) => (
              <div key={id}>
                <div>{name}</div>
                <div>{point}</div>
              </div>
            ))}
            {!clas?.assignments.length && (
              <div>This class has no assignments</div>
            )}
          </div>
        </div>

        <div>
          <button className="cr-button w-full">Invite</button>

          <div className="border rounded-md shadow-md p-4 my-4">
            <div className="font-medium">Grade Structure</div>
            <div className="flex flex-col gap-2 mt-3">
              {clas?.students.map(({ id, name }) => (
                <div className="hover:bg-gray-300 rounded-md p-2" key={id}>
                  {name}
                </div>
              ))}
              {!clas?.students.length && (
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
                <div>No one has ever joined you class</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
