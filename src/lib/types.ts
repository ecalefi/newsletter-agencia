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

export interface PackageImage {
  imageUrl: string;
  caption: string;
}

export interface NewsletterContent {
  templateVersion: "v2";
  agencyName: string;
  preheader: string;
  nationalPackages: PackageImage[];
  internationalPackages: PackageImage[];
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
