-- CreateEnum
CREATE TYPE "AdminRole" AS ENUM ('ADMIN', 'EDITOR');

-- CreateEnum
CREATE TYPE "EmploymentType" AS ENUM ('FULL_TIME', 'PART_TIME', 'CONTRACT', 'FREELANCE');

-- CreateEnum
CREATE TYPE "ProjectStatus" AS ENUM ('LIVE', 'MAINTENANCE', 'ARCHIVED', 'CONCEPT');

-- CreateEnum
CREATE TYPE "Industry" AS ENUM ('SAAS', 'ERP', 'FINTECH', 'EDTECH', 'ECOMMERCE', 'GOVERNMENT', 'AI', 'TRAVEL', 'HOSPITALITY', 'OTHER');

-- CreateEnum
CREATE TYPE "ProjectType" AS ENUM ('WEB_APP', 'MOBILE_APP', 'API_PLATFORM', 'INTERNAL_TOOL');

-- CreateEnum
CREATE TYPE "TechCategory" AS ENUM ('FRONTEND', 'BACKEND', 'DATABASE', 'INFRASTRUCTURE', 'AI', 'MOBILE', 'TOOLS');

-- CreateEnum
CREATE TYPE "TechImportance" AS ENUM ('PRIMARY', 'SECONDARY');

-- CreateEnum
CREATE TYPE "SkillCategory" AS ENUM ('LANGUAGE', 'FRAMEWORK', 'DATABASE', 'INFRASTRUCTURE', 'AI_ML', 'ARCHITECTURE', 'LEADERSHIP', 'OTHER');

-- CreateEnum
CREATE TYPE "SkillLevel" AS ENUM ('FAMILIAR', 'PROFICIENT', 'ADVANCED', 'EXPERT');

-- CreateEnum
CREATE TYPE "ArticleType" AS ENUM ('ARCHITECTURE', 'AI', 'ENGINEERING', 'NEXTJS', 'DATABASE', 'LEADERSHIP');

-- CreateEnum
CREATE TYPE "MediaType" AS ENUM ('IMAGE', 'DIAGRAM', 'VIDEO', 'DOCUMENT');

-- CreateEnum
CREATE TYPE "ExternalLinkType" AS ENUM ('GITHUB', 'LIVE_DEMO', 'CASE_STUDY', 'ARTICLE', 'OTHER');

-- CreateEnum
CREATE TYPE "SourceType" AS ENUM ('PROFILE', 'EXPERIENCE', 'PROJECT', 'ARTICLE', 'SKILL', 'CUSTOM');

-- CreateEnum
CREATE TYPE "ConversationMode" AS ENUM ('GENERAL', 'RECRUITER', 'ENGINEERING', 'JOB_MATCH');

-- CreateEnum
CREATE TYPE "MessageRole" AS ENUM ('USER', 'ASSISTANT', 'TOOL', 'SYSTEM');

-- CreateEnum
CREATE TYPE "EvalCategory" AS ENUM ('FACTUAL', 'SOURCE_ATTRIBUTION', 'HALLUCINATION', 'PROMPT_INJECTION', 'RELEVANCE', 'JOB_FIT');

-- CreateEnum
CREATE TYPE "AnalyticsEventType" AS ENUM ('CV_DOWNLOAD', 'PROJECT_VIEW', 'ARTICLE_VIEW', 'AI_OPEN', 'AI_QUESTION', 'JOB_MATCH_RUN', 'CONTACT_CLICK', 'CONTACT_SUBMIT', 'GITHUB_CLICK', 'LINKEDIN_CLICK');

-- CreateEnum
CREATE TYPE "ContactStatus" AS ENUM ('NEW', 'READ', 'REPLIED', 'SPAM');

