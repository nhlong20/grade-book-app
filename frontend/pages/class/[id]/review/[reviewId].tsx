import Layout from '@utils/components/Layout'
import { getSessionToken } from '@utils/libs/getToken'
import { getReview, resolveReview } from '@utils/service/review'
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import { dehydrate, QueryClient, useMutation, useQuery } from 'react-query'
import moment from 'moment'
import Comments from '@components/Comment'
import { notification } from 'antd'

export const getServerSideProps: GetServerSideProps = async ({
  req,
  query,
}) => {
  const client = new QueryClient()
  const id = query.reviewId as string
  const token = getSessionToken(req.cookies)

  if (token) {
    await Promise.all([
      client.prefetchQuery(['review', id], getReview(id, token)),
    ])
  }

  return {
    props: {
      dehydratedState: dehydrate(client),
    },
  }
}

export default function ReviewDetail() {
  const { query, push } = useRouter()
  const id = query.reviewId as string

  const { data: review } = useQuery(['review', id], getReview(id), {
    enabled: false,
  })

  const { owner } = review || {}

  const { mutateAsync, isLoading } = useMutation(
    ['resolve-review', id],
    resolveReview(id),
    {
      onSuccess() {
        notification.success({ message: 'Resolve review successfully' })
        push(`/class/${review?.grade.student.class.id}/grade`)
      },
      onError() {
        notification.error({ message: 'Resolve review unsuccessfully' })
      },
    },
  )

  return (
    <Layout requireLogin>
      <div className="cr-container py-4 relative min-h-[calc(100vh-32px-70px)]">
        {!review?.resolved && (
          <button
            onClick={() => mutateAsync()}
            className="cr-button absolute bottom-0 right-[60px]"
          >
            Resolve this request
            <span className="fa fa-check ml-2" />
          </button>
        )}

        <div className="flex gap-8 justify-center">
          <div>
            <span>{owner?.name}</span>{' '}
            <span>
              at {moment(review?.createdAt).format('DD/MM/YYYY HH:mm A')}
            </span>
          </div>
          <div>
            <b>Class:</b> {review?.grade.student.class.name}
          </div>
        </div>

        <div className="mt-4 text-2xl text-center flex w-full gap-2 justify-center">
          Request review for{' '}
          <b className="text-blue-600">{review?.grade.struct?.title}</b>{' '}
          {review?.resolved && (
            <span
              title="Resolved"
              className="w-8 h-8 text-base ml-4 rounded-full bg-green-600 grid place-content-center"
            >
              <span className="fa fa-check text-white "></span>
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 gap-8 mt-8 p-4 border rounded-md text-xl">
          <div>Expected Grade: {review?.expectedGrade}</div>
          <div>Initial Grade: {review?.grade.point}</div>
        </div>

        <div className="grid grid-cols-2 gap-8">
          <div className="p-4">
            <div className="text-xl">
              <b className="underline">Explanation</b>
            </div>
            <div className="mt-2">{review?.explanation}</div>
          </div>
          <div className="p-4">
            <div className="text-xl">
              <b className="underline">Discussion</b>
            </div>

            <Comments />
          </div>
        </div>
      </div>
    </Layout>
  )
}
