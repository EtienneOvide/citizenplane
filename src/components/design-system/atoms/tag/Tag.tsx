import type { ReactNode } from 'react'
import styles from './Tag.module.scss'
import clsx from 'clsx'

type TagProps = {
  children: ReactNode
  variant?: 'disabled' | 'error' | 'success'
}

export const Tag = ({ children, variant }: TagProps) => {
  return (
    <div className={clsx(styles['a-tag'], variant && styles[`a-tag--${variant}`])}>{children}</div>
  )
}
