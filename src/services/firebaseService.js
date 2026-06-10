// Firebase Firestore REST API Client for Comments Section
// Lightweight, zero-dependency implementation using native fetch

const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID || 'website-db-499023';

// Helper to map Firestore document format to clean JS object
function mapFirestoreDoc(doc) {
  const id = doc.name.split('/').pop();
  const fields = doc.fields || {};
  return {
    id,
    name: fields.name?.stringValue || '',
    role: fields.role?.stringValue || 'Visitor',
    rating: parseInt(fields.rating?.integerValue || '0', 10),
    text: fields.text?.stringValue || '',
    date: fields.date?.stringValue || '',
    likes: parseInt(fields.likes?.integerValue || '0', 10),
    secretToken: fields.secretToken?.stringValue || ''
  };
}

export const firebaseService = {
  isActive: () => {
    return !!projectId;
  },

  getComments: async () => {
    if (!projectId) return [];
    try {
      const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/comments`;
      const response = await fetch(url);
      if (!response.ok) {
        if (response.status === 404) return []; // Collection doesn't exist yet
        throw new Error(`Firestore error: ${response.statusText}`);
      }
      const data = await response.json();
      if (!data.documents) return [];
      
      const comments = data.documents.map(mapFirestoreDoc);
      // Sort comments: Newest first (by date, fallback to id comparison)
      return comments.sort((a, b) => new Date(b.date) - new Date(a.date) || b.id.localeCompare(a.id));
    } catch (error) {
      console.error('Error fetching comments from Firestore:', error);
      throw error;
    }
  },

  addComment: async (comment) => {
    if (!projectId) throw new Error('Firebase Project ID is not configured');
    
    // Generate a secure token for client-side ownership verification
    const secretToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    
    const docData = {
      fields: {
        name: { stringValue: comment.name },
        role: { stringValue: comment.role || 'Visitor' },
        rating: { integerValue: String(comment.rating) },
        text: { stringValue: comment.text },
        date: { stringValue: comment.date || new Date().toISOString().split('T')[0] },
        likes: { integerValue: '0' },
        secretToken: { stringValue: secretToken }
      }
    };

    try {
      const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/comments`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(docData)
      });

      if (!response.ok) {
        throw new Error(`Firestore error: ${response.statusText}`);
      }

      const createdDoc = await response.json();
      const mapped = mapFirestoreDoc(createdDoc);
      return mapped; // Returns comment with generated ID and secretToken
    } catch (error) {
      console.error('Error adding comment to Firestore:', error);
      throw error;
    }
  },

  updateComment: async (id, data, token) => {
    if (!projectId) throw new Error('Firebase Project ID is not configured');

    const docData = {
      fields: {
        text: { stringValue: data.text },
        rating: { integerValue: String(data.rating) }
      }
    };

    try {
      // updateMask specify which fields to modify in Firestore
      const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/comments/${id}?updateMask.fieldPaths=text&updateMask.fieldPaths=rating`;
      const response = await fetch(url, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(docData)
      });

      if (!response.ok) {
        throw new Error(`Firestore error: ${response.statusText}`);
      }

      const updatedDoc = await response.json();
      return mapFirestoreDoc(updatedDoc);
    } catch (error) {
      console.error('Error updating comment in Firestore:', error);
      throw error;
    }
  },

  deleteComment: async (id, token) => {
    if (!projectId) throw new Error('Firebase Project ID is not configured');

    try {
      const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/comments/${id}`;
      const response = await fetch(url, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error(`Firestore error: ${response.statusText}`);
      }

      return true;
    } catch (error) {
      console.error('Error deleting comment from Firestore:', error);
      throw error;
    }
  },

  likeComment: async (id, currentLikes) => {
    if (!projectId) throw new Error('Firebase Project ID is not configured');

    const docData = {
      fields: {
        likes: { integerValue: String(currentLikes + 1) }
      }
    };

    try {
      const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/comments/${id}?updateMask.fieldPaths=likes`;
      const response = await fetch(url, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(docData)
      });

      if (!response.ok) {
        throw new Error(`Firestore error: ${response.statusText}`);
      }

      const updatedDoc = await response.json();
      return mapFirestoreDoc(updatedDoc);
    } catch (error) {
      console.error('Error liking comment in Firestore:', error);
      throw error;
    }
  }
};
