'use client'

import { useEffect } from 'react'

/**
 * Sets the tab title from client state, for pages whose static metadata must stay generic (a
 * character file can't put a name in its HTML). Next's metadata may write the <title> again after
 * hydration, so the title is re-applied whenever it changes until the component unmounts; the next
 * page's own metadata then takes over.
 */
export function useDocumentTitle(title: string | undefined) {
  useEffect(() => {
    if (!title) return
    const previous = document.title
    const apply = () => {
      if (document.title !== title) document.title = title
    }
    apply()
    const observer = new MutationObserver(apply)
    observer.observe(document.head, { subtree: true, childList: true, characterData: true })
    return () => {
      observer.disconnect()
      // Leaving (or relocking) must not keep a name in the tab.
      if (document.title === title) document.title = previous
    }
  }, [title])
}
