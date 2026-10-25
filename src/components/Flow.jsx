import { ArrowUpRight } from './icons'

export default function Flow({ items }) {
  return (
    <ol className="wrapper_flow">
      {items.map((item, index) => (
        <li key={item}>
          <header><p className="text_caption">{String(index + 1).padStart(2, '0')}</p><ArrowUpRight size={20} aria-hidden="true" /></header>
          <p className="text_body">{item}</p>
        </li>
      ))}
    </ol>
  )
}
