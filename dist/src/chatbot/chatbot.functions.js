"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAvailableAgents = getAvailableAgents;
exports.checkAgentAvailability = checkAgentAvailability;
exports.scheduleMeeting = scheduleMeeting;
exports.translateWebsite = translateWebsite;
exports.handleFunctionCall = handleFunctionCall;
const timezone_helper_1 = require("../email/templates/timezone-helper");
const chatbot_validators_1 = require("./chatbot.validators");
const chatbot_config_1 = require("./chatbot.config");
const chatbot_utils_1 = require("./chatbot.utils");
async function getAvailableAgents(services) {
    try {
        if (!services.agentsService) {
            return 'Agent service is not available. Please try again later.';
        }
        const agents = await services.agentsService.findActive();
        if (agents.length === 0) {
            return 'No agents are currently available.';
        }
        const agentsList = agents
            .map((agent, index) => `${index + 1}. ${agent.name || agent.email} - Timezone: ${agent.timezone || 'Not set'}`)
            .join('\n');
        return `Available agents:\n${agentsList}\n\nWhen scheduling, you can specify the agent by name or email.`;
    }
    catch (error) {
        console.error('Error fetching agents:', error);
        return 'Unable to fetch available agents at this time. Please try again later.';
    }
}
async function checkAgentAvailability(params, services) {
    try {
        if (!services.agentsService) {
            return 'Agent service is not available. Please try again later.';
        }
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateRegex.test(params.date)) {
            return 'Invalid date format. Please use YYYY-MM-DD format (e.g., 2024-12-25).';
        }
        const timeRegex = /^\d{2}:\d{2}$/;
        if (!timeRegex.test(params.time)) {
            return 'Invalid time format. Please use HH:mm format (e.g., 14:30).';
        }
        let agentId = params.agentId;
        if (!agentId && params.agentName) {
            const foundAgentId = await (0, chatbot_validators_1.findAgentByNameOrEmail)(params.agentName, services.agentsService);
            if (!foundAgentId) {
                return `Agent "${params.agentName}" not found. Please use list_agents to see available agents.`;
            }
            agentId = foundAgentId;
        }
        if (!agentId) {
            return 'An agent must be specified. Please provide agentId or agentName.';
        }
        const agent = await services.agentsService.findOne(agentId);
        if (!agent.timezone) {
            return 'Agent timezone is not set. Cannot check availability.';
        }
        const customerValidation = (0, chatbot_validators_1.validateWorkingHours)(params.date, params.time, params.customerTimezone);
        if (!customerValidation.valid) {
            return customerValidation.message || 'Invalid working hours.';
        }
        const agentTimeResult = (0, timezone_helper_1.convertTimezone)(params.date, params.time, params.customerTimezone, agent.timezone);
        const agentValidation = (0, chatbot_validators_1.validateWorkingHours)(agentTimeResult.date, agentTimeResult.time, agent.timezone);
        if (!agentValidation.valid) {
            const timeDiff = (0, chatbot_validators_1.calculateTimeDifference)(params.date, params.time, params.customerTimezone, agent.timezone);
            return `The requested time is not available. In the agent's timezone (${agent.timezone}), this would be ${agentTimeResult.date} at ${agentTimeResult.time}. ${agentValidation.message} ${timeDiff}`;
        }
        const isAvailable = await services.agentsService.isAgentAvailable(agentId, agentTimeResult.date, agentTimeResult.time, params.customerTimezone);
        if (!isAvailable) {
            const timeDiff = (0, chatbot_validators_1.calculateTimeDifference)(params.date, params.time, params.customerTimezone, agent.timezone);
            return `The agent is not available at the requested time. In the agent's timezone (${agent.timezone}), this would be ${agentTimeResult.date} at ${agentTimeResult.time}, and they already have a meeting scheduled. ${timeDiff}`;
        }
        const timeDiff = (0, chatbot_validators_1.calculateTimeDifference)(params.date, params.time, params.customerTimezone, agent.timezone);
        return `The agent is available! ${timeDiff} The meeting time in the agent's timezone (${agent.timezone}) would be ${agentTimeResult.date} at ${agentTimeResult.time}.`;
    }
    catch (error) {
        console.error('Error checking agent availability:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return `Failed to check agent availability: ${errorMessage}`;
    }
}
async function scheduleMeeting(params, services) {
    try {
        if (!services.meetingsService || !services.agentsService) {
            return 'Meeting service is not available. Please try again later.';
        }
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateRegex.test(params.date)) {
            return 'Invalid date format. Please use YYYY-MM-DD format (e.g., 2024-12-25).';
        }
        const timeRegex = /^\d{2}:\d{2}$/;
        if (!timeRegex.test(params.time)) {
            return 'Invalid time format. Please use HH:mm format (e.g., 14:30).';
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(params.email)) {
            return 'Invalid email format.';
        }
        let agentId = params.agentId;
        if (!agentId && params.agentName) {
            const foundAgentId = await (0, chatbot_validators_1.findAgentByNameOrEmail)(params.agentName, services.agentsService);
            if (!foundAgentId) {
                return `Agent "${params.agentName}" not found. Please use list_agents to see available agents.`;
            }
            agentId = foundAgentId;
        }
        if (!agentId) {
            return 'An agent must be selected for the meeting. Please use list_agents to see available agents and specify which agent you want to schedule with.';
        }
        let agentForCheck;
        try {
            agentForCheck = await services.agentsService.findOne(agentId);
        }
        catch (error) {
            return `Agent not found. Please use list_agents to see available agents.`;
        }
        if (!agentForCheck.timezone) {
            return 'Agent timezone is not set. Cannot schedule meeting.';
        }
        const { date: agentDate, time: agentTime } = (0, timezone_helper_1.convertTimezone)(params.date, params.time, params.timezone, agentForCheck.timezone);
        const workingHoursValidation = (0, chatbot_validators_1.validateWorkingHours)(agentDate, agentTime, agentForCheck.timezone);
        if (!workingHoursValidation.valid) {
            const timeDiff = (0, chatbot_validators_1.calculateTimeDifference)(params.date, params.time, params.timezone, agentForCheck.timezone);
            return `The selected time is outside agent working hours. In the agent's timezone (${agentForCheck.timezone}), this would be ${agentDate} at ${agentTime}. ${workingHoursValidation.message} ${timeDiff}`;
        }
        const isAvailable = await services.agentsService.isAgentAvailable(agentId, agentDate, agentTime, params.timezone);
        if (!isAvailable) {
            return `I checked one last time, and it seems this slot is no longer available. Please choose another time.`;
        }
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
    }
    catch (error) {
        console.error('Error scheduling meeting:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return `Failed to schedule meeting: ${errorMessage}`;
    }
}
async function translateWebsite(params, services, genAI) {
    try {
        if (!services.translationsService) {
            return 'Translation service is not available. Please try again later.';
        }
        if (!genAI) {
            return 'AI translation service is not available. Please ensure GEMINI_API_KEY is configured.';
        }
        const sourceLang = params.sourceLanguage || 'en';
        const targetLang = params.targetLanguage.toLowerCase();
        let sourceTranslation;
        try {
            sourceTranslation =
                await services.translationsService.getTranslationByCode(sourceLang);
        }
        catch (error) {
            return `Source language "${sourceLang}" not found. Please ensure English translations exist.`;
        }
        if (!sourceTranslation || !sourceTranslation.data) {
            return `Source language "${sourceLang}" has no translation data.`;
        }
        const sourceData = sourceTranslation.data;
        const languageNames = {
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
            const response = (await (0, chatbot_utils_1.retryWithBackoff)(() => genAI.models.generateContent({
                model: chatbot_config_1.GEMINI_CONFIG.MODEL,
                contents: [{ role: 'user', parts: [{ text: translationPrompt }] }],
            }), {
                maxRetries: chatbot_config_1.GEMINI_CONFIG.RETRY.MAX_RETRIES,
                initialDelay: chatbot_config_1.GEMINI_CONFIG.RETRY.INITIAL_DELAY,
                maxDelay: chatbot_config_1.GEMINI_CONFIG.RETRY.MAX_DELAY,
                context: 'Translation',
            }));
            let translatedText = '';
            if (response.candidates &&
                response.candidates[0]?.content?.parts?.[0]?.text) {
                translatedText = response.candidates[0].content.parts[0].text;
            }
            else {
                return 'Failed to get translation response from AI.';
            }
            translatedText = translatedText
                .replace(/```json\n?/g, '')
                .replace(/```\n?/g, '')
                .trim();
            let translatedData;
            try {
                translatedData = JSON.parse(translatedText);
            }
            catch (parseError) {
                console.error('Failed to parse translated JSON:', translatedText);
                return `Failed to parse translated content. The AI may have returned invalid JSON. Please try again.`;
            }
            await services.translationsService.upsertTranslation(targetLang, translatedData, targetLangInfo.native, targetLangInfo.english);
            return `Successfully translated the website to ${targetLangInfo.english} (${targetLangInfo.native})! The translations have been saved to the database. 

To see the translated content, please click on the globe icon (🌐) in the header and select "${targetLangInfo.english}" from the language dropdown menu.`;
        }
        catch (error) {
            console.error('Error during AI translation:', error);
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            return `Failed to translate website: ${errorMessage}`;
        }
    }
    catch (error) {
        console.error('Error translating website:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return `Failed to translate website: ${errorMessage}`;
    }
}
async function handleFunctionCall(functionName, args, services, genAI) {
    switch (functionName) {
        case 'list_agents':
            return await getAvailableAgents(services);
        case 'check_agent_availability':
            return await checkAgentAvailability({
                agentId: args.agentId,
                agentName: args.agentName,
                date: args.date,
                time: args.time,
                customerTimezone: args.customerTimezone,
            }, services);
        case 'schedule_meeting':
            return await scheduleMeeting({
                customerName: args.customerName,
                email: args.email,
                phone: args.phone,
                date: args.date,
                time: args.time,
                timezone: args.timezone,
                agentId: args.agentId,
                agentName: args.agentName,
            }, services);
        case 'set_locale':
            const locale = args.locale;
            if (!locale) {
                return 'Locale code is required. Please provide a valid language code (e.g., "en", "fr", "es", "de").';
            }
            return `LOCALE_CHANGE:${locale}`;
        case 'translate_website':
            return await translateWebsite({
                targetLanguage: args.targetLanguage,
                sourceLanguage: args.sourceLanguage,
            }, services, genAI);
        default:
            return `Unknown function: ${functionName}`;
    }
}
//# sourceMappingURL=chatbot.functions.js.map