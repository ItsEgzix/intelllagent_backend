import { AgentsService } from '../agents/agents.service';
import { MeetingsService } from '../meetings/meetings.service';
import { convertTimezone } from '../email/templates/timezone-helper';
import {
  validateWorkingHours,
  findAgentByNameOrEmail,
  calculateTimeDifference,
} from './chatbot.validators';
import {
  translateWebsite,
  getLanguageDisplayName,
} from './chatbot.translations';

/**
 * Services required for function execution
 */
export interface FunctionServices {
  agentsService: AgentsService;
  meetingsService: MeetingsService;
  geminiApiKey?: string; // Optional API key for translation functions
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
 * Handle a function call by routing to the appropriate function
 */
export async function handleFunctionCall(
  functionName: string,
  args: any,
  services: FunctionServices,
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
    case 'translate_website':
      if (!services.geminiApiKey) {
        return 'Translation service is not available. Gemini API key is not configured.';
      }
      const targetLanguage = args.language as string;
      if (!targetLanguage) {
        return 'Language code is required. Please provide a valid ISO 639-1 language code (e.g., "fr", "es", "de").';
      }
      try {
        const result = await translateWebsite(
          targetLanguage,
          services.geminiApiKey,
        );
        if (result.success) {
          const languageName = getLanguageDisplayName(targetLanguage);
          // Return a message that prompts the AI to set the locale
          // The AI should automatically call set_locale after this
          return `Website successfully translated to ${languageName} (${targetLanguage})! The translation file has been created and is now available. The website has been translated successfully. Now automatically switch the user's language to ${targetLanguage} by calling set_locale with locale="${targetLanguage}".`;
        }
        return `Translation failed: ${result.message}`;
      } catch (error) {
        console.error('Translation error:', error);
        const errorMessage =
          error instanceof Error ? error.message : 'Unknown error';
        // Provide helpful error message
        if (errorMessage.includes('Messages directory not found')) {
          return `I am sorry, I was unable to translate the website because the translation files directory could not be found. This is a configuration issue. Please ensure the MESSAGES_DIRECTORY environment variable is set correctly, or that the messages folder exists in the expected location. Error: ${errorMessage}`;
        }
        return `Translation failed: ${errorMessage}. Please try again later or contact support if the issue persists.`;
      }
    case 'set_locale':
      const locale = args.locale as string;
      if (!locale) {
        return 'Locale code is required. Please provide a valid language code (e.g., "en", "fr", "es", "de").';
      }
      // Return a special marker that the frontend will detect and handle
      return `LOCALE_CHANGE:${locale}`;
    default:
      return `Unknown function: ${functionName}`;
  }
}
