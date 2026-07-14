import { Helmet } from 'react-helmet-async'

interface SeoProps {
  title: string
  description: string
}

function Seo({ title, description }: SeoProps) {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
    </Helmet>
  )
}

export default Seo
