const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validateEmail(email: string): boolean {
  return emailPattern.test(email.trim())
}

export function validateOfferCapture(name: string, email: string): string | null {
  if (!name.trim() && !email.trim()) {
    return 'Enter your name and email.'
  }

  if (!name.trim()) {
    return 'Enter your name.'
  }

  if (!email.trim()) {
    return 'Enter your email address.'
  }

  if (!validateEmail(email)) {
    return 'Enter a valid email address.'
  }

  return null
}
