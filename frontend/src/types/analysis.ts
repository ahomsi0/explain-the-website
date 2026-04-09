export type TechCategory = "cms" | "framework" | "analytics" | "cdn" | "builder" | "ecommerce";
export type Confidence = "high" | "medium" | "low";
export type SEOStatus = "pass" | "warning" | "fail";
export type AnalysisStatus = "idle" | "loading" | "error" | "success";
export type PageLoadHint = "lightweight" | "medium" | "heavy";

export interface TechItem {
  name: string;
  category: TechCategory;
  confidence: Confidence;
}

export interface SEOCheck {
  id: string;
  label: string;
  status: SEOStatus;
  detail: string;
}

export interface Overview {
  title: string;
  description: string;
  favicon: string;
  language: string;
  pageLoadHint: PageLoadHint;
}

export interface UXResult {
  hasCTA: boolean;
  ctaCount: number;
  hasForms: boolean;
  formCount: number;
  hasSocialProof: boolean;
  hasTrustSignals: boolean;
  hasContactInfo: boolean;
  mobileReady: boolean;
}

export interface PageStats {
  wordCount: number;
  imageCount: number;
  internalLinks: number;
  externalLinks: number;
  scriptCount: number;
  h1Count: number;
  h2Count: number;
  h3Count: number;
}

export interface AnalysisResult {
  url: string;
  fetchedAt: string;
  overview: Overview;
  techStack: TechItem[];
  seoChecks: SEOCheck[];
  ux: UXResult;
  pageStats?: PageStats;
  weakPoints: string[];
  recommendations: string[];
}

export interface AnalysisError {
  error: string;
}
