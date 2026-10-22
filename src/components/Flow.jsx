import { ArrowUpRight } from './icons'

export default function Flow({ items }) {
  return (
    <ol className="wrapper_flow">
      {items.map((item, index) => (
        <li key={item}>
          <header><span className="text_caption">0{index + 1}</span><ArrowUpRight size={20} aria-hidden="true" /></header>
          <p className="text_body">{item}</p>
        </li>
      ))}
    </ol>
  )
}
