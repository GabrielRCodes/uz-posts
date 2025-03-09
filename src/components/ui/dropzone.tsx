"use client"

import { useDropzone } from "react-dropzone"
import { FiUploadCloud, FiX } from "react-icons/fi"
import Image from "next/image"
import { Button } from "./button"

interface DropzoneProps {
  onDrop: (files: File[]) => void
  error?: string
  value?: File[]
  onChange?: (files: File[]) => void
}

export function Dropzone({ onDrop, error, value, onChange }: DropzoneProps) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (files) => {
      onDrop(files)
      onChange?.(files)
    },
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".gif"],
    },
    maxFiles: 1,
  })

  const handleRemove = () => {
    onChange?.([])
  }

  if (value?.[0]) {
    return (
      <div className="relative rounded-lg border border-border p-2">
        <div className="relative aspect-video w-full overflow-hidden rounded-lg">
          <Image
            src={URL.createObjectURL(value[0])}
            alt="Preview"
            fill
            className="object-cover"
          />
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="absolute -right-2 -top-2 h-8 w-8 rounded-full p-0"
          onClick={handleRemove}
        >
          <FiX className="h-4 w-4" />
        </Button>
      </div>
    )
  }

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-lg p-6 cursor-pointer text-center transition-colors
        ${isDragActive ? "border-primary bg-primary/5" : error ? "border-destructive" : "border-border"}
      `}
    >
      <input {...getInputProps()} />
      <FiUploadCloud className="w-10 h-10 mx-auto text-muted-foreground" />
      {isDragActive ? (
        <p className="mt-2 text-primary">Solte a imagem aqui...</p>
      ) : (
        <div className="mt-2 text-muted-foreground">
          <p>Arraste e solte uma imagem aqui, ou clique para selecionar</p>
          <p className="text-sm">PNG, JPG ou GIF (max. 10MB)</p>
        </div>
      )}
      {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
    </div>
  )
} 