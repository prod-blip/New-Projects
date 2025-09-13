import { db, auth } from './firebase';
import {
  doc,
  setDoc,
  getDoc,
  onSnapshot,
  updateDoc,
  serverTimestamp
} from 'firebase/firestore';
import {
  signInAnonymously,
  onAuthStateChanged
} from 'firebase/auth';

// Firebase Storage Manager
export const FirebaseStorageManager = {
  // Initialize user authentication
  initAuth: () => {
    return new Promise((resolve) => {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          resolve(user);
        } else {
          // Sign in anonymously if no user
          signInAnonymously(auth)
            .then((result) => {
              console.log('Anonymous auth successful');
              resolve(result.user);
            })
            .catch((error) => {
              console.error('Anonymous auth failed:', error);
              console.error('Make sure Authentication is enabled in Firebase Console');
              console.error('Go to Authentication > Sign-in method > Enable Anonymous');
              // Create a mock user for fallback
              const mockUser = { uid: `local_${Date.now()}` };
              resolve(mockUser);
            });
        }
      });
    });
  },

  // Get shared document reference (all devices access the same data)
  getUserDocRef: (collection) => {
    // Always use the same document ID "shared" for all devices
    return doc(db, collection, "shared");
  },

  // Save data to Firestore
  save: async (collection, data) => {
    try {
      const docRef = FirebaseStorageManager.getUserDocRef(collection);
      await setDoc(docRef, {
        data,
        lastModified: serverTimestamp(),
        version: '1.0'
      }, { merge: true });
      return true;
    } catch (error) {
      console.error('Failed to save to Firebase:', error);
      // Fallback to localStorage
      try {
        const dataWithTimestamp = {
          data,
          lastModified: new Date().toISOString(),
          version: '1.0'
        };
        localStorage.setItem(`firebase_fallback_${collection}`, JSON.stringify(dataWithTimestamp));
        return true;
      } catch (localError) {
        console.error('Fallback to localStorage also failed:', localError);
        return false;
      }
    }
  },

  // Load data from Firestore
  load: async (collection, fallback = null) => {
    try {
      const docRef = FirebaseStorageManager.getUserDocRef(collection);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const stored = docSnap.data();
        return stored.data || fallback;
      } else {
        // Try localStorage fallback
        const localData = localStorage.getItem(`firebase_fallback_${collection}`);
        if (localData) {
          const parsed = JSON.parse(localData);
          return parsed.data || fallback;
        }
        return fallback;
      }
    } catch (error) {
      console.error('Failed to load from Firebase:', error);
      // Fallback to localStorage
      try {
        const localData = localStorage.getItem(`firebase_fallback_${collection}`);
        if (localData) {
          const parsed = JSON.parse(localData);
          return parsed.data || fallback;
        }
        return fallback;
      } catch (localError) {
        console.error('Fallback to localStorage also failed:', localError);
        return fallback;
      }
    }
  },

  // Subscribe to real-time updates
  subscribe: (collection, callback) => {
    try {
      const docRef = FirebaseStorageManager.getUserDocRef(collection);
      return onSnapshot(docRef, (doc) => {
        if (doc.exists()) {
          const data = doc.data();
          callback(data.data);
        }
      }, (error) => {
        console.error('Firebase subscription error:', error);
      });
    } catch (error) {
      console.error('Failed to subscribe to Firebase:', error);
      return () => {}; // Return empty unsubscribe function
    }
  },

  // Export all user data
  exportData: async () => {
    try {
      const collections = ['ingredients', 'customMeals', 'confirmedMeals'];
      const exportData = {
        exportDate: new Date().toISOString(),
        version: '1.0'
      };

      for (const collection of collections) {
        exportData[collection] = await FirebaseStorageManager.load(collection);
      }

      return JSON.stringify(exportData, null, 2);
    } catch (error) {
      console.error('Failed to export data:', error);
      return null;
    }
  },

  // Import data to Firebase
  importData: async (jsonString) => {
    try {
      const data = JSON.parse(jsonString);
      const collections = ['ingredients', 'customMeals', 'confirmedMeals'];

      for (const collection of collections) {
        if (data[collection]) {
          await FirebaseStorageManager.save(collection, data[collection]);
        }
      }
      return true;
    } catch (error) {
      console.error('Failed to import data:', error);
      return false;
    }
  },

  // Get current user ID for display
  getCurrentUserId: () => {
    const user = auth.currentUser;
    return user ? user.uid.substring(0, 8) : 'Not authenticated';
  }
};

// Collections
export const COLLECTIONS = {
  INGREDIENTS: 'mealPlannerIngredients',
  CUSTOM_MEALS: 'mealPlannerCustomMeals',
  CONFIRMED_MEALS: 'mealPlannerConfirmedMeals'
};