import { Link } from '@inertiajs/react'
import { Button } from './ui/button'
import { ExternalLink, ArrowRight } from 'lucide-react'

interface ActionButtonProps {
  label: string
  action: 'navigate' | 'external'
  url: string
}

export function ActionButton({ label, action, url }: ActionButtonProps) {
  if (action === 'external') {
    return (
      <Button
        asChild
        variant="secondary"
        size="sm"
        className="w-full justify-between group"
      >
        <a href={url} target="_blank" rel="noopener noreferrer">
          <span>{label}</span>
          <ExternalLink className="w-4 h-4 ml-2 group-hover:translate-x-0.5 transition-transform" />
        </a>
      </Button>
    )
  }

  return (
    <Button
      asChild
      variant="secondary"
      size="sm"
      className="w-full justify-between group"
    >
      <Link href={url}>
        <span>{label}</span>
        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-0.5 transition-transform" />
      </Link>
    </Button>
  )
}
