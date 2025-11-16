import imageCompression from 'browser-image-compression'

export type ImageType = 'logo' | 'cover' | 'gallery' | 'product' | 'service' | 'portfolio'

interface ImageDimensions {
  maxWidth: number
  maxHeight: number
}

/**
 * Get optimal dimensions for different image types
 */
function getImageDimensions(type: ImageType): ImageDimensions {
  switch (type) {
    case 'logo':
      return { maxWidth: 400, maxHeight: 400 }
    case 'cover':
      return { maxWidth: 1920, maxHeight: 600 }
    case 'gallery':
    case 'portfolio':
      return { maxWidth: 1200, maxHeight: 1200 }
    case 'product':
    case 'service':
      return { maxWidth: 800, maxHeight: 800 }
    default:
      return { maxWidth: 800, maxHeight: 800 }
  }
}

/**
 * Resize a single image file
 * @param file - The image file to resize
 * @param type - The type of image (logo, cover, gallery, etc.)
 * @param maxSizeMB - Maximum file size in MB (default: 2)
 * @returns Promise<File> - Resized image file
 */
export async function resizeImage(
  file: File,
  type: ImageType,
  maxSizeMB: number = 2
): Promise<File> {
  const dimensions = getImageDimensions(type)

  const options = {
    maxSizeMB,
    maxWidthOrHeight: Math.max(dimensions.maxWidth, dimensions.maxHeight),
    useWebWorker: true,
    fileType: file.type as 'image/jpeg' | 'image/png' | 'image/webp',
    initialQuality: 0.9,
  }

  try {
    const compressedFile = await imageCompression(file, options)

    // Return a new File object with the same name
    return new File([compressedFile], file.name, {
      type: file.type,
      lastModified: Date.now(),
    })
  } catch (error) {
    console.error('Error resizing image:', error)
    // If compression fails, return the original file
    return file
  }
}

/**
 * Resize multiple image files
 * @param files - Array of image files to resize
 * @param type - The type of images
 * @param maxSizeMB - Maximum file size in MB per image
 * @returns Promise<File[]> - Array of resized image files
 */
export async function resizeImages(
  files: File[],
  type: ImageType,
  maxSizeMB: number = 2
): Promise<File[]> {
  const resizePromises = files.map(file => resizeImage(file, type, maxSizeMB))
  return Promise.all(resizePromises)
}

/**
 * Create a data URL preview from a file
 * @param file - The image file
 * @returns Promise<string> - Data URL for preview
 */
export function createImagePreview(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => {
      resolve(reader.result as string)
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

/**
 * Validate image file type
 * @param file - The file to validate
 * @returns boolean - True if file is a valid image
 */
export function isValidImageType(file: File): boolean {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
  return validTypes.includes(file.type)
}

/**
 * Validate image file size
 * @param file - The file to validate
 * @param maxSizeMB - Maximum size in MB
 * @returns boolean - True if file size is within limit
 */
export function isValidImageSize(file: File, maxSizeMB: number = 5): boolean {
  const maxSizeBytes = maxSizeMB * 1024 * 1024
  return file.size <= maxSizeBytes
}

/**
 * Format file size for display
 * @param bytes - File size in bytes
 * @returns string - Formatted file size
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

/**
 * Convert a Blob to a File object
 * @param blob - The blob to convert
 * @param fileName - The name for the file
 * @param fileType - The MIME type
 * @returns File - The created file
 */
export function blobToFile(blob: Blob, fileName: string, fileType: string = 'image/jpeg'): File {
  return new File([blob], fileName, {
    type: fileType,
    lastModified: Date.now(),
  })
}

/**
 * Process an image with cropping and resizing
 * @param croppedBlob - The cropped image blob from the cropper
 * @param fileName - Original file name
 * @param type - Image type for sizing
 * @param maxSizeMB - Maximum file size
 * @returns Promise<File> - Processed and resized image file
 */
export async function processCroppedImage(
  croppedBlob: Blob,
  fileName: string,
  type: ImageType,
  maxSizeMB: number = 2
): Promise<File> {
  // Convert blob to file
  const file = blobToFile(croppedBlob, fileName)

  // Resize the cropped image
  return resizeImage(file, type, maxSizeMB)
}
