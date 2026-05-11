import '../css/SectionHeading.css'

interface SectionHeadingProps {
  title: string
  id: string
  subtitle?: string
}

function SectionHeading({ title, id, subtitle }: SectionHeadingProps) {
  return (
    <header className="section-heading">
      <h2 id={id} className="section-heading__title">
        {title}
      </h2>
      {subtitle ? (
        <p className="section-heading__subtitle">{subtitle}</p>
      ) : null}
    </header>
  )
}

export default SectionHeading
