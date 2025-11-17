interface EventHighlightProps {
  eyebrowLabel?: string
  eyebrowText?: string
  title: string
  description: string
  details: {
    label: string
    value: string
  }[]
  ctaLabel: string
  imageSrc: string
  imageAlt: string
}

export function EventHighlight({
  eyebrowLabel = "Kwika",
  eyebrowText = "Event Spotlight",
  title,
  description,
  details,
  ctaLabel,
  imageSrc,
  imageAlt,
}: EventHighlightProps) {
  return (
    <section className="bg-accent text-accent-foreground">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-10 px-6 py-16 md:flex-row md:items-stretch md:gap-12 md:px-10 lg:py-20">
        <div className="flex-1 max-w-xl space-y-6 md:space-y-8">
          <div className="inline-flex items-center rounded-full bg-background/10 px-4 py-1 text-sm font-medium text-accent-foreground/90">
            <span className="mr-2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
              {eyebrowLabel}
            </span>
            <span>{eyebrowText}</span>
          </div>
          <h2 className="font-heading text-3xl font-semibold leading-tight tracking-tight md:text-4xl lg:text-5xl">
            {title}
          </h2>
          <p className="text-base text-accent-foreground/85 md:text-lg">
            {description}
          </p>
          <div className="space-y-3 rounded-3xl bg-background/10 p-6 text-sm text-accent-foreground/90">
            {details.map((detail) => (
              <div key={detail.label} className="flex items-center justify-between gap-4">
                <span className="font-semibold">{detail.label}</span>
                <span>{detail.value}</span>
              </div>
            ))}
          </div>
          <div>
            <button className="rounded-full bg-background px-6 py-3 text-sm font-semibold text-foreground shadow-sm transition hover:bg-background/90">
              {ctaLabel}
            </button>
          </div>
        </div>
        <div className="relative w-full max-w-xl flex-1 self-stretch">
          <div className="relative flex h-full min-h-[260px] items-center justify-center rounded-[72px] bg-background/10 px-6 py-6 md:px-8 md:py-8 lg:min-h-[320px]">
            <div className="absolute -left-10 top-10 h-20 w-20 rounded-full bg-secondary md:-left-14 md:h-28 md:w-28" />
            <div className="absolute -right-6 bottom-6 h-20 w-20 rounded-full bg-primary md:-right-10 md:h-28 md:w-28" />
            <div className="relative w-full max-w-lg">
              <div className="relative h-[240px] w-full rotate-[-12deg] overflow-hidden rounded-[140px] border border-white/20 bg-background/20 shadow-2xl md:h-[300px] lg:h-[340px]">
                <img
                  src={imageSrc}
                  alt={imageAlt}
                  className="h-full w-full object-cover rotate-[12deg] scale-110"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
