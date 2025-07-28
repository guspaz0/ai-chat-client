<p align="center">
    AI Chat Client
</p>

<br />
<p align="center">
    <img src="resources/build/icon.svg" width="64" />
</p>

<p align="center">
    A Modern desktop app multiplaform for chat with LLM models and AI assistants like Ollama.
</p>

<br />

<br />

## Features

- 🚀 Electron - Cross-platform desktop application framework
- ⚛️ React - Component-based UI library
- 📦 TypeScript - Type-safe JavaScript
- 🎨 Shadcn UI - Beautiful and accessible component library
- 🎨 TailwindCSS - Utility-first CSS framework
- ⚡ Vite - Lightning-fast build tool
- 🔥 Fast HMR - Hot Module Replacement
- 🎨 Dark/Light Mode - Built-in theme switching
- 🪟 Custom Window & Titlebar - Professional-looking window with custom titlebar & file menus
- 📐 Clean Project Structure - Separation of main and renderer processes
- 🧩 Path Aliases – Keep your code organized
- 🛠️ Electron Builder - Configured for packaging applications

<br />


## Project Structure

<!-- prettier-ignore-start -->
```markdown
├── app/                        # Renderer process files
│   ├── assets/                 # Static assets (images, fonts, etc)
│   ├── components/             # React components
│   │   ├── App.tsx             # Application component
│   ├── styles/                 # CSS and Tailwind files
│   │   ├── app.css             # App stylesheet
│   │   └── tailwind.css        # Tailwind stylesheet
│   ├── index.html              # Entry HTML file
│   └── renderer.tsx            # Renderer process entry
├── lib/                        # Shared library code
│   ├── main/                   # Main process code
│   │   ├── index.ts            # Main entry point for Electron
│   │   └── ...                 # Other main process modules
│   ├── preload/                # Preload scripts for IPC
│   │   ├── index.ts            # Preload script entry
│   │   └── api.ts              # Exposed API for renderer
│   └── window/                 # Custom window implementation
├── resources/                  # Build resources
├── .eslintrc                   # ESLint configuration
├── .prettierrc                 # Prettier format configuration
├── electron-builder.yml        # Electron builder configuration
├── electron.vite.config.ts     # Vite configuration for Electron
├── package.json                # Project dependencies and scripts
└── tsconfig.node.json          # Main process tsconfig
└── tsconfig.web.json           # Renderer process tsconfig

```
<!-- prettier-ignore-end -->
