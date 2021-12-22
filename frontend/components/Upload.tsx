import { ButtonHTMLAttributes, DetailedHTMLProps, useRef } from 'react'

interface Props
  extends Omit<
    DetailedHTMLProps<
      ButtonHTMLAttributes<HTMLButtonElement>,
      HTMLButtonElement
    >,
    'onClick'
  > {
  effect: (file: File) => any
}

export default function UploadButton({ effect, ...props }: Props) {
  const ref = useRef<HTMLInputElement>(null)

  return (
    <div>
      <button onClick={() => ref.current?.click()} {...props} />
      <input
        ref={ref}
        type="file"
        onChange={(f) => effect(f.target.files?.item(0)!)}
        accept=".csv"
        className="hidden"
      />
    </div>
  )
}
