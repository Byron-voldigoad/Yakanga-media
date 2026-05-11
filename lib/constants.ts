
export const CATEGORIES = [
  { name: 'Actualités',               slug: 'actualites' },
  { name: 'Culture',                  slug: 'culture' },
  { name: 'Découverte',               slug: 'decouverte' },
  { name: 'Dossiers',                 slug: 'dossiers' },
  { name: 'Édito',                    slug: 'edito' },
  { name: 'Interviews',               slug: 'interviews' },
  { name: 'Kalara',                   slug: 'kalara' },
  { name: 'Le commentaire d\'écoute', slug: 'commentaire-ecoute' },
  { name: 'Mode',                     slug: 'mode' },
  { name: 'Opinions',                 slug: 'opinions' },
  { name: 'Politique',                slug: 'politique' },
  { name: 'Portraits',                slug: 'portraits' },
  { name: 'Société',                  slug: 'societe' },
  { name: 'Sport',                    slug: 'sport' },
  { name: 'Technologie',              slug: 'technologie' },
]

// Lookup par slug pour les pages de catégorie
export const CATEGORIES_METADATA: Record<string, { name: string, color: string, description: string }> = {
  "actualites": {
    name: "Actualités",
    color: "#5C3A1E",
    description: "Les dernières nouvelles culturelles et sociétales d'ici et d'ailleurs."
  },
  "culture": {
    name: "Culture",
    color: "#D35400",
    description: "L'art, les traditions et les expressions culturelles africaines."
  },
  "decouverte": {
    name: "Découverte",
    color: "#27AE60",
    description: "Nouveaux talents, lieux insolites et pépites culturelles à explorer."
  },
  "dossiers": {
    name: "Dossiers",
    color: "#2C3E50",
    description: "Enquêtes et reportages au long cours sur des thématiques clés."
  },
  "edito": {
    name: "Édito",
    color: "#2D6A2D",
    description: "La voix de Yakanga, nos réflexions sur l'actualité et la culture."
  },
  "interviews": {
    name: "Interviews",
    color: "#E67E22",
    description: "Entretiens exclusifs avec les acteurs de la scène culturelle."
  },
  "kalara": {
    name: "Kalara",
    color: "#CC2200",
    description: "Le monde du livre, de l'écriture et de la pensée littéraire."
  },
  "commentaire-ecoute": {
    name: "Le commentaire d'écoute",
    color: "#7F8C8D",
    description: "Analyses approfondies et critiques musicales pour une écoute éclairée."
  },
  "mode": {
    name: "Mode",
    color: "#9B59B6",
    description: "Tendances, créateurs et l'esthétique des cultures modernes."
  },
  "opinions": {
    name: "Opinions",
    color: "#E8440A",
    description: "Tribunes libres et points de vue engagés sur les enjeux contemporains."
  },
  "politique": {
    name: "Politique",
    color: "#2980B9",
    description: "Analyses et décryptages de la scène politique et institutionnelle."
  },
  "portraits": {
    name: "Portraits",
    color: "#3AADA8",
    description: "Rencontres avec les figures marquantes de notre temps."
  },
  "societe": {
    name: "Société",
    color: "#8E44AD",
    description: "Les dynamiques sociales, débats et modes de vie qui transforment notre monde."
  },
  "sport": {
    name: "Sport",
    color: "#C0392B",
    description: "L'actualité sportive, les exploits et les enjeux du monde du sport."
  },
  "technologie": {
    name: "Technologie",
    color: "#34495E",
    description: "Innovations, numérique et l'impact de la technologie sur notre avenir."
  }
};
