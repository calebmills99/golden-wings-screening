export type ScreeningState = 'open' | 'scheduled' | 'closed'

const configuredState = String(
  import.meta.env.VITE_SCREENING_STATE || 'open'
).toLowerCase()

export const screeningState: ScreeningState =
  configuredState === 'scheduled' || configuredState === 'closed'
    ? configuredState
    : 'open'

export const filmOffer = {
  shortTitle: 'Golden Wings',
  title: 'Golden Wings',
  director: 'Caleb Mills Stewart',
  screeningState,
  hero: {
    chip: '★ Best Documentary Short · Guadalajara 2024',
    tagline: 'Find Your Wings',
    meta:
      'A documentary short by Caleb Mills Stewart · 25 minutes · Free private screening',
    logline:
      "Robyn Stewart has flown for American Airlines since 1971. Her gold wings carry her father's 747 training program, the routes she flew, the losses she survived — and the second chance she chose.",
    primaryCta: 'Board the Midnight Rocket',
    ctaNote: 'Overnight service — your watch link lands by email',
    video: '/media/videos/clouds-aerial.mp4',
    videoPoster: '/media/videos/poster.jpg'
  },
  story: {
    eyebrow: 'Flight record',
    heading: 'Fifty-Five Years in the Cabin',
    kicker: 'Fifty-five years in the air. Twenty-five minutes in your seat.',
    introduction:
      "Golden Wings follows Robyn Stewart from stewardess college to fifty-five years with American Airlines. Her father, Jay R. Ricks, helped build the airline's 747 training program — Jock Bethune still remembers the people who made that rollout possible.",
    family:
      "The film stays close to the family inside the history: Robyn's recovery, Henry Stewart's death on a Frankfurt layover, and Caleb's letter to the father he still carries with him."
  },
  timeline: [
    {
      year: '1971',
      title: 'Robyn joins American Airlines',
      description:
        'From stewardess college to the cabin crew — the start of fifty-five years in flight.'
    },
    {
      year: '747',
      title: 'Two careers connect',
      description:
        "Her father, Jay R. Ricks, helps build American's 747 training program."
    },
    {
      year: 'Today',
      title: 'Still in flight',
      description:
        'Gold wings, a second chance, and a family story told at altitude.'
    }
  ],
  stats: [
    { value: '1971', label: 'Year Robyn joined' },
    { value: '55+', label: 'Years in the cabin' },
    { value: '25', label: 'Minutes in your seat' },
    { value: '4', label: 'Festival honors', sublabel: '2024 – 2025' }
  ],
  preview: {
    eyebrow: 'In-flight preview',
    heading: 'Meet the People Behind the Wings',
    kicker:
      'A first look at Robyn, the 747 connection, and the film waiting inside the screening room.',
    runtimeLine: 'Runtime — 25 minutes · Now showing',
    embedUrl:
      'https://customer-e46l63ee4ck01nmz.cloudflarestream.com/a4ad2ae7bcf9a68035416570b045edfa/iframe'
  },
  departures: {
    eyebrow: 'Flight record',
    heading: 'Festival Departures',
    kicker:
      'Where the film has flown — and the overnight seat still open on the board.',
    boardTitle: 'Golden Wings — Departures',
    boardSubtitle: '2024 – 2026',
    rows: [
      {
        time: '2024',
        destination: 'Guadalajara Film Awards',
        remark: 'Best Documentary Short',
        status: 'departed'
      },
      {
        time: '2024',
        destination: 'Independent Shorts Awards',
        remark: 'Best Mobile Short',
        status: 'departed'
      },
      {
        time: '2024',
        destination: 'Silicon Beach Film Festival',
        remark: 'Best Short Cinematography',
        status: 'departed'
      },
      {
        time: '2025',
        destination: "Beyond Hollywood Int'l",
        remark: 'Finalist',
        status: 'departed'
      },
      {
        time: '11:59P',
        destination: 'Midnight Rocket — your private screening',
        remark: 'RSVP below — link by email',
        status: 'boarding'
      }
    ]
  },
  editionNotice: {
    label: 'Notice to passengers',
    leadIn: 'Now screening: ',
    edition: 'Golden Wings — Silicon Beach Layover Edition',
    body:
      ', the festival cut that premiered at the Chinese Theatre in Hollywood for the 2024 Silicon Beach Film Festival. The final cut is still in the edit bay — your seat on this flight includes first word when it lands.'
  },
  boardingPass: {
    from: { code: 'YOU', city: 'Wherever you are' },
    to: { code: 'GWX', city: 'The screening room' },
    cabin: 'Midnight Rocket · Private Screening',
    flight: 'GW-1971',
    seat: 'Admit one',
    passengerFallback: 'Your Name Here',
    gateFallback: 'Your inbox',
    noteIdle: 'Overnight service · Departs the moment you RSVP.',
    noteSentPrefix: 'Seat held — the Midnight Rocket departs for ',
    noteSentSuffix: '.'
  },
  offer: {
    eyebrow: 'Final boarding',
    heading: 'Board the Midnight Rocket',
    kicker:
      "The overnight flight to the screening room. A name and an email and you're aboard — the watch link departs for your inbox the moment you RSVP.",
    ticketCaption: 'Your ticket prints as you type —',
    manifestLabel: 'Passenger Manifest',
    admitLabel: 'Admit One',
    submitLabel: 'Send my watch link',
    success: '✓ Aboard — your watch link is on its way. Check your inbox.',
    error:
      'The link could not be sent. Try again or email info@golden-wings-robyn.com.',
    trustLine: 'Free screening · No spam · Unsubscribe anytime',
    emailConsent:
      'By sending my watch link, I agree to receive email from Golden Wings about this screening and related updates. Unsubscribe anytime.',
    smsOptInLabel: 'Text me screening updates and special events',
    smsConsent:
      'By entering your phone number and checking this box, you consent to receive automated text messages from Golden Wings about screenings and special events. Message frequency may vary. Message and data rates may apply. Reply STOP to cancel; reply HELP for help or call 562-523-9620. Consent is not required to get your email watch link.',
    smsOptInRequired:
      'Check the SMS box to receive texts, or clear your phone number.',
    futureUrl: import.meta.env.VITE_FUTURE_OFFER_URL || ''
  },
  watch: {
    eyebrow: 'Private screening',
    heading: 'Access your screening',
    body: 'Enter your email and the screening room will open.',
    submitLabel: 'Open the screening room',
    loadingLabel: 'Opening the screening room',
    embedUrl: import.meta.env.VITE_SCREENING_EMBED_URL || '',
    readyBody: 'Welcome aboard. Your private screening is ready.',
    pendingIntro: 'Your RSVP is confirmed.',
    pendingHeading: 'The screening room is being prepared.',
    pendingBody:
      "Your RSVP holds your place. We'll email the live screening link when the room opens.",
    scheduledHeading: 'The next screening is being prepared.',
    scheduledBody:
      'Your place is held. Watch for the boarding email when the room opens.',
    closedHeading: 'This screening is closed.',
    closedBody:
      'Leave your email on the home page and we will invite you to the next open screening.'
  },
  confirmation: {
    eyebrow: 'Access confirmed',
    heading: 'Check your email',
    body:
      'Your Golden Wings watch link is being sent. You can also continue straight to the screening room.'
  },
  laurels: [
    {
      award: 'Best Documentary Short',
      festival: 'International Guadalajara Film Awards',
      year: '2024'
    },
    {
      award: 'Best Mobile Short',
      festival: 'Independent Shorts Awards',
      year: '2024'
    },
    {
      award: 'Best Short Cinematography',
      festival: 'Silicon Beach Film Festival',
      year: '2024'
    },
    {
      award: 'Finalist',
      festival: "Beyond Hollywood Int'l Film Festival",
      year: '2025'
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
    privacy: '/privacy-policy',
    terms: '/terms-of-service'
  }
} as const
