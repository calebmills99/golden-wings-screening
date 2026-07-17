import { describe, expect, it } from 'vitest'
import { validateEmail, validateOfferCapture } from './leadValidation'

describe('lead validation', () => {
  it('requires a name and email for an offer capture', () => {
    expect(validateOfferCapture('', '')).toBe('Enter your name and email.')
  })

  it('rejects an invalid email', () => {
    expect(validateEmail('not-an-email')).toBe(false)
    expect(validateOfferCapture('Robyn', 'not-an-email')).toBe('Enter a valid email address.')
  })

  it('accepts a trimmed valid lead', () => {
    expect(validateOfferCapture(' Robyn ', ' robyn@example.com ')).toBeNull()
  })
})
