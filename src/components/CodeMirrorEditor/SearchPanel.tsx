import { SearchQuery, setSearchQuery } from '@codemirror/search'
import { EditorView } from '@uiw/react-codemirror'
import { useEffect, useState } from 'react'
import styles from './SearchPanel.module.scss'

interface SearchPanelProps {
  view: EditorView
}

export default function SearchPanel(props: SearchPanelProps) {
  const { view } = props
  const [searchTerm, setSearchTerm] = useState<string>('')

  useEffect(() => {
    const searchQuery = new SearchQuery({
      search: searchTerm,
      caseSensitive: false
    })

    view.dispatch({ effects: setSearchQuery.of(searchQuery) })
  }, [searchTerm])

  return (
    <div className={styles.searchPanel}>
      <input autoFocus placeholder='Search' onChange={(e) => setSearchTerm(e.target.value)} />
    </div>
  )
}
