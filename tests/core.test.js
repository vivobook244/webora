import test from 'node:test'
import assert from 'node:assert/strict'
import {
  isSafeUrl,
  isValidCssLength,
  isValidHexColor,
  isValidSlug,
} from '../src/lib/validation.js'
import {
  SECTION_VARIANT_CONFIG,
  getDefaultVariantId,
  getSectionVariants,
  getValidVariantId,
} from '../src/data/sectionVariants.js'
import { resolveMediaUrl } from '../src/components/public/publicUtils.js'

test('safe URL validation accepts supported destinations only', () => {
  assert.equal(isSafeUrl('https://example.com'), true)
  assert.equal(isSafeUrl('/about'), true)
  assert.equal(isSafeUrl('mailto:hello@example.com'), true)
  assert.equal(isSafeUrl('javascript:alert(1)'), false)
  assert.equal(isSafeUrl('data:text/html,hello'), false)
  assert.equal(isSafeUrl('//example.com/path'), false)
  assert.equal(isSafeUrl('https://example.com\n.evil.test'), false)
})

test('page slugs, colors, and CSS lengths follow the supported formats', () => {
  assert.equal(isValidSlug('company-profile-2026'), true)
  assert.equal(isValidSlug('Company Profile'), false)
  assert.equal(isValidHexColor('#2563EB'), true)
  assert.equal(isValidHexColor('red'), false)
  assert.equal(isValidCssLength('1200px'), true)
  assert.equal(isValidCssLength('calc(100% - 2rem)'), false)
})

test('every supported section type has a valid default variant', () => {
  for (const type of Object.keys(SECTION_VARIANT_CONFIG)) {
    const defaultVariant = getDefaultVariantId(type)
    assert.ok(defaultVariant, `missing default variant for ${type}`)
    assert.equal(getValidVariantId(type, defaultVariant), defaultVariant)
    assert.ok(getSectionVariants(type).length > 0)
    assert.equal(getValidVariantId(type, '__invalid__'), null)
  }
})

test('media URLs reject unsafe metadata but allow persisted local blobs', () => {
  assert.equal(resolveMediaUrl('javascript:alert(1)', []), null)
  assert.equal(resolveMediaUrl('/webora-mark.svg', []), '/webora-mark.svg')
  assert.equal(resolveMediaUrl('media-1', [
    { id: 'media-1', url: 'blob:local-preview', storageId: 'media-1' },
  ]), 'blob:local-preview')
  assert.equal(resolveMediaUrl('media-2', [
    { id: 'media-2', url: 'javascript:alert(1)' },
  ]), null)
})
