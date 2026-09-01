'use client'

import { UploadCloud, X } from 'lucide-react'
import { useRef, useState } from 'react'

import { Button } from '@/components/ui/button'
import { services } from '@/lib/api/services'

interface SelectedFile {
  name: string
  size: number
  type: string
  preview: string | null
}

const formatSize = (size: number) => {
  if (size < 1024) return `${size} B`
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`
  return `${(size / (1024 * 1024)).toFixed(1)} MB`
}

export function MediaUpload() {
  const [files, setFiles] = useState<SelectedFile[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const addFiles = (list: FileList | null) => {
    if (!list) return
    const next = Array.from(list).map((file) => ({
      name: file.name,
      size: file.size,
      type: file.type,
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null,
    }))
    setFiles((prev) => [...prev, ...next])
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (files.length === 0) return
    setIsSubmitting(true)
    try {
      for (const file of files) {
        await services.media.store({ name: file.name, type: file.type, size: file.size })
      }
      alert(`Uploaded ${files.length} file(s) successfully.`)
      setFiles([])
    } catch {
      alert('Upload failed. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex max-w-xl flex-col gap-6">
      <div
        className={`flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-10 text-center transition-colors ${
          isDragging ? 'border-primary bg-primary/5' : 'border-border'
        }`}
        onDragOver={(e) => {
          e.preventDefault()
          setIsDragging(true)
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault()
          setIsDragging(false)
          addFiles(e.dataTransfer.files)
        }}
      >
        <UploadCloud className="text-muted-foreground size-8" />
        <p className="text-sm font-medium">Drag &amp; drop files here</p>
        <p className="text-muted-foreground text-xs">or click the button below to browse</p>
        <input
          ref={inputRef}
          type="file"
          multiple
          className="hidden"
          onChange={(e) => addFiles(e.target.files)}
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => inputRef.current?.click()}
        >
          Browse files
        </Button>
      </div>

      {files.length > 0 && (
        <div className="flex flex-col gap-2">
          {files.map((file, index) => (
            <div key={index} className="flex items-center gap-3 rounded-md border p-3">
              {file.preview && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={file.preview}
                  alt={file.name}
                  className="size-10 shrink-0 rounded object-cover"
                />
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{file.name}</p>
                <p className="text-muted-foreground text-xs">{formatSize(file.size)}</p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setFiles((prev) => prev.filter((_, i) => i !== index))}
              >
                <X className="size-4" />
                <span className="sr-only">Remove {file.name}</span>
              </Button>
            </div>
          ))}
        </div>
      )}

      <div>
        <Button type="submit" disabled={files.length === 0 || isSubmitting}>
          {isSubmitting ? 'Uploading...' : 'Upload files'}
        </Button>
      </div>
    </form>
  )
}