export interface WorkspaceChatState {
  threads: Record<string, { role: "user" | "assistant"; text: string }[]>;
  drafts: Record<string, string>;
}
