export interface LegalSource {
  id: string;
  type: 'act' | 'notification' | 'circular' | 'guideline';
  authority: string;
  reference: string;
  title: string;
  text: string;
  url: string;
  effectiveDate?: string;
}

export interface LegalCitation {
  source: LegalSource;
  excerpt: string;
  relevance: string;
}
