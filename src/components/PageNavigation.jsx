export default function PageNavigation({ items, activePage, onNavigate }) {
  return (
    <nav className="wrapper_page_navigation" aria-label="페이지 탐색">
      <ol>
        {items.map(({ id, label }, index) => (
          <li key={id}>
            <button
              type="button"
              aria-current={index === activePage ? 'page' : undefined}
              aria-controls={id}
              onClick={() => onNavigate(index)}
            >
              <p className="h_designSystem-type-label_14_500">{label}</p>
            </button>
          </li>
        ))}
      </ol>
    </nav>
  )
}
