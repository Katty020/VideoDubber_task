"use client"

import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react"
import { Paper, Box, Button, Group, Text } from "@mantine/core"

const TextEditor = forwardRef<HTMLDivElement>((props, ref) => {
  const editorRef = useRef<HTMLDivElement>(null)
  const [charCount, setCharCount] = useState(0)
  const [wordCount, setWordCount] = useState(0)

  useImperativeHandle(ref, () => editorRef.current as HTMLDivElement)

  useEffect(() => {
    const handleInput = () => {
      if (!editorRef.current) return

      const base = editorRef.current.innerHTML.replace(/<(\/?(br|span|span class="ansi-[0-9]*"))>/g, "[$1]")

      if (base.includes("<") || base.includes(">")) {
        editorRef.current.innerHTML = base
          .replace(/<.*?>/g, "")
          .replace(/[<>]/g, "")
          .replace(/\[(\/?(br|span|span class="ansi-[0-9]*"))\]/g, "<$1>")
      }

      const text = editorRef.current.innerText
      setCharCount(text.length)
      setWordCount(text.trim().split(/\s+/).length)
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        document.execCommand("insertLineBreak")
        event.preventDefault()
      }
    }

    const editor = editorRef.current
    if (editor) {
      editor.addEventListener("input", handleInput)
      editor.addEventListener("keydown", handleKeyDown)

      // Set default content
      editor.innerHTML =
        'Welcome to&nbsp;<span class="ansi-33">Rebane</span>\'s <span class="ansi-45"><span class="ansi-37">Discord</span></span>&nbsp;<span class="ansi-31">C</span><span class="ansi-32">o</span><span class="ansi-33">l</span><span class="ansi-34">o</span><span class="ansi-35">r</span><span class="ansi-36">e</span><span class="ansi-37">d</span>&nbsp;Text Generator!'
    }

    return () => {
      if (editor) {
        editor.removeEventListener("input", handleInput)
        editor.removeEventListener("keydown", handleKeyDown)
      }
    }
  }, [])

  const clearEditor = () => {
    if (editorRef.current) {
      editorRef.current.innerHTML = ""
    }
  }

  return (
    <Paper
      withBorder
      p="md"
      sx={{
        minHeight: "400px",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#1E1F22",
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
      }}
    >
      <Box
        component="div"
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        sx={{
          width: "100%",
          height: "100%",
          minHeight: "400px",
          maxHeight: "600px",
          resize: "both",
          overflow: "auto",
          textAlign: "left",
          fontFamily: "monospace",
          backgroundColor: "#2C2F33",
          color: "#FFFFFF",
          border: "1px solid #4F545C",
          padding: "16px",
          whiteSpace: "pre-wrap",
          fontSize: "1rem",
          lineHeight: "1.6rem",
          outline: "none",
          borderRadius: "8px",
          transition: "border-color 0.2s ease",
          "&:focus": {
            borderColor: "#7289DA",
          },
        }}
      />
      <Group position="apart" mt="md">
        <Text size="sm" color="dimmed">
          {charCount} characters, {wordCount} words
        </Text>
        <Button size="xs" variant="light" color="blue" onClick={clearEditor}>
          Clear
        </Button>
      </Group>
    </Paper>
  )
})

TextEditor.displayName = "TextEditor"

export default TextEditor
