export type LegalSection = {
  heading: string
  paragraphs: string[]
  bullets?: string[]
}

export const privacyPolicy = {
  title: 'Privacy Policy',
  effectiveDate: 'July 20, 2026',
  intro:
    'Welcome to Golden Wings ("we," "our," "us"). We are committed to protecting your privacy and handling your personal information securely. This Privacy Policy explains how we collect, use, and protect your data when you visit gwingz.com (the "Site"), request a screening link, or opt in to email or SMS communications.',
  sections: [
    {
      heading: 'Information We Collect',
      paragraphs: [
        'Personal data: When you RSVP for a screening or opt in to communications, we may collect your name, email address, and phone number.',
        'Usage data: We may collect information about how you interact with the Site, including IP address, browser type, pages visited, and screening-room access events. This helps us operate the private screening and improve the experience.'
      ]
    },
    {
      heading: 'How We Use Your Information',
      paragraphs: [
        'To deliver your watch link and screening access by email.',
        'To send newsletters, updates, and promotional materials you have consented to receive by email.',
        'To send automated text messages about screenings, special events, and related Golden Wings updates when you have opted in by providing your mobile number and confirming SMS consent.',
        'To improve our services by understanding how visitors use the Site.'
      ]
    },
    {
      heading: 'SMS / Mobile Messaging',
      paragraphs: [
        'If you provide a mobile number and opt in to SMS, you consent to receive automated text messages from Golden Wings at that number. Message frequency may vary. Message and data rates may apply.',
        'You can opt out at any time by replying STOP. For help, reply HELP or call 562-523-9620.',
        'We do not sell or rent your phone number. Consent to receive texts is not a condition of watching the film or receiving your email watch link.'
      ]
    },
    {
      heading: 'Data Sharing and Disclosure',
      paragraphs: [
        'We do not sell or rent your personal data. We may share information with service providers who help us deliver email, SMS, hosting, analytics, or video streaming. Those providers are obligated to protect your data and use it only for the purposes we specify.'
      ]
    },
    {
      heading: 'Your Rights and Choices',
      paragraphs: [
        'Email: You can unsubscribe from marketing emails using the link in any message, or by contacting us.',
        'SMS: Reply STOP to cancel texts at any time.',
        'Access and correction: You may request access to or correction of your personal information by contacting us.'
      ]
    },
    {
      heading: 'Data Security',
      paragraphs: [
        'We implement appropriate technical and organizational measures to protect personal data against unauthorized access, alteration, disclosure, or destruction.'
      ]
    },
    {
      heading: 'Cookies and Tracking',
      paragraphs: [
        'The Site may use cookies and similar technologies to operate the screening funnel and understand usage. You can control cookies through your browser settings.'
      ]
    },
    {
      heading: 'Changes to This Policy',
      paragraphs: [
        'We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated effective date.'
      ]
    },
    {
      heading: 'Contact Us',
      paragraphs: [
        'Questions about this Privacy Policy or our data practices:',
        'Email: privacy@golden-wings-robyn.com',
        'General: info@golden-wings-robyn.com',
        'Address: 4030 Verdant Street, Los Angeles, CA 90039'
      ]
    }
  ] satisfies LegalSection[]
}

export const termsOfService = {
  title: 'Terms of Service',
  effectiveDate: 'July 20, 2026',
  intro:
    'Welcome to Golden Wings. These Terms of Service govern your use of gwingz.com and related screening experiences operated by Get Booked Studio / Golden Wings ("we," "our," "us"). By using the Site, you agree to these terms.',
  sections: [
    {
      heading: 'Acceptance of Terms',
      paragraphs: [
        'By accessing or using gwingz.com, you agree to comply with these Terms of Service. If you do not agree, please do not use the Site.'
      ]
    },
    {
      heading: 'The Screening Experience',
      paragraphs: [
        'Golden Wings may offer free or invited private screenings online. Access may require an RSVP, email verification, or other controls we set. We may open, schedule, or close screenings at any time.',
        'Screening links and embeds are for personal, non-commercial viewing unless we expressly agree otherwise in writing.'
      ]
    },
    {
      heading: 'Communications',
      paragraphs: [
        'By submitting an RSVP with your email, you agree we may email you the watch link and related screening updates.',
        'By providing a mobile number and confirming SMS opt-in on the Site, you consent to receive automated texts from Golden Wings about screenings and special events. Message frequency may vary. Message and data rates may apply. Reply STOP to cancel; reply HELP for help or call 562-523-9620.',
        'Our Privacy Policy describes how we handle personal data related to these communications.'
      ]
    },
    {
      heading: 'User Responsibilities',
      paragraphs: [
        'You agree to use the Site for lawful purposes only. You may not:'
      ],
      bullets: [
        'Post or transmit unlawful, harmful, or offensive content',
        'Attempt to disrupt or reverse-engineer the Site or screening delivery',
        'Impersonate any person or entity',
        'Share screening credentials or embeds in a way that defeats access controls'
      ]
    },
    {
      heading: 'Intellectual Property',
      paragraphs: [
        'All content on the Site — including text, graphics, logos, images, video, and design — is owned by Golden Wings, Get Booked Studio, or our licensors and is protected by applicable intellectual-property laws. Unauthorized use is prohibited.'
      ]
    },
    {
      heading: 'Limitation of Liability',
      paragraphs: [
        'To the fullest extent permitted by law, Golden Wings and Get Booked Studio are not liable for damages arising from your use of, or inability to use, the Site or screening services, including direct, indirect, incidental, or consequential damages.'
      ]
    },
    {
      heading: 'Changes to Terms',
      paragraphs: [
        'We may modify these terms at any time. Updates will be posted on this page. Continued use of the Site after changes means you accept the updated terms.'
      ]
    },
    {
      heading: 'Governing Law',
      paragraphs: [
        'These Terms of Service are governed by the laws of the State of California, without regard to conflict-of-law principles. Disputes arising under these terms are subject to the exclusive jurisdiction of the courts located in Los Angeles County, California.'
      ]
    },
    {
      heading: 'Contact',
      paragraphs: [
        'Questions about these Terms of Service:',
        'Email: info@golden-wings-robyn.com',
        'Phone: 562-523-9620'
      ]
    }
  ] satisfies LegalSection[]
}
