---
name: board
description: "Open the Why board for this repo's Design Bits project, the product as it was built with the reason for each part. Use when the user asks to see the board, what shipped on vibes, what needs nobody is building, or runs /why:board."
---

# Open the board

1. Call `list_projects` on the `designbits` MCP server and find the project (the plugin's `project` setting names it when there are several).
2. The board is at `<Design Bits address>/app/board/<project id>` (the address is https://designbits.app unless the plugin's settings say otherwise).
3. Give the user the link, and open it if they ask (`open` on macOS, `xdg-open` on Linux, `start` on Windows).
   In Claude Code 2.1.287 or later (the terminal, VS Code or the desktop app), `/why-board` also opens the board in brief in a pane beside the chat.
4. In the terminal, add the three lines from the `landing` tool if they haven't seen them this week.
