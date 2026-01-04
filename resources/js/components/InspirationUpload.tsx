import { useState, useRef, useCallback } from 'react'
import { Upload, X, Image as ImageIcon, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface InspirationUploadProps {
  images: File[]
  onChange: (images: File[]) => void
  maxImages?: number
  maxSizeMB?: number
}

export function InspirationUpload({
  images,
  onChange,
  maxImages = 5,
  maxSizeMB = 5,
}: InspirationUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [previews, setPreviews] = useState<Map<File, string>>(new Map())

  const maxSizeBytes = maxSizeMB * 1024 * 1024

  const validateFile = (file: File): string | null => {
    if (!file.type.startsWith('image/')) {
      return `${file.name} is not an image file`
    }
    if (file.size > maxSizeBytes) {
      return `${file.name} is too large (max ${maxSizeMB}MB)`
    }
    return null
  }

  const createPreview = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result as string)
      reader.readAsDataURL(file)
    })
  }

  const addFiles = useCallback(async (files: FileList | File[]) => {
    setError(null)
    const fileArray = Array.from(files)

    // Check max limit
    const availableSlots = maxImages - images.length
    if (availableSlots <= 0) {
      setError(`Maximum ${maxImages} images allowed`)
      return
    }

    const filesToAdd = fileArray.slice(0, availableSlots)
    const errors: string[] = []

    // Validate files
    const validFiles: File[] = []
    for (const file of filesToAdd) {
      const validationError = validateFile(file)
      if (validationError) {
        errors.push(validationError)
      } else {
        validFiles.push(file)
      }
    }

    if (errors.length > 0) {
      setError(errors.join(', '))
    }

    if (validFiles.length > 0) {
      // Create previews for new files
      const newPreviews = new Map(previews)
      for (const file of validFiles) {
        const preview = await createPreview(file)
        newPreviews.set(file, preview)
      }
      setPreviews(newPreviews)
      onChange([...images, ...validFiles])
    }
  }, [images, maxImages, maxSizeBytes, onChange, previews])

  const removeImage = (index: number) => {
    const fileToRemove = images[index]
    const newPreviews = new Map(previews)
    newPreviews.delete(fileToRemove)
    setPreviews(newPreviews)

    const newImages = [...images]
    newImages.splice(index, 1)
    onChange(newImages)
    setError(null)
  }

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      addFiles(e.dataTransfer.files)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      addFiles(e.target.files)
    }
    // Reset input so same file can be selected again
    e.target.value = ''
  }

  const openFileDialog = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="space-y-4">
      {/* Drop Zone */}
      <div
        onClick={openFileDialog}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={cn(
          "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all",
          isDragging
            ? "border-primary bg-primary/5"
            : "border-gray-300 hover:border-primary/50 hover:bg-gray-50",
          images.length >= maxImages && "opacity-50 cursor-not-allowed"
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/jpeg,image/png,image/gif,image/webp"
          onChange={handleFileSelect}
          className="hidden"
          disabled={images.length >= maxImages}
        />

        <div className="flex flex-col items-center gap-2">
          <div className={cn(
            "w-12 h-12 rounded-full flex items-center justify-center",
            isDragging ? "bg-primary/10" : "bg-gray-100"
          )}>
            <Upload className={cn(
              "h-6 w-6",
              isDragging ? "text-primary" : "text-gray-400"
            )} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700">
              {isDragging ? 'Drop your images here' : 'Drop inspiration photos here'}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              or click to browse (max {maxImages} images, {maxSizeMB}MB each)
            </p>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-lg">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Image Previews */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {images.map((file, index) => (
            <div
              key={`${file.name}-${index}`}
              className="relative group aspect-square rounded-lg overflow-hidden bg-gray-100 border"
            >
              {previews.get(file) ? (
                <img
                  src={previews.get(file)}
                  alt={`Inspiration ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ImageIcon className="h-8 w-8 text-gray-300" />
                </div>
              )}

              {/* Remove Button */}
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                title="Remove image"
              >
                <X className="h-4 w-4" />
              </button>

              {/* File name overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-1.5 truncate">
                {file.name}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Counter */}
      {images.length > 0 && (
        <p className="text-xs text-gray-500 text-right">
          {images.length} of {maxImages} images selected
        </p>
      )}
    </div>
  )
}
