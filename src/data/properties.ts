import type { ImageMetadata } from 'astro';
import houseImage from '../assets/images/nowoczesny-dom-na-sprzedaz-bielsko.jpg';

export interface Property {
  id: string;
  title: string;
  location: string;
  price: string;
  size: string;
  plot: string;
  status: string;
  rooms: number;
  bathrooms: number;
  features: readonly string[];
  image: ImageMetadata;
  imageAlt: string;
  description: string;
}

// Existing investment data confirmed by the owner on 2026-10-17.
// Home, offers and projects must all read this source.
export const properties: readonly Property[] = [
  {
    id: 'pisarzowice-etap-ii',
    title: 'Dom Wolnostojący Pisarzowice (Etap II)',
    location: 'Pisarzowice',
    price: '895 000 zł',
    size: '135 m²',
    plot: '700 m²',
    status: 'Stan deweloperski',
    rooms: 4,
    bathrooms: 2,
    features: ['Ogrzewanie gazowe', 'Garaż', '2 łazienki', '3 sypialnie'],
    image: houseImage,
    imageAlt: 'Dom z pierwszego etapu inwestycji INVESTDOM w Pisarzowicach',
    description:
      'Rozpoczynamy drugi etap budowy domów jednorodzinnych, położonych w spokojnej i zielonej okolicy w Pisarzowicach. To kontynuacja zrealizowanego już etapu pierwszego, w ramach którego wybudowano i sprzedano 6 domów.\n\nDomy zostaną wybudowany z wysokiej jakości materiałów. Posiadają przestronny salon, dwie łazienki, garaż oraz trzy sypialnie.Idealne dla rodziny ceniącej komfort, bliskość natury. Położone są w dogodnej lokalizacji, niedaleko znajduje się szkoła podstawowa, przystanek autobusowy, sklepy spożywcze i punkty usługowe.\n\nZamieszczone zdjęcia przedstawiają sprzedany budynek w pierwszym etapie. Zainteresowanych zapraszam do kontaktu i umówienia się na prezentację.',
  },
];

export const propertyLocations = [...new Set(properties.map((property) => property.location))]
  .map((name) => ({ name, offers: properties.filter((property) => property.location === name) }));
