import Layout from '@utils/components/Layout'
import { getSessionToken } from '@utils/libs/getToken'
import { getReviews } from '@utils/service/review'
import { Switch } from 'antd'
import { GetServerSideProps } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { dehydrate, QueryClient, useQuery } from 'react-query'

export const getServerSideProps: GetServerSideProps = async ({
  req,
  params,
}) => {
  const classId = params?.id as string
  const client = new QueryClient()
  const token = getSessionToken(req.cookies)

  if (token) {
    await client.prefetchQuery('reviews', getReviews(classId, token))
  }

  return {
    props: {
      dehydratedState: dehydrate(client),
    },
  }
}

export default function ReviewsPage() {
  const { query } = useRouter()
  const classId = query.id as string

  const { data: reviews } = useQuery('reviews', getReviews(classId), {
    enabled: false,
  })

  const [showResolved, setShowResolved] = useState(false)

  return (
    <Layout requireLogin>
      <div className="cr-container pt-4 flex justify-between items-center">
        <div className=" flex gap-2">
          <button className="cr-button-outline">
            <Link href={`/class/${query.id}`}>
              <a className="text-current">Overview</a>
            </Link>
          </button>
          <button className="cr-button-outline">
            <Link href={`/class/${query.id}/grade`}>
              <a className="text-current">Grade</a>
            </Link>
          </button>
          <button className="cr-button">
            <Link href={`/class/${query.id}/review`}>
              <a className="text-current">Review Requests</a>
            </Link>
          </button>
        </div>

        <div className="flex gap-2">
          <Switch checked={showResolved} onChange={(v) => setShowResolved(v)} />
          <span>Show resolve reviews</span>
        </div>
      </div>

      <div className="cr-container mt-4 grid grid-cols-2 gap-6">
        {reviews
          ?.filter((r) => (showResolved ? true : !r.resolved))
          .map((review) => (
            <div
              key={review.id}
              className="p-4 border rounded-[4px] flex justify-between items-center"
            >
              <div>
                <div className="font-bold">{review.owner.name}</div>
                <div>{review.grade.struct.title}</div>
              </div>
              <div>
                <Link href={`/class/${classId}/review/${review.id}`}>
                  <button>
                    <span className="fa fa-arrow-right" />
                  </button>
                </Link>
              </div>
            </div>
          ))}
      </div>
    </Layout>
  )
}
