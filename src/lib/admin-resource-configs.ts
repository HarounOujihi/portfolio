/** Field specs for the generic admin resource editors (client-safe pure data). */

export type FieldType = "text" | "textarea" | "bigtextarea" | "number" | "date" | "checkbox" | "select";

export interface FieldSpec {
  name: string;
  label: string;
  type: FieldType;
  options?: readonly string[];
  required?: boolean;
  maxLength?: number;
  half?: boolean;
}

export interface ResourceSpec {
  key: string;
  label: string;
  titleField: string;
  fields: FieldSpec[];
  /** sortOrder move support on the list */
  hasOrder: boolean;
  /** auto-generate slug from this field (articles) */
  slugFrom?: string;
}

export const TECH_CATEGORIES = ["FRONTEND", "BACKEND", "DATABASE", "INFRASTRUCTURE", "AI", "MOBILE", "TOOLS"] as const;
export const SKILL_CATEGORIES = ["LANGUAGE", "FRAMEWORK", "DATABASE", "INFRASTRUCTURE", "AI_ML", "ARCHITECTURE", "LEADERSHIP", "OTHER"] as const;
export const SKILL_LEVELS = ["FAMILIAR", "PROFICIENT", "ADVANCED", "EXPERT"] as const;
export const ARTICLE_TYPES = ["ARCHITECTURE", "AI", "ENGINEERING", "NEXTJS", "DATABASE", "LEADERSHIP"] as const;

export const RESOURCE_SPECS: Record<string, ResourceSpec> = {
  technologies: {
    key: "technologies",
    label: "Technologies",
    titleField: "name",
    hasOrder: true,
    fields: [
      { name: "name", label: "Name", type: "text", required: true, maxLength: 60 },
      { name: "category", label: "Category", type: "select", options: TECH_CATEGORIES, required: true, half: true },
      { name: "url", label: "URL", type: "text", half: true },
      { name: "description", label: "Description", type: "textarea" },
    ],
  },
  skills: {
    key: "skills",
    label: "Skills",
    titleField: "name",
    hasOrder: true,
    fields: [
      { name: "name", label: "Name", type: "text", required: true, maxLength: 80 },
      { name: "category", label: "Category", type: "select", options: SKILL_CATEGORIES, required: true, half: true },
      { name: "level", label: "Level", type: "select", options: SKILL_LEVELS, required: true, half: true },
      { name: "years", label: "Years of experience", type: "number", half: true },
      { name: "featured", label: "Featured on about page", type: "checkbox" },
      { name: "description", label: "Description", type: "textarea" },
    ],
  },
  education: {
    key: "education",
    label: "Education",
    titleField: "institution",
    hasOrder: true,
    fields: [
      { name: "institution", label: "Institution", type: "text", required: true, maxLength: 120 },
      { name: "degree", label: "Degree", type: "text", required: true, half: true },
      { name: "field", label: "Field", type: "text", half: true },
      { name: "location", label: "Location", type: "text", half: true },
      { name: "startDate", label: "Start", type: "date", required: true, half: true },
      { name: "endDate", label: "End", type: "date", half: true },
      { name: "description", label: "Description", type: "textarea" },
    ],
  },
  certifications: {
    key: "certifications",
    label: "Certifications",
    titleField: "name",
    hasOrder: false,
    fields: [
      { name: "name", label: "Name", type: "text", required: true, maxLength: 120 },
      { name: "issuer", label: "Issuer", type: "text", required: true, half: true },
      { name: "issueDate", label: "Issue date", type: "date", required: true, half: true },
      { name: "expiryDate", label: "Expiry date", type: "date", half: true },
      { name: "credentialUrl", label: "Credential URL", type: "text", half: true },
      { name: "description", label: "Description", type: "textarea" },
    ],
  },
  articles: {
    key: "articles",
    label: "Articles",
    titleField: "title",
    slugFrom: "title",
    hasOrder: false,
    fields: [
      { name: "title", label: "Title", type: "text", required: true, maxLength: 150 },
      { name: "articleType", label: "Type", type: "select", options: ARTICLE_TYPES, required: true, half: true },
      { name: "published", label: "Published", type: "checkbox", half: true },
      { name: "excerpt", label: "Excerpt", type: "textarea", required: true },
      { name: "content", label: "Content (Markdown)", type: "bigtextarea", required: true },
    ],
  },
};

export function getResourceSpec(resource: string): ResourceSpec | undefined {
  return RESOURCE_SPECS[resource];
}
