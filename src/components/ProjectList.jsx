import { ContentTag, Hashtag } from '@h_designsystem/ui'

export default function ProjectList({ projects }) {
  return (
    <ol className="wrapper_projects">
      {projects.map(({ title, tag, date, roles }) => (
        <li key={title} data-project-tag={tag}>
          <a href="https://www.google.com/" aria-label={title}>
            <div className="wrapper_project_media">
              <img src="/imgs/imac-gray-mockup.png" alt="" loading="lazy" />
              {tag && <ContentTag size="small">{tag}</ContentTag>}
            </div>
            <div className="wrapper_project_details">
              <p className="h_designSystem-type-title_18_600" role="heading" aria-level={3}>{title}</p>
              <div className="wrapper_project_roles">
                {roles.map(role => <Hashtag key={role} size="medium">#{role}</Hashtag>)}
              </div>
              <p className="h_designSystem-type-label_14_400">{date}</p>
            </div>
          </a>
        </li>
      ))}
    </ol>
  )
}
