import { Fragment } from 'react'

export default function Flow({ items }) {
  return (
    <div className="wrapper_flow_step" role="list">
      {items.map((item, index) => (
        <Fragment key={item}>
          <div role="listitem">
            <span className="h_designSystem-type-title_16_600">{index + 1}.</span>
            <p className="h_designSystem-type-body_16_400">{item}</p>
          </div>
          {index < items.length - 1 && (
            <span className="wrapper_icon_arrow h_designSystem-IconButton" data-spec="btn_icon_filled_medium" aria-hidden="true" />
          )}
        </Fragment>
      ))}
    </div>
  )
}
