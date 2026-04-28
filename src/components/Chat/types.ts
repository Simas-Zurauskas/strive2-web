/**
 * Shared chat data shapes. Both the course-creation chat and the
 * lesson-screen mentor pass messages through this normalized shape so the
 * presentational `<Chat>` component doesn't need to know about the AI SDK.
 */

export interface ToolInvocation {
  toolName: string;
  state: string;
}

export interface ChatMessageData {
  id: string;
  role: 'user' | 'assistant' | string;
  content: string;
  toolInvocations?: ToolInvocation[];
}
