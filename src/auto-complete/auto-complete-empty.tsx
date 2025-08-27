import React from 'react'
import AutoCompleteSearch from './auto-complete-searching'

interface Props {
  hidden?: boolean
  className?: string
}

const defaultProps = {
  hidden: false,
  className: '',
}

export type AutoCompleteEmptyProps = Props & React.HTMLAttributes<any>

const AutoCompleteEmpty: React.FC<React.PropsWithChildren<AutoCompleteEmptyProps>> = ({
  children,
  hidden,
  className,
}: React.PropsWithChildren<AutoCompleteEmptyProps>) => {
  if (hidden) return null
  return <AutoCompleteSearch className={className}>{children}</AutoCompleteSearch>
}

//@ts-ignore
AutoCompleteEmpty.defaultProps = defaultProps
AutoCompleteEmpty.displayName = 'GeistAutoCompleteEmpty'

export default AutoCompleteEmpty
