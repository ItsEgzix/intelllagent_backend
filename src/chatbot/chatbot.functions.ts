import { AgentsService } from '../agents/agents.service';
import { MeetingsService } from '../meetings/meetings.service';
import { TranslationsService } from '../translations/translations.service';
import { convertTimezone } from '../email/templates/timezone-helper';
import {
  validateWorkingHours,
  findAgentByNameOrEmail,
  calculateTimeDifference,
} from './chatbot.validators';

/**
 * Services required for function execution
 */
export interface FunctionServices {
  agentsService: AgentsService;
  meetingsService: MeetingsService;
  translationsService?: TranslationsService;
}

/**
 * Get available agents for scheduling
 */
export async function getAvailableAgents(
  services: FunctionServices,
): Promise<string> {
  try {
    if (!services.agentsService) {
      return 'Agent service is not available. Please try again later.';
    }

    const agents = await services.agentsService.findActive();
    if (agents.length === 0) {
      return 'No agents are currently available.';
    }

    const agentsList = agents
      .map(
        (agent, index) =>
          `${index + 1}. ${agent.name || agent.email} - Timezone: ${agent.timezone || 'Not set'}`,
      )
      .join('\n');

    return `Available agents:\n${agentsList}\n\nWhen scheduling, you can specify the agent by name or email.`;
  } catch (error) {
    console.error('Error fetching agents:', error);
    return 'Unable to fetch available agents at this time. Please try again later.';
  }
}

/**
 * Check if agent is available at a specific date and time
 * Considers timezone differences, working hours, lunch break, and weekends
 */
export async function checkAgentAvailability(
  params: {
    agentId?: string;
    agentName?: string;
    date: string; // YYYY-MM-DD in customer's timezone
    time: string; // HH:mm in customer's timezone
    customerTimezone: string;
  },
  services: FunctionServices,
): Promise<string> {
  try {
    if (!services.agentsService) {
      return 'Agent service is not available. Please try again later.';
    }

    // Validate date format
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(params.date)) {
      return 'Invalid date format. Please use YYYY-MM-DD format (e.g., 2024-12-25).';
    }

    // Validate time format
    const timeRegex = /^\d{2}:\d{2}$/;
    if (!timeRegex.test(params.time)) {
      return 'Invalid time format. Please use HH:mm format (e.g., 14:30).';
    }

    // Resolve agent ID
    let agentId: string | undefined = params.agentId;

    if (!agentId && params.agentName) {
      const foundAgentId = await findAgentByNameOrEmail(
        params.agentName,
        services.agentsService,
      );
      if (!foundAgentId) {
        return `Agent "${params.agentName}" not found. Please use list_agents to see available agents.`;
      }
      agentId = foundAgentId;
    }

    if (!agentId) {
      return 'An agent must be specified. Please provide agentId or agentName.';
    }

    // Get agent information
    const agent = await services.agentsService.findOne(agentId);
    if (!agent.timezone) {
      return 'Agent timezone is not set. Cannot check availability.';
    }

    // Validate customer's working hours first
    const customerValidation = validateWorkingHours(
      params.date,
      params.time,
      params.customerTimezone,
    );
    if (!customerValidation.valid) {
      return customerValidation.message || 'Invalid working hours.';
    }

    // Convert customer time to agent timezone
    const agentTimeResult = convertTimezone(
      params.date,
      params.time,
      params.customerTimezone,
      agent.timezone,
    );

    // Validate agent's working hours in their timezone
    const agentValidation = validateWorkingHours(
      agentTimeResult.date,
      agentTimeResult.time,
      agent.timezone,
    );
    if (!agentValidation.valid) {
      const timeDiff = calculateTimeDifference(
        params.date,
        params.time,
        params.customerTimezone,
        agent.timezone,
      );
      return `The requested time is not available. In the agent's timezone (${agent.timezone}), this would be ${agentTimeResult.date} at ${agentTimeResult.time}. ${agentValidation.message} ${timeDiff}`;
    }

    // Check if agent already has a meeting at this time (in agent's timezone)
    const isAvailable = await services.agentsService.isAgentAvailable(
      agentId,
      agentTimeResult.date,
      agentTimeResult.time,
      params.customerTimezone,
    );

    if (!isAvailable) {
      const timeDiff = calculateTimeDifference(
        params.date,
        params.time,
        params.customerTimezone,
        agent.timezone,
      );
      return `The agent is not available at the requested time. In the agent's timezone (${agent.timezone}), this would be ${agentTimeResult.date} at ${agentTimeResult.time}, and they already have a meeting scheduled. ${timeDiff}`;
    }

    // Calculate time difference for display
    const timeDiff = calculateTimeDifference(
      params.date,
      params.time,
      params.customerTimezone,
      agent.timezone,
    );

    return `The agent is available! ${timeDiff} The meeting time in the agent's timezone (${agent.timezone}) would be ${agentTimeResult.date} at ${agentTimeResult.time}.`;
  } catch (error) {
    console.error('Error checking agent availability:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    return `Failed to check agent availability: ${errorMessage}`;
  }
}

