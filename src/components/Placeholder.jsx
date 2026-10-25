import { Image } from './icons'

export default function Placeholder({ label }) {
  return (
    <div className="wrapper_placeholder" role="img" aria-label={label}>
      <Image size={24} strokeWidth={1.25} aria-hidden="true" />
      <p className="text_caption">{label}</p>
    </div>
  )
}
