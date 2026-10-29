export default function Placeholder({ label }) {
  return (
    <div className="wrapper_placeholder" role="img" aria-label={label}>
      <span className="wrapper_icon_image" aria-hidden="true" />
      <p className="h_designSystem-type-label_14_400">{label}</p>
    </div>
  )
}
