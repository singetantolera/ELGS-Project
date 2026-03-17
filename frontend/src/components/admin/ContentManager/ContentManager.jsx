import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../../hooks/useAuth'
import { useLanguage } from '../../../hooks/useLanguage'
import Loader from '../../common/Loader/Loader'
import api from '../../../services/api'
import './ContentManager.css'

const ContentManager = () => {
  const { user } = useAuth()
  const { currentLanguage, t } = useLanguage()
  const navigate = useNavigate()
  
  const [content, setContent] = useState([])
  const [filteredContent, setFilteredContent] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedLanguage, setSelectedLanguage] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingContent, setEditingContent] = useState(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [contentToDelete, setContentToDelete] = useState(null)
  const [stats, setStats] = useState({
    total: 0,
    published: 0,
    draft: 0,
    archived: 0
  })

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/dashboard')
      return
    }
    fetchContent()
    fetchStats()
  }, [user, navigate])

  useEffect(() => {
    filterContent()
  }, [content, searchTerm, selectedCategory, selectedLanguage, selectedStatus])

  const fetchContent = async () => {
    setIsLoading(true)
    try {
      const response = await api.get('/admin/content')
      setContent(response.data.content)
    } catch (error) {
      console.error('Failed to fetch content:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await api.get('/admin/content/stats')
      setStats(response.data.stats)
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    }
  }

  const filterContent = useCallback(() => {
    let filtered = [...content]

    if (searchTerm) {
      filtered = filtered.filter(item => 
        item.title.en.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.title.am.includes(searchTerm) ||
        item.title.om.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.metadata?.articleNumber?.includes(searchTerm)
      )
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.category === selectedCategory)
    }

    if (selectedLanguage !== 'all') {
      filtered = filtered.filter(item => item.language === selectedLanguage)
    }

    if (selectedStatus !== 'all') {
      filtered = filtered.filter(item => item.status === selectedStatus)
    }

    setFilteredContent(filtered)
  }, [content, searchTerm, selectedCategory, selectedLanguage, selectedStatus])

  const handleDelete = async (id) => {
    setIsDeleting(true)
    try {
      await api.delete(`/admin/content/${id}`)
      setContent(prev => prev.filter(item => item.id !== id))
      setShowDeleteModal(false)
      setContentToDelete(null)
      fetchStats()
    } catch (error) {
      console.error('Failed to delete content:', error)
    } finally {
      setIsDeleting(false)
    }
  }

  const handleStatusChange = async (id, newStatus) => {
    try {
      await api.patch(`/admin/content/${id}/status`, { status: newStatus })
      setContent(prev => prev.map(item => 
        item.id === id ? { ...item, status: newStatus } : item
      ))
      fetchStats()
    } catch (error) {
      console.error('Failed to update status:', error)
    }
  }

  const handleSave = async (contentData) => {
    try {
      if (editingContent) {
        // Update existing content
        const response = await api.put(`/admin/content/${editingContent.id}`, contentData)
        setContent(prev => prev.map(item => 
          item.id === editingContent.id ? response.data.content : item
        ))
      } else {
        // Create new content
        const response = await api.post('/admin/content', contentData)
        setContent(prev => [...prev, response.data.content])
      }
      setShowAddModal(false)
      setEditingContent(null)
      fetchStats()
    } catch (error) {
      console.error('Failed to save content:', error)
    }
  }

  const getCategoryName = (category) => {
    const categories = {
      criminal: { en: 'Criminal Law', am: 'የወንጀል ሕግ', om: 'Seera Cubbuu' },
      family: { en: 'Family Law', am: 'የቤተሰብ ሕግ', om: 'Seera Maatii' },
      labor: { en: 'Labor Law', am: 'የሠራተኛ ሕግ', om: 'Seera Hojii' }
    }
    return categories[category]?.[currentLanguage] || category
  }

  const getLanguageName = (code) => {
    const languages = {
      en: 'English',
      am: 'አማርኛ',
      om: 'Afaan Oromoo'
    }
    return languages[code] || code
  }

  const getStatusBadgeClass = (status) => {
    switch(status) {
      case 'published': return 'status-badge published'
      case 'draft': return 'status-badge draft'
      case 'archived': return 'status-badge archived'
      default: return 'status-badge'
    }
  }

  if (isLoading) {
    return (
      <div className="content-manager-loading">
        <Loader size="large" />
        <p>{t('loadingContent') || 'Loading content manager...'}</p>
      </div>
    )
  }

  return (
    <div className="content-manager">
      <div className="manager-header">
        <div>
          <h1>{t('contentManager') || 'Content Manager'}</h1>
          <div className="stats-badges">
            <span className="stat-badge total">
              <span className="stat-label">Total</span>
              <span className="stat-value">{stats.total}</span>
            </span>
            <span className="stat-badge published">
              <span className="stat-label">Published</span>
              <span className="stat-value">{stats.published}</span>
            </span>
            <span className="stat-badge draft">
              <span className="stat-label">Draft</span>
              <span className="stat-value">{stats.draft}</span>
            </span>
            <span className="stat-badge archived">
              <span className="stat-label">Archived</span>
              <span className="stat-value">{stats.archived}</span>
            </span>
          </div>
        </div>

        <button className="add-btn" onClick={() => setShowAddModal(true)}>
          <span className="btn-icon">➕</span>
          {t('addNewContent') || 'Add New Content'}
        </button>
      </div>

      <div className="filters-section">
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder={t('searchContent') || 'Search content...'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button className="clear-search" onClick={() => setSearchTerm('')}>
              ✕
            </button>
          )}
        </div>

        <div className="filter-controls">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="all">{t('allCategories') || 'All Categories'}</option>
            <option value="criminal">{t('criminalLaw') || 'Criminal Law'}</option>
            <option value="family">{t('familyLaw') || 'Family Law'}</option>
            <option value="labor">{t('laborLaw') || 'Labor Law'}</option>
          </select>

          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
          >
            <option value="all">{t('allLanguages') || 'All Languages'}</option>
            <option value="en">English</option>
            <option value="am">አማርኛ</option>
            <option value="om">Afaan Oromoo</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      <div className="results-info">
        <span className="results-count">
          Showing <strong>{filteredContent.length}</strong> of <strong>{content.length}</strong> articles
        </span>
      </div>

      <div className="content-table">
        <table>
          <thead>
            <tr>
              <th>{t('title') || 'Title'}</th>
              <th>{t('category') || 'Category'}</th>
              <th>{t('language') || 'Language'}</th>
              <th>{t('status') || 'Status'}</th>
              <th>{t('views') || 'Views'}</th>
              <th>{t('bookmarks') || 'Bookmarks'}</th>
              <th>{t('lastUpdated') || 'Last Updated'}</th>
              <th>{t('actions') || 'Actions'}</th>
            </tr>
          </thead>
          <tbody>
            {filteredContent.map(item => (
              <tr key={item.id}>
                <td className="title-cell">
                  <div className="title-content">
                    <strong>{item.title[currentLanguage]}</strong>
                    <small className="title-other">
                      {Object.entries(item.title)
                        .filter(([lang]) => lang !== currentLanguage)
                        .map(([lang, title]) => (
                          <span key={lang} className="other-lang">
                            {getLanguageName(lang)}: {title}
                          </span>
                        ))}
                    </small>
                    {item.metadata?.articleNumber && (
                      <small className="title-meta">Art. {item.metadata.articleNumber}</small>
                    )}
                  </div>
                </td>
                <td>
                  <span className="category-badge" data-category={item.category}>
                    {getCategoryName(item.category)}
                  </span>
                </td>
                <td>
                  <span className="language-badge">
                    <span className="language-flag">
                      {item.language === 'en' && '🇬🇧'}
                      {item.language === 'am' && '🇪🇹'}
                      {item.language === 'om' && '🇪🇹'}
                    </span>
                    {getLanguageName(item.language)}
                  </span>
                </td>
                <td>
                  <select
                    value={item.status}
                    onChange={(e) => handleStatusChange(item.id, e.target.value)}
                    className={`status-select ${item.status}`}
                  >
                    <option value="published">{t('published') || 'Published'}</option>
                    <option value="draft">{t('draft') || 'Draft'}</option>
                    <option value="archived">{t('archived') || 'Archived'}</option>
                  </select>
                </td>
                <td>{item.views?.toLocaleString() || 0}</td>
                <td>{item.bookmarks || 0}</td>
                <td>
                  <div className="date-cell">
                    {new Date(item.lastUpdated).toLocaleDateString()}
                    <small>{new Date(item.lastUpdated).toLocaleTimeString()}</small>
                  </div>
                </td>
                <td className="actions-cell">
                  <button
                    className="action-btn edit"
                    onClick={() => setEditingContent(item)}
                    title={t('edit') || 'Edit'}
                  >
                    ✏️
                  </button>
                  <button
                    className="action-btn view"
                    onClick={() => navigate(`/legal-content/${item.id}`)}
                    title={t('view') || 'View'}
                  >
                    👁️
                  </button>
                  <button
                    className="action-btn delete"
                    onClick={() => {
                      setContentToDelete(item)
                      setShowDeleteModal(true)
                    }}
                    title={t('delete') || 'Delete'}
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredContent.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">📄</div>
            <h3>No content found</h3>
            <p>Try adjusting your filters or add new content</p>
            <button className="add-first-btn" onClick={() => setShowAddModal(true)}>
              + Add Your First Article
            </button>
          </div>
        )}
      </div>

      {(showAddModal || editingContent) && (
        <ContentFormModal
          content={editingContent}
          onClose={() => {
            setShowAddModal(false)
            setEditingContent(null)
          }}
          onSave={handleSave}
        />
      )}

      {showDeleteModal && contentToDelete && (
        <div className="modal-overlay">
          <div className="modal-content delete-modal">
            <div className="delete-icon">⚠️</div>
            <h3>{t('deleteContent') || 'Delete Content'}</h3>
            <p>{t('deleteConfirmation') || 'Are you sure you want to delete'} "{contentToDelete.title[currentLanguage]}"?</p>
            <p className="warning-text">{t('cannotUndo') || 'This action cannot be undone.'}</p>
            <div className="modal-actions">
              <button className="cancel-btn" onClick={() => {
                setShowDeleteModal(false)
                setContentToDelete(null)
              }} disabled={isDeleting}>
                {t('cancel') || 'Cancel'}
              </button>
              <button className="delete-btn" onClick={() => handleDelete(contentToDelete.id)} disabled={isDeleting}>
                {isDeleting ? 'Deleting...' : (t('delete') || 'Delete')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Content Form Modal Component
const ContentFormModal = ({ content, onClose, onSave }) => {
  const { currentLanguage, t } = useLanguage()
  const [formData, setFormData] = useState({
    title: {
      en: content?.title?.en || '',
      am: content?.title?.am || '',
      om: content?.title?.om || ''
    },
    category: content?.category || 'criminal',
    language: content?.language || 'en',
    status: content?.status || 'draft',
    content: {
      en: content?.content?.en || '',
      am: content?.content?.am || '',
      om: content?.content?.om || ''
    },
    simplifiedContent: {
      en: content?.simplifiedContent?.en || '',
      am: content?.simplifiedContent?.am || '',
      om: content?.simplifiedContent?.om || ''
    },
    metadata: {
      articleNumber: content?.metadata?.articleNumber || '',
      proclamationNo: content?.metadata?.proclamationNo || '',
      dateEnacted: content?.metadata?.dateEnacted || '',
      lastAmended: content?.metadata?.lastAmended || '',
      source: content?.metadata?.source || ''
    }
  })

  const [activeTab, setActiveTab] = useState('basic')
  const [activeLanguage, setActiveLanguage] = useState('en')
  const [isSaving, setIsSaving] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSaving(true)
    await onSave(formData)
    setIsSaving(false)
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content content-form-modal">
        <div className="modal-header">
          <h2>{content ? (t('editContent') || 'Edit Content') : (t('addNewContent') || 'Add New Content')}</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-tabs">
            <button
              type="button"
              className={`tab-btn ${activeTab === 'basic' ? 'active' : ''}`}
              onClick={() => setActiveTab('basic')}
            >
              {t('basicInfo') || 'Basic Info'}
            </button>
            <button
              type="button"
              className={`tab-btn ${activeTab === 'content' ? 'active' : ''}`}
              onClick={() => setActiveTab('content')}
            >
              {t('content') || 'Content'}
            </button>
            <button
              type="button"
              className={`tab-btn ${activeTab === 'metadata' ? 'active' : ''}`}
              onClick={() => setActiveTab('metadata')}
            >
              {t('metadata') || 'Metadata'}
            </button>
          </div>

          {activeTab === 'basic' && (
            <div className="tab-content">
              <div className="form-group">
                <label>{t('category') || 'Category'}</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                >
                  <option value="criminal">{t('criminalLaw') || 'Criminal Law'}</option>
                  <option value="family">{t('familyLaw') || 'Family Law'}</option>
                  <option value="labor">{t('laborLaw') || 'Labor Law'}</option>
                </select>
              </div>

              <div className="form-group">
                <label>{t('primaryLanguage') || 'Primary Language'}</label>
                <select
                  value={formData.language}
                  onChange={(e) => setFormData(prev => ({ ...prev, language: e.target.value }))}
                >
                  <option value="en">English</option>
                  <option value="am">አማርኛ</option>
                  <option value="om">Afaan Oromoo</option>
                </select>
              </div>

              <div className="form-group">
                <label>{t('status') || 'Status'}</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                >
                  <option value="draft">{t('draft') || 'Draft'}</option>
                  <option value="published">{t('published') || 'Published'}</option>
                  <option value="archived">{t('archived') || 'Archived'}</option>
                </select>
              </div>

              <div className="language-tabs">
                {['en', 'am', 'om'].map(lang => (
                  <button
                    key={lang}
                    type="button"
                    className={`lang-tab ${activeLanguage === lang ? 'active' : ''}`}
                    onClick={() => setActiveLanguage(lang)}
                  >
                    {lang === 'en' && '🇬🇧 English'}
                    {lang === 'am' && '🇪🇹 አማርኛ'}
                    {lang === 'om' && '🇪🇹 Afaan Oromoo'}
                  </button>
                ))}
              </div>

              <div className="form-group">
                <label>{t('title') || 'Title'} ({activeLanguage})</label>
                <input
                  type="text"
                  value={formData.title[activeLanguage]}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    title: { ...prev.title, [activeLanguage]: e.target.value }
                  }))}
                  required
                />
              </div>
            </div>
          )}

          {activeTab === 'content' && (
            <div className="tab-content">
              <div className="language-tabs">
                {['en', 'am', 'om'].map(lang => (
                  <button
                    key={lang}
                    type="button"
                    className={`lang-tab ${activeLanguage === lang ? 'active' : ''}`}
                    onClick={() => setActiveLanguage(lang)}
                  >
                    {lang === 'en' && '🇬🇧 English'}
                    {lang === 'am' && '🇪🇹 አማርኛ'}
                    {lang === 'om' && '🇪🇹 Afaan Oromoo'}
                  </button>
                ))}
              </div>

              <div className="form-group">
                <label>{t('originalLegalText') || 'Original Legal Text'} ({activeLanguage})</label>
                <textarea
                  rows="8"
                  value={formData.content[activeLanguage]}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    content: { ...prev.content, [activeLanguage]: e.target.value }
                  }))}
                  required
                />
              </div>

              <div className="form-group">
                <label>{t('simplifiedVersion') || 'Simplified Version'} ({activeLanguage})</label>
                <textarea
                  rows="4"
                  value={formData.simplifiedContent[activeLanguage]}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    simplifiedContent: { ...prev.simplifiedContent, [activeLanguage]: e.target.value }
                  }))}
                />
              </div>
            </div>
          )}

          {activeTab === 'metadata' && (
            <div className="tab-content">
              <div className="form-group">
                <label>{t('articleNumber') || 'Article Number'}</label>
                <input
                  type="text"
                  value={formData.metadata.articleNumber}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    metadata: { ...prev.metadata, articleNumber: e.target.value }
                  }))}
                />
              </div>

              <div className="form-group">
                <label>{t('proclamationNumber') || 'Proclamation Number'}</label>
                <input
                  type="text"
                  value={formData.metadata.proclamationNo}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    metadata: { ...prev.metadata, proclamationNo: e.target.value }
                  }))}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>{t('dateEnacted') || 'Date Enacted'}</label>
                  <input
                    type="date"
                    value={formData.metadata.dateEnacted}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      metadata: { ...prev.metadata, dateEnacted: e.target.value }
                    }))}
                  />
                </div>

                <div className="form-group">
                  <label>{t('lastAmended') || 'Last Amended'}</label>
                  <input
                    type="date"
                    value={formData.metadata.lastAmended}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      metadata: { ...prev.metadata, lastAmended: e.target.value }
                    }))}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>{t('source') || 'Source'}</label>
                <input
                  type="text"
                  value={formData.metadata.source}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    metadata: { ...prev.metadata, source: e.target.value }
                  }))}
                  placeholder={t('sourcePlaceholder') || 'e.g., Federal Negarit Gazeta'}
                />
              </div>
            </div>
          )}

          <div className="modal-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>
              {t('cancel') || 'Cancel'}
            </button>
            <button type="submit" className="save-btn" disabled={isSaving}>
              {isSaving ? 'Saving...' : (content ? (t('update') || 'Update') : (t('create') || 'Create'))}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ContentManager