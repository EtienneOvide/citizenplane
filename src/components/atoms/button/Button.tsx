import { composeRenderProps, Button as RACButton, type ButtonProps } from 'react-aria-components'
import { ProgressCircle } from '@/components/atoms/progress-circle/ProgressCircle'
import clsx from 'clsx'
import styles from './Button.module.scss'

export type ButtonVariant = 'primary' | 'secondary' | 'icon'
export type ButtonWidth = 'full' | 'auto'

export interface ButtonPropsWithVariant extends ButtonProps {
  variant?: ButtonVariant
  width?: ButtonWidth
}

export const Button = ({
  variant = 'primary',
  width = 'auto',
  ...props
}: ButtonPropsWithVariant) => {
  return (
    <RACButton
      {...props}
      className={clsx(
        styles['a-button'],
        variant && styles[`a-button--${variant}`],
        width && styles[`a-button--${width}`],
      )}
    >
      {composeRenderProps(props.children, (children, { isPending }) => (
        <>
          {!isPending && children}
          {isPending && <ProgressCircle aria-label="Loading..." isIndeterminate />}
        </>
      ))}
    </RACButton>
  )
}
