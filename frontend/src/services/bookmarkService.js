import api from './api'

class BookmarkService {
  async getBookmarks(params = {}) {
    try {
      const response = await api.get('/bookmarks', { params })
      return response.data
    } catch (error) {
      throw error
    }
  }

  async addBookmark(articleId) {
    try {
      const response = await api.post('/bookmarks', { articleId })
      return response.data
    } catch (error) {
      throw error
    }
  }

  async removeBookmark(bookmarkId) {
    try {
      const response = await api.delete(`/bookmarks/${bookmarkId}`)
      return response.data
    } catch (error) {
      throw error
    }
  }

  async checkBookmark(articleId) {
    try {
      const response = await api.get(`/bookmarks/check/${articleId}`)
      return response.data
    } catch (error) {
      throw error
    }
  }

  async getCollections() {
    try {
      const response = await api.get('/bookmarks/collections')
      return response.data
    } catch (error) {
      throw error
    }
  }

  async createCollection(collectionData) {
    try {
      const response = await api.post('/bookmarks/collections', collectionData)
      return response.data
    } catch (error) {
      throw error
    }
  }

  async updateCollection(collectionId, collectionData) {
    try {
      const response = await api.put(`/bookmarks/collections/${collectionId}`, collectionData)
      return response.data
    } catch (error) {
      throw error
    }
  }

  async deleteCollection(collectionId) {
    try {
      const response = await api.delete(`/bookmarks/collections/${collectionId}`)
      return response.data
    } catch (error) {
      throw error
    }
  }

  async moveToCollection(bookmarkId, collectionId) {
    try {
      const response = await api.put(`/bookmarks/${bookmarkId}/move`, { collectionId })
      return response.data
    } catch (error) {
      throw error
    }
  }

  async exportBookmarks(format = 'json') {
    try {
      const response = await api.get(`/bookmarks/export`, {
        params: { format },
        responseType: 'blob'
      })
      return response.data
    } catch (error) {
      throw error
    }
  }

  async importBookmarks(file) {
    const formData = new FormData()
    formData.append('file', file)
    
    try {
      const response = await api.post('/bookmarks/import', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      return response.data
    } catch (error) {
      throw error
    }
  }
}

export default new BookmarkService()