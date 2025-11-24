/**
 * Tool/function definitions for the Gemini API
 */

/**
 * Get the tool definitions for function calling
 */
export function getToolDefinitions(): any {
  return [
    {
      functionDeclarations: [
        {
          name: 'list_agents',
          description:
            'Get a list of available agents that can be scheduled for meetings. Use this when the user asks about available agents or wants to see who they can schedule with.',
          parameters: {
            type: 'object',
            properties: {},
            required: [],
          },
        },
        {
          name: 'check_agent_availability',
          description:
            'Check if an agent is available at a specific date and time. Use this BEFORE scheduling to verify availability, considering timezone differences, working hours, lunch breaks, and existing meetings. Always use this after the user provides a date, time, and timezone.',
          parameters: {
            type: 'object',
            properties: {
              agentId: {
                type: 'string',
                description:
                  'Optional: ID of the agent to check. Prefer using agentName instead.',
              },
              agentName: {
                type: 'string',
                description:
                  'Required if agentId not provided: Name or email of the agent to check availability for.',
              },
              date: {
                type: 'string',
                description:
                  "Date in YYYY-MM-DD format (e.g., 2024-12-25). This is the date in the customer's timezone.",
              },
              time: {
                type: 'string',
                description:
                  "Time in HH:mm format (e.g., 14:30). This is the time in the customer's timezone.",
              },
              customerTimezone: {
                type: 'string',
                description:
                  'IANA timezone string of the customer (e.g., Asia/Kuala_Lumpur, America/New_York)',
              },
            },
            required: ['date', 'time', 'customerTimezone', 'agentName'],
          },
        },
        {
          name: 'schedule_meeting',
          description:
            'Schedule a call/meeting with an agent. Use this ONLY after checking agent availability with check_agent_availability and confirming the time works for both parties. This finalizes the booking.',
          parameters: {
            type: 'object',
            properties: {
              customerName: {
                type: 'string',
                description: 'Full name of the customer',
              },
              email: {
                type: 'string',
                description: 'Email address of the customer',
              },
              phone: {
                type: 'string',
                description: 'Phone number of the customer',
              },
              date: {
                type: 'string',
                description:
                  'Date in YYYY-MM-DD format (e.g., 2024-12-25). Must be a weekday (Monday-Friday), not a weekend. Convert natural language dates to this format.',
              },
              time: {
                type: 'string',
                description:
                  "Time in HH:mm format (e.g., 14:30). Must be between 8:30 and 17:30 (5:30 PM), excluding lunch break (13:00-14:00), in the customer's timezone. Convert natural language times to this format.",
              },
              timezone: {
                type: 'string',
                description:
                  'IANA timezone string (e.g., Asia/Kuala_Lumpur, America/New_York)',
              },
              agentId: {
                type: 'string',
                description:
                  'Optional: ID of the agent to schedule with. Prefer using agentName instead.',
              },
              agentName: {
                type: 'string',
                description:
                  'Required if agentId not provided: Name or email of the agent to schedule with. Use list_agents to see available agents.',
              },
            },
            required: [
              'customerName',
              'email',
              'phone',
              'date',
              'time',
              'timezone',
              'agentName',
            ],
          },
        },
        {
          name: 'translate_website',
          description:
            "Translate the entire website to a target language. Use this when users request to view the website in a different language. The translation will create a new language file and make it available in the language dropdown. Common language codes: en (English), zh (Chinese), ms (Malay), fr (French), es (Spanish), de (German), ja (Japanese), ko (Korean), ar (Arabic), hi (Hindi), pt (Portuguese), ru (Russian), it (Italian), th (Thai), vi (Vietnamese), id (Indonesian), tr (Turkish), pl (Polish), nl (Dutch). After translation is complete, ALWAYS use set_locale to change the user's language preference.",
          parameters: {
            type: 'object',
            properties: {
              language: {
                type: 'string',
                description:
                  'ISO 639-1 language code (e.g., "fr" for French, "es" for Spanish, "de" for German). Use standard two-letter language codes.',
              },
            },
            required: ['language'],
          },
        },
        {
          name: 'set_locale',
          description:
            "Change the user's language preference on the website. Use this after translating the website or when the user explicitly requests to change their language. This will update the website interface to display in the selected language.",
          parameters: {
            type: 'object',
            properties: {
              locale: {
                type: 'string',
                description:
                  'Language code to set (e.g., "en", "fr", "es", "de", "ja", "zh", "ms"). Must be a valid language code that exists in the system.',
              },
            },
            required: ['locale'],
          },
        },
      ],
    },
  ] as any;
}
