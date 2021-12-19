import {
  ButtonHTMLAttributes,
  DetailedHTMLProps,
  useEffect,
  useRef,
  useState,
} from 'react'

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

export default function UploadButton({effect, ...props}: Props) {
  const [file, setFile] = useState<File>()
  const ref = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!file) return 
    effect(file)
  } , [file, effect])

  return (
    <div>
      <button onClick={() => ref.current?.click()} {...props} />
      <input
        ref={ref}
        type="file"
        onChange={(f) => setFile(f.target.files?.item(0) || undefined)}
        accept=".csv"
        className="hidden"
      />
    </div>
  )
}
