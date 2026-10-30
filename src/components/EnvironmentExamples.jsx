import { Tab, TabList, TabPanel, Tabs } from '@h_designsystem/ui'

export default function EnvironmentExamples({ title, environments }) {
  return (
    <section className="wrapper_environment_examples" aria-label={title}>
      <h3 className="h_designSystem-type-title_18_700">{title}</h3>
      <Tabs className="wrapper_environment_tabs" defaultValue={environments[0].id}>
        <TabList aria-label="프로젝트 환경">
          {environments.map(({ id, label }) => (
            <Tab key={id} value={id} size="small" variant="filled" shape="full-rounded">{label}</Tab>
          ))}
        </TabList>
        {environments.map(({ id, description, code, note }) => (
          <TabPanel key={id} value={id} className="wrapper_environment_panel">
            <p className="h_designSystem-type-body_16_400">{description}</p>
            <code className="wrapper_environment_code h_designSystem-type-label_14_400">{code}</code>
            {note && <p className="h_designSystem-type-label_14_400">{note}</p>}
          </TabPanel>
        ))}
      </Tabs>
    </section>
  )
}