/**
 * Schedule a meeting
 */
export async function scheduleMeeting(
  params: {
    customerName: string;
    email: string;
    phone: string;
    date: string; // YYYY-MM-DD
    time: string; // HH:mm
    timezone: string;
    agentId?: string;
    agentName?: string; // Allow agent selection by name/email
  },
  services: FunctionServices,
): Promise<string> {
  try {
    if (!services.meetingsService || !services.agentsService) {
      return 'Meeting service is not available. Please try again later.';
    }

    // Validate date format
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(params.date)) {
      return 'Invalid date format. Please use YYYY-MM-DD format (e.g., 2024-12-25).';
    }

    // Validate time format
    const timeRegex = /^\d{2}:\d{2}$/;
    if (!timeRegex.test(params.time)) {
      return 'Invalid time format. Please use HH:mm format (e.g., 14:30).';
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(params.email)) {
      return 'Invalid email format.';
    }

    // Validate working hours
    const workingHoursValidation = validateWorkingHours(
      params.date,
      params.time,
      params.timezone,
    );
    if (!workingHoursValidation.valid) {
      return workingHoursValidation.message || 'Invalid working hours.';
    }

    // Resolve agent ID - prioritize agentId, then agentName
    let agentId: string | undefined = params.agentId;

    if (!agentId && params.agentName) {
      const foundAgentId = await findAgentByNameOrEmail(
        params.agentName,
        services.agentsService,
      );
      if (!foundAgentId) {
        return `Agent "${params.agentName}" not found. Please use list_agents to see available agents.`;
      }
      agentId = foundAgentId;
    }

    // Require agent selection
    if (!agentId) {
      return 'An agent must be selected for the meeting. Please use list_agents to see available agents and specify which agent you want to schedule with.';
    }

    // Verify agent exists
    try {
      await services.agentsService.findOne(agentId);
    } catch (error) {
      return `Agent not found. Please use list_agents to see available agents.`;
    }

    // Mock meeting creation for automation demo
    // We don't want to actually create the meeting here because the frontend automation
    // will fill the form and submit it, which will call the API to create the meeting.
    // If we create it here, the frontend submission will fail with a conflict.

    // Just validate availability one last time to be sure
    // Convert customer time to agent timezone for availability check
    const agentForCheck = await services.agentsService.findOne(agentId);
    const { date: agentDate, time: agentTime } = convertTimezone(
      params.date,
      params.time,
      params.timezone,
      agentForCheck.timezone || 'UTC',
    );

    const isAvailable = await services.agentsService.isAgentAvailable(
      agentId,
      agentDate,
      agentTime,
      params.timezone,
    );

    if (!isAvailable) {
      return `I checked one last time, and it seems this slot is no longer available. Please choose another time.`;
    }

    // Fetch agent details for the response
    const agent = await services.agentsService.findOne(agentId);

    const automationData = {
      agentId: agentId,
      agentName: params.agentName || agent.name || agent.email,
      date: params.date,
      time: params.time,
      timezone: params.timezone,
      customerName: params.customerName,
      email: params.email,
      phone: params.phone,
    };

    console.log('DEBUG: Generating automation payload:', automationData);
    return `Let me show you an amazing web automation! I'll navigate to the booking form and fill it out for you.\n\nMEETING_AUTOMATION:${JSON.stringify(automationData)}\n\nWatch as the website scrolls down and automatically fills in all your meeting details!`;
  } catch (error) {
    console.error('Error scheduling meeting:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    return `Failed to schedule meeting: ${errorMessage}`;
  }
}

/**
 * Translate website content to a different language using AI
 */
