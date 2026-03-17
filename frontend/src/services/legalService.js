import api from './api'

class LegalService {
  async getCategories() {
    try {
      const response = await api.get('/legal/categories')
      return response.data
    } catch (error) {
      throw error
    }
  }

  async getCategory(categoryId) {
    try {
      const response = await api.get(`/legal/categories/${categoryId}`)
      return response.data
    } catch (error) {
      throw error
    }
  }

  async getArticles(params = {}) {
    try {
      const response = await api.get('/legal/articles', { params })
      return response.data
    } catch (error) {
      throw error
    }
  }

  async getArticle(articleId) {
    try {
      const response = await api.get(`/legal/articles/${articleId}`)
      return response.data
    } catch (error) {
      throw error
    }
  }

  async searchArticles(query, filters = {}) {
    try {
      const response = await api.get('/legal/search', { 
        params: { q: query, ...filters }
      })
      return response.data
    } catch (error) {
      throw error
    }
  }

  async createArticle(articleData) {
    try {
      const response = await api.post('/legal/articles', articleData)
      return response.data
    } catch (error) {
      throw error
    }
  }

  async updateArticle(articleId, articleData) {
    try {
      const response = await api.put(`/legal/articles/${articleId}`, articleData)
      return response.data
    } catch (error) {
      throw error
    }
  }

  async deleteArticle(articleId) {
    try {
      const response = await api.delete(`/legal/articles/${articleId}`)
      return response.data
    } catch (error) {
      throw error
    }
  }

  async getRelatedArticles(articleId) {
    try {
      const response = await api.get(`/legal/articles/${articleId}/related`)
      return response.data
    } catch (error) {
      throw error
    }
  }

  async incrementViewCount(articleId) {
    try {
      const response = await api.post(`/legal/articles/${articleId}/view`)
      return response.data
    } catch (error) {
      throw error
    }
  }

  async getTrendingArticles() {
    try {
      const response = await api.get('/legal/trending')
      return response.data
    } catch (error) {
      throw error
    }
  }
}

export default new LegalService()