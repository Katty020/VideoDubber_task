"use client"

import { ActionIcon, Tooltip } from "@mantine/core"
import type { CSSProperties } from "react"

interface ColorButtonProps {
  color: string
  code: number
  label: string
  onClick: () => void
  isBackground?: boolean
}

export default function ColorButton({ color, code, label, onClick, isBackground = false }: ColorButtonProps) {
  const style: CSSProperties = isBackground
    ? { backgroundColor: color, width: 32, height: 32 }
    : { backgroundColor: color, width: 32, height: 32, color: "#fff" }

  return (
    <Tooltip label={label}>
      <ActionIcon variant="filled" style={style} onClick={onClick} radius="sm" size="lg" />
    </Tooltip>
  )
}

