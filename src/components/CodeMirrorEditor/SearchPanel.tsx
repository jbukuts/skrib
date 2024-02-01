import { SearchQuery, setSearchQuery } from '@codemirror/search'
import { EditorView } from '@uiw/react-codemirror'
import { useEffect, useState } from 'react'
import { Input } from '../UI'
import styles from './SearchPanel.module.scss'

interface SearchPanelProps {
  view: EditorView
}

export default function SearchPanel(props: SearchPanelProps) {
  const { view } = props
  const [searchTerm, setSearchTerm] = useState<string>('')

  // search params
  const [caseSensitive] = useState<boolean>(false)
  const [wholeWord] = useState<boolean>(false)

  useEffect(() => {
    const searchQuery = new SearchQuery({
      search: searchTerm,
      caseSensitive,
      wholeWord
    })

    view.dispatch({ effects: setSearchQuery.of(searchQuery) })
  }, [searchTerm])

  return (
    <div className={styles.searchPanel}>
      <Input autoFocus placeholder='Search' onChange={(e) => setSearchTerm(e.target.value)} />
    </div>
  )
}
