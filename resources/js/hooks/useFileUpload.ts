import { useState, useCallback } from 'react'
import axios from 'axios'

export interface UploadProgress {
  loaded: number
  total: number
  percentage: number
}

export function useFileUpload(conversationId: number | null) {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState<UploadProgress | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Validate file before upload
  const validateFile = useCallback((file: File): { valid: boolean; error?: string } => {
    const MAX_SIZE = 5 * 1024 * 1024 // 5MB
    const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf']

    if (file.size > MAX_SIZE) {
      return {
        valid: false,
        error: 'File size must be less than 5MB',
      }
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return {
        valid: false,
        error: 'Only images (JPEG, PNG, GIF) and PDF files are allowed',
      }
    }

    return { valid: true }
  }, [])

  // Upload file
  const uploadFile = useCallback(
    async (file: File, caption?: string) => {
      if (!conversationId) {
        throw new Error('No conversation selected')
      }

      // Validate file
      const validation = validateFile(file)
      if (!validation.valid) {
        setError(validation.error || 'Invalid file')
        throw new Error(validation.error)
      }

      try {
        setUploading(true)
        setError(null)
        setProgress(null)

        const formData = new FormData()
        formData.append('file', file)
        if (caption) {
          formData.append('caption', caption)
        }

        const response = await axios.post(
          `/api/conversations/${conversationId}/upload`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
            onUploadProgress: (progressEvent) => {
              if (progressEvent.total) {
                const percentage = Math.round(
                  (progressEvent.loaded * 100) / progressEvent.total
                )
                setProgress({
                  loaded: progressEvent.loaded,
                  total: progressEvent.total,
                  percentage,
                })
              }
            },
          }
        )

        setProgress(null)
        return response.data.message
      } catch (err: any) {
        console.error('File upload failed:', err)
        const errorMessage = err.response?.data?.message || 'Failed to upload file'
        setError(errorMessage)
        throw new Error(errorMessage)
      } finally {
        setUploading(false)
      }
    },
    [conversationId, validateFile]
  )

  // Get file preview URL
  const getFilePreview = useCallback((file: File): string => {
    return URL.createObjectURL(file)
  }, [])

  // Format file size
  const formatFileSize = useCallback((bytes: number): string => {
    if (bytes === 0) return '0 Bytes'

    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
  }, [])

  // Check if file is an image
  const isImage = useCallback((fileType: string): boolean => {
    return fileType.startsWith('image/')
  }, [])

  // Reset state
  const reset = useCallback(() => {
    setUploading(false)
    setProgress(null)
    setError(null)
  }, [])

  return {
    uploading,
    progress,
    error,
    uploadFile,
    validateFile,
    getFilePreview,
    formatFileSize,
    isImage,
    reset,
  }
}