-- CreateTable
CREATE TABLE "AdminUser" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "image" TEXT,
    "role" "AdminRole" NOT NULL DEFAULT 'EDITOR',
    "lastLoginAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AdminUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Profile" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "headline" TEXT NOT NULL,
    "shortBio" TEXT NOT NULL,
    "longBio" TEXT NOT NULL,
    "location" TEXT,
    "availability" TEXT,
    "yearsExperience" INTEGER,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "linkedinUrl" TEXT,
    "githubUrl" TEXT,
    "cvUrl" TEXT,
    "avatarUrl" TEXT,
    "heroImageUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Experience" (
    "id" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "companySlug" TEXT NOT NULL,
    "jobTitle" TEXT NOT NULL,
    "employmentType" "EmploymentType" NOT NULL DEFAULT 'FULL_TIME',
    "location" TEXT,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "isCurrent" BOOLEAN NOT NULL DEFAULT false,
    "summary" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Experience_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExperienceAchievement" (
    "id" TEXT NOT NULL,
    "experienceId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "metric" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "ExperienceAchievement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "shortDescription" TEXT NOT NULL,
    "longDescription" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "clientName" TEXT,
    "market" TEXT,
    "industry" "Industry" NOT NULL,
    "projectType" "ProjectType" NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "isCurrent" BOOLEAN NOT NULL DEFAULT false,
    "status" "ProjectStatus" NOT NULL DEFAULT 'LIVE',
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "githubUrl" TEXT,
    "liveUrl" TEXT,
    "caseStudyUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectChallenge" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "ProjectChallenge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectSolution" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "ProjectSolution_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectOutcome" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "metric" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "ProjectOutcome_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Technology" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "category" "TechCategory" NOT NULL,
    "icon" TEXT,
    "url" TEXT,
    "description" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Technology_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectTechnology" (
    "projectId" TEXT NOT NULL,
    "technologyId" TEXT NOT NULL,
    "importance" "TechImportance" NOT NULL DEFAULT 'PRIMARY',

    CONSTRAINT "ProjectTechnology_pkey" PRIMARY KEY ("projectId","technologyId")
);

