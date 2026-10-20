import type { ImageMetadata } from 'astro';
import image from '../assets/images/pisarzowice-etap-ii-hero.png';
import garden from '../assets/images/pisarzowice/IMG_3244.jpg';
import terrace from '../assets/images/pisarzowice/IMG_3321.jpg';
import entrance from '../assets/images/pisarzowice/IMG_3252.jpg';
import side from '../assets/images/pisarzowice/IMG_3254.jpg';
import rear from '../assets/images/pisarzowice/IMG_3320.jpg';
import rearSide from '../assets/images/pisarzowice/IMG_3324.jpg';
import groundFloor from '../assets/images/pisarzowice/uklad-projektu-parter.png';
import upperFloor from '../assets/images/pisarzowice/uklad-projektu-poddasze.png';
import groundFloorDiagram from '../assets/images/pisarzowice/uklad-projektu-parter-czytelny.svg?url&no-inline';
import upperFloorDiagram from '../assets/images/pisarzowice/uklad-projektu-poddasze-czytelny.svg?url&no-inline';

export interface PropertyMedia {
  image: ImageMetadata;
  alt: string;
  caption: string;
}

export interface PropertyPlan {
  image: { src: string; width: number; height: number };
  sourceImage: ImageMetadata;
  alt: string;
  rooms: readonly { name: string; color: string }[];
}

const planColors = {
  circulation: '#ede2d3',
  living: '#f7d19b',
  kitchen: '#f8e7a8',
  bedroom: '#c8dfc5',
  bathroom: '#b9dbef',
  garage: '#d3dce5',
};

// Owner-approved edited view; the surroundings include visualized changes.
export const propertyPhoto = {
  image,
  alt: 'Dom jednorodzinny w Pisarzowicach — wizualizacja otoczenia',
};

// Both original photo groups were confirmed as the offered house on 2026-10-20.
// The garden varies between sessions; no claim that every photo shows today's surroundings.
export const propertyGallery: readonly PropertyMedia[] = [
  { image: garden, alt: 'Dom w Pisarzowicach widziany z ogrodu z trawnikiem', caption: 'Dom i ogród' },
  { image: terrace, alt: 'Elewacja domu w Pisarzowicach z wyjściem na taras', caption: 'Wyjście na taras' },
  { image: entrance, alt: 'Wejście do domu i brama garażowa od strony ulicy', caption: 'Wejście i garaż' },
  { image: side, alt: 'Boczna elewacja domu w Pisarzowicach od strony ogrodu', caption: 'Dom z boku' },
  { image: rear, alt: 'Elewacja ogrodowa domu w Pisarzowicach na wprost', caption: 'Dom od strony ogrodu' },
  { image: rearSide, alt: 'Boczna elewacja domu w Pisarzowicach z oknami poddasza', caption: 'Boczna elewacja' },
];

// Presentation diagrams traced from the source scans; originals retain dimension lines.
// The owner confirmed this is the same project; its original site address is not the offer location.
export const propertyPlans: readonly PropertyPlan[] = [
  {
    image: { src: groundFloorDiagram, width: 1260, height: 800 },
    sourceImage: groundFloor,
    alt: 'Rzut parteru z garażem, salonem, kuchnią, pokojem i łazienką',
    rooms: [
      { name: 'Przedsionek', color: planColors.circulation },
      { name: 'Hall', color: planColors.circulation },
      { name: 'Łazienka', color: planColors.bathroom },
      { name: 'Salon z jadalnią', color: planColors.living },
      { name: 'Kuchnia', color: planColors.kitchen },
      { name: 'Pokój', color: planColors.bedroom },
      { name: 'Garaż', color: planColors.garage },
    ],
  },
  {
    image: { src: upperFloorDiagram, width: 815, height: 750 },
    sourceImage: upperFloor,
    alt: 'Rzut poddasza z trzema pokojami, łazienką i hallem',
    rooms: [
      { name: 'Hall', color: planColors.circulation },
      { name: 'Łazienka', color: planColors.bathroom },
      { name: 'Sypialnia', color: planColors.bedroom },
      { name: 'Sypialnia', color: planColors.bedroom },
      { name: 'Sypialnia', color: planColors.bedroom },
    ],
  },
];
