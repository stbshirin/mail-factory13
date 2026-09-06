/**
 * Utility to mask sensitive phone numbers and accounts for depositor privacy.
 * Users' deposit phone numbers should not be visible to other users.
 */
export function maskPhoneNumber(phone?: string | null): string {
  if (!phone || phone.trim() === '' || phone === 'N/A') {
    return '🔒 সুরক্ষিত';
  }

  const clean = phone.trim();

  // If phone has at least 8 chars (e.g. 01712345678 or +8801712345678)
  if (clean.length >= 8) {
    const first3 = clean.substring(0, 3);
    const last3 = clean.substring(clean.length - 3);
    return `${first3}****${last3}`;
  }

  // Short strings
  if (clean.length >= 4) {
    return `${clean.substring(0, 2)}****`;
  }

  return '****';
}

/**
 * Check if the current viewer is authorized to see the full phone number.
 * Only Admins or the transaction owner themselves may see it.
 */
export function formatProtectedPhone(
  phone: string | undefined | null,
  isOwnerOrAdmin: boolean
): string {
  if (!phone) return 'N/A';
  if (isOwnerOrAdmin) return phone;
  return maskPhoneNumber(phone);
}
