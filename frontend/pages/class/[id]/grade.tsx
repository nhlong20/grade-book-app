import Layout from '@utils/components/Layout'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { GetServerSideProps } from 'next'
import { dehydrate, QueryClient, useMutation, useQuery } from 'react-query'
import { getSessionToken } from '@utils/libs/getToken'
import { getClass } from '@utils/service/class'
import { useCallback } from 'react'
import { downloadTemplate } from '@utils/service/download'
import { uploadStudent } from '@utils/service/upload'
import UploadButton from '@components/Upload'

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const client = new QueryClient()
  const token = getSessionToken(ctx.req.cookies)

  const id = ctx.query.id as string

  if (token) {
    await Promise.all([client.prefetchQuery('class', getClass(id, token))])
  }

  return {
    props: {
      dehydratedState: dehydrate(client),
    },
  }
}

export default function ClassGrade() {
  const { query } = useRouter()
  const id = query.id as string
  const { data: clas } = useQuery('class', getClass(id))

  const downloadDefaultTemplate = useCallback(() => {
    downloadTemplate(clas?.name || 'Template')
  }, [clas])

  const { mutateAsync } = useMutation('upload-student', uploadStudent(id), {})

  return (
    <Layout requireLogin>
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
          </div>

          <div className="flex gap-2">
            <UploadButton
              effect={(file) => mutateAsync(file)}
              className="cr-button"
            >
              <span className="fa fa-upload mr-2" /> Upload Student
            </UploadButton>

            <button onClick={downloadDefaultTemplate} className="cr-button">
              Download Template
            </button>
          </div>
        </div>
      </div>
    </Layout>
  )
}
