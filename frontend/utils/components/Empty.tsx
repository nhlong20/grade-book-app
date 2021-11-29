interface Props {
  message: string
  on: boolean
}

export default function Empty({ message, on }: Props) {
  return on ? <div>{message}</div> : null
}
