export type ContactStatus = "active" | "unsubscribed";
export type ContactSource = "manual" | "spreadsheet";

export interface Contact {
  id: string;
  name: string;
  email: string;
  whatsapp: string;
  source: ContactSource;
  status: ContactStatus;
  createdAt: string;
}

export interface SectionCard {
  title: string;
  subtitle: string;
  description: string;
  price: string;
  imageUrl: string;
  ctaUrl: string;
  ctaLabel: string;
}

export interface ReviewCard {
  name: string;
  role: string;
  text: string;
  rating: string;
  avatarUrl: string;
}

export interface BannerBlock {
  title: string;
  subtitle: string;
  imageUrl: string;
  ctaUrl: string;
  ctaLabel: string;
}

export interface HeroBlock {
  title: string;
  subtitle: string;
  imageUrl: string;
  ctaLabel: string;
  ctaUrl: string;
}

export interface FooterBlock {
  email: string;
  phone: string;
  address: string;
  website: string;
  instagram: string;
  unsubscribeUrl: string;
}

export interface NewsletterContent {
  templateVersion: "v1";
  agencyName: string;
  preheader: string;
  logoUrl: string;
  hero: HeroBlock;
  banner1: BannerBlock;
  banner2: BannerBlock;
  destinations: SectionCard[];
  hotels: SectionCard[];
  packages: SectionCard[];
  reviews: ReviewCard[];
  footer: FooterBlock;
  updatedAt: string;
}

export interface CampaignLog {
  id: string;
  subject: string;
  previewText: string;
  mode: "test" | "weekly";
  testEmail?: string;
  totalRecipients: number;
  status: "sent" | "failed";
  providerMessageId?: string;
  error?: string;
  sentAt: string;
}

export interface AppDb {
  contacts: Contact[];
  newsletter: NewsletterContent;
  campaigns: CampaignLog[];
}
