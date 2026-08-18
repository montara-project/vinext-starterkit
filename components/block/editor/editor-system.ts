import {
  blockFormatExtension,
  boldExtension,
  codeExtension,
  createEditorSystem,
  historyExtension,
  horizontalRuleExtension,
  italicExtension,
  linkExtension,
  listExtension,
  richTextExtension,
  strikethroughExtension,
  tableExtension,
  underlineExtension,
} from '@lexkit/editor'

interface GetExtensionProps {
  placeholder?: string
}

export function getExtension({ placeholder = 'Start writing...' }: GetExtensionProps) {
  const extensions = [
    richTextExtension.configure({
      placeholder,
      dir: 'ltr',
      classNames: {
        contentEditable: 'min-h-[200px] p-3 outline-none text-sm leading-relaxed text-left',
        placeholder: 'p-3 text-sm text-muted-foreground/50 pointer-events-none select-none italic',
      },
    }),
    boldExtension,
    italicExtension,
    underlineExtension,
    strikethroughExtension,
    linkExtension.configure({
      linkSelectedTextOnPaste: true,
      autoLinkText: true,
      autoLinkUrls: true,
    }),
    horizontalRuleExtension,
    tableExtension,
    listExtension,
    historyExtension,
    blockFormatExtension,
    codeExtension,
  ] as const

  return extensions
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const extensions = getExtension({})

export const { Provider, useEditor } = createEditorSystem<typeof extensions>()
