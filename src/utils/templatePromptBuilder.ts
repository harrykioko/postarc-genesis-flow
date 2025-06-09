import type { TemplateWizardData } from '@/components/CustomTemplateWizard';

export const buildSystemPromptFromChoices = (wizardData: TemplateWizardData): string => {
  // Add defensive checks for undefined data
  if (!wizardData) {
    console.warn('⚠️ buildSystemPromptFromChoices called with undefined wizardData');
    return "Create engaging, professional content with clear insights and actionable takeaways.";
  }

  const { foundation_type, tone_attributes, structure_type, industry_context } = wizardData;

  // Ensure tone_attributes is an array
  const safeTonesArray = Array.isArray(tone_attributes) ? tone_attributes : [];

  // Safe company data extraction for business_representative
  const companyName = wizardData.company_name?.trim() || "the company";
  const companyDescription = wizardData.company_description?.trim() || "your organization";
  const companyIndustry = wizardData.company_industry?.trim() || "their";
  const targetAudience = wizardData.target_audience?.trim() || "their target market";
  const companyGoals = wizardData.company_goals?.trim() || "growth and success";

  // Foundation base prompts
  const foundationPrompts = {
    fresh: "Create original, authentic content that reflects personal insights and experiences.",
    consultant: "Write with professional authority, focusing on expertise and strategic thinking. Include frameworks and analytical perspectives.",
    founder: "Adopt an entrepreneurial voice with vision and ambition. Share lessons from building and scaling, with focus on innovation and leadership.",
    vc: "Write from an investment perspective, focusing on market analysis, trends, and strategic insights. Include metrics and growth thinking.",
    sales: "Create engaging, relationship-focused content that drives connection and conversation. Focus on value and human connection.",
    hr: "Write with empathy and people-first perspective. Focus on culture, development, and human workplace experiences.",
    business_representative: `You are posting on behalf of ${companyName}, ${companyDescription}. The company operates in the ${companyIndustry} industry and serves ${targetAudience}. The company's primary goals are: ${companyGoals}. Write from the company's perspective, representing their brand voice and values.`
  };

  // Structure templates
  const structurePrompts = {
    story: "Use a narrative structure: Start with a compelling hook, share a personal or professional story, then extract the key lesson or insight. Make it relatable and memorable.",
    insight_list: "Present information as 3-5 key insights or takeaways. Use clear headers or numbering, with brief explanations for each point. Conclude with a summary or call to action.",
    problem_solution: "Structure as: Problem identification → Analysis of why it matters → Your solution or approach → Results or next steps. Be specific and actionable.",
    case_study: "Follow case study format: Challenge → Process/methodology → Specific results with metrics → Key learnings. Include concrete examples and data.",
    opinion: "Present a clear viewpoint: State your opinion → Provide supporting evidence or reasoning → Address potential counterarguments → Invite discussion."
  };

  // Tone modifiers with safe array access
  const toneModifiers = safeTonesArray.map(tone => {
    const toneMap: Record<string, string> = {
      conversational: "Use a conversational, approachable tone",
      professional: "Maintain professional language and formal structure",
      thoughtful: "Be reflective and include deeper insights",
      bold: "Use confident, decisive language",
      friendly: "Write in a warm, personable manner",
      direct: "Be clear and straightforward, avoid unnecessary complexity",
      educational: "Include instructional elements and learning opportunities",
      innovative: "Emphasize creativity and forward-thinking concepts",
      analytical: "Include data points and logical reasoning",
      playful: "Add light humor and engaging elements where appropriate",
      energetic: "Use dynamic language that conveys enthusiasm",
      inspirational: "Include motivating elements that uplift the reader"
    };
    return toneMap[tone] || "";
  }).filter(Boolean);

  // Build the complete system prompt with safe property access
  let systemPrompt = foundationPrompts[foundation_type as keyof typeof foundationPrompts] || foundationPrompts.fresh;
  
  systemPrompt += `\n\n${structurePrompts[structure_type as keyof typeof structurePrompts] || structurePrompts.story}`;
  
  if (toneModifiers.length > 0) {
    systemPrompt += `\n\nTone guidelines: ${toneModifiers.join(', ')}.`;
  }

  if (industry_context && industry_context.trim()) {
    systemPrompt += `\n\nIndustry context: Focus on ${industry_context} industry insights, terminology, and relevant examples.`;
  }

  systemPrompt += "\n\nGenerate content that feels authentic and valuable, avoiding generic advice. Include specific examples and actionable insights.";

  return systemPrompt;
};

export const generateTemplateNameSuggestions = (wizardData: TemplateWizardData): string[] => {
  // Add defensive checks
  if (!wizardData) {
    return ["Custom Template"];
  }

  const { foundation_type, tone_attributes, industry_context } = wizardData;
  
  // Handle business_representative with company-specific names
  if (foundation_type === 'business_representative') {
    const companyName = wizardData.company_name?.trim();
    const industry = industry_context ? ` ${industry_context}` : "";
    
    if (companyName) {
      return [
        `${companyName} Business Voice`,
        `${companyName} Brand Template`,
        `${companyName}${industry} Style`,
        `${companyName} Company Voice`,
        `${companyName} Communications`
      ].filter(name => name.length <= 50);
    } else {
      // Fallback names when company name is not available
      return [
        "Company Representative Style",
        "Business Communication Template",
        `Corporate${industry} Voice`,
        "Brand Representative Template",
        "Business Voice Template"
      ].filter(name => name.length <= 50);
    }
  }
  
  const foundationNames = {
    fresh: "Original",
    consultant: "Professional",
    founder: "Entrepreneurial",
    vc: "Investment",
    sales: "Relationship",
    hr: "People-First",
    business_representative: "Business"
  };

  const baseName = foundationNames[foundation_type as keyof typeof foundationNames] || "Custom";
  const industry = industry_context ? ` ${industry_context}` : "";
  
  // Safe access to tone_attributes array
  const safeTonesArray = Array.isArray(tone_attributes) ? tone_attributes : [];
  const primaryTone = safeTonesArray.length > 0 ? ` ${safeTonesArray[0].charAt(0).toUpperCase() + safeTonesArray[0].slice(1)}` : "";

  return [
    `${baseName}${industry} Style`,
    `My${primaryTone}${industry} Voice`,
    `${baseName}${primaryTone} Template`,
    `${industry}${primaryTone} Approach`.trim(),
    `Custom ${baseName} Style`
  ].filter(name => name.length <= 50);
};
