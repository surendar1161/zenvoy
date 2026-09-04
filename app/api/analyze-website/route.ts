import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

// Simple website analyzer - checks basic metrics
async function analyzeWebsite(url: string) {
  try {
    const urlObj = new URL(url);
    const domain = urlObj.hostname;
    
    // Fetch the website
    const startTime = Date.now();
    const response = await fetch(url, {
      headers: {
        "User-Agent": "DealPilot-Website-Analyzer/1.0",
      },
      signal: AbortSignal.timeout(10000), // 10 second timeout
    });
    const loadTime = Date.now() - startTime;
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const html = await response.text();
    const contentSize = Buffer.byteLength(html, "utf8") / 1024; // KB
    
    // Basic HTML analysis
    const analysis = {
      // Meta tags
      metaTitle: extractMetaTag(html, "title"),
      metaDescription: extractMetaTag(html, "description"),
      
      // Headings
      h1Tags: extractHeadings(html, "h1"),
      
      // Technical checks
      hasSitemap: await checkSitemap(urlObj.origin),
      hasRobotsTxt: await checkRobotsTxt(urlObj.origin),
      
      // Performance estimates (basic)
      loadTimeMs: loadTime,
      contentSizeKb: Math.round(contentSize),
      
      // SEO checks
      hasMetaDescription: !!extractMetaTag(html, "description"),
      hasH1: html.toLowerCase().includes("<h1"),
      hasSSL: urlObj.protocol === "https:",
      
      // Mobile check (basic)
      hasViewportMeta: html.includes('name="viewport"'),
      
      // Technology detection (basic)
      technologies: detectTechnologies(html),
    };
    
    // Calculate scores
    const scores = calculateScores(analysis, html);
    
    // Identify issues
    const issues = identifyIssues(analysis, scores);
    
    return {
      url,
      domain,
      analysis,
      scores,
      issues,
      analyzedAt: new Date().toISOString(),
    };
  } catch (error: any) {
    throw new Error(`Failed to analyze website: ${error.message}`);
  }
}

function extractMetaTag(html: string, name: string): string | null {
  if (name === "title") {
    const match = html.match(/<title[^>]*>([^<]*)<\/title>/i);
    return match ? match[1].trim() : null;
  }
  
  const patterns = [
    new RegExp(`<meta\\s+name=["']${name}["']\\s+content=["']([^"']*)["']`, "i"),
    new RegExp(`<meta\\s+content=["']([^"']*)["']\\s+name=["']${name}["']`, "i"),
  ];
  
  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match) return match[1].trim();
  }
  
  return null;
}

function extractHeadings(html: string, tag: string): string[] {
  const pattern = new RegExp(`<${tag}[^>]*>([^<]*)<\/${tag}>`, "gi");
  const matches = html.matchAll(pattern);
  return Array.from(matches, m => m[1].trim()).filter(Boolean);
}

async function checkSitemap(origin: string): Promise<boolean> {
  try {
    const response = await fetch(`${origin}/sitemap.xml`, {
      method: "HEAD",
      signal: AbortSignal.timeout(5000),
    });
    return response.ok;
  } catch {
    return false;
  }
}

async function checkRobotsTxt(origin: string): Promise<boolean> {
  try {
    const response = await fetch(`${origin}/robots.txt`, {
      method: "HEAD",
      signal: AbortSignal.timeout(5000),
    });
    return response.ok;
  } catch {
    return false;
  }
}

function detectTechnologies(html: string): string[] {
  const technologies: string[] = [];
  const htmlLower = html.toLowerCase();
  
  // CMS & Frameworks
  if (htmlLower.includes("wp-content") || htmlLower.includes("wordpress")) {
    technologies.push("WordPress");
  }
  if (htmlLower.includes("shopify")) {
    technologies.push("Shopify");
  }
  if (htmlLower.includes("wix.com")) {
    technologies.push("Wix");
  }
  if (htmlLower.includes("squarespace")) {
    technologies.push("Squarespace");
  }
  if (htmlLower.includes("react") || html.includes("__NEXT_DATA__")) {
    technologies.push("React");
  }
  if (html.includes("ng-app") || html.includes("angular")) {
    technologies.push("Angular");
  }
  if (html.includes("vue")) {
    technologies.push("Vue.js");
  }
  
  // Analytics
  if (htmlLower.includes("google-analytics") || htmlLower.includes("gtag")) {
    technologies.push("Google Analytics");
  }
  
  // Other
  if (htmlLower.includes("jquery")) {
    technologies.push("jQuery");
  }
  if (htmlLower.includes("bootstrap")) {
    technologies.push("Bootstrap");
  }
  
  return technologies;
}