-- CreateTable
CREATE TABLE "Skill" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" "SkillCategory" NOT NULL,
    "level" "SkillLevel" NOT NULL,
    "years" DOUBLE PRECISION,
    "description" TEXT,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Skill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Education" (
    "id" TEXT NOT NULL,
    "institution" TEXT NOT NULL,
    "degree" TEXT NOT NULL,
    "field" TEXT,
    "location" TEXT,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "description" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Education_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Certification" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "issuer" TEXT NOT NULL,
    "issueDate" TIMESTAMP(3) NOT NULL,
    "expiryDate" TIMESTAMP(3),
    "credentialUrl" TEXT,
    "description" TEXT,

    CONSTRAINT "Certification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Article" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "excerpt" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "articleType" "ArticleType" NOT NULL,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "publishedAt" TIMESTAMP(3),
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "coverImageUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Article_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MediaAsset" (
    "id" TEXT NOT NULL,
    "type" "MediaType" NOT NULL,
    "url" TEXT NOT NULL,
    "alt" TEXT NOT NULL,
    "caption" TEXT,
    "width" INTEGER,
    "height" INTEGER,
    "projectId" TEXT,
    "articleId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MediaAsset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExternalLink" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "type" "ExternalLinkType" NOT NULL,
    "projectId" TEXT,
    "experienceId" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "ExternalLink_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KnowledgeDocument" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "sourceType" "SourceType" NOT NULL,
    "sourceId" TEXT,
    "content" TEXT NOT NULL,
    "contentHash" TEXT NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "KnowledgeDocument_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KnowledgeChunk" (
    "id" TEXT NOT NULL,
    "documentId" TEXT NOT NULL,
    "chunkIndex" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "tokenCount" INTEGER NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "KnowledgeChunk_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Conversation" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "mode" "ConversationMode" NOT NULL DEFAULT 'GENERAL',
    "visitorHash" TEXT,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastMessageAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "metadata" JSONB,

    CONSTRAINT "Conversation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Message" (
    "id" TEXT NOT NULL,
    "conversationId" TEXT NOT NULL,
    "role" "MessageRole" NOT NULL,
    "content" TEXT NOT NULL,
    "model" TEXT,
    "inputTokens" INTEGER,
    "outputTokens" INTEGER,
    "latencyMs" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ToolCall" (
    "id" TEXT NOT NULL,
    "messageId" TEXT NOT NULL,
    "toolName" TEXT NOT NULL,
    "arguments" JSONB NOT NULL,
    "result" JSONB,
    "durationMs" INTEGER,
    "success" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ToolCall_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JobMatchAnalysis" (
    "id" TEXT NOT NULL,
    "conversationId" TEXT,
    "shareSlug" TEXT NOT NULL,
    "jobDescriptionRaw" TEXT NOT NULL,
    "extractedRequirements" JSONB NOT NULL,
    "overallScore" INTEGER NOT NULL,
    "strongMatches" JSONB NOT NULL,
    "partialMatches" JSONB NOT NULL,
    "gaps" JSONB NOT NULL,
    "suggestedTopics" JSONB,
    "model" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "JobMatchAnalysis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AIEvaluationCase" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" "EvalCategory" NOT NULL,
    "input" TEXT NOT NULL,
    "expectedBehavior" TEXT NOT NULL,
    "expectedSources" JSONB,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AIEvaluationCase_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AIEvaluationRunResult" (
    "id" TEXT NOT NULL,
    "runId" TEXT NOT NULL,
    "caseId" TEXT NOT NULL,
    "actualResponse" TEXT,
    "score" DOUBLE PRECISION,
    "passed" BOOLEAN,
    "model" TEXT,
    "latencyMs" INTEGER,
    "totalTokens" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AIEvaluationRunResult_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AnalyticsEvent" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "eventType" "AnalyticsEventType" NOT NULL,
    "entityType" TEXT,
    "entityId" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AnalyticsEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContactMessage" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "subject" TEXT,
    "message" TEXT NOT NULL,
    "status" "ContactStatus" NOT NULL DEFAULT 'NEW',
    "ipHash" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ContactMessage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AdminUser_email_key" ON "AdminUser"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Experience_companySlug_key" ON "Experience"("companySlug");

-- CreateIndex
CREATE INDEX "Experience_published_sortOrder_idx" ON "Experience"("published", "sortOrder");

-- CreateIndex
CREATE INDEX "ExperienceAchievement_experienceId_idx" ON "ExperienceAchievement"("experienceId");

-- CreateIndex
CREATE UNIQUE INDEX "Project_slug_key" ON "Project"("slug");

-- CreateIndex
CREATE INDEX "Project_published_featured_sortOrder_idx" ON "Project"("published", "featured", "sortOrder");

-- CreateIndex
CREATE INDEX "ProjectChallenge_projectId_idx" ON "ProjectChallenge"("projectId");

-- CreateIndex
CREATE INDEX "ProjectSolution_projectId_idx" ON "ProjectSolution"("projectId");

-- CreateIndex
CREATE INDEX "ProjectOutcome_projectId_idx" ON "ProjectOutcome"("projectId");

-- CreateIndex
CREATE UNIQUE INDEX "Technology_slug_key" ON "Technology"("slug");

-- CreateIndex
CREATE INDEX "ProjectTechnology_technologyId_idx" ON "ProjectTechnology"("technologyId");

-- CreateIndex
CREATE UNIQUE INDEX "Article_slug_key" ON "Article"("slug");

-- CreateIndex
CREATE INDEX "Article_published_articleType_idx" ON "Article"("published", "articleType");

-- CreateIndex
CREATE INDEX "MediaAsset_projectId_idx" ON "MediaAsset"("projectId");

-- CreateIndex
CREATE INDEX "MediaAsset_articleId_idx" ON "MediaAsset"("articleId");

-- CreateIndex
CREATE INDEX "ExternalLink_projectId_idx" ON "ExternalLink"("projectId");

-- CreateIndex
CREATE INDEX "ExternalLink_experienceId_idx" ON "ExternalLink"("experienceId");

-- CreateIndex
CREATE INDEX "KnowledgeDocument_sourceType_sourceId_idx" ON "KnowledgeDocument"("sourceType", "sourceId");

-- CreateIndex
CREATE UNIQUE INDEX "KnowledgeDocument_sourceType_sourceId_key" ON "KnowledgeDocument"("sourceType", "sourceId");

-- CreateIndex
CREATE INDEX "KnowledgeChunk_documentId_idx" ON "KnowledgeChunk"("documentId");

-- CreateIndex
CREATE INDEX "Conversation_mode_startedAt_idx" ON "Conversation"("mode", "startedAt");

-- CreateIndex
CREATE INDEX "Conversation_lastMessageAt_idx" ON "Conversation"("lastMessageAt");

-- CreateIndex
CREATE UNIQUE INDEX "Conversation_sessionId_mode_key" ON "Conversation"("sessionId", "mode");

-- CreateIndex
CREATE INDEX "Message_conversationId_idx" ON "Message"("conversationId");

-- CreateIndex
CREATE INDEX "ToolCall_messageId_idx" ON "ToolCall"("messageId");

-- CreateIndex
CREATE INDEX "ToolCall_toolName_idx" ON "ToolCall"("toolName");

-- CreateIndex
CREATE UNIQUE INDEX "JobMatchAnalysis_shareSlug_key" ON "JobMatchAnalysis"("shareSlug");

-- CreateIndex
CREATE INDEX "JobMatchAnalysis_shareSlug_idx" ON "JobMatchAnalysis"("shareSlug");

-- CreateIndex
CREATE INDEX "JobMatchAnalysis_createdAt_idx" ON "JobMatchAnalysis"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "AIEvaluationCase_name_key" ON "AIEvaluationCase"("name");

-- CreateIndex
CREATE INDEX "AIEvaluationCase_category_active_idx" ON "AIEvaluationCase"("category", "active");

-- CreateIndex
CREATE INDEX "AIEvaluationRunResult_runId_idx" ON "AIEvaluationRunResult"("runId");

-- CreateIndex
CREATE INDEX "AIEvaluationRunResult_caseId_passed_idx" ON "AIEvaluationRunResult"("caseId", "passed");

-- CreateIndex
CREATE UNIQUE INDEX "AIEvaluationRunResult_runId_caseId_key" ON "AIEvaluationRunResult"("runId", "caseId");

-- CreateIndex
CREATE INDEX "AnalyticsEvent_eventType_createdAt_idx" ON "AnalyticsEvent"("eventType", "createdAt");

-- CreateIndex
CREATE INDEX "AnalyticsEvent_sessionId_idx" ON "AnalyticsEvent"("sessionId");

-- CreateIndex
CREATE INDEX "ContactMessage_status_createdAt_idx" ON "ContactMessage"("status", "createdAt");

-- AddForeignKey
ALTER TABLE "ExperienceAchievement" ADD CONSTRAINT "ExperienceAchievement_experienceId_fkey" FOREIGN KEY ("experienceId") REFERENCES "Experience"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectChallenge" ADD CONSTRAINT "ProjectChallenge_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectSolution" ADD CONSTRAINT "ProjectSolution_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectOutcome" ADD CONSTRAINT "ProjectOutcome_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectTechnology" ADD CONSTRAINT "ProjectTechnology_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectTechnology" ADD CONSTRAINT "ProjectTechnology_technologyId_fkey" FOREIGN KEY ("technologyId") REFERENCES "Technology"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MediaAsset" ADD CONSTRAINT "MediaAsset_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MediaAsset" ADD CONSTRAINT "MediaAsset_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "Article"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExternalLink" ADD CONSTRAINT "ExternalLink_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExternalLink" ADD CONSTRAINT "ExternalLink_experienceId_fkey" FOREIGN KEY ("experienceId") REFERENCES "Experience"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KnowledgeChunk" ADD CONSTRAINT "KnowledgeChunk_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "KnowledgeDocument"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ToolCall" ADD CONSTRAINT "ToolCall_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "Message"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobMatchAnalysis" ADD CONSTRAINT "JobMatchAnalysis_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AIEvaluationRunResult" ADD CONSTRAINT "AIEvaluationRunResult_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "AIEvaluationCase"("id") ON DELETE CASCADE ON UPDATE CASCADE;
