import { Button } from "@/Components/ui/button"
import { motion } from "framer-motion"
import { Gift, Wallet, Trophy, Tag, Percent } from "lucide-react"

// Sticker badge component with scalloped edge effect
function StickerBadge({ children, className = "", rotate = 0 }: { children: React.ReactNode; className?: string; rotate?: number }) {
  return (
    <div
      className={`relative ${className}`}
      style={{ transform: `rotate(${rotate}deg)` }}
    >
      {/* Scalloped badge background */}
      <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full">
        <path
          d="M50 2 L54 10 L62 4 L63 14 L73 11 L71 21 L81 21 L76 30 L86 33 L79 40 L88 46 L79 51 L86 58 L76 61 L81 70 L71 70 L73 80 L63 77 L62 87 L54 81 L50 89 L46 81 L38 87 L37 77 L27 80 L29 70 L19 70 L24 61 L14 58 L21 51 L12 46 L21 40 L14 33 L24 30 L19 21 L29 21 L27 11 L37 14 L38 4 L46 10 Z"
          fill="white"
          stroke="#1a1a1a"
          strokeWidth="2"
        />
      </svg>
      {/* Icon content */}
      <div className="relative z-10 w-full h-full flex items-center justify-center">
        {children}
      </div>
    </div>
  )
}

// Rounded sticker for variety
function RoundedSticker({ children, className = "", rotate = 0 }: { children: React.ReactNode; className?: string; rotate?: number }) {
  return (
    <div
      className={`bg-white border-2 border-gray-900 rounded-2xl p-3 shadow-lg ${className}`}
      style={{ transform: `rotate(${rotate}deg)` }}
    >
      {children}
    </div>
  )
}

