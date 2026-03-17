import { useLanguage } from '../../../hooks/useLanguage'
import './CategoryCard.css'

const CategoryCard = ({ category, onClick, isSelected }) => {
  const { currentLanguage } = useLanguage()

  // Safe article count formatting (real API protection)
  const articleCount = category?.articleCount ?? 0

  return (
    <div 
      className={`category-card ${isSelected ? 'selected' : ''}`}
      onClick={onClick}
      style={{ backgroundColor: category?.color || '#ffffff' }}
    >
      <div className="card-header">
        <span className="category-icon">
          {category?.icon}
        </span>

        <span className="article-count">
          {articleCount} articles
        </span>
      </div>

      <h3 className="category-title">
        {category?.title?.[currentLanguage] || ''}
      </h3>

      <p className="category-description">
        {category?.description?.[currentLanguage] || ''}
      </p>

      <button className="browse-btn">
        {currentLanguage === 'en' && 'Browse →'}
        {currentLanguage === 'am' && 'ይመልከቱ →'}
        {currentLanguage === 'om' && 'Ilaali →'}
      </button>

      <div className="card-hover-effect"></div>
    </div>
  )
}

export default CategoryCard