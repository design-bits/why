// Why's board beside the chat: /why-board opens a pane with the board in brief (merges, the vibes ratio, tripwires, what needs a
// look, needs nobody is building). It asks the plugin's own Design Bits connection, so it signs in once, through /mcp, like the
// tools; it reads counts and names only, never files. Nothing opens by itself: the pane is there when someone asks for it.
import { atom, read, update } from 'claude-code'
import type { EngineInterface, Register } from 'claude-code'

import type { BoardBrief, BoardState } from '../types'

const PANE = 'why-board'
// change the tag when the brief's fields change: it declines what an earlier version stored, which outlives a reload
const board = atom({ plugin: 'why', key: 'board' } as const, { brief: null, note: 'Loading the board…', at: '' } as BoardState, { shape: 'board-1' })

const STATE_MARK: Record<string, string> = { tripped: '!', vibes: '~', grave: '†', experiment: '?', receipted: '✓' }

export const register: Register = (on, options) => {
  const project = typeof options?.project === 'string' ? options.project.trim() : ''

  // asks Design Bits for the board in brief, and keeps what came back or why nothing did
  async function refresh($: EngineInterface) {
    const done = (s: Partial<BoardState>) => update($, board, () => ({ brief: null, note: '', at: new Date().toISOString(), ...s }))
    try {
      const c = await $.mcp.connect('designbits')
      if (!c.isConnected) return done({ note: 'Not connected to Design Bits yet. Run /mcp, choose designbits and sign in, then press Refresh.' })
      const r = await $.mcp.call(c.server, 'board', project ? { project } : {})
      const text = r.content.find(b => b.type === 'text')
      const body = text && 'text' in text ? String(text.text) : ''
      if (r.isError) return done({ note: body || 'Design Bits could not show the board.' })
      return done({ brief: JSON.parse(body) as BoardBrief })
    } catch (err) {
      return done({ note: `The board didn’t load: ${err instanceof Error ? err.message : 'try again'}.` })
    }
  }

  on('session.start', async ($, e, next) => {
    await $.command.register({ name: 'why-board', description: 'Show Why’s board beside the chat: what shipped on vibes, tripwires and needs nobody is building' })
    return next(e)
  })

  on('command.run', { command: 'why-board' }, async $ => {
    const opened = await $.ui.open({ id: PANE, title: 'Why · board' })
    await refresh($)
    return { text: opened.isPlaced ? 'Why’s board is open beside the chat.' : 'This screen can’t show a pane here. Use /why:board to open the board in the browser.' }
  })

  on('ui.render', { component: 'Pane', requestId: PANE }, async ($, e) => {
    const { Box, Text, Button } = $.ui.resolve(e)
    const s = await read($, board)
    const b = s.brief
    return (
      <Box flexDirection="column">
        {!b && <Text dimColor>{s.note}</Text>}
        {b && (
          <Box flexDirection="column">
            <Text bold>{b.project}</Text>
            <Text>{b.merged} merged · {b.receipted} rest on what people said</Text>
            <Text>vibes ratio {b.vibes.of ? Math.round((b.vibes.count / b.vibes.of) * 100) : 0}% ({b.vibes.count} of {b.vibes.of}) · {b.tripped} tripwire{b.tripped === 1 ? '' : 's'} went off</Text>
            <Text dimColor>Needs a look</Text>
            {b.look.length === 0 && <Text dimColor>Nothing: every feature has a reason or is a labelled bet.</Text>}
            {b.look.map(r => <Text>{STATE_MARK[r.state] || '·'} {r.name} · {r.label}</Text>)}
            {b.orphans.length > 0 && <Text dimColor>Needs nobody is building</Text>}
            {b.orphans.map(n => <Text>{n.key} {n.text} · {n.grade}</Text>)}
            <Text dimColor>{b.link}</Text>
          </Box>
        )}
        <Box flexDirection="row">
          <Button key="refresh" label="Refresh" hotkey="r" onPress={() => { void refresh($) }} />
          <Button key="close" label="Close" role="dismiss" onPress={() => { void $.ui.close({ id: PANE }) }} />
        </Box>
      </Box>
    )
  })
}
