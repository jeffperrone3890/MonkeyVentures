/**
 * Google Business Profile extractor.
 *
 * Production implementation: call the Google Places API (Details endpoint)
 * with the place_id, then map the response to RawGBPData.
 *
 * Current implementation: returns realistic mock data shaped like a real
 * landscaping GBP so the pipeline can be exercised end-to-end.
 *
 * Swap path: implement `fetchGBPFromAPI(placeId: string)` and call it below
 * instead of returning the mock object. The mock structure defines the exact
 * shape the real extractor must produce.
 */

import type { RawGBPData } from '../types';

/**
 * Extract structured data from a Google Business Profile.
 *
 * @param urlOrPlaceId - The GBP URL (https://maps.google.com/...) or bare Place ID
 */
export async function extractGoogleBusiness(urlOrPlaceId: string): Promise<RawGBPData> {
  const placeId = parsePlaceId(urlOrPlaceId);
  void placeId; // will be used by the real API call

  // ── Real implementation (commented until API key is configured) ──
  // return fetchGBPFromAPI(placeId);

  return MOCK_GBP_DATA;
}

// ─── Place ID parser ──────────────────────────────────────────────────────────

/**
 * Accepts either a raw Place ID or a Maps URL and returns the Place ID.
 * Handles formats:
 *   - ChIJ... (raw place ID)
 *   - https://maps.google.com/?cid=12345
 *   - https://www.google.com/maps/place/.../@.../data=!...0x...
 */
function parsePlaceId(urlOrId: string): string {
  if (!urlOrId.startsWith('http')) return urlOrId;

  // CID format
  const cidMatch = urlOrId.match(/[?&]cid=(\d+)/);
  if (cidMatch) return cidMatch[1];

  // Place ID embedded in data segment
  const placeMatch = urlOrId.match(/0x[0-9a-f]+:0x[0-9a-f]+/i);
  if (placeMatch) return placeMatch[0];

  // Fall back to the full URL — real implementation should resolve this
  return urlOrId;
}

// ─── Real API caller (to be implemented) ─────────────────────────────────────

// async function fetchGBPFromAPI(placeId: string): Promise<RawGBPData> {
//   const apiKey = process.env.GOOGLE_PLACES_API_KEY;
//   if (!apiKey) throw new Error('GOOGLE_PLACES_API_KEY is not set');
//
//   const fields = [
//     'name', 'formatted_phone_number', 'website', 'formatted_address',
//     'geometry', 'types', 'editorial_summary', 'rating', 'user_ratings_total',
//     'opening_hours', 'photos', 'reviews',
//   ].join(',');
//
//   const res = await fetch(
//     `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=${fields}&key=${apiKey}`
//   );
//   const json = await res.json();
//   return mapGoogleResponse(json.result);
// }

// ─── Mock data ────────────────────────────────────────────────────────────────

const MOCK_GBP_DATA: RawGBPData = {
  name: 'Acme Landscaping & Property Care',
  phone: '(302) 555-0100',
  website: 'https://acmelandscaping.com',
  address: {
    street: '123 Green Way',
    city: 'Newark',
    region: 'DE',
    regionName: 'Delaware',
    postalCode: '19702',
    country: 'US',
  },
  coordinates: { lat: 39.6837, lng: -75.7497 },
  category: 'Landscaper',
  description:
    'Full-service lawn care, tree services, and hardscaping for residential and commercial properties in New Castle County.',
  foundedYear: 2011,
  rating: 4.8,
  reviewCount: 142,
  reviews: [
    {
      text: 'Same crew every week, professional and reliable. The lawn has never looked better.',
      rating: 5,
      date: '2024-06-01',
    },
    {
      text: 'Fair pricing, no contracts, and they always show up on time. Exactly what I needed.',
      rating: 5,
      date: '2024-05-15',
    },
    {
      text: 'Licensed and insured — that mattered to us. Great work on the paver patio.',
      rating: 4,
      date: '2024-04-20',
    },
    {
      text: 'Called at 7 AM after a storm and they had the driveway cleared by noon. Incredible.',
      rating: 5,
      date: '2024-03-10',
    },
    {
      text: 'Friendly crew, consistent quality, and a clear written estimate upfront.',
      rating: 5,
      date: '2024-02-28',
    },
  ],
  hours: [
    { day: 'Mon–Fri', time: '7 AM – 6 PM' },
    { day: 'Saturday', time: '8 AM – 4 PM' },
    { day: 'Sunday', time: 'Emergency only' },
  ],
  openingHours: [
    {
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '07:00',
      closes: '18:00',
    },
    { days: ['Saturday'], opens: '08:00', closes: '16:00' },
  ],
  photos: [
    { url: 'https://lh3.googleusercontent.com/mock-photo-1', category: 'work' },
    { url: 'https://lh3.googleusercontent.com/mock-photo-2', category: 'work' },
    { url: 'https://lh3.googleusercontent.com/mock-photo-3', category: 'team' },
    { url: 'https://lh3.googleusercontent.com/mock-photo-4', category: 'exterior' },
  ],
  attributes: {
    licensed: true,
    insured: true,
    veteran_owned: false,
    women_owned: false,
  },
  social: {
    facebook: 'https://facebook.com/acmelandscaping',
    instagram: 'https://instagram.com/acmelandscaping',
  },
  email: 'info@acmelandscaping.com',
};
