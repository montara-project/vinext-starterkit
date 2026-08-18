'use client'

import { $generateHtmlFromNodes, $generateNodesFromDOM } from '@lexical/html'
import { $getRoot } from 'lexical'
import { useEffect, useRef } from 'react'

import { useEditor } from './editor-system'

interface EditorInnerProps {
  initialHtml?: string
  onChange?: (html: string) => void
}

export default function EditorInner({ initialHtml, onChange }: EditorInnerProps) {
  const { editor } = useEditor()
  const isUpdatingRef = useRef(false)
  const hasInitializedRef = useRef(false)

  // Set LTR direction on mount and register transform to keep it LTR
  useEffect(() => {
    if (!editor) return

    editor.update(() => {
      const root = $getRoot()
      root.setDirection('ltr')
    })
  }, [editor])

  useEffect(() => {
    if (!initialHtml || !editor || hasInitializedRef.current) return

    hasInitializedRef.current = true
    isUpdatingRef.current = true

    editor.update(() => {
      const parser = new DOMParser()
      const dom = parser.parseFromString(initialHtml, 'text/html')
      const nodes = $generateNodesFromDOM(editor, dom)

      const root = $getRoot()
      root.clear()
      root.setDirection('ltr')

      // Force LTR direction on all paragraph nodes
      nodes.forEach((node: any) => {
        if (node.setDirection && typeof node.setDirection === 'function') {
          node.setDirection('ltr')
        }
      })

      root.append(...nodes)
    })

    setTimeout(() => {
      isUpdatingRef.current = false
    }, 0)
  }, [editor, initialHtml])

  // Register update listener to capture changes
  useEffect(() => {
    if (!editor || !onChange) return

    const removeListener = editor.registerUpdateListener(({ editorState }: any) => {
      // Skip onChange during programmatic updates
      if (isUpdatingRef.current) return

      editorState.read(() => {
        try {
          const html = $generateHtmlFromNodes(editor, null)
          const clean = !html || html === '<p><br></p>' || html === '<p></p>' ? '' : html
          onChange(clean)
        } catch (error) {
          console.error('Error generating HTML:', error)
        }
      })
    })

    return removeListener
  }, [editor, onChange])

  return null
}