function calculateScores(analysis: any, html: string) {
  let performanceScore = 100;
  let seoScore = 100;
  let accessibilityScore = 100;
  let bestPracticesScore = 100;
  
  // Performance scoring
  if (analysis.loadTimeMs > 5000) performanceScore -= 40;
  else if (analysis.loadTimeMs > 3000) performanceScore -= 25;
  else if (analysis.loadTimeMs > 2000) performanceScore -= 15;
  
  if (analysis.contentSizeKb > 3000) performanceScore -= 20;
  else if (analysis.contentSizeKb > 1500) performanceScore -= 10;
  
  // SEO scoring
  if (!analysis.metaTitle) seoScore -= 20;
  else if (analysis.metaTitle.length < 30 || analysis.metaTitle.length > 60) seoScore -= 10;
  
  if (!analysis.hasMetaDescription) seoScore -= 20;
  if (!analysis.hasH1) seoScore -= 15;
  if (!analysis.hasSitemap) seoScore -= 10;
  if (!analysis.hasRobotsTxt) seoScore -= 5;
  
  if (analysis.h1Tags.length === 0) seoScore -= 15;
  else if (analysis.h1Tags.length > 1) seoScore -= 5;
  
  // Accessibility scoring
  if (!analysis.hasViewportMeta) accessibilityScore -= 15;
  
  const imgCount = (html.match(/<img/gi) || []).length;
  const imgWithAlt = (html.match(/<img[^>]+alt=/gi) || []).length;
  if (imgCount > 0 && imgWithAlt / imgCount < 0.8) {
    accessibilityScore -= 20;
  }
  
  // Best practices scoring
  if (!analysis.hasSSL) bestPracticesScore -= 30;
  if (html.includes("eval(")) bestPracticesScore -= 10;
  if (!html.includes('charset="utf-8"') && !html.includes("charset=utf-8")) {
    bestPracticesScore -= 10;
  }
  
  return {
    performance: Math.max(0, performanceScore),
    seo: Math.max(0, seoScore),
    accessibility: Math.max(0, accessibilityScore),
    bestPractices: Math.max(0, bestPracticesScore),
  };
}

