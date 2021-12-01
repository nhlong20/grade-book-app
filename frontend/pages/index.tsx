import Empty from '@utils/components/Empty'
import Layout from '@utils/components/Layout'
import { getSessionToken } from '@utils/libs/getToken'
import { GetServerSideProps } from 'next'
import { dehydrate, QueryClient, useQuery } from 'react-query'
import { useModal } from '@utils/hooks/useModal'
import CreateCourseModal from '@components/CreateCourseModal'
import Link from 'next/link'
import { getUser } from '@utils/service/user'

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const client = new QueryClient()
  const token = getSessionToken(ctx.req.cookies)

  if (token) {
    await client.prefetchQuery('user', getUser(token))
  }

  return {
    props: {
      dehydratedState: dehydrate(client),
    },
  }
}

export default function Index() {
  const { data: user } = useQuery('user', getUser())
  const courses = [
    ...(user?.subscriptedClasses || []),
    ...(user?.ownerClasses || []),
  ]

  const [visible, open, close] = useModal()

  return (
    <Layout requireLogin>
      <CreateCourseModal close={close} visible={visible} />
      <div className="cr-container py-4 mb-6">
        <div className="flex justify-between items-center">
          <h1 className="inline-block text-3xl font-medium mr-2 ">
            Your Classes
          </h1>
          <button onClick={open} className="cr-button mb-2 font-medium">
            <span className="fa fa-plus mr-2" /> Create class
          </button>
        </div>

        <div
          style={{
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 240px))',
          }}
          className="grid gap-2"
        >
          {courses?.map(({ id, name }) => (
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
              <Link href={`/class/${id}`}>
                <a className="truncate w-full block text-xl font-medium mt-2">
                  {name}
                </a>
              </Link>
            </div>
          ))}
        </div>
        <Empty message="You haven't taken any class" on={!courses?.length} />
      </div>
    </Layout>
  )
}
