import { getReview, createComment } from '@utils/service/review'
import { notification } from 'antd'
import { useRouter } from 'next/router'
import { useCallback, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import moment from 'moment'

type CommentData = {
  content: string
  reviewId: string
}

export default function Comments() {
  const { query } = useRouter()
  const id = query.reviewId as string
  const client = useQueryClient()

  const { data: review } = useQuery(['review', id], getReview(id))

  const { handleSubmit, register, reset, setValue } = useForm<CommentData>()

  useEffect(() => {
    setValue('reviewId', id)
  }, [id])

  const { mutateAsync, isLoading } = useMutation(
    'create-comment',
    createComment,
    {
      onSuccess() {
        client.invalidateQueries(['review', id])
        setValue('reviewId', '')
      },
      onError() {
        notification.error({ message: 'Post comment unsuccessfully' })
      },
    },
  )

  const submitComment = useCallback(
    handleSubmit((data) => {
      mutateAsync(data)
    }),
    [],
  )

  return (
    <div className="mt-4">
      <div className="flex flex-col gap-2 max-h-[400px] overflow-auto">
        {review?.comments.map((comment) => (
          <div key={comment.id}>
            <div>
              <span className="font-semibold">{comment.author.name}</span> at{' '}
              {moment(comment.createdAt).format('DD/MM/YYYY HH:mm')}
            </div>
            <div className="mt-1">{comment.content}</div>
          </div>
        ))}
      </div>

      <form className="mt-4" noValidate onSubmit={submitComment}>
        <textarea
          className="cr-input w-full"
          placeholder="Comment"
          disabled={review?.resolved}
          rows={2}
          {...register('content')}
        />

        <div className="mt-4 flex gap-2 justify-end">
          <button
            disabled={isLoading || review?.resolved}
            type="submit"
            className="cr-button"
          >
            Submit
          </button>
          <button
            disabled={review?.resolved}
            onClick={() => reset({ content: '', reviewId: id })}
            type="button"
            className="cr-button-outline"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
