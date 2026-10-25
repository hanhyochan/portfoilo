export default function ProjectList({ projects }) {
  return (
    <ol className="wrapper_projects">
      {projects.map(({ title, date, description }, index) => (
        <li key={title}>
          <p className="text_index">{String(index + 1).padStart(2, '0')}</p>
          <div>
            <header>
              <p className="text_title" role="heading" aria-level={3}>{title}</p>
              <p className="text_caption">{date}</p>
            </header>
            <p className="text_body">{description}</p>
          </div>
        </li>
      ))}
    </ol>
  )
}
