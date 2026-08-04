export type Book = {
  slug: string;
  title: string;
  eyebrow: string;
  description: string;
  cover: string;
  spreads: readonly string[];
  accent: string;
  accentSoft: string;
  numberLabel: string;
  coverAspect: number;
  shelfScale: number;
  coverCrop?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  coverTreatment?: "archive-artwork";
};

export function getBookSpreads(book: Book) {
  return [...new Set(book.spreads)];
}

export const books = [
  {
    slug: "dormir-sin-miedo",
    title: "Dormir sin miedo",
    eyebrow: "Un cuento para bajar la luz",
    description:
      "Una historia cálida para acompañar esos momentos en los que la noche se hace un poquito grande.",
    cover: "/images/books/dormir-sin-miedo-cover.webp",
    spreads: ["/images/books/dormir-sin-miedo-spread-1.webp"],
    accent: "#b42334",
    accentSoft: "#f5cdd0",
    numberLabel: "01",
    coverAspect: 0.88,
    shelfScale: 0.92,
    coverCrop: { x: 0.302, y: 0.091, width: 0.463, height: 0.79 },
  },
  {
    slug: "sant-jordi",
    title: "Sant Jordi",
    eyebrow: "Dragones, rosas y una leyenda",
    description:
      "Una mirada juguetona a una historia que vuelve cada primavera para invitarnos a leer y regalar palabras.",
    cover: "/images/books/sant-jordi-cover.webp",
    spreads: [
      "/images/books/sant-jordi-spread-1.webp",
      "/images/books/sant-jordi-spread-2.webp",
      "/images/books/sant-jordi-spread-3.webp",
    ],
    accent: "#f99a2e",
    accentSoft: "#ffe4bc",
    numberLabel: "02",
    coverAspect: 0.79,
    shelfScale: 1,
    coverCrop: { x: 0.326, y: 0.114, width: 0.407, height: 0.773 },
  },
  {
    slug: "kai-y-emma",
    title: "Kai y Emma",
    eyebrow: "Dos maneras de mirar",
    description:
      "Dos personajes, muchas posibilidades y una colección de escenas llenas de color para quedarse mirando.",
    cover: "/images/books/kai-y-emma-cover.webp",
    spreads: [
      "/images/books/kai-y-emma-spread-1.webp",
      "/images/books/kai-y-emma-spread-2.webp",
      "/images/books/kai-y-emma-spread-3.webp",
    ],
    accent: "#2e9bb3",
    accentSoft: "#c7f1f4",
    numberLabel: "03",
    coverAspect: 0.92,
    shelfScale: 0.94,
    coverCrop: { x: 0.271, y: 0.113, width: 0.48, height: 0.782 },
  },
  {
    slug: "anton-pinon",
    title: "Antón Piñón",
    eyebrow: "Pequeño, curioso y lleno de líos",
    description:
      "Antón Piñón siempre encuentra una aventura a la vuelta de la esquina. Y Marta, claro, acaba dibujándola.",
    cover: "/images/books/anton-pinon-cover.webp",
    spreads: ["/images/books/anton-pinon-spread-1.jpg"],
    accent: "#64a621",
    accentSoft: "#e3f4be",
    numberLabel: "04",
    coverAspect: 0.9,
    shelfScale: 0.86,
    coverCrop: { x: 0.18, y: 0.205, width: 0.64, height: 0.57 },
  },
  {
    slug: "pol-mig",
    title: "Pol Mig",
    eyebrow: "Un personaje para abrazar",
    description:
      "Una propuesta delicada y cercana para descubrir cómo una imagen puede contar mucho sin levantar la voz.",
    cover: "/images/books/pol-mig-cover.webp",
    spreads: [
      "/images/books/pol-mig-spread-1.webp",
      "/images/books/pol-mig-spread-2.webp",
    ],
    accent: "#6d549d",
    accentSoft: "#e5ddf2",
    numberLabel: "05",
    coverAspect: 0.88,
    shelfScale: 0.9,
    coverCrop: { x: 0.294, y: 0.162, width: 0.391, height: 0.666 },
  },
  {
    slug: "el-caracol-se-queja",
    title: "El caracol se queja",
    eyebrow: "Una queja con patas",
    description:
      "Humor, ritmo y una criatura diminuta que tiene algo importante que decir —muy despacio, eso sí.",
    cover: "/images/books/el-caracol-se-queja-cover.webp",
    spreads: [
      "/images/books/el-caracol-se-queja-spread-1.webp",
      "/images/books/el-caracol-se-queja-spread-2.jpg",
      "/images/books/el-caracol-se-queja-spread-3.jpg",
    ],
    accent: "#e07835",
    accentSoft: "#ffe0c8",
    numberLabel: "06",
    coverAspect: 0.58,
    shelfScale: 1.08,
    coverCrop: { x: 0.374, y: 0.128, width: 0.281, height: 0.727 },
  },
  {
    slug: "don-croqueto",
    title: "Don Croqueto",
    eyebrow: "Una aventura crujiente",
    description:
      "Un álbum con mucha personalidad, humor y ese pequeño caos que hace que un personaje se vuelva inolvidable.",
    cover: "/images/books/don-croqueto-cover.webp",
    spreads: [
      "/images/books/don-croqueto-spread-1.webp",
      "/images/books/don-croqueto-spread-2.webp",
      "/images/books/don-croqueto-spread-3.webp",
    ],
    accent: "#d85b75",
    accentSoft: "#f9d4dc",
    numberLabel: "07",
    coverAspect: 1.16,
    shelfScale: 0.82,
    coverCrop: { x: 0.237, y: 0.132, width: 0.58, height: 0.75 },
  },
  {
    slug: "la-fuente",
    title: "La fuente escondida",
    eyebrow: "Hay lugares que aparecen al mirar",
    description:
      "Una historia de descubrimientos, rincones secretos y personajes que saben seguir el hilo de una pista.",
    cover: "/images/books/la-fuente-cover.webp",
    spreads: [
      "/images/books/la-fuente-spread-1.webp",
      "/images/books/la-fuente-spread-2.webp",
    ],
    accent: "#278d83",
    accentSoft: "#c7eee6",
    numberLabel: "08",
    coverAspect: 0.72,
    shelfScale: 0.98,
    coverCrop: { x: 0.352, y: 0.118, width: 0.364, height: 0.758 },
  },
  {
    slug: "que-frio",
    title: "¡Qué frío!",
    eyebrow: "Un abrigo para la imaginación",
    description:
      "Una escena invernal que invita a mirar de cerca, reconocer emociones y encontrar calor en los detalles.",
    cover: "/images/books/que-frio-cover.webp",
    spreads: ["/images/books/que-frio-spread-1.jpg"],
    accent: "#2877a4",
    accentSoft: "#d4eaf7",
    numberLabel: "09",
    coverAspect: 0.9,
    shelfScale: 0.88,
    coverCrop: { x: 0.265, y: 0.104, width: 0.44, height: 0.734 },
  },
  {
    slug: "el-monstruo-comepueblos",
    title: "El monstruo comepueblos",
    eyebrow: "Grande, raro y un poco hambriento",
    description:
      "Una criatura enorme para jugar con las escalas, el miedo y las ganas de saber qué hay detrás de cada página.",
    cover: "/images/books/el-monstruo-comepueblos-cover.webp",
    spreads: [
      "/images/books/el-monstruo-comepueblos-spread-1.webp",
      "/images/books/el-monstruo-comepueblos-spread-2.webp",
      "/images/books/el-monstruo-comepueblos-spread-3.webp",
    ],
    accent: "#7652a7",
    accentSoft: "#e4d9f1",
    numberLabel: "10",
    coverAspect: 0.72,
    shelfScale: 1.04,
    coverCrop: { x: 0.334, y: 0.18, width: 0.324, height: 0.676 },
  },
  {
    slug: "cocodrilo",
    title: "Cocodrilo",
    eyebrow: "Una mirada que no se olvida",
    description:
      "Un personaje de gesto expresivo y mucha presencia, para mirar cómo el dibujo construye una historia antes de leerla.",
    cover: "/images/books/cocodrilo-cover.webp",
    spreads: [
      "/images/books/cocodrilo-spread-1.webp",
      "/images/books/cocodrilo-spread-2.webp",
      "/images/books/cocodrilo-spread-3.webp",
    ],
    accent: "#3b9274",
    accentSoft: "#d0f0df",
    numberLabel: "11",
    coverAspect: 0.58,
    shelfScale: 1.1,
    coverCrop: { x: 0.384, y: 0.144, width: 0.286, height: 0.74 },
  },
  {
    slug: "simona",
    title: "Simona",
    eyebrow: "Una protagonista con carácter",
    description:
      "Una colección de gestos, colores y decisiones que dejan espacio para que cada lector imagine el siguiente paso.",
    cover: "/images/books/simona-cover.webp",
    spreads: [],
    accent: "#d45b4a",
    accentSoft: "#f8d8d1",
    numberLabel: "12",
    coverAspect: 0.72,
    shelfScale: 0.96,
    coverTreatment: "archive-artwork",
  },
  {
    slug: "gracias-profe",
    title: "Gracias, profe",
    eyebrow: "Para quien acompaña cada comienzo",
    description:
      "Un homenaje luminoso a las personas que enseñan con paciencia, curiosidad y un montón de pequeñas historias.",
    cover: "/images/books/gracias-profe-cover.webp",
    spreads: [
      "/images/books/gracias-profe-spread-1.webp",
      "/images/books/gracias-profe-spread-3.webp",
    ],
    accent: "#d4632f",
    accentSoft: "#ffe1c8",
    numberLabel: "13",
    coverAspect: 0.88,
    shelfScale: 0.94,
    coverCrop: { x: 0.329, y: 0.177, width: 0.409, height: 0.697 },
  },
  {
    slug: "sensibles",
    title: "Sensibles",
    eyebrow: "Sentir también es una forma de mirar",
    description:
      "Una propuesta para hablar de lo que pasa por dentro con imágenes honestas, delicadas y llenas de matices.",
    cover: "/images/books/sensibles-cover.webp",
    spreads: [
      "/images/books/sensibles-spread-1.webp",
      "/images/books/sensibles-spread-2.webp",
      "/images/books/sensibles-spread-3.webp",
    ],
    accent: "#ba4d6b",
    accentSoft: "#f4d3dd",
    numberLabel: "14",
    coverAspect: 0.72,
    shelfScale: 1.02,
    coverCrop: { x: 0.311, y: 0.1, width: 0.386, height: 0.805 },
  },
  {
    slug: "martina-futbolista",
    title: "Martina futbolista",
    eyebrow: "Jugar también es encontrar tu sitio",
    description:
      "Una protagonista con energía y ganas de demostrar que el campo, como el papel, también puede ser para ti.",
    cover: "/images/books/martina-futbolista-cover.jpg",
    spreads: [],
    accent: "#3b8f62",
    accentSoft: "#d5eed9",
    numberLabel: "15",
    coverAspect: 0.72,
    shelfScale: 0.98,
    coverCrop: { x: 0.215, y: 0.099, width: 0.564, height: 0.784 },
  },
  {
    slug: "vera-astronauta",
    title: "Vera, la astronauta valiente",
    eyebrow: "Un viaje empieza con una pregunta",
    description:
      "Una invitación a levantar la vista, inventar mundos y llevar la imaginación tan lejos como haga falta.",
    cover: "/images/books/vera-astronauta-cover.webp",
    spreads: [],
    accent: "#4e6db1",
    accentSoft: "#dae4f7",
    numberLabel: "16",
    coverAspect: 0.96,
    shelfScale: 0.86,
    coverCrop: { x: 0.14, y: 0.2, width: 0.73, height: 0.51 },
  },
  {
    slug: "victor-no-quiere-compartir",
    title: "Víctor no quiere compartir",
    eyebrow: "Cuando cuesta abrir la mano",
    description:
      "Una historia cercana para reconocer lo que sentimos, probar otras maneras y volver a encontrarnos.",
    cover: "/images/books/victor-no-quiere-compartir-cover.webp",
    spreads: [
      "/images/books/victor-no-quiere-compartir-spread-1.jpg",
      "/images/books/victor-no-quiere-compartir-spread-2.jpg",
    ],
    accent: "#d28538",
    accentSoft: "#f9e1be",
    numberLabel: "17",
    coverAspect: 0.64,
    shelfScale: 1,
    coverCrop: { x: 0.353, y: 0.168, width: 0.309, height: 0.724 },
  },
  {
    slug: "el-hilo",
    title: "El hilo",
    eyebrow: "Una historia para acompañarse",
    description:
      "Un hilo invisible que conecta personas, recuerdos y momentos en los que necesitamos sentirnos cerca.",
    cover: "/images/books/el-hilo-cover.webp",
    spreads: [
      "/images/books/el-hilo-spread-1.webp",
      "/images/books/el-hilo-spread-2.webp",
      "/images/books/el-hilo-spread-3.webp",
    ],
    accent: "#b24d6c",
    accentSoft: "#f4d3dd",
    numberLabel: "18",
    coverAspect: 0.7,
    shelfScale: 1.03,
    coverCrop: { x: 0.315, y: 0.12, width: 0.353, height: 0.756 },
  },
  {
    slug: "como-estas-hoy",
    title: "¿Cómo estás hoy?",
    eyebrow: "Una pregunta que abre espacio",
    description:
      "Colores, criaturas y preguntas sencillas para poner nombre a lo que sentimos y compartirlo sin prisa.",
    cover: "/images/books/como-estas-hoy-cover.webp",
    spreads: [
      "/images/books/como-estas-hoy-spread-1.webp",
      "/images/books/como-estas-hoy-spread-3.webp",
    ],
    accent: "#338d58",
    accentSoft: "#d4efcf",
    numberLabel: "19",
    coverAspect: 1,
    shelfScale: 0.84,
  },
] satisfies readonly Book[];
