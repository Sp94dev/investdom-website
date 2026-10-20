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
  caption: string;
  rooms: readonly string[];
}

// Owner-approved edited view; the surroundings include visualized changes.
export const propertyPhoto = {
  image,
  alt: 'Dom jednorodzinny w Pisarzowicach — wizualizacja otoczenia',
};

// Both original photo groups were confirmed as the offered house on 2026-10-20.
// The garden varies between sessions; no claim that every photo shows today's surroundings.
export const propertyGallery: readonly PropertyMedia[] = [
  { image: garden, alt: 'Dom w Pisarzowicach widziany z ogrodu z trawnikiem', caption: 'Widok od strony ogrodu' },
  { image: terrace, alt: 'Elewacja domu w Pisarzowicach z wyjściem na taras', caption: 'Elewacja z wyjściem na taras' },
  { image: entrance, alt: 'Wejście do domu i brama garażowa od strony ulicy', caption: 'Wejście i garaż' },
  { image: side, alt: 'Boczna elewacja domu w Pisarzowicach od strony ogrodu', caption: 'Dom od strony bocznej elewacji' },
  { image: rear, alt: 'Elewacja ogrodowa domu w Pisarzowicach na wprost', caption: 'Elewacja ogrodowa' },
  { image: rearSide, alt: 'Dom w Pisarzowicach z oknami poddasza i boczną elewacją', caption: 'Widok na poddasze i boczną elewację' },
];

// Presentation diagrams traced from the source scans; originals retain dimension lines.
// The owner confirmed this is the same project; its original site address is not the offer location.
export const propertyPlans: readonly PropertyPlan[] = [
  {
    image: { src: groundFloorDiagram, width: 1260, height: 800 },
    sourceImage: groundFloor,
    alt: 'Układ pomieszczeń projektu — parter z garażem, salonem, kuchnią, pokojem i łazienką',
    caption: 'Parter: salon z jadalnią, kuchnia, pokój, łazienka, hall, przedsionek i garaż.',
    rooms: ['Przedsionek', 'Hall', 'Łazienka', 'Salon z jadalnią', 'Kuchnia', 'Pokój', 'Garaż'],
  },
  {
    image: { src: upperFloorDiagram, width: 815, height: 750 },
    sourceImage: upperFloor,
    alt: 'Układ pomieszczeń projektu — poddasze z trzema pokojami, łazienką i hallem',
    caption: 'Poddasze: trzy pokoje, łazienka i hall ze schodami.',
    rooms: ['Hall', 'Łazienka', 'Sypialnia', 'Sypialnia', 'Sypialnia'],
  },
];

export const projectPlanCredit = 'Projekt architektoniczny: mgr inż. arch. Joanna Srokosz. Opracowanie: Projektowanie i Nadzory inż. Piotr Pezda. Źródło: dokumentacja projektu przekazana przez INVESTDOM.';
