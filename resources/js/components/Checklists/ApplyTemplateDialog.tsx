import { useState } from 'react'
import { router } from '@inertiajs/react'
import { Button } from '@/components/ui/button'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ListChecks } from 'lucide-react'

interface Template {
  id: number
  name: string
  description: string | null
  item_count: number
}

interface ApplyTemplateDialogProps {
  bookingId: number
  templates: Template[]
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ApplyTemplateDialog({
  bookingId,
  templates,
  open,
  onOpenChange,
}: ApplyTemplateDialogProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  function handleSubmit() {
    if (!selectedTemplate) return

    setIsSubmitting(true)
    router.post(`/provider/bookings/${bookingId}/checklist`, {
      template_id: selectedTemplate === 'empty' ? null : selectedTemplate,
    }, {
      preserveScroll: true,
      onSuccess: () => {
        setSelectedTemplate('')
        onOpenChange(false)
      },
      onFinish: () => setIsSubmitting(false),
    })
  }

  function handleClose() {
    setSelectedTemplate('')
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Create Checklist</DialogTitle>
          <DialogDescription>
            Start with an empty checklist or use a template.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <RadioGroup value={selectedTemplate} onValueChange={setSelectedTemplate}>
            {/* Empty checklist option */}
            <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50 cursor-pointer">
              <RadioGroupItem value="empty" id="empty" />
              <Label htmlFor="empty" className="flex-1 cursor-pointer">
                <div className="font-medium">Empty Checklist</div>
                <div className="text-sm text-muted-foreground">
                  Start fresh and add items manually
                </div>
              </Label>
            </div>

            {/* Template options */}
            {templates.map((template) => (
              <div
                key={template.id}
                className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50 cursor-pointer"
              >
                <RadioGroupItem value={String(template.id)} id={`template-${template.id}`} />
                <Label htmlFor={`template-${template.id}`} className="flex-1 cursor-pointer">
                  <div className="flex items-center gap-2">
                    <ListChecks className="h-4 w-4 text-primary" />
                    <span className="font-medium">{template.name}</span>
                    <span className="text-xs text-muted-foreground">
                      ({template.item_count} items)
                    </span>
                  </div>
                  {template.description && (
                    <div className="text-sm text-muted-foreground mt-1">
                      {template.description}
                    </div>
                  )}
                </Label>
              </div>
            ))}

            {templates.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">
                No templates available. You can create templates in the Checklists section.
              </p>
            )}
          </RadioGroup>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!selectedTemplate || isSubmitting}
          >
            {isSubmitting ? 'Creating...' : 'Create Checklist'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
