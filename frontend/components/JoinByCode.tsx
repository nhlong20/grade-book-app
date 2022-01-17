import { Modal } from 'antd'
import { useCallback } from 'react'
import { useForm } from 'react-hook-form'

type Props = {
  visible: boolean
  close: () => void
}

type FormData = {
  code: string
}

export default function JoinByCode({ close, visible }: Props) {
  const { register, handleSubmit } = useForm<FormData>()

  const submitCode = useCallback(
    handleSubmit((data) => {}),
    [],
  )

  return (
    <Modal visible={visible} onCancel={close} centered footer={null}>
      <div className='text-2xl font-semibold mb-6'>Join A Class By Code</div>

      <form noValidate onSubmit={submitCode}>
        <label htmlFor="code" className="cr-label">
          Code
        </label>
        <input type="text" id="code" {...register('code')} />

        <div className="mt-4 flex gap-2 justify-end">
          <button type="button" className="cr-button">
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
