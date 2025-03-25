interface ANSIState {
  fg: number
  bg: number
  st: number
}

export function nodesToANSI(nodes: NodeListOf<ChildNode>, states: ANSIState[] = [{ fg: 2, bg: 2, st: 2 }]): string {
  let text = ""

  for (const node of Array.from(nodes)) {
    if (node.nodeType === 3) {
      // Text node
      text += node.textContent
      continue
    }

    if (node.nodeName === "BR") {
      text += "\n"
      continue
    }

    // Handle span elements with ANSI classes
    if (node.nodeName === "SPAN" && node instanceof HTMLElement) {
      const className = node.className
      if (!className.startsWith("ansi-")) continue

      const ansiCode = +className.split("-")[1]
      const newState = Object.assign({}, states[states.length - 1])

      if (ansiCode < 30) newState.st = ansiCode
      if (ansiCode >= 30 && ansiCode < 40) newState.fg = ansiCode
      if (ansiCode >= 40) newState.bg = ansiCode

      states.push(newState)
      text += `\x1b[${newState.st};${ansiCode >= 40 ? newState.bg : newState.fg}m`

      if (node.childNodes.length > 0) {
        text += nodesToANSI(node.childNodes, states)
      }

      states.pop()
      text += `\x1b[0m`

      const currentState = states[states.length - 1]
      if (currentState.fg !== 2) text += `\x1b[${currentState.st};${currentState.fg}m`
      if (currentState.bg !== 2) text += `\x1b[${currentState.st};${currentState.bg}m`
    }
  }

  return text
}