export function KwikaRewards() {
  return (
    <section className="py-12 lg:py-16">
      <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#f0fdf4] to-[#dcfce7] p-8 lg:p-12 min-h-[400px] lg:min-h-[450px]">
          {/* Floating Sticker Icons */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">

            {/* Top left - Trophy */}
            <motion.div
              className="absolute top-6 left-6 lg:top-8 lg:left-12"
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <StickerBadge className="w-16 h-16 lg:w-20 lg:h-20" rotate={-10}>
                <Trophy className="w-7 h-7 lg:w-9 lg:h-9 text-[#166534]" />
              </StickerBadge>
            </motion.div>

            {/* Left side - Money/Wallet stack */}
            <motion.div
              className="absolute top-1/2 -translate-y-1/2 left-2 lg:left-6"
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            >
              <StickerBadge className="w-14 h-14 lg:w-18 lg:h-18" rotate={-15}>
                <Wallet className="w-6 h-6 lg:w-8 lg:h-8 text-[#166534]" />
              </StickerBadge>
            </motion.div>

            {/* Bottom left - Percent badge */}
            <motion.div
              className="absolute bottom-6 left-8 lg:bottom-10 lg:left-16"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            >
              <StickerBadge className="w-14 h-14 lg:w-16 lg:h-16" rotate={8}>
                <Percent className="w-5 h-5 lg:w-7 lg:h-7 text-[#166534]" />
              </StickerBadge>
            </motion.div>

            {/* Above phone - Tag */}
            <motion.div
              className="absolute top-4 left-[25%] lg:left-[22%]"
              animate={{ y: [0, 6, 0], rotate: [12, 8, 12] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
            >
              <RoundedSticker rotate={12}>
                <Tag className="w-6 h-6 lg:w-7 lg:h-7 text-[#166534]" />
              </RoundedSticker>
            </motion.div>

            {/* Center top - Gift wallet */}
            <motion.div
              className="absolute top-8 left-[42%] lg:left-[38%] hidden md:block"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
            >
              <StickerBadge className="w-16 h-16 lg:w-20 lg:h-20" rotate={5}>
                <Gift className="w-7 h-7 lg:w-8 lg:h-8 text-[#166534]" />
              </StickerBadge>
            </motion.div>

            {/* Right of phone - Wallet */}
            <motion.div
              className="absolute top-[35%] left-[48%] lg:left-[45%] hidden md:block"
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
            >
              <RoundedSticker rotate={-8}>
                <Wallet className="w-6 h-6 lg:w-7 lg:h-7 text-[#166534]" />
              </RoundedSticker>
            </motion.div>

            {/* Bottom center - Tag */}
            <motion.div
              className="absolute bottom-8 left-[35%] lg:left-[32%] hidden md:block"
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
            >
              <StickerBadge className="w-14 h-14 lg:w-16 lg:h-16" rotate={-5}>
                <Tag className="w-5 h-5 lg:w-6 lg:h-6 text-[#166534]" />
              </StickerBadge>
            </motion.div>

            {/* Far right - Percent */}
            <motion.div
              className="absolute bottom-12 left-[52%] lg:left-[50%] hidden lg:block"
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
            >
              <StickerBadge className="w-16 h-16" rotate={10}>
                <Percent className="w-6 h-6 text-[#166534]" />
              </StickerBadge>
            </motion.div>

          </div>

          {/* Content */}
          <div className="relative z-10 flex flex-col lg:flex-row items-center lg:items-center gap-8 lg:gap-12 h-full">
            {/* Phone Mockup and Icons - Left Side (60%) */}
            <div className="flex-shrink-0 w-full lg:w-3/5 flex justify-center order-1 lg:order-1" style={{ perspective: '1000px' }}>
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="relative w-64 lg:w-72"
                style={{ 
                  transform: 'rotateY(-15deg) rotateX(5deg)',
                  transformStyle: 'preserve-3d'
                }}
              >
                {/* Phone frame */}
                <div className="relative bg-gray-900 rounded-[2.5rem] p-1.5 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.4)]" style={{ transform: 'translateZ(20px)' }}>
                  <div className="bg-white rounded-[2rem] overflow-hidden">
                    {/* Phone screen content */}
                    <div className="aspect-[9/17] bg-white">
                      {/* Status bar mockup */}
                      <div className="flex justify-between items-center text-[10px] text-gray-500 px-4 pt-2">
                        <span>9:41</span>
                        <div className="flex gap-1">
                          <div className="w-4 h-2 bg-gray-400 rounded-sm"></div>
                        </div>
                      </div>

                      {/* App content mockup */}
                      <div className="p-3 space-y-2">
                        {/* Welcome offer banner */}
                        <div className="bg-[#84cc16]/15 rounded-lg p-2">
                          <p className="text-[#166534] font-bold text-[10px]">MWK 5,000 Welcome Offer</p>
                          <p className="text-gray-500 text-[8px]">Applies to Services</p>
                        </div>

                        {/* Service card */}
                        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
                          <img
                            src="/resized-win/wedding-photo-1.jpg"
                            alt="Service preview"
                            className="w-full h-20 object-cover"
                          />
                          <div className="p-2">
                            <p className="font-bold text-[10px] text-gray-900">Premium Photography</p>
                            <p className="text-[8px] text-gray-500">Lilongwe</p>
                          </div>
                        </div>

                        {/* Rewards indicator */}
                        <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-2">
                          <div className="w-5 h-5 bg-[#84cc16] rounded-full flex items-center justify-center">
                            <Gift className="w-2.5 h-2.5 text-white" />
                          </div>
                          <div>
                            <p className="text-[8px] text-gray-600">Your Rewards</p>
                            <p className="text-[10px] font-bold text-[#166534]">2,500 Points</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Notch */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-5 bg-gray-900 rounded-b-xl"></div>
                </div>
              </motion.div>
            </div>

            {/* Text Content - Right Side (40%) */}
            <motion.div
              initial={{ x: 30, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="w-full lg:w-2/5 text-center lg:text-left order-2 lg:order-2"
            >
              {/* Badge */}
              <div className="flex items-center justify-center lg:justify-start gap-2 mb-3">
                <Gift className="w-5 h-5 text-gray-900" />
                <span className="font-bold text-sm text-gray-900">Rewards</span>
              </div>

              {/* Heading */}
              <h2 className="text-5xl md:text-6xl lg:text-7xl font-black text-gray-900 mb-4 leading-[1.05] tracking-tight">
                Introducing<br />
                Kwika<br />
                Rewards
              </h2>

              {/* Description */}
              <p className="text-base lg:text-lg text-gray-800 mb-6 mx-auto lg:mx-0 max-w-sm">
                It pays to plan, book, and share.<br />
                Join now for MWK 5,000 off your first booking.
              </p>

              {/* CTA Button */}
              <div className="flex justify-center lg:justify-start">
                <Button
                  size="lg"
                  className="bg-gray-900 hover:bg-gray-800 text-white rounded-full px-8 py-6 text-base font-semibold"
                >
                  Learn more
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
