import React, { useState } from 'react'
import { MdPreview, MdCatalog, config } from 'md-editor-rt'
import 'md-editor-rt/lib/preview.css'

config({
  editorExtensions: {
    highlight: {
      js: '../scripts/highlight.min.js',
      css: {
        atom: {
          dark: '../styles/atom-one-dark.css',
          light: '../styles/atom-one-light.css',
        },
      },
    },
  },
})

const scrollElement = document.documentElement

export default function MdPreviewComponent({ text }: Record<string, string>) {
  const [id] = useState('preview-only')

  return (
    <>
      <MdPreview
        id={id}
        style={{
          backgroundColor: 'var(--color-gray-700)',
          color: 'var(--color-white)',
          fontSize: '10px'
        }}
        language={'en-US'}
        theme="dark"
        previewTheme="github"
        codeTheme="atom"
        noKatex={true}
        noMermaid={true}
        value={text}
      />
      <MdCatalog editorId={id} scrollElement={scrollElement} />
    </>
  )
}
