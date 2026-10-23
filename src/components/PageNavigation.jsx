import './PageNavigation.scss'

export default function PageNavigation({ items, activePage, onNavigate }) {
  return (
    <nav className="wrapper_page_navigation" aria-label="페이지 탐색">
      <ol>
        {items.map(({ id, label }, index) => (
          <li key={id}>
            <button
              type="button"
              className={index === activePage ? 'is-active' : undefined}
              aria-current={index === activePage ? 'page' : undefined}
              aria-controls={id}
              onClick={() => onNavigate(index)}
            >
              <span className="text_label">{label}</span>
            </button>
          </li>
        ))}
      </ol>
    </nav>
  )
}
