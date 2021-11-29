import Empty from '@utils/components/Empty'
import Layout from '@utils/components/Layout'
import { getSessionToken } from '@utils/libs/getToken'
import { getCourses } from '@utils/service/course'
import { GetServerSideProps } from 'next'
import { dehydrate, QueryClient, useQuery } from 'react-query'
import { useModal } from '@utils/hooks/useModal'
import CreateCourseModal from '@components/CreateCourseModal'

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const client = new QueryClient()
  const token = getSessionToken(ctx.req.cookies)

  await client.prefetchQuery('courses', getCourses(token))

  return {
    props: {
      dehydratedState: dehydrate(client),
    },
  }
}

export default function Index() {
  const { data: courses } = useQuery('course', getCourses())
  const [visible, open, close] = useModal()

  return (
    <Layout requireLogin>
      <CreateCourseModal close={close} visible={visible} />
      <div className="cr-container py-4 mb-6">
        <div className="flex justify-between items-center">
          <h1 className="inline-block text-3xl font-medium mr-2 ">Courses</h1>
          <button onClick={open} className="cr-button mb-2 font-medium">
            <span className="fa fa-plus mr-2" /> Create course
          </button>
        </div>

        <div
          style={{
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 240px))',
          }}
          className="grid gap-2"
        >
          {courses?.map(({ id, name, teacher }) => (
            <div
              className="h-[260px] border rounded-md p-4 hover:shadow-md cr-transition overflow-hidden"
              key={id}
            >
              <div
                className="bg-hover bg-center h-[100px] m-[-16px] mb-0"
                style={{
                  backgroundImage:
                    'url(https://gstatic.com/classroom/themes/Economics.jpg)',
                }}
              />
              <div className="truncate w-full text-xl font-medium mt-2">
                {name}
              </div>
              <div className="truncate w-full">Teacher: {teacher.name}</div>
            </div>
          ))}
        </div>
        <Empty message="There is no course" on={!courses?.length} />
      </div>
    </Layout>
  )
}
