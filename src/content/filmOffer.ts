export const filmOffer = {
  shortTitle: 'Golden Wings',
  title: 'Golden Wings: Fifty Year Flight Path',
  director: 'Caleb Mills Stewart',
  hero: {
    eyebrow: 'A documentary short by Caleb Mills Stewart',
    headline: 'Fifty years in the cabin. A family history carried at altitude.',
    body:
      "Robyn Stewart joined American Airlines in 1971. Her gold wings carry the work of her father Jay R. Ricks, the routes she flew, the losses she survived, and the second chance she chose.",
    primaryCta: 'Send me the watch link',
    secondaryCta: 'Enter the screening room'
  },
  story: {
    heading: 'Robyn kept flying. The family story kept gathering altitude.',
    introduction:
      "Golden Wings follows Robyn from stewardess college to more than five decades at American Airlines. Her father Jay helped build the airline's 747 training program, and Jock Bethune remembers the people who made that rollout possible.",
    family:
      "The film stays close to the family inside that history. It includes Robyn's recovery, Henry Stewart's death during a Frankfurt layover, and Caleb's letter to the father he still carries with him.",
    waypoints: [
      { year: '1971', label: 'Robyn joins American Airlines' },
      { year: '747', label: "Jay R. Ricks's training work connects two careers" },
      { year: '50+', label: 'Gold wings and a life still in flight' }
    ]
  },
  preview: {
    eyebrow: 'In-flight preview',
    heading: 'Meet the people behind the wings.',
    embedUrl:
      'https://customer-e46l63ee4ck01nmz.cloudflarestream.com/a4ad2ae7bcf9a68035416570b045edfa/iframe'
  },
  offer: {
    eyebrow: 'Now boarding',
    heading: 'Get the watch link',
    body:
      'Leave your name and email. We will send the current screening link. When the download release opens, this is where the ownership offer will live.',
    submitLabel: 'Send my watch link',
    success: 'Your watch link is on its way.',
    error:
      'The link could not be sent. Try again or email info@golden-wings-robyn.com.',
    futureUrl: import.meta.env.VITE_FUTURE_OFFER_URL || ''
  },
  watch: {
    eyebrow: 'Private screening',
    heading: 'Access your screening',
    body: 'Enter your email and the screening room will open.',
    submitLabel: 'Open the screening room',
    embedUrl: 'https://www.youtube.com/embed/RzkdMRHRblU'
  },
  confirmation: {
    eyebrow: 'Access confirmed',
    heading: 'Check your email',
    body:
      'Your Golden Wings watch link is being sent. You can also continue straight to the screening room.'
  },
  awards: [
    {
      label: 'Best Short Documentary, Guadalajara',
      image: '/media/images/laurel-guadalajara.webp'
    },
    {
      label: 'Best Mobile Short, Independent Shorts Awards',
      image: '/media/images/laurel-mobile-short.webp'
    },
    {
      label: 'Best Short Cinematography, Silicon Beach',
      image: '/media/images/laurel-cinematography.webp'
    },
    {
      label: 'Finalist, Beyond Hollywood',
      image: '/media/images/laurel-finalist.webp'
    }
  ],
  assets: {
    hero: '/media/images/hero-worldport.webp',
    robynHeadshot: '/media/images/robyn-headshot.webp',
    robyn1971: '/media/images/robyn-1971.webp',
    poster: '/media/images/poster-2026.webp'
  },
  contactEmail: 'info@golden-wings-robyn.com',
  legal: {
    privacy: 'https://www.golden-wings-robyn.com/privacy-policy',
    terms: 'https://www.golden-wings-robyn.com/terms-of-use'
  }
} as const
