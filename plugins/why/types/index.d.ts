// What Why's board pane keeps in the session's state: the board in brief, as the MCP tool `board` returns it, or why it isn't there.
export type BoardRow = { name: string; state: string; label: string; rests: string[] }
export type BoardNeed = { key: string; text: string; grade: string }
export type BoardBrief = {
  project: string
  merged: number
  receipted: number
  vibes: { count: number; of: number }
  tripped: number
  look: BoardRow[]
  receiptedFeatures: number
  experiments: number
  orphans: BoardNeed[]
  link: string
}
export type BoardState = { brief: BoardBrief | null; note: string; at: string }

declare module 'claude-code' {
  interface PluginState {
    why: { board: Shaped<BoardState> }
  }
}
