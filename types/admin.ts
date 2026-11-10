import type { CaseStatus, FundCategory } from "@/types";

export type AdminFormStep = 0 | 1 | 2;

export interface CaseForm {
  title: string;
  slug: string;
  affectedArea: string;
  summary: string;
  incidentDate: string;
  periodStart: string;
  periodEnd: string;
  contextNote: string;
  scopeLimitations: string;
  status: CaseStatus;
}

export interface FundForm {
  id: string;
  category: FundCategory;
  amount: string;
  purpose: string;
  periodLabel: string;
  documentDate: string;
  sourceTitle: string;
}

export interface SourceForm {
  id: string;
  title: string;
  url: string;
  publisher: string;
  publicationDate: string;
  lastCheckedAt: string;
}
