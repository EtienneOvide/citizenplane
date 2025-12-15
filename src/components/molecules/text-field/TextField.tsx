import {
  Group,
  Input,
  TextField as AriaTextField,
  type TextFieldProps as AriaTextFieldProps,
  type ValidationResult,
  Label,
  FieldError,
} from 'react-aria-components'
import styles from './TextField.module.scss'
import type { ReactNode } from 'react'
import clsx from 'clsx'

export interface TextFieldProps extends AriaTextFieldProps {
  label?: string
  headerContent: ReactNode
  errorMessage?: string | ((validation: ValidationResult) => string)
}

export const TextField = ({ label, errorMessage, ...props }: TextFieldProps) => {
  return (
    <AriaTextField {...props} className={styles['m-text-field']}>
      <div className={styles['m-text-field__header']}>
        <Label className={styles['m-text-field__label']}>{label}</Label>
        {props.headerContent}
      </div>
      <Group>
        <Input
          className={clsx(
            styles['m-text-field__input'],
            (props.isInvalid || errorMessage) && styles['m-text-field__input--error'],
          )}
        />
      </Group>
      <FieldError className={styles['m-text-field__error']}>{errorMessage}</FieldError>
    </AriaTextField>
  )
}
