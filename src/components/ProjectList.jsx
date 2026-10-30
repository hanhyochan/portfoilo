import { ContentTag, Hashtag } from '@h_designsystem/ui'

export default function ProjectList({ projects }) {
  return (
    <ol className="wrapper_projects">
      {projects.map(({ title, tag, date, roles, image = '/imgs/imac-gray-mockup.png', imageAlt = '' }) => (
        <li key={title} data-project-tag={tag}>
          <a href="https://www.google.com/" aria-label={title}>
            <div className="wrapper_project_media">
              <img src={image} alt={imageAlt} loading="lazy" />
              {tag && <ContentTag size="small">{tag}</ContentTag>}
            </div>
            <div className="wrapper_project_details">
              <p className="h_designSystem-type-title_18_600" role="heading" aria-level={3}>{title}</p>
              <div className="wrapper_project_roles">
                {roles.map(role => <Hashtag key={role} size="medium">#{role}</Hashtag>)}
              </div>
              {date && <p className="h_designSystem-type-label_14_400">{date}</p>}
            </div>
          </a>
        </li>
      ))}
    </ol>
  )
}
