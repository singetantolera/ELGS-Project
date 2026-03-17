import api from './api'

class SearchService {
  async search(query, filters = {}, page = 1, limit = 10) {
    try {
      const response = await api.get('/search', {
        params: {
          q: query,
          ...filters,
          page,
          limit
        }
      })
      return response.data
    } catch (error) {
      throw error
    }
  }

  async getSuggestions(query) {
    try {
      const response = await api.get('/search/suggestions', {
        params: { q: query }
      })
      return response.data
    } catch (error) {
      throw error
    }
  }

  async getTrendingSearches() {
    try {
      const response = await api.get('/search/trending')
      return response.data
    } catch (error) {
      throw error
    }
  }

  async saveSearchHistory(searchTerm) {
    try {
      const response = await api.post('/search/history', { searchTerm })
      return response.data
    } catch (error) {
      throw error
    }
  }

  async getSearchHistory() {
    try {
      const response = await api.get('/search/history')
      return response.data
    } catch (error) {
      throw error
    }
  }

  async clearSearchHistory() {
    try {
      const response = await api.delete('/search/history')
      return response.data
    } catch (error) {
      throw error
    }
  }

  async advancedSearch(criteria) {
    try {
      const response = await api.post('/search/advanced', criteria)
      return response.data
    } catch (error) {
      throw error
    }
  }
}

export default new SearchService()