/**
 * Shared chat data shapes. Both the course-creation chat and the
 * lesson-screen mentor pass messages through this normalized shape so the
 * presentational `<Chat>` component doesn't need to know about the AI SDK.
 */

export interface ToolInvocation {
  toolName: string;
  state: string;
  /**
   * The tool's serialized output once `state === 'output-available'`.
   * Raw JSON string — the chat message renderer parses it per-tool to
   * surface things like search-hit counts on the badge.
   */
  output?: unknown;
}

/**
 * Display metadata for a file the learner attached to a past message.
 * The chip renders from this; the actual extracted text never leaves
 * the server. Only attached to user messages.
 */
export interface ChatMessageAttachment {
  id: string;
  filename: string;
  kind: 'pdf' | 'text';
  approxTokens: number;
}

export interface ChatMessageData {
  id: string;
  role: 'user' | 'assistant' | string;
  content: string;
  toolInvocations?: ToolInvocation[];
  attachments?: ChatMessageAttachment[];
}
