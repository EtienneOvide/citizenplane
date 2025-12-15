import { createFileRoute, Outlet } from '@tanstack/react-router'
import styles from './_layout.module.scss'

const Layout = () => (
  <div className={styles['l-layout']}>
    <>
      <Outlet />
    </>
  </div>
)

export const Route = createFileRoute('/_layout')({
  component: Layout,
})
