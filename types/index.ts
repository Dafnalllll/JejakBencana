export type FundCategory = "ALLOCATION" | "DISTRIBUTION" | "REALIZATION" | "PLAN";

export type CaseStatus = "DRAFT" | "PUBLISHED";

export interface SourceDocument {
  id: string;
  title: string;
  url: string;
  publisher: string;
  publicationDate?: string;
  lastCheckedAt?: string;
  verificationNote?: string;
}

export interface FundRecord {
  id: string;
  caseId: string;
  category: FundCategory;
  amount: number;
  currency: "IDR";
  purpose?: string;
  documentDate?: string;
  periodLabel?: string;
  notes?: string;
  sources: SourceDocument[];
}

export interface DisasterCase {
  id: string;
  title: string;
  slug: string;
  affectedArea: string;
  summary: string;
  incidentDate?: string;
  periodStart?: string;
  periodEnd?: string;
  contextNote?: string;
  scopeLimitations?: string;
  status: CaseStatus;
  publishedAt?: string;
  updatedAt: string;
  fundRecords: FundRecord[];
  sourceDocuments: SourceDocument[];
}
