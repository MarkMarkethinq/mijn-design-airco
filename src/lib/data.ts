export type ModelKey = "daiseikai" | "haori" | "kazumi";

export interface AircoModel {
  name: string;
  jp: string;
  img: string;
  desc: string;
  swatches: string[];
}

export interface Installer {
  id: string;
  naam: string;
  stad: string;
  lat: number;
  lng: number;
  aanvragen: number;
  reactie: number;
  status: "available" | "busy";
  desc: string;
}

export interface RecentRequest {
  naam: string;
  stad: string;
  model: ModelKey;
  when: string;
}

export const MODELS: Record<ModelKey, AircoModel> = {
  daiseikai: {
    name: "Daiseikai",
    jp: "大成会",
    img: "/assets/daiseikai.webp",
    desc: "Matzwart, strak premium design — verdwijnt elegant in een moderne interieur.",
    swatches: ["#222222", "#3D2B1F", "#7A7A7A"],
  },
  haori: {
    name: "Haori",
    jp: "羽織",
    img: "/assets/haori.webp",
    desc: "Cognacbruine leren uitstraling — warm en herkenbaar, zonder op de voorgrond te treden.",
    swatches: ["#A0532E", "#7E3A22", "#D9B79A"],
  },
  kazumi: {
    name: "Kazumi",
    jp: "和澄",
    img: "/assets/kazumi.webp",
    desc: "Naturel houten latten — luchtig en warm, geïnspireerd op Japanse interieurtraditie.",
    swatches: ["#D9B98A", "#A98855", "#3D2B1F"],
  },
};

export const INSTALLERS: Installer[] = [
  {
    id: "amsterdam",
    naam: "Klimaat Experts BV",
    stad: "Amsterdam",
    lat: 52.3676,
    lng: 4.9041,
    aanvragen: 8,
    reactie: 1.4,
    status: "available",
    desc: "F-gassen gecertificeerd · Installeert alle drie de modellen · Eigen monteurs in dienst.",
  },
  {
    id: "rotterdam",
    naam: "CoolAir Installaties",
    stad: "Rotterdam",
    lat: 51.9225,
    lng: 4.4792,
    aanvragen: 6,
    reactie: 2.2,
    status: "available",
    desc: "Gespecialiseerd in nieuwbouw en appartementen · Onderhoudscontracten beschikbaar.",
  },
  {
    id: "utrecht",
    naam: "De Airco Specialist",
    stad: "Utrecht",
    lat: 52.0907,
    lng: 5.1214,
    aanvragen: 5,
    reactie: 3.1,
    status: "busy",
    desc: "Premium installaties · Werkt veel met de Daiseikai en Haori.",
  },
  {
    id: "nijmegen",
    naam: "AirPro Thuis",
    stad: "Nijmegen",
    lat: 51.8126,
    lng: 5.8372,
    aanvragen: 3,
    reactie: 1.8,
    status: "available",
    desc: "Familiebedrijf met focus op woonhuizen · Persoonlijk advies aan huis.",
  },
  {
    id: "eindhoven",
    naam: "Comfort Klimaat",
    stad: "Eindhoven",
    lat: 51.4416,
    lng: 5.4697,
    aanvragen: 2,
    reactie: 2.9,
    status: "available",
    desc: "Werkt regionaal in Noord-Brabant · Snelle afspraakplanning.",
  },
];

export const RECENT_REQUESTS: RecentRequest[] = [
  { naam: "Jan de Vries", stad: "Amsterdam", model: "haori", when: "vandaag, 14:22" },
  { naam: "Sophie Janssen", stad: "Rotterdam", model: "kazumi", when: "vandaag, 11:08" },
  { naam: "Thomas Bakker", stad: "Utrecht", model: "daiseikai", when: "gisteren, 16:44" },
  { naam: "Emma van Dijk", stad: "Nijmegen", model: "haori", when: "gisteren, 09:30" },
  { naam: "Lotte Smit", stad: "Eindhoven", model: "kazumi", when: "2 dagen geleden" },
];

export function postcodeToInstaller(pc: string): Installer {
  const n = parseInt((pc || "").replace(/\D/g, "").slice(0, 4), 10);
  if (isNaN(n)) return INSTALLERS[3];
  if (n >= 1000 && n <= 1999) return INSTALLERS[0]; // Amsterdam
  if (n >= 2900 && n <= 3299) return INSTALLERS[1]; // Rotterdam
  if (n >= 3400 && n <= 3999) return INSTALLERS[2]; // Utrecht
  if (n >= 6500 && n <= 6699) return INSTALLERS[3]; // Nijmegen
  if (n >= 5500 && n <= 5699) return INSTALLERS[4]; // Eindhoven
  return INSTALLERS[3];
}

export function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}
