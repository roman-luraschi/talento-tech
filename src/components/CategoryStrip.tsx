import type { Category } from '../types/store'
import '../css/CategoryStrip.css'

interface CategoryStripProps {
  categories: Category[]
}

function CategoryStrip({ categories }: CategoryStripProps) {
  return (
    <section
      className="category-strip"
      aria-labelledby="categories-heading"
    >
      <div className="category-strip__inner">
        <h2 id="categories-heading" className="category-strip__title">
          Categorías
        </h2>
        <ul className="category-strip__list" role="list">
          {categories.map((cat) => (
            <li key={cat.id}>
              <a href="#destacados" className="category-strip__chip">
                {cat.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export default CategoryStrip
