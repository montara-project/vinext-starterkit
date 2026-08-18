'use client'

import {
  IconBold,
  IconCode,
  IconHash,
  IconItalic,
  IconLink,
  IconListLetters,
  IconListNumbers,
  IconPilcrow,
  IconQuote,
  IconRotate,
  IconRotate360,
  IconStrikethrough,
  IconUnderline,
} from '@tabler/icons-react'
import { useMemo } from 'react'

import SelectInput from '@/components/block/common/select-input'
import { cn } from '@/lib/utils'

import { useEditor } from './editor-system'

interface ToolbarButtonProps {
  onClick: () => void
  isActive?: boolean
  title: string
  children: React.ReactNode
}

function ToolbarButton({ onClick, isActive, title, children }: ToolbarButtonProps) {
  return (
    <button
      type="button"
      title={title}
      onMouseDown={(e) => {
        e.preventDefault() // prevent editor losing focus
        onClick()
      }}
      className={cn(
        'flex h-7 w-7 items-center justify-center rounded-md text-xs transition-colors',
        'hover:bg-[#2c3892]/10 hover:text-[#2c3892]',
        isActive ? 'bg-[#2c3892]/15 text-[#2c3892]' : 'text-muted-foreground'
      )}
    >
      {children}
    </button>
  )
}

function ToolbarDivider() {
  return <div className="bg-border mx-1 h-4 w-px shrink-0" />
}

const blockFormatOptions = [
  {
    value: 'p',
    label: 'Paragraph',
    icon: IconPilcrow,
  },
  {
    value: 'h1',
    label: 'Heading 1',
    icon: IconHash,
  },
  {
    value: 'h2',
    label: 'Heading 2',
    icon: IconHash,
  },
  {
    value: 'h3',
    label: 'Heading 3',
    icon: IconHash,
  },
  {
    value: 'quote',
    label: 'Quote',
    icon: IconQuote,
  },
]

export default function EditorToolbar() {
  const { commands, activeStates } = useEditor()

  const currentBlockFormat = useMemo(() => {
    if (activeStates.isH1) {
      return 'h1'
    }
    if (activeStates.isH2) {
      return 'h2'
    }
    if (activeStates.isH3) {
      return 'h3'
    }
    if (activeStates.isQuote) {
      return 'quote'
    }
    return 'p'
  }, [activeStates])

  const handleBlockFormatChange = (value: string) => {
    if (value === 'p') commands.toggleParagraph()
    else if (value.startsWith('h')) commands.toggleHeading(value as 'h1' | 'h2' | 'h3')
    else if (value === 'quote') commands.toggleQuote()
  }

  return (
    <div className="border-border bg-muted/30 flex flex-wrap items-center gap-0.5 border-b px-2 py-1.5">
      <ToolbarButton
        title="Bold (Ctrl+B)"
        onClick={commands.toggleBold}
        isActive={!!activeStates.bold}
      >
        <IconBold className="h-3 w-3" />
      </ToolbarButton>
      <ToolbarButton
        title="Italic (Ctrl+I)"
        onClick={commands.toggleItalic}
        isActive={!!activeStates.italic}
      >
        <IconItalic className="h-3 w-3" />
      </ToolbarButton>
      <ToolbarButton
        title="Underline (Ctrl+U)"
        onClick={commands.toggleUnderline}
        isActive={!!activeStates.underline}
      >
        <IconUnderline className="h-3 w-3" />
      </ToolbarButton>
      <ToolbarButton
        title="Strikethrough"
        onClick={commands.toggleStrikethrough}
        isActive={!!activeStates.strikethrough}
      >
        <IconStrikethrough className="h-3 w-3" />
      </ToolbarButton>

      <ToolbarDivider />

      <SelectInput
        options={blockFormatOptions}
        onSelect={handleBlockFormatChange}
        defaultValue={currentBlockFormat}
        placeholder="Select block format"
      />

      <ToolbarDivider />

      <ToolbarButton
        title="Bullet List"
        onClick={commands.toggleUnorderedList}
        isActive={!!activeStates.unorderedList}
      >
        <IconListLetters className="h-3 w-3" />
      </ToolbarButton>
      <ToolbarButton
        title="Numbered List"
        onClick={commands.toggleOrderedList}
        isActive={!!activeStates.orderedList}
      >
        <IconListNumbers className="h-3 w-3" />
      </ToolbarButton>

      <ToolbarDivider />

      <ToolbarButton
        title="Blockquote"
        onClick={commands.toggleQuote}
        isActive={!!activeStates.isQuote}
      >
        <IconQuote className="h-3 w-3" />
      </ToolbarButton>
      <ToolbarButton
        title="Code Block"
        onClick={commands.toggleCodeBlock}
        isActive={!!activeStates.isInCodeBlock}
      >
        <IconCode className="h-3 w-3" />
      </ToolbarButton>
      <ToolbarButton
        title="Insert/Remove Link"
        onClick={() => (activeStates.isLink ? commands.removeLink() : commands.insertLink())}
        isActive={!!activeStates.isLink}
      >
        <IconLink className="h-3 w-3" />
      </ToolbarButton>

      <ToolbarDivider />

      <ToolbarButton title="Undo (Ctrl+Z)" onClick={commands.undo}>
        <IconRotate className="h-3 w-3" />
      </ToolbarButton>
      <ToolbarButton title="Redo (Ctrl+Y)" onClick={commands.redo}>
        <IconRotate360 className="h-3 w-3" />
      </ToolbarButton>
    </div>
  )
}