export async function translateWebsite(
  params: {
    targetLanguage: string;
    sourceLanguage?: string;
  },
  services: FunctionServices,
  genAI?: any, // Gemini AI instance
): Promise<string> {
  try {
    if (!services.translationsService) {
      return 'Translation service is not available. Please try again later.';
    }

    if (!genAI) {
      return 'AI translation service is not available. Please ensure GEMINI_API_KEY is configured.';
    }

    const sourceLang = params.sourceLanguage || 'en';
    const targetLang = params.targetLanguage.toLowerCase();

    // Get source translation
    let sourceTranslation;
    try {
      sourceTranslation =
        await services.translationsService.getTranslationByCode(sourceLang);
    } catch (error) {
      return `Source language "${sourceLang}" not found. Please ensure English translations exist.`;
    }

    if (!sourceTranslation || !sourceTranslation.data) {
      return `Source language "${sourceLang}" has no translation data.`;
    }

    const sourceData = sourceTranslation.data as Record<string, any>;

    // Language display names mapping
    const languageNames: Record<string, { native: string; english: string }> = {
      en: { native: 'English', english: 'English' },
      zh: { native: '中文', english: 'Chinese' },
      ms: { native: 'Bahasa Melayu', english: 'Malay' },
      fr: { native: 'Français', english: 'French' },
      ja: { native: '日本語', english: 'Japanese' },
      vi: { native: 'Tiếng Việt', english: 'Vietnamese' },
      es: { native: 'Español', english: 'Spanish' },
      de: { native: 'Deutsch', english: 'German' },
      ar: { native: 'العربية', english: 'Arabic' },
      hi: { native: 'हिन्दी', english: 'Hindi' },
      pt: { native: 'Português', english: 'Portuguese' },
      ru: { native: 'Русский', english: 'Russian' },
      it: { native: 'Italiano', english: 'Italian' },
      th: { native: 'ไทย', english: 'Thai' },
      id: { native: 'Bahasa Indonesia', english: 'Indonesian' },
      tr: { native: 'Türkçe', english: 'Turkish' },
      pl: { native: 'Polski', english: 'Polish' },
      nl: { native: 'Nederlands', english: 'Dutch' },
    };

    const targetLangInfo = languageNames[targetLang] || {
      native: targetLang.toUpperCase(),
      english: targetLang.toUpperCase(),
    };

    // Use Gemini to translate the JSON structure
    const translationPrompt = `You are a professional translator. Translate the following JSON object from ${sourceLang} to ${targetLang} (${targetLangInfo.english}). 

IMPORTANT RULES:
1. Maintain the exact JSON structure - all keys must remain the same
2. Only translate the VALUES, never the keys
3. For nested objects, translate all string values recursively
4. For arrays, translate string values but keep the structure
5. Return ONLY valid JSON, no markdown, no explanations
6. Preserve any special characters, placeholders, or formatting codes
7. Keep the same data types (strings, numbers, booleans, arrays, objects)

Source JSON:
${JSON.stringify(sourceData, null, 2)}

Return the translated JSON:`;

    try {
      const response = await genAI.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: [{ role: 'user', parts: [{ text: translationPrompt }] }],
      });

      let translatedText = '';
      if (
        response.candidates &&
        response.candidates[0]?.content?.parts?.[0]?.text
      ) {
        translatedText = response.candidates[0].content.parts[0].text;
      } else {
        return 'Failed to get translation response from AI.';
      }

      // Clean up the response (remove markdown code blocks if present)
      translatedText = translatedText
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim();

      // Parse the translated JSON
      let translatedData: Record<string, any>;
      try {
        translatedData = JSON.parse(translatedText);
      } catch (parseError) {
        console.error('Failed to parse translated JSON:', translatedText);
        return `Failed to parse translated content. The AI may have returned invalid JSON. Please try again.`;
      }

      // Save to database
      await services.translationsService.upsertTranslation(
        targetLang,
        translatedData,
        targetLangInfo.native,
        targetLangInfo.english,
      );

      return `Successfully translated the website to ${targetLangInfo.english} (${targetLangInfo.native})! The translations have been saved to the database. 

To see the translated content, please click on the globe icon (🌐) in the header and select "${targetLangInfo.english}" from the language dropdown menu.`;
    } catch (error) {
      console.error('Error during AI translation:', error);
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      return `Failed to translate website: ${errorMessage}`;
    }
  } catch (error) {
    console.error('Error translating website:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    return `Failed to translate website: ${errorMessage}`;
  }
}

/**
 * Handle a function call by routing to the appropriate function
 */
export async function handleFunctionCall(
  functionName: string,
  args: any,
  services: FunctionServices,
  genAI?: any, // Gemini AI instance for translation
): Promise<string> {
  switch (functionName) {
    case 'list_agents':
      return await getAvailableAgents(services);
    case 'check_agent_availability':
      return await checkAgentAvailability(
        {
          agentId: args.agentId as string | undefined,
          agentName: args.agentName as string | undefined,
          date: args.date as string,
          time: args.time as string,
          customerTimezone: args.customerTimezone as string,
        },
        services,
      );
    case 'schedule_meeting':
      return await scheduleMeeting(
        {
          customerName: args.customerName as string,
          email: args.email as string,
          phone: args.phone as string,
          date: args.date as string,
          time: args.time as string,
          timezone: args.timezone as string,
          agentId: args.agentId as string | undefined,
          agentName: args.agentName as string | undefined,
        },
        services,
      );
    case 'set_locale':
      const locale = args.locale as string;
      if (!locale) {
        return 'Locale code is required. Please provide a valid language code (e.g., "en", "fr", "es", "de").';
      }
      // Return a special marker that the frontend will detect and handle
      return `LOCALE_CHANGE:${locale}`;
    case 'translate_website':
      return await translateWebsite(
        {
          targetLanguage: args.targetLanguage as string,
          sourceLanguage: args.sourceLanguage as string | undefined,
        },
        services,
        genAI,
      );
    default:
      return `Unknown function: ${functionName}`;
  }
}
