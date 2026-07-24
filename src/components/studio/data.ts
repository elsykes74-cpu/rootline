export interface DemoPackage {
  id: string;
  title: string;
  fileName: string;
  size: string;
  duration: string;
  thumb: string;
}

export const DEMO_PACKAGES: DemoPackage[] = [
  {
    id: "film",
    title: "The New Black Indie Film Circuit",
    fileName: "The New Black Indie Film Circuit.mp4",
    size: "2.4 GB",
    duration: "42:18",
    thumb: "/images/thumb-film.png",
  },
  {
    id: "hiphop",
    title: "Cypher Sundays Vol 12",
    fileName: "Cypher Sundays Vol 12.mp4",
    size: "1.8 GB",
    duration: "28:04",
    thumb: "/images/thumb-hiphop.png",
  },
  {
    id: "soulfood",
    title: "Jollof Blind Taste Test",
    fileName: "Jollof Blind Taste Test.mp4",
    size: "3.1 GB",
    duration: "35:52",
    thumb: "/images/thumb-soulfood.png",
  },
];

export const CATEGORIES = [
  "Film",
  "Afrobeats",
  "Hip-Hop",
  "HBCU",
  "Black Tech",
  "Culture",
  "Soul Food",
  "Gospel",
  "Style",
  "Roots",
  "Jazz",
] as const;

export const VIDEO_TYPES = [
  "Episode",
  "Short",
  "Live Replay",
  "Premiere",
  "Members-only",
  "Podcast",
] as const;

export const STEPS = [
  "Select File",
  "Package Details",
  "Rights & Safety",
  "Processing",
  "Publish Plan",
] as const;

export type StageStatus = "queued" | "processing" | "complete";

export interface Stage {
  id: string;
  label: string;
}

export const STAGES: Stage[] = [
  { id: "upload", label: "Upload received" },
  { id: "security", label: "Virus / security scan" },
  { id: "proxy", label: "360p proxy" },
  { id: "hd", label: "1080p encode" },
  { id: "uhd", label: "4K encode" },
  { id: "captions", label: "Captions generated" },
  { id: "thumbs", label: "Thumbnails generated" },
  { id: "rights", label: "Rights scan" },
  { id: "fairpay", label: "FairPay pre-check" },
];

export const DECLARATIONS = [
  {
    id: "music",
    label: "Music rights",
    hint: "All music is licensed, original, or cleared for this upload.",
  },
  {
    id: "visual",
    label: "Visual copyright",
    hint: "Footage and images are yours or properly licensed.",
  },
  {
    id: "clips",
    label: "Reused clips",
    hint: "Third-party clips are declared and fall within fair use or license.",
  },
  {
    id: "age",
    label: "Age rating",
    hint: "The rating you set reflects the actual content of the package.",
  },
  {
    id: "sponsors",
    label: "Sponsor conflicts",
    hint: "Sponsorships and paid placements are disclosed.",
  },
  {
    id: "advertiser",
    label: "Advertiser fit",
    hint: "You understand ads may be limited pending human review.",
  },
] as const;

export const EARNING_LANES = [
  { name: "FairPay revenue share", status: "Planned" },
  { name: "Channel memberships", status: "Planned" },
  { name: "Premiere tickets", status: "Planned" },
  { name: "Tips & thanks", status: "Planned" },
  { name: "Brand partnership desk", status: "Planned" },
];

export const LIMIT_TIERS = [
  {
    name: "Standard Creator",
    specs: ["3 hr max length", "50 GB max file", "4K SDR · 60fps"],
    highlight: false,
  },
  {
    name: "Approved Partner",
    specs: ["12 hr max length", "256 GB max file", "4K HDR · priority review"],
    highlight: true,
  },
  {
    name: "8K Future Pilot",
    specs: ["Invite-only", "8K HDR pipeline", "Dedicated review pod"],
    highlight: false,
  },
];
