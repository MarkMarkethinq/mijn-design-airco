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
    desc: "Naturel houten latten — luchtig en warm, geïnspireerd op Japanse interieurtraditie.",
    swatches: ["#D9B98A", "#A98855", "#3D2B1F"],
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
    desc: "Matzwart, strak premium design — verdwijnt elegant in een moderne interieur.",
    swatches: ["#222222", "#3D2B1F", "#7A7A7A"],
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
  {
    id: "denhaag",
    naam: "HaagKlimaat",
    stad: "Den Haag",
    lat: 52.0705,
    lng: 4.3007,
    aanvragen: 7,
    reactie: 1.6,
    status: "available",
    desc: "Actief in de hele Haagse regio · Specialisatie in monumentale panden.",
  },
  {
    id: "groningen",
    naam: "Noord Airco Services",
    stad: "Groningen",
    lat: 53.2194,
    lng: 6.5665,
    aanvragen: 4,
    reactie: 2.5,
    status: "available",
    desc: "Enige gecertificeerde partner in Noord-Nederland · Breed servicegebied.",
  },
  {
    id: "breda",
    naam: "Airco Zuid BV",
    stad: "Breda",
    lat: 51.5719,
    lng: 4.7683,
    aanvragen: 5,
    reactie: 1.9,
    status: "busy",
    desc: "Familiebedrijf sinds 2012 · Gespecialiseerd in design modellen.",
  },
  {
    id: "tilburg",
    naam: "KlimaatComfort Tilburg",
    stad: "Tilburg",
    lat: 51.5555,
    lng: 5.0913,
    aanvragen: 3,
    reactie: 2.4,
    status: "available",
    desc: "Snelle installatie binnen 5 werkdagen · Inclusief 3 jaar garantie.",
  },
  {
    id: "arnhem",
    naam: "Gelderland Airco",
    stad: "Arnhem",
    lat: 51.9851,
    lng: 5.8987,
    aanvragen: 4,
    reactie: 2.0,
    status: "available",
    desc: "Werkgebied Arnhem, Velp en Oosterbeek · F-gassen gecertificeerd.",
  },
  {
    id: "maastricht",
    naam: "LimburgKoel",
    stad: "Maastricht",
    lat: 50.8514,
    lng: 5.6910,
    aanvragen: 2,
    reactie: 3.4,
    status: "busy",
    desc: "Installatie en onderhoud in heel Zuid-Limburg · Duitstalige service.",
  },
  {
    id: "zwolle",
    naam: "IJssel Klimaat",
    stad: "Zwolle",
    lat: 52.5168,
    lng: 6.0830,
    aanvragen: 3,
    reactie: 2.1,
    status: "available",
    desc: "Actief in Overijssel · Gespecialiseerd in woningen en kleine kantoren.",
  },
  {
    id: "leiden",
    naam: "KoelTechniek Leiden",
    stad: "Leiden",
    lat: 52.1601,
    lng: 4.4970,
    aanvragen: 4,
    reactie: 1.7,
    status: "available",
    desc: "Korte wachttijden · Ervaring met alle Toshiba-modellen.",
  },
  {
    id: "haarlem",
    naam: "Haarlem Air",
    stad: "Haarlem",
    lat: 52.3874,
    lng: 4.6462,
    aanvragen: 5,
    reactie: 1.3,
    status: "available",
    desc: "Snelste reactietijd in de regio · Premium klantenservice.",
  },
  {
    id: "almere",
    naam: "Flevo Airco",
    stad: "Almere",
    lat: 52.3508,
    lng: 5.2647,
    aanvragen: 3,
    reactie: 2.6,
    status: "available",
    desc: "Nieuwbouw specialist in Flevoland · Inclusief advies op maat.",
  },
  {
    id: "enschede",
    naam: "Twente Koeling",
    stad: "Enschede",
    lat: 52.2215,
    lng: 6.8937,
    aanvragen: 2,
    reactie: 3.0,
    status: "busy",
    desc: "Werkzaam in heel Twente · Eigen onderhoudsteam.",
  },
  {
    id: "denbosch",
    naam: "Brabant Klimaat BV",
    stad: "'s-Hertogenbosch",
    lat: 51.6978,
    lng: 5.3037,
    aanvragen: 4,
    reactie: 2.3,
    status: "available",
    desc: "Centraal in Brabant · Alle modellen op voorraad.",
  },
  {
    id: "apeldoorn",
    naam: "Veluwe Air Services",
    stad: "Apeldoorn",
    lat: 52.2112,
    lng: 5.9699,
    aanvragen: 3,
    reactie: 2.7,
    status: "available",
    desc: "Actief op de Veluwe en in de Stedendriehoek · Persoonlijk advies.",
  },
  {
    id: "amersfoort",
    naam: "AircoFit Amersfoort",
    stad: "Amersfoort",
    lat: 52.1561,
    lng: 5.3878,
    aanvragen: 6,
    reactie: 1.5,
    status: "available",
    desc: "Hoge klantwaardering · Specialisatie in de Haori en Kazumi.",
  },
  {
    id: "dordrecht",
    naam: "Drechtstreek Koeling",
    stad: "Dordrecht",
    lat: 51.8133,
    lng: 4.6901,
    aanvragen: 2,
    reactie: 2.8,
    status: "available",
    desc: "Werkzaam in de Drechtsteden · Flexibele planning.",
  },
  {
    id: "leeuwarden",
    naam: "Fries Klimaat",
    stad: "Leeuwarden",
    lat: 53.2012,
    lng: 5.7999,
    aanvragen: 2,
    reactie: 3.2,
    status: "available",
    desc: "Enige partner in Friesland · Brede regionale dekking.",
  },
  {
    id: "deventer",
    naam: "Salland Airco",
    stad: "Deventer",
    lat: 52.2660,
    lng: 6.1552,
    aanvragen: 3,
    reactie: 2.3,
    status: "busy",
    desc: "Actief in Salland en de IJsselvallei · Snel en vakkundig.",
  },
  {
    id: "delft",
    naam: "Delft KoelTech",
    stad: "Delft",
    lat: 52.0116,
    lng: 4.3571,
    aanvragen: 4,
    reactie: 1.8,
    status: "available",
    desc: "Gespecialiseerd in appartementen · Stille installaties.",
  },
  {
    id: "roosendaal",
    naam: "West-Brabant Air",
    stad: "Roosendaal",
    lat: 51.5308,
    lng: 4.4653,
    aanvragen: 2,
    reactie: 2.5,
    status: "available",
    desc: "Werkgebied West-Brabant en Zeeland · Inclusief onderhoud.",
  },
  {
    id: "hilversum",
    naam: "Gooi Klimaat",
    stad: "Hilversum",
    lat: 52.2292,
    lng: 5.1669,
    aanvragen: 5,
    reactie: 1.6,
    status: "available",
    desc: "Premium installaties in het Gooi · Ervaren met villa's en vrijstaande woningen.",
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
