-- ============================================================
-- Update 26 — Website Analyzer & Opportunity Scoring
-- Run in: Supabase Dashboard → SQL Editor
-- ============================================================

-- ══════════════════════════════════════════════════════════
-- 1. WEBSITE ANALYSIS TABLE
-- ══════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS website_analyses (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Website Info
  url               TEXT NOT NULL,
  domain            TEXT NOT NULL,
  company_name      TEXT,
  
  -- Analysis Status
  status            TEXT NOT NULL DEFAULT 'pending'
                    CHECK (status IN ('pending', 'analyzing', 'completed', 'failed')),
  
  -- Performance Metrics (Google Lighthouse)
  performance_score       INTEGER,  -- 0-100
  accessibility_score     INTEGER,  -- 0-100
  best_practices_score    INTEGER,  -- 0-100
  seo_score              INTEGER,  -- 0-100
  
  -- Core Web Vitals
  lcp                    NUMERIC(10,2),  -- Largest Contentful Paint (seconds)
  fid                    NUMERIC(10,2),  -- First Input Delay (ms)
  cls                    NUMERIC(10,3),  -- Cumulative Layout Shift
  
  -- SEO Analysis
  meta_title            TEXT,
  meta_description      TEXT,
  h1_tags               TEXT[],
  has_sitemap           BOOLEAN,
  has_robots_txt        BOOLEAN,
  mobile_friendly       BOOLEAN,
  page_speed_mobile     INTEGER,
  page_speed_desktop    INTEGER,
  
  -- Technical Issues
  issues_found          INTEGER DEFAULT 0,
  critical_issues       INTEGER DEFAULT 0,
  warnings              INTEGER DEFAULT 0,
  opportunities         INTEGER DEFAULT 0,
  
  -- Issue Details (JSONB for flexibility)
  seo_issues            JSONB DEFAULT '[]'::jsonb,
  performance_issues    JSONB DEFAULT '[]'::jsonb,
  accessibility_issues  JSONB DEFAULT '[]'::jsonb,
  security_issues       JSONB DEFAULT '[]'::jsonb,
  
  -- Technology Stack
  technologies          JSONB DEFAULT '[]'::jsonb,  -- ["WordPress", "React", etc.]
  
  -- Opportunity Score
  opportunity_score     INTEGER,  -- 0-100 (calculated)
  estimated_budget_min  NUMERIC(10,2),
  estimated_budget_max  NUMERIC(10,2),
  priority_level        TEXT CHECK (priority_level IN ('low', 'medium', 'high', 'urgent')),
  
  -- Analysis Report
  report_url            TEXT,  -- PDF report URL
  report_generated_at   TIMESTAMPTZ,
  
  -- Metadata
  analyzed_at           TIMESTAMPTZ,
  created_at            TIMESTAMPTZ DEFAULT NOW(),
  updated_at            TIMESTAMPTZ DEFAULT NOW(),
  
  -- Indexes
  UNIQUE(user_id, url)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_website_analyses_user ON website_analyses(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_website_analyses_domain ON website_analyses(domain);
CREATE INDEX IF NOT EXISTS idx_website_analyses_status ON website_analyses(user_id, status);
CREATE INDEX IF NOT EXISTS idx_website_analyses_opportunity ON website_analyses(user_id, opportunity_score DESC NULLS LAST);
CREATE INDEX IF NOT EXISTS idx_website_analyses_priority ON website_analyses(user_id, priority_level, opportunity_score DESC);

-- RLS Policies
ALTER TABLE website_analyses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "website_analyses_own" ON website_analyses FOR ALL USING (auth.uid() = user_id);

-- Updated timestamp trigger
CREATE TRIGGER trg_website_analyses_updated
  BEFORE UPDATE ON website_analyses
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE website_analyses IS 'Website analysis results for lead prospecting and opportunity scoring';


-- ══════════════════════════════════════════════════════════
-- 2. LEADS TABLE (Enhanced with website analysis)
-- ══════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS leads (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Company Info
  company_name      TEXT NOT NULL,
  website           TEXT,
  domain            TEXT,
  industry          TEXT,
  company_size      TEXT,  -- "1-10", "11-50", "51-200", "201-500", "500+"
  
  -- Contact Info
  contact_name      TEXT,
  contact_email     TEXT,
  contact_phone     TEXT,
  contact_title     TEXT,
  
  -- Location
  country           CHAR(2) REFERENCES countries(code),
  city              TEXT,
  address           TEXT,
  
  -- Lead Source & Status
  source            TEXT,  -- "Website Analyzer", "LinkedIn", "Manual", etc.
  status            TEXT NOT NULL DEFAULT 'new'
                    CHECK (status IN ('new', 'contacted', 'qualified', 'proposal_sent', 'won', 'lost')),
  
  -- Scoring
  lead_score        INTEGER,  -- 0-100
  opportunity_score INTEGER,  -- From website analysis
  priority          TEXT CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  
  -- Website Analysis Link
  website_analysis_id UUID REFERENCES website_analyses(id) ON DELETE SET NULL,
  
  -- Budget Estimation
  estimated_budget_min  NUMERIC(10,2),
  estimated_budget_max  NUMERIC(10,2),
  
  -- Engagement
  last_contacted_at TIMESTAMPTZ,
  next_follow_up    TIMESTAMPTZ,
  
  -- Notes
  notes             TEXT,
  tags              TEXT[],
  
  -- Conversion
  converted_to_client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
  converted_at      TIMESTAMPTZ,
  
  -- Metadata
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_leads_user ON leads(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(user_id, status);
CREATE INDEX IF NOT EXISTS idx_leads_score ON leads(user_id, lead_score DESC NULLS LAST);
CREATE INDEX IF NOT EXISTS idx_leads_priority ON leads(user_id, priority, lead_score DESC);
CREATE INDEX IF NOT EXISTS idx_leads_website_analysis ON leads(website_analysis_id);
CREATE INDEX IF NOT EXISTS idx_leads_domain ON leads(domain);

-- RLS Policies
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "leads_own" ON leads FOR ALL USING (auth.uid() = user_id);

-- Updated timestamp trigger
CREATE TRIGGER trg_leads_updated
  BEFORE UPDATE ON leads
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

COMMENT ON TABLE leads IS 'Lead management with website analysis integration';


-- ══════════════════════════════════════════════════════════
-- 3. OPPORTUNITY SCORING FUNCTION
-- ══════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION calculate_opportunity_score(
  p_performance_score INTEGER,
  p_seo_score INTEGER,
  p_issues_found INTEGER,
  p_critical_issues INTEGER,
  p_mobile_friendly BOOLEAN,
  p_page_speed_mobile INTEGER
)
RETURNS INTEGER AS $$
DECLARE
  v_score INTEGER := 0;
  v_max_score INTEGER := 100;
BEGIN
  -- Performance issues (30 points)
  IF p_performance_score < 50 THEN
    v_score := v_score + 30;
  ELSIF p_performance_score < 70 THEN
    v_score := v_score + 20;
  ELSIF p_performance_score < 90 THEN
    v_score := v_score + 10;
  END IF;
  
  -- SEO issues (25 points)
  IF p_seo_score < 50 THEN
    v_score := v_score + 25;
  ELSIF p_seo_score < 70 THEN
    v_score := v_score + 15;
  ELSIF p_seo_score < 90 THEN
    v_score := v_score + 8;
  END IF;
  
  -- Critical issues (20 points)
  IF p_critical_issues > 5 THEN
    v_score := v_score + 20;
  ELSIF p_critical_issues > 2 THEN
    v_score := v_score + 12;
  ELSIF p_critical_issues > 0 THEN
    v_score := v_score + 6;
  END IF;
  
  -- Mobile optimization (15 points)
  IF p_mobile_friendly = FALSE THEN
    v_score := v_score + 15;
  ELSIF p_page_speed_mobile IS NOT NULL AND p_page_speed_mobile < 50 THEN
    v_score := v_score + 10;
  END IF;
  
  -- Total issues (10 points)
  IF p_issues_found > 20 THEN
    v_score := v_score + 10;
  ELSIF p_issues_found > 10 THEN
    v_score := v_score + 5;
  END IF;
  
  -- Cap at max score
  IF v_score > v_max_score THEN
    v_score := v_max_score;
  END IF;
  
  RETURN v_score;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

COMMENT ON FUNCTION calculate_opportunity_score IS 'Calculates opportunity score (0-100) based on website issues found';


-- ══════════════════════════════════════════════════════════
-- 4. BUDGET ESTIMATION FUNCTION
-- ══════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION estimate_project_budget(
  p_opportunity_score INTEGER,
  p_issues_found INTEGER,
  p_critical_issues INTEGER,
  p_has_redesign_need BOOLEAN DEFAULT FALSE
)
RETURNS TABLE(budget_min NUMERIC, budget_max NUMERIC) AS $$
BEGIN
  -- Base budget on opportunity score and issues
  IF p_has_redesign_need OR p_opportunity_score > 70 THEN
    -- Full redesign needed
    RETURN QUERY SELECT 8000::NUMERIC, 25000::NUMERIC;
  ELSIF p_opportunity_score > 50 THEN
    -- Major improvements
    RETURN QUERY SELECT 5000::NUMERIC, 15000::NUMERIC;
  ELSIF p_opportunity_score > 30 THEN
    -- Moderate improvements
    RETURN QUERY SELECT 2500::NUMERIC, 8000::NUMERIC;
  ELSIF p_opportunity_score > 15 THEN
    -- Minor improvements
    RETURN QUERY SELECT 1000::NUMERIC, 4000::NUMERIC;
  ELSE
    -- Small fixes
    RETURN QUERY SELECT 500::NUMERIC, 2000::NUMERIC;
  END IF;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

COMMENT ON FUNCTION estimate_project_budget IS 'Estimates project budget range based on opportunity score';


-- ══════════════════════════════════════════════════════════
-- 5. PRIORITY CLASSIFICATION FUNCTION
-- ══════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION classify_priority(p_opportunity_score INTEGER)
RETURNS TEXT AS $$
BEGIN
  IF p_opportunity_score >= 75 THEN
    RETURN 'urgent';
  ELSIF p_opportunity_score >= 50 THEN
    RETURN 'high';
  ELSIF p_opportunity_score >= 25 THEN
    RETURN 'medium';
  ELSE
    RETURN 'low';
  END IF;
END;
$$ LANGUAGE plpgsql IMMUTABLE;


-- ══════════════════════════════════════════════════════════
-- 6. AUTO-UPDATE OPPORTUNITY SCORE TRIGGER
-- ══════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION update_website_analysis_score()
RETURNS TRIGGER AS $$
DECLARE
  v_budget_range RECORD;
BEGIN
  -- Calculate opportunity score if analysis is completed
  IF NEW.status = 'completed' AND (NEW.opportunity_score IS NULL OR OLD.issues_found != NEW.issues_found) THEN
    NEW.opportunity_score := calculate_opportunity_score(
      NEW.performance_score,
      NEW.seo_score,
      NEW.issues_found,
      NEW.critical_issues,
      NEW.mobile_friendly,
      NEW.page_speed_mobile
    );
    
    -- Estimate budget
    SELECT * INTO v_budget_range FROM estimate_project_budget(
      NEW.opportunity_score,
      NEW.issues_found,
      NEW.critical_issues,
      FALSE
    );
    
    NEW.estimated_budget_min := v_budget_range.budget_min;
    NEW.estimated_budget_max := v_budget_range.budget_max;
    
    -- Set priority
    NEW.priority_level := classify_priority(NEW.opportunity_score);
    
    -- Set analyzed timestamp
    IF NEW.analyzed_at IS NULL THEN
      NEW.analyzed_at := NOW();
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_update_website_analysis_score ON website_analyses;
CREATE TRIGGER trg_update_website_analysis_score
  BEFORE UPDATE ON website_analyses
  FOR EACH ROW
  EXECUTE FUNCTION update_website_analysis_score();


-- ══════════════════════════════════════════════════════════
-- 7. SAMPLE DATA FOR TESTING
-- ══════════════════════════════════════════════════════════

-- Insert sample website analysis (commented out - uncomment to test)
/*
INSERT INTO website_analyses (
  user_id, url, domain, company_name, status,
  performance_score, seo_score, accessibility_score, best_practices_score,
  issues_found, critical_issues, warnings, opportunities,
  mobile_friendly, page_speed_mobile, page_speed_desktop
) VALUES (
  auth.uid(),
  'https://example-company.com',
  'example-company.com',
  'Example Company',
  'completed',
  45, 52, 78, 65,
  23, 5, 12, 8,
  FALSE, 42, 58
);
*/


-- ══════════════════════════════════════════════════════════
-- 8. VIEWS FOR DASHBOARD
-- ══════════════════════════════════════════════════════════

CREATE OR REPLACE VIEW v_high_opportunity_leads AS
SELECT 
  l.*,
  wa.opportunity_score,
  wa.issues_found,
  wa.critical_issues,
  wa.performance_score,
  wa.seo_score,
  wa.analyzed_at
FROM leads l
LEFT JOIN website_analyses wa ON l.website_analysis_id = wa.id
WHERE l.status IN ('new', 'contacted', 'qualified')
  AND wa.opportunity_score >= 50
ORDER BY wa.opportunity_score DESC, l.created_at DESC;

COMMENT ON VIEW v_high_opportunity_leads IS 'High-value leads with opportunity score >= 50';


-- Log completion
DO $$
BEGIN
  RAISE NOTICE 'Website Analyzer schema installed successfully';
  RAISE NOTICE 'Tables: website_analyses, leads';
  RAISE NOTICE 'Functions: calculate_opportunity_score, estimate_project_budget, classify_priority';
END $$;
