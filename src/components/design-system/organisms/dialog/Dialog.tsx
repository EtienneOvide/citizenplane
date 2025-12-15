import { DialogTrigger, Modal, Dialog as RACDialog } from 'react-aria-components'
import { type ReactNode, useMemo } from 'react'
import { Button } from '@/components/design-system/atoms/button/Button'
import clsx from 'clsx'
import { useBreakpoint } from '@/hooks/useBreakpoint'
import styles from './Dialog.module.scss'
import { X } from 'lucide-react'

type DialogProps = {
  className?: string
  title: string
  subtitle?: string
  component?: ReactNode
  children?: ReactNode
  isOpen: boolean
  width?: string
  onClose?: () => void
}

export const Dialog = ({
  children,
  title,
  subtitle,
  className,
  component,
  isOpen = false,
  width,
  onClose,
}: DialogProps) => {
  const { isMobile } = useBreakpoint()

  const dialogStyle = useMemo(() => {
    if (isMobile) {
      return width
        ? { width: '100%', maxWidth: 'none', maxHeight: 'var(--visual-viewport-height)' }
        : { width: '100%', height: 'var(--visual-viewport-height)' }
    }
    return width ? { maxWidth: width } : { width: '100%', height: 'var(--visual-viewport-height)' }
  }, [isMobile, width])

  return (
    <div className={clsx(styles['o-dialog'], className)}>
      <DialogTrigger isOpen={isOpen} onOpenChange={(open) => !open && onClose?.()}>
        {children}
        <Modal className={styles['o-dialog__overlay']}>
          <RACDialog style={dialogStyle} className={styles['o-dialog__content']}>
            <div className={styles['o-dialog__content-wrapper']}>
              <header className={styles['o-dialog__header']}>
                <div className={styles['o-dialog__header-text']}>
                  {title && <h4 className={styles['o-dialog__title']}>{title}</h4>}
                  {subtitle && <p className={styles['o-dialog__subtitle']}>{subtitle}</p>}
                </div>
                <Button onPress={onClose} variant="icon">
                  <X />
                </Button>
              </header>
              <div
                className={clsx(
                  styles['o-dialog__component-wrapper'],
                  width && styles['o-dialog__component-wrapper--fixed-width'],
                )}
              >
                {component}
              </div>
            </div>
          </RACDialog>
        </Modal>
      </DialogTrigger>
    </div>
  )
}
