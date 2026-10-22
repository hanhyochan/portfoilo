import { Braces, PenTool, Layers } from './icons'

const icons = { '퍼블리싱': Braces, '프론트엔드': Braces, '디자인': PenTool, '도구': Layers }

export default function TechStack({ groups }) {
  return (
    <aside className="wrapper_stack" aria-label="기술 스택">
      <header>
        <span className="text_caption">TECH STACK</span>
        <h3 className="text_title">공통 기술 스택</h3>
      </header>
      {groups.map(({ label, items }) => {
        const Icon = icons[label] || Layers
        return (
          <section key={label}>
            <h4 className="text_label"><Icon size={16} aria-hidden="true" />{label}</h4>
            <ul>{items.map((item) => <li className="text_label" key={item}>{item}</li>)}</ul>
          </section>
        )
      })}
    </aside>
  )
}
