export interface PromptContext {
    ragContext?: string;
    currentDate: string;
    currentTime: string;
    currentDay: string;
}
export declare function getCurrentDateTimeContext(): {
    date: string;
    time: string;
    day: string;
};
export declare function buildSystemPrompt(ragContext?: string): string;
