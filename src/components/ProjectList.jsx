export default function ProjectList({ projects }) {
  return (
    <ol className="wrapper_projects">
      {projects.map(({ title, date, description }, index) => (
        <li key={title}>
          <span className="text_caption">{String(index + 1).padStart(2, '0')}</span>
          <div>
            <header>
              <h3 className="text_title">{title}</h3>
              <span className="text_caption">{date}</span>
            </header>
            <p className="text_body">{description}</p>
          </div>
        </li>
      ))}
    </ol>
  )
}
