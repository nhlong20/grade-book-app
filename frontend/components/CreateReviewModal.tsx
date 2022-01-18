import { Class } from '@utils/models/class'
import { Review } from '@utils/models/review'
import { createReview } from '@utils/service/review'
import { Modal, notification } from 'antd'
import { useRouter } from 'next/router'
import { useCallback, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useMutation, useQuery } from 'react-query'

type Props = {
  visible: boolean
  close: () => void
}

type FormData = Pick<Review, 'expectedGrade' | 'explanation'> & {
  gradeId: string
}

export default function CreateReviewModal({ visible, close }: Props) {
  const { push, query } = useRouter()
  const id = query.id as string
  const { register, handleSubmit, reset } = useForm<FormData>()

  const { mutateAsync, isLoading } = useMutation(
    'create-review',
    createReview,
    {
      onError() {
        notification.error({ message: 'Submit review unsuccessfully' })
      },
      onSuccess(res) {
        notification.success({ message: 'Submit review successfully' })
        push(`/review/${res.id}`)
      },
    },
  )

  useEffect(() => {
    if (!visible) return
    reset()
  }, [visible])

  const submit = useCallback(
    handleSubmit((data) => {
      mutateAsync(data)
    }),
    [],
  )

  const { data: clas } = useQuery<Class>(['class', id], { enabled: false })

  return (
    <Modal visible={visible} onCancel={close} centered footer={null}>
      <div className="font-semibold text-2xl mb-8 text-blue-600">
        Submit a Review
      </div>

      <form onSubmit={submit} noValidate>
        <div className="mb-4">
          <label className="cr-label" htmlFor="gradid">
            Grade Struct
          </label>
          <select
            className="w-full cr-input"
            id="gradid"
            {...register('gradeId')}
          >
            {clas?.gradeStructure.map((struc) => (
              <option key={struc.id} value={struc.id}>
                {struc.title}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="expect" className="cr-label">
            Expected Grade
          </label>
          <input
            className="cr-input w-full"
            type="number"
            id="expect"
            {...register('expectedGrade')}
          />
        </div>

        <div className="mb-4">
          <label className="cr-label" htmlFor="explan">
            Explanation
          </label>
          <textarea
            className="w-full cr-input"
            id="explan"
            {...register('explanation')}
            rows={3}
          />
        </div>

        <div className="mb-4 flex gap-2 justify-end">
          <button disabled={isLoading} type="submit" className="cr-button">
            Submit
          </button>
          <button onClick={close} type="button" className="cr-button-outline">
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  )
}
