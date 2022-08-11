import markdownIt from 'markdown-it'

const md = markdownIt({})

export function render(markdown: string) {
  return md.render(markdown)
}
