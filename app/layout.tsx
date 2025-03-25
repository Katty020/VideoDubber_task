import type React from "react"
import "@/app/globals.css"
import { MantineProvider } from "@mantine/core"
import { Notifications } from "@mantine/notifications"

export const metadata = {
  title: "Rebane's Discord Colored Text Generator",
  description: "Create colored text for Discord using ANSI color codes",
    generator: ''
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <MantineProvider
          withGlobalStyles
          withNormalizeCSS
          theme={{
            defaultColorScheme: "dark",
            primaryColor: "blue",
          }}
        >
          <Notifications position="top-right" />
          {children}
        </MantineProvider>
      </body>
    </html>
  )
}



import './globals.css'