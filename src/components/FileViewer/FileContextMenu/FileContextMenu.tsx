import { Menu } from 'react-contexify'
import Portal from '@/components/Portal'
import styles from './FileContextMenu.module.scss'

interface FileContextMenuProps {
  children: React.ReactNode
  id: string
  handlerMap?: Record<string, () => void>
}

export default function FileContextMenu(props: FileContextMenuProps) {
  const { children, id } = props

  return (
    <Portal>
      <Menu id={id} animation={false} className={styles.contextMenu}>
        {children}
      </Menu>
    </Portal>
  )
}
