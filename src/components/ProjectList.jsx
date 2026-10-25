export default function ProjectList({ projects }) {
  return (
    <ol className="wrapper_projects">
      {projects.map(({ title, tag, date, description }) => (
        <li key={title}>
          <header className="wrapper_project_title">
            {tag && <p className="text_tag">{tag}</p>}
            <p className="text_title" role="heading" aria-level={3}>{title}</p>
          </header>
          <p className="text_body">{description}</p>
          <p className="text_caption">{date}</p>
        </li>
      ))}
    </ol>
  )
}
