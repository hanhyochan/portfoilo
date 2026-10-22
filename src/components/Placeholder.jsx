import { Image } from './icons'

export default function Placeholder({ label, variant = 'landscape' }) {
  return (
    <div className="wrapper_placeholder" data-variant={variant} role="img" aria-label={label}>
      <Image size={24} strokeWidth={1.25} aria-hidden="true" />
      <span className="text_caption">{label}</span>
    </div>
  )
}
