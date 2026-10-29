export default function Flow({ items }) {
  return (
    <ol className="wrapper_flow">
      {items.map((item, index) => (
        <li key={item}>
          <header><p className="h_designSystem-type-title_18_700">{String(index + 1).padStart(2, '0')}</p><span className="wrapper_icon_arrow" aria-hidden="true" /></header>
          <p className="h_designSystem-type-body_16_400">{item}</p>
        </li>
      ))}
    </ol>
  )
}
