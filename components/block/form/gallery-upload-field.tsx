'use client'

import {
  IconAlertTriangle,
  IconPhoto,
  IconTrash,
  IconUpload,
  IconX,
  IconZoomIn,
} from '@tabler/icons-react'
import { useSelector } from '@tanstack/react-form'
import Image from 'next/image'
import { useState } from 'react'

import { Alert, AlertContent, AlertDescription, AlertIcon, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Field, FieldError } from '@/components/ui/field'
import { useFieldContext } from '@/hooks/form-context'
import {
  type FileMetadata,
  type FileWithPreview,
  formatBytes,
  useFileUpload,
} from '@/hooks/use-file-upload'
import { cn } from '@/lib/utils'

interface GalleryUploadFieldProps {
  label?: string
  minFiles?: number
  maxFiles?: number
  maxSize?: number
  accept?: string
  multiple?: boolean
  className?: string
  onFilesChange?: (files: FileWithPreview[]) => void
  defaultFiles?: FileMetadata[]
}

export default function GalleryUploadField({
  label,
  maxFiles = 3,
  maxSize = 5 * 1024 * 1024, // 5MB
  accept = 'image/*',
  multiple = true,
  className,
  onFilesChange,
  defaultFiles,
}: GalleryUploadFieldProps) {
  const field = useFieldContext<string>()
  const formErrors = useSelector(field.store, (state) => state.meta.errors)

  const isInvalid = !!formErrors?.length

  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  const [
    { files, isDragging, errors },
    {
      removeFile,
      clearFiles,
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
      openFileDialog,
      getInputProps,
    },
  ] = useFileUpload({
    maxFiles,
    maxSize,
    accept,
    multiple,
    initialFiles: defaultFiles || [],
    onFilesChange,
  })

  const isImage = (file: File | FileMetadata) => {
    const type = file instanceof File ? file.type : file.type
    return type.startsWith('image/')
  }

  const errorsUpload = Array.from(new Set(errors))

  return (
    <Field data-invalid={isInvalid}>
      <div className={cn('w-full max-w-4xl', className)}>
        {/* Upload Area */}
        <div
          className={cn(
            'relative rounded-lg border border-dashed p-8 text-center transition-colors',
            isInvalid
              ? 'border-destructive bg-destructive/5'
              : isDragging
                ? 'border-primary bg-primary/5'
                : 'border-muted-foreground/25 hover:border-muted-foreground/50'
          )}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <input {...getInputProps()} className="sr-only" />

          <div className="flex flex-col items-center gap-4">
            <div
              className={cn(
                'flex h-16 w-16 items-center justify-center rounded-full',
                isInvalid ? 'bg-destructive/10' : isDragging ? 'bg-primary/10' : 'bg-muted'
              )}
            >
              <IconPhoto
                className={cn(
                  'h-5 w-5',
                  isInvalid
                    ? 'text-destructive'
                    : isDragging
                      ? 'text-primary'
                      : 'text-muted-foreground'
                )}
              />
            </div>

            <div className="space-y-2">
              <h3 className={cn('text-lg font-semibold', isInvalid && 'text-destructive')}>
                {label || 'Upload Images'}
              </h3>
              <p
                className={cn('text-sm', isInvalid ? 'text-destructive' : 'text-muted-foreground')}
              >
                Drag and drop images here or click to browse
              </p>
              <p
                className={cn(
                  'text-xs',
                  isInvalid ? 'text-destructive/80' : 'text-muted-foreground'
                )}
              >
                Max size: {formatBytes(maxSize)}, Max files: {maxFiles}
              </p>
            </div>

            <Button
              onClick={openFileDialog}
              type="button"
              variant="outline"
              className="border-primary text-primary rounded-lg"
            >
              <IconUpload className="text-primary h-4 w-4" />
              Select Images
            </Button>
          </div>
        </div>

        {/* Gallery Stats */}
        {files.length > 0 && (
          <div className="mt-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h4 className="text-sm font-medium">
                Gallery: {files.length}/{maxFiles}
              </h4>
              <div className="text-muted-foreground text-xs">
                Total: {formatBytes(files.reduce((acc, file) => acc + file.file.size, 0))}
              </div>
            </div>
            <Button onClick={clearFiles} type="button" variant="destructive" appearance="ghost">
              <IconTrash />
              <span>Clear All</span>
            </Button>
          </div>
        )}

        {/* Image Grid */}
        {files.length > 0 && (
          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {files.map((fileItem) => (
              <div key={fileItem.id} className="group relative aspect-square">
                {isImage(fileItem.file) && fileItem.preview ? (
                  <Image
                    src={fileItem.preview}
                    alt={fileItem.file.name}
                    width={800}
                    height={800}
                    className="h-full w-full rounded-lg border object-cover transition-transform group-hover:scale-105"
                  />
                ) : (
                  <div className="bg-muted flex h-full w-full items-center justify-center rounded-lg border">
                    <IconPhoto className="text-muted-foreground h-8 w-8" />
                  </div>
                )}

                {/* Overlay */}
                <div className="absolute inset-0 flex items-center justify-center gap-2 rounded-lg bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                  {/* View Button */}
                  {fileItem.preview && (
                    <Button
                      onClick={() => setSelectedImage(fileItem.preview!)}
                      variant="secondary"
                      size="icon"
                      className="size-7"
                      type="button"
                    >
                      <IconZoomIn className="opacity-100/80" />
                    </Button>
                  )}

                  {/* Remove Button */}
                  <Button
                    onClick={() => removeFile(fileItem.id)}
                    variant="secondary"
                    size="icon"
                    className="size-7"
                    type="button"
                  >
                    <IconX className="opacity-100/80" />
                  </Button>
                </div>

                {/* File Info */}
                <div className="absolute right-0 bottom-0 left-0 rounded-b-lg bg-black/70 p-2 text-white opacity-0 transition-opacity group-hover:opacity-100">
                  <p className="truncate text-xs font-medium">{fileItem.file.name}</p>
                  <p className="text-xs text-gray-300">{formatBytes(fileItem.file.size)}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error Messages */}
        {errorsUpload.length > 0 && (
          <Alert variant="destructive" appearance="light" className="mt-5">
            <AlertIcon>
              <IconAlertTriangle />
            </AlertIcon>
            <AlertContent>
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                {errorsUpload.map((error, index) => (
                  <p key={index} className="last:mb-0">
                    {error}
                  </p>
                ))}
              </AlertDescription>
            </AlertContent>
          </Alert>
        )}

        {isInvalid && (
          <div className="mt-4">
            <FieldError errors={field.state.meta.errors} />
          </div>
        )}

        {/* Image Preview Modal */}
        {selectedImage && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm transition-all duration-300"
            onClick={() => setSelectedImage(null)}
          >
            <div className="relative max-h-full max-w-full">
              <Image
                src={selectedImage}
                alt="Preview"
                width={800}
                height={800}
                className="max-h-full max-w-full rounded-lg object-contain"
                onClick={(e) => e.stopPropagation()}
              />
              <Button
                onClick={() => setSelectedImage(null)}
                variant="secondary"
                size="icon"
                className="absolute inset-e-2 top-2 size-7 p-0"
                type="button"
              >
                <IconX className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </Field>
  )
}
