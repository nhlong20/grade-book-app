import { CircleSpinner } from 'react-spinners-kit'
import { ReactNode } from 'react'

interface Props {
  size?: number
  as?: any
  on?: boolean
  children?: ReactNode
  frontColor?: string
  backColor?: string
}

function Loading({ on, children, size, backColor, frontColor, as }: Props) {
  const Component = as || CircleSpinner

  return on ? (
    <div className="inline-block m-auto">
      <div className="inline-block dark:hidden">
        <Component
          backColor={backColor || '#fff'}
          frontColor={frontColor || '#2563eb'}
          size={size || 14}
          sizeUnit="px"
        />
      </div>
      <div className="hidden dark:inline-block">
        <Component
          backColor={backColor || '#1f2937'}
          frontColor={frontColor || '#fff'}
          size={size || 14}
          sizeUnit="px"
        />
      </div>
    </div>
  ) : (
    <>{children}</>
  )
}

Loading.defaultProps = {
  on: true,
}

export default Loading
