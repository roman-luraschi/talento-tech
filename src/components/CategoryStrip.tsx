import type { Category } from '../types/store'
import '../css/CategoryStrip.css'

interface CategoryStripProps {
  categories: Category[]
  selectedCategoryId?: string | null
  onSelectCategory?: (categoryId: string | null) => void
}

function CategoryStrip({
  categories,
  selectedCategoryId = null,
  onSelectCategory,
}: CategoryStripProps) {
  const handleSelect = (categoryId: string) => {
    if (!onSelectCategory) return
    onSelectCategory(selectedCategoryId === categoryId ? null : categoryId)
  }

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
          {categories.map((cat) => {
            const isSelected = selectedCategoryId === cat.id
            return (
              <li key={cat.id}>
                <button
                  type="button"
                  className={
                    isSelected
                      ? 'category-strip__chip category-strip__chip--active'
                      : 'category-strip__chip'
                  }
                  aria-pressed={isSelected}
                  onClick={() => handleSelect(cat.id)}
                >
                  {cat.label}
                </button>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}

export default CategoryStrip
