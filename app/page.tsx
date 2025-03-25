"use client"

import { useState, useRef } from "react"
import { Container, Title, Text, Button, Group, Stack, Paper, Tooltip, Box, Divider, Card, Badge } from "@mantine/core"
import { useClipboard } from "@mantine/hooks"
import { notifications } from "@mantine/notifications"
import { Bold, Underline, Copy } from "lucide-react"
import { nodesToANSI } from "@/lib/ansi-converter"
import ColorButton from "@/components/color-button"
import TextEditor from "@/components/text-editor"

export default function Home() {
  const [editorContent, setEditorContent] = useState<HTMLDivElement | null>(null)
  const editorRef = useRef<HTMLDivElement>(null)
  const clipboard = useClipboard()
  const [copyCount, setCopyCount] = useState(0)

  const fgColors = [
    { code: 30, color: "#4f545c", label: "Dark Gray (33%)" },
    { code: 31, color: "#dc322f", label: "Red" },
    { code: 32, color: "#859900", label: "Yellowish Green" },
    { code: 33, color: "#b58900", label: "Gold" },
    { code: 34, color: "#268bd2", label: "Light Blue" },
    { code: 35, color: "#d33682", label: "Pink" },
    { code: 36, color: "#2aa198", label: "Teal" },
    { code: 37, color: "#ffffff", label: "White" },
  ]

  const bgColors = [
    { code: 40, color: "#002b36", label: "Blueish Black" },
    { code: 41, color: "#cb4b16", label: "Rust Brown" },
    { code: 42, color: "#586e75", label: "Gray (40%)" },
    { code: 43, color: "#657b83", label: "Gray (45%)" },
    { code: 44, color: "#839496", label: "Light Gray (55%)" },
    { code: 45, color: "#6c71c4", label: "Blurple" },
    { code: 46, color: "#93a1a1", label: "Light Gray (60%)" },
    { code: 47, color: "#fdf6e3", label: "Cream White" },
  ]

  const applyStyle = (ansiCode: number) => {
    if (!editorRef.current) return

    if (ansiCode === 0) {
      
      if (editorRef.current) {
        editorRef.current.innerHTML = editorRef.current.innerText
      }
      return
    }

    const selection = window.getSelection()
    if (!selection || selection.rangeCount === 0) return

    const range = selection.getRangeAt(0)
    const selectedText = selection.toString()

    if (selectedText) {
      const span = document.createElement("span")
      span.innerText = selectedText
      span.classList.add(`ansi-${ansiCode}`)

      range.deleteContents()
      range.insertNode(span)

      range.selectNodeContents(span)
      selection.removeAllRanges()
      selection.addRange(range)
    }
  }

  const copyText = () => {
    if (!editorRef.current) return

    const toCopy = "```ansi\n" + nodesToANSI(editorRef.current.childNodes) + "\n```"
    clipboard.copy(toCopy)

    const funnyMessages = [
      "Copied!",
      "Double Copy!",
      "Triple Copy!",
      "Dominating!!",
      "Rampage!!",
      "Mega Copy!!",
      "Unstoppable!!",
      "Wicked Sick!!",
      "Monster Copy!!!",
      "GODLIKE!!!",
      "BEYOND GODLIKE!!!!",
      Array(16)
        .fill(0)
        .reduce((p) => p + String.fromCharCode(Math.floor(Math.random() * 65535)), ""),
    ]

    const newCount = Math.min(11, copyCount + 1)
    setCopyCount(newCount)

    notifications.show({
      title: "Success",
      message: funnyMessages[copyCount],
      color: copyCount <= 8 ? "green" : "red",
      autoClose: 2000,
    })

    setTimeout(() => {
      setCopyCount(0)
    }, 2000)
  }

  return (
    <Container size="lg" py="xl" style={{ textAlign: "center" }}>
      <Stack spacing="xl">
        <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Title order={1} style={{ fontSize: "2.5rem",  }}>
            Rebane&apos;s Discord{" "}
            <Text component="span" style={{ color: "#268bd2" }} inherit>
              Colored
            </Text>{" "}
            Text Generator
            </Title>
          <Text size="sm" color="dimmed" mt="sm">
            Create stunning Discord messages with ANSI color codes!
          </Text>
        </Card>

        <Paper p="md" withBorder shadow="xs" radius="md">
          <Stack spacing="md">
            <Title order={3}>About</Title>
            <Text>
              This is a simple app that creates colored Discord messages using the ANSI color codes available on the
              latest Discord desktop versions.
            </Text>
            <Text>
              To use this, write your text, select parts of it and assign colors to them, then copy it using the button
              below, and send in a Discord message.
            </Text>
          </Stack>
        </Paper>

        <Divider my="lg" />

        <Title order={2} style={{ fontSize: "2rem" }}>
          Create your text
        </Title>

        <Group position="center" spacing="md">
          <Button variant="light" color="red" onClick={() => applyStyle(0)}>
            Reset All
          </Button>
          <Tooltip label="Bold">
            <Button variant="light" color="blue" onClick={() => applyStyle(1)} fw={700}>
              <Bold size={16} />
            </Button>
          </Tooltip>
          <Tooltip label="Underline">
            <Button variant="light" color="blue" onClick={() => applyStyle(4)} style={{ textDecoration: "underline" }}>
              <Underline size={16} />
            </Button>
          </Tooltip>
        </Group>

        <Box>
          <Text fw={700} mb="xs">
            Foreground Colors
          </Text>
          <Group position="center" spacing="xs">
            {fgColors.map((color) => (
              <ColorButton
                key={color.code}
                color={color.color}
                code={color.code}
                label={color.label}
                onClick={() => applyStyle(color.code)}
              />
            ))}
          </Group>
        </Box>

        <Box>
          <Text fw={700} mb="xs">
            Background Colors
          </Text>
          <Group position="center" spacing="xs">
            {bgColors.map((color) => (
              <ColorButton
                key={color.code}
                color={color.color}
                code={color.code}
                label={color.label}
                onClick={() => applyStyle(color.code)}
                isBackground
              />
            ))}
          </Group>
        </Box>

        <TextEditor ref={editorRef} style={{ border: "1px solid #e0e0e0", borderRadius: "8px", padding: "1rem" }} />

        <Group position="center" mt="lg">
          <Button icon={<Copy size={16} />} onClick={copyText} size="md" variant="gradient" gradient={{ from: 'indigo', to: 'cyan' }}>
            Copy text as Discord formatted
          </Button>
        </Group>

        
      </Stack>
    </Container>
  )
}
