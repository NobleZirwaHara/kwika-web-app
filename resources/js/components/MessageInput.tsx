import { useState, useRef, KeyboardEvent } from 'react'
import { Button } from './ui/button'
import { Textarea } from './ui/textarea'
import { Send, Paperclip, X, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useFileUpload } from '@/hooks/useFileUpload'

interface MessageInputProps {
  conversationId: number
  onSendMessage: (content: string) => Promise<void>
  onTyping?: () => void
  disabled?: boolean
  placeholder?: string
}

export function MessageInput({
  conversationId,
  onSendMessage,
  onTyping,
  disabled = false,
  placeholder = 'Type a message...',
}: MessageInputProps) {
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const {
    uploading,
    progress,
    uploadFile,
    validateFile,
    getFilePreview,
    formatFileSize,
    isImage,
  } = useFileUpload(conversationId)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const validation = validateFile(file)
    if (!validation.valid) {
      alert(validation.error)
      return
    }

    setSelectedFile(file)
  }

  const handleRemoveFile = () => {
    setSelectedFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleSend = async () => {
    if (!message.trim() && !selectedFile) return
    if (sending || uploading) return

    try {
      setSending(true)

      // Upload file if selected
      if (selectedFile) {
        await uploadFile(selectedFile, message.trim() || undefined)
        handleRemoveFile()
        setMessage('')
      } else {
        // Send text message
        await onSendMessage(message.trim())
        setMessage('')
      }

      // Focus back on textarea
      textareaRef.current?.focus()
    } catch (error) {
      console.error('Failed to send message:', error)
    } finally {
      setSending(false)
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleChange = (value: string) => {
    setMessage(value)
    onTyping?.()
  }

  const isProcessing = sending || uploading
  const canSend = (message.trim() || selectedFile) && !isProcessing && !disabled

  return (
    <div className="border-t border-border bg-background p-4">
      {/* File preview */}
      {selectedFile && (
        <div className="mb-3 p-3 bg-muted rounded-lg">
          <div className="flex items-center gap-3">
            {isImage(selectedFile.type) && (
              <img
                src={getFilePreview(selectedFile)}
                alt="Preview"
                className="w-16 h-16 object-cover rounded"
              />
            )}
            <div className="flex-1 min-w-0">
              <div className="font-medium text-sm truncate">{selectedFile.name}</div>
              <div className="text-xs text-muted-foreground">
                {formatFileSize(selectedFile.size)}
              </div>
              {progress && (
                <div className="mt-2">
                  <div className="w-full bg-secondary rounded-full h-1.5">
                    <div
                      className="bg-primary h-1.5 rounded-full transition-all"
                      style={{ width: `${progress.percentage}%` }}
                    />
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Uploading... {progress.percentage}%
                  </div>
                </div>
              )}
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={handleRemoveFile}
              disabled={uploading}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Input area */}
      <div className="flex items-end gap-2">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/gif,application/pdf"
          className="hidden"
          onChange={handleFileSelect}
          disabled={disabled || isProcessing}
        />

        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled || isProcessing}
          className="flex-shrink-0"
        >
          <Paperclip className="w-5 h-5" />
        </Button>

        <Textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => handleChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled || isProcessing}
          className={cn(
            'min-h-[44px] max-h-32 resize-none',
            'focus-visible:ring-1 focus-visible:ring-primary'
          )}
          rows={1}
        />

        <Button
          type="button"
          onClick={handleSend}
          disabled={!canSend}
          size="icon"
          className="flex-shrink-0"
        >
          {isProcessing ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Send className="w-5 h-5" />
          )}
        </Button>
      </div>

      {/* Formatting hint */}
      <div className="text-xs text-muted-foreground mt-2">
        Use *bold*, _italic_, ~strikethrough~. Press Enter to send, Shift+Enter for new line.
      </div>
    </div>
  )
}
