import type { ImageMetadata } from 'astro';
import { propertyPhoto, propertyGallery, propertyPlans } from './property-media';

export interface Property {
  id: string;
  href: string;
  title: string;
  location: string;
  price: string;
  size: string;
  plot: string;
  status: string;
  stage: string;
  rooms: number;
  bathrooms: number;
  features: readonly string[];
  image: ImageMetadata;
  imageAlt: string;
  gallery: typeof propertyGallery;
  plans: typeof propertyPlans;
  description: string;
}

// Investment data confirmed on 2026-10-17; stage/photo clarified on 2026-10-19.
// Ready house and both gallery groups confirmed in the handover/session on 2026-10-20.
// Home, offers and projects must all read this source.
export const properties: readonly Property[] = [
  {
    id: 'pisarzowice-etap-ii',
    href: '/inwestycje/pisarzowice-etap-ii',
    title: 'Dom wolnostojący w Pisarzowicach (etap II)',
    location: 'Pisarzowice',
    price: '895 000 zł',
    size: '135 m²',
    plot: '700 m²',
    status: 'Stan deweloperski',
    stage: 'Etap II w trakcie realizacji',
    rooms: 4,
    bathrooms: 2,
    features: ['Ogrzewanie gazowe', 'Garaż', '2 łazienki', '3 sypialnie'],
    image: propertyPhoto.image,
    imageAlt: propertyPhoto.alt,
    gallery: propertyGallery,
    plans: propertyPlans,
    description:
      'Dom wolnostojący w Pisarzowicach koło Bielska-Białej, gotowy w stanie deweloperskim.\n\nZapraszamy do oglądania.',
  },
];

export const propertyLocations = [...new Set(properties.map((property) => property.location))]
  .map((name) => ({ name, offers: properties.filter((property) => property.location === name) }));