function identifyIssues(analysis: any, scores: any) {
  const seoIssues: any[] = [];
  const performanceIssues: any[] = [];
  const accessibilityIssues: any[] = [];
  const securityIssues: any[] = [];
  
  // SEO issues
  if (!analysis.metaTitle) {
    seoIssues.push({
      severity: "critical",
      title: "Missing page title",
      description: "The page doesn't have a <title> tag, which is essential for SEO.",
      recommendation: "Add a descriptive title tag (50-60 characters).",
    });
  }
  
  if (!analysis.hasMetaDescription) {
    seoIssues.push({
      severity: "high",
      title: "Missing meta description",
      description: "No meta description found. This affects click-through rates in search results.",
      recommendation: "Add a compelling meta description (150-160 characters).",
    });
  }
  
  if (!analysis.hasH1) {
    seoIssues.push({
      severity: "high",
      title: "Missing H1 heading",
      description: "No H1 heading found. H1 tags are important for SEO and page structure.",
      recommendation: "Add one clear H1 heading that describes the page content.",
    });
  }
  
  if (!analysis.hasSitemap) {
    seoIssues.push({
      severity: "medium",
      title: "No sitemap.xml found",
      description: "Sitemap helps search engines discover and index your pages.",
      recommendation: "Generate and submit a sitemap to search engines.",
    });
  }
  
  // Performance issues
  if (analysis.loadTimeMs > 3000) {
    performanceIssues.push({
      severity: analysis.loadTimeMs > 5000 ? "critical" : "high",
      title: "Slow page load time",
      description: `Page takes ${(analysis.loadTimeMs / 1000).toFixed(2)}s to load. Target is under 3 seconds.`,
      recommendation: "Optimize images, enable compression, use a CDN, and minify CSS/JS.",
    });
  }
  
  if (analysis.contentSizeKb > 1500) {
    performanceIssues.push({
      severity: "medium",
      title: "Large page size",
      description: `Page size is ${analysis.contentSizeKb}KB. Recommended is under 1500KB.`,
      recommendation: "Compress images, minify code, and remove unused resources.",
    });
  }
  
  // Accessibility issues
  if (!analysis.hasViewportMeta) {
    accessibilityIssues.push({
      severity: "high",
      title: "Missing viewport meta tag",
      description: "Required for mobile-responsive design.",
      recommendation: 'Add: <meta name="viewport" content="width=device-width, initial-scale=1">',
    });
  }
  
  // Security issues
  if (!analysis.hasSSL) {
    securityIssues.push({
      severity: "critical",
      title: "No HTTPS/SSL",
      description: "Website is not secure. HTTPS is required for security and SEO.",
      recommendation: "Install an SSL certificate and redirect HTTP to HTTPS.",
    });
  }
  
  const totalIssues = seoIssues.length + performanceIssues.length + 
                      accessibilityIssues.length + securityIssues.length;
  
  const criticalIssues = [
    ...seoIssues,
    ...performanceIssues,
    ...accessibilityIssues,
    ...securityIssues,
  ].filter(issue => issue.severity === "critical").length;
  
  return {
    seo: seoIssues,
    performance: performanceIssues,
    accessibility: accessibilityIssues,
    security: securityIssues,
    total: totalIssues,
    critical: criticalIssues,
    warnings: [
      ...seoIssues,
      ...performanceIssues,
      ...accessibilityIssues,
      ...securityIssues,
    ].filter(issue => issue.severity === "high" || issue.severity === "medium").length,
  };
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const body = await request.json();
    const { url, companyName } = body;
    
    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }
    
    // Validate URL format
    try {
      new URL(url);
    } catch {
      return NextResponse.json({ error: "Invalid URL format" }, { status: 400 });
    }
    
    // Check if analysis already exists
    const urlObj = new URL(url);
    const domain = urlObj.hostname;
    
    const { data: existing } = await supabase
      .from("website_analyses")
      .select("id, status, opportunity_score, analyzed_at")
      .eq("user_id", user.id)
      .eq("url", url)
      .maybeSingle();
    
    // If recent analysis exists (< 7 days), return it
    if (existing && existing.status === "completed") {
      const analyzedDate = new Date(existing.analyzed_at);
      const daysSince = (Date.now() - analyzedDate.getTime()) / (1000 * 60 * 60 * 24);
      
      if (daysSince < 7) {
        return NextResponse.json({
          id: existing.id,
          cached: true,
          message: "Recent analysis found (less than 7 days old)",
        });
      }
    }
    
    // Create pending analysis record
    const { data: analysisRecord, error: insertError } = await supabase
      .from("website_analyses")
      .upsert({
        user_id: user.id,
        url,
        domain,
        company_name: companyName || domain,
        status: "analyzing",
      }, {
        onConflict: "user_id,url",
      })
      .select()
      .single();
    
    if (insertError) {
      console.error("Insert error:", insertError);
      return NextResponse.json({ error: "Failed to create analysis record" }, { status: 500 });
    }
    
    // Perform analysis
    try {
      const result = await analyzeWebsite(url);
      
      // Update database with results
      const { error: updateError } = await supabase
        .from("website_analyses")
        .update({
          status: "completed",
          performance_score: result.scores.performance,
          seo_score: result.scores.seo,
          accessibility_score: result.scores.accessibility,
          best_practices_score: result.scores.bestPractices,
          
          meta_title: result.analysis.metaTitle,
          meta_description: result.analysis.metaDescription,
          h1_tags: result.analysis.h1Tags,
          has_sitemap: result.analysis.hasSitemap,
          has_robots_txt: result.analysis.hasRobotsTxt,
          mobile_friendly: result.analysis.hasViewportMeta,
          page_speed_mobile: result.scores.performance,
          page_speed_desktop: result.scores.performance,
          
          issues_found: result.issues.total,
          critical_issues: result.issues.critical,
          warnings: result.issues.warnings,
          
          seo_issues: result.issues.seo,
          performance_issues: result.issues.performance,
          accessibility_issues: result.issues.accessibility,
          security_issues: result.issues.security,
          
          technologies: result.analysis.technologies,
          
          analyzed_at: result.analyzedAt,
        })
        .eq("id", analysisRecord.id);
      
      if (updateError) {
        console.error("Update error:", updateError);
        return NextResponse.json({ error: "Failed to save analysis results" }, { status: 500 });
      }
      
      // Fetch complete record with calculated scores
      const { data: finalRecord } = await supabase
        .from("website_analyses")
        .select("*")
        .eq("id", analysisRecord.id)
        .single();
      
      return NextResponse.json({
        success: true,
        analysisId: analysisRecord.id,
        analysis: finalRecord,
      });
      
    } catch (analysisError: any) {
      // Mark as failed
      await supabase
        .from("website_analyses")
        .update({ status: "failed" })
        .eq("id", analysisRecord.id);
      
      return NextResponse.json({
        error: "Analysis failed",
        details: analysisError.message,
      }, { status: 500 });
    }
    
  } catch (error: any) {
    console.error("API error:", error);
    return NextResponse.json({
      error: "Internal server error",
      details: error.message,
    }, { status: 500 });
  }
}
