interface ProviderCoverProps {
  coverImage?: string
  logo?: string
  name: string
}

export function ProviderCover({ coverImage, logo, name }: ProviderCoverProps) {
  return (
    <div className="container mx-auto px-6 lg:px-20">
      <div className="relative w-full">
        {/* Cover Image */}
        <div className="relative w-full h-[300px] md:h-[400px] lg:h-[450px] overflow-hidden rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20">
          {coverImage ? (
            <img
              src={coverImage}
              alt={`${name} cover`}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-muted-foreground text-lg">No cover image</span>
            </div>
          )}
          {/* Gradient overlay for better logo visibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        </div>

        {/* Logo positioned at bottom left */}
        <div className="absolute bottom-0 left-0">
          <div className="relative flex items-end pb-6 pl-6">
            <div className="relative">
              {/* Logo container with white background and shadow */}
              <div className="h-32 w-32 md:h-40 md:w-40 lg:h-44 lg:w-44 rounded-2xl bg-white shadow-2xl ring-4 ring-white overflow-hidden">
                {logo ? (
                  <img
                    src={logo}
                    alt={`${name} logo`}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center bg-primary/10">
                    <span className="text-4xl md:text-5xl font-bold text-primary">
                      {name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
