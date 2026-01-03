import { FileText, Download, Image as ImageIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FileAttachmentProps {
  fileUrl: string
  fileName: string
  fileType: string
  fileSize: number
  className?: string
}

export function FileAttachment({
  fileUrl,
  fileName,
  fileType,
  fileSize,
  className,
}: FileAttachmentProps) {
  const isImage = fileType.startsWith('image/')

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
  }

  if (isImage) {
    return (
      <div className={cn('mb-2', className)}>
        <a
          href={fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block rounded-lg overflow-hidden hover:opacity-90 transition-opacity"
        >
          <img
            src={fileUrl}
            alt={fileName}
            className="max-w-full h-auto max-h-64 object-cover rounded-lg"
          />
        </a>
        <div className="text-xs opacity-70 mt-1">{fileName}</div>
      </div>
    )
  }

  return (
    <div className={cn('mb-2', className)}>
      <a
        href={fileUrl}
        target="_blank"
        rel="noopener noreferrer"
        download
        className="flex items-center gap-3 p-3 bg-background/10 hover:bg-background/20 rounded-lg transition-colors border border-border/20"
      >
        <div className="flex-shrink-0">
          {fileType === 'application/pdf' ? (
            <FileText className="w-8 h-8" />
          ) : (
            <ImageIcon className="w-8 h-8" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-medium text-sm truncate">{fileName}</div>
          <div className="text-xs opacity-70">{formatFileSize(fileSize)}</div>
        </div>
        <Download className="w-5 h-5 flex-shrink-0" />
      </a>
    </div>
  )
}
