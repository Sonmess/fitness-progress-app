import { ref } from 'vue';
import {
  collection,
  addDoc,
  getDocs,
  getFirestore,
  query,
  where,
  doc,
  updateDoc,
  deleteDoc,
  orderBy,
  limit,
  getDoc,
  Timestamp,
} from 'firebase/firestore';
import type { WorkoutLog, NewWorkoutLogData, Set } from '~/types';

export const useWorkoutLogs = () => {
  // --- State ---
  // Use useState for global state caching across the app
  const logs = useState<WorkoutLog[]>('workoutLogs', () => []);
  const log = useState<WorkoutLog | null>('currentWorkoutLog', () => null);
  const recentLog = useState<WorkoutLog | null>('recentWorkoutLog', () => null);
  const isLoading = useState<boolean>('workoutLogsLoading', () => false);
  const currentSessionId = useState<string | null>('currentLogsSessionId', () => null);

  const { userId } = useAuth();
  const db = getFirestore();
  const logsCollection = collection(db, 'workoutLogs');

  // --- Actions ---

  /**
   * Fetches workout logs for a specific session. Uses cache if available for the same session.
   * @param sessionId The session ID to fetch logs for
   * @param force If true, forces a refresh even if data is already cached
   */
  const fetchLogsForSession = async (sessionId: string, force = false) => {
    if (!userId.value) return;

    // Skip fetch if already loaded for this session and not forcing refresh
    if (currentSessionId.value === sessionId && logs.value.length > 0 && !force) {
      return;
    }

    try {
      isLoading.value = true;
      const q = query(
        logsCollection,
        where('userId', '==', userId.value),
        where('sessionId', '==', sessionId),
        orderBy('date', 'desc')
      );
      const querySnapshot = await getDocs(q);
      logs.value = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          date: (data.date as Timestamp).toDate(),
        } as WorkoutLog;
      });
      currentSessionId.value = sessionId;
    } catch (error) {
      console.error('Error fetching workout logs: ', error);
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Fetches a single workout log by its ID. Checks cache first, then fetches from Firestore if needed.
   * @param logId The workout log ID to fetch
   */
  const fetchLogById = async (logId: string) => {
    if (!userId.value) return;

    // First, check if we have it in the cached logs array
    const cachedLog = logs.value.find((l) => l.id === logId);
    if (cachedLog) {
      log.value = cachedLog;
      return;
    }

    // If not in cache, fetch from Firestore
    log.value = null; // Clear previous state
    try {
      isLoading.value = true;
      const docRef = doc(db, 'workoutLogs', logId);
      const docSnap = await getDoc(docRef);
      // Security check: Make sure the fetched log belongs to the current user
      if (docSnap.exists() && docSnap.data().userId === userId.value) {
        const data = docSnap.data();
        log.value = {
          id: docSnap.id,
          ...data,
          date: (data.date as Timestamp).toDate(),
        } as WorkoutLog;
      } else {
        console.warn('Workout log not found or user not authorized.');
      }
    } catch (error) {
      console.error('Error fetching log by ID:', error);
    } finally {
      isLoading.value = false;
    }
  };

  const fetchRecentLogForExercise = async (exerciseId: string) => {
    if (!userId.value) return;
    recentLog.value = null;
    try {
      isLoading.value = true;
      const q = query(
        logsCollection,
        where('userId', '==', userId.value),
        where('exerciseId', '==', exerciseId),
        orderBy('date', 'desc'),
        limit(1)
      );
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty && querySnapshot.docs[0]) {
        const doc = querySnapshot.docs[0];
        const data = doc.data();
        recentLog.value = {
          id: doc.id,
          ...data,
          date: (data.date as Timestamp).toDate(),
        } as WorkoutLog;
      }
    } catch (error) {
      console.error('Error fetching recent log: ', error);
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Adds a new workout log. Requires user to be authenticated.
   * @param logData The workout log data (userId and date are automatically added)
   * @returns The newly created WorkoutLog
   * @throws Error if user is not authenticated
   */
  const addWorkoutLog = async (logData: NewWorkoutLogData) => {
    if (!userId.value) {
      throw new Error('User must be authenticated to add workout logs');
    }

    try {
      isLoading.value = true;
      const logWithUserAndDate: Omit<WorkoutLog, 'id'> = {
        ...logData,
        userId: userId.value,
        date: new Date(),
      };
      const docRef = await addDoc(logsCollection, logWithUserAndDate);
      const newLog: WorkoutLog = { id: docRef.id, ...logWithUserAndDate };
      logs.value.unshift(newLog);
      return newLog;
    } catch (error) {
      console.error('Error adding workout log: ', error);
      throw error; // Re-throw to let caller handle it
    } finally {
      isLoading.value = false;
    }
  };

  const updateWorkoutLog = async (logId: string, updatedSets: Set[]) => {
    try {
      isLoading.value = true;
      const docRef = doc(db, 'workoutLogs', logId);
      await updateDoc(docRef, { sets: updatedSets });
      const index = logs.value.findIndex((log) => log.id === logId);
      if (index !== -1 && logs.value[index]) {
        logs.value[index].sets = updatedSets;
      }
    } catch (error) {
      console.error('Error updating workout log:', error);
    } finally {
      isLoading.value = false;
    }
  };

  const deleteWorkoutLog = async (logId: string) => {
    try {
      isLoading.value = true;
      const docRef = doc(db, 'workoutLogs', logId);
      await deleteDoc(docRef);
      logs.value = logs.value.filter((log) => log.id !== logId);
    } catch (error) {
      console.error('Error deleting workout log:', error);
    } finally {
      isLoading.value = false;
    }
  };

  // --- Public API ---
  return {
    logs,
    log, // Expose new state for the edit page
    recentLog,
    isLoading,
    fetchLogsForSession,
    fetchLogById, // Expose new function for the edit page
    fetchRecentLogForExercise,
    addWorkoutLog,
    updateWorkoutLog,
    deleteWorkoutLog,
  };
};
