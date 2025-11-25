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
    <section className="py-16">
      <div className="container mx-auto">
        <div className="mx-auto max-w-6xl rounded-[48px] bg-accent px-6 py-12 text-accent-foreground shadow-2xl md:px-12 lg:px-16">
          <div className="flex flex-col items-stretch gap-10 md:flex-row md:items-center md:gap-12">
            <div className="flex-1 space-y-6 md:space-y-8">
              <div className="inline-flex items-center rounded-full bg-background/10 px-4 py-1 text-sm font-medium text-accent-foreground/90">
                {/* <span className="mr-2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                  {eyebrowLabel}
                </span> */}
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
            <div className="relative flex w-full flex-1 justify-center">
              <div className="absolute -left-6 top-4 hidden h-16 w-16 rounded-full bg-secondary/80 md:block" />
              <div className="absolute -right-4 bottom-6 hidden h-16 w-16 rounded-full bg-primary/80 md:block" />
              <div className="relative h-[220px] w-full max-w-md rotate-[-8deg] overflow-hidden rounded-[110px] border border-white/20 bg-background/20 shadow-xl sm:h-[240px] md:h-[280px] lg:h-[320px]">
                <img
                  src={imageSrc}
                  alt={imageAlt}
                  className="h-full w-full object-cover rotate-[8deg] scale-110"
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
