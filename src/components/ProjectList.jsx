import { ContentTag } from '@h_designsystem/ui'

export default function ProjectList({ projects }) {
  return (
    <ol className="wrapper_projects">
      {projects.map(({ title, tag, date, description }) => (
        <li key={title}>
          <header className="wrapper_project_title">
            {tag && <ContentTag size="small">{tag}</ContentTag>}
            <p className="h_designSystem-type-title_18_600" role="heading" aria-level={3}>{title}</p>
          </header>
          <p className="h_designSystem-type-body_16_400">{description}</p>
          <p className="h_designSystem-type-label_14_400">{date}</p>
        </li>
      ))}
    </ol>
  )
}
