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
  const logs = ref<WorkoutLog[]>([]); // For the session list
  const log = ref<WorkoutLog | null>(null); // For the edit page
  const recentLog = ref<WorkoutLog | null>(null);
  const isLoading = ref(false);

  const { userId } = useAuth();
  const db = getFirestore();
  const logsCollection = collection(db, 'workoutLogs');

  // --- Actions ---

  const fetchLogsForSession = async (sessionId: string) => {
    if (!userId.value) return;
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
    } catch (error) {
      console.error('Error fetching workout logs: ', error);
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Fetches a single workout log by its ID.
   */
  const fetchLogById = async (logId: string) => {
    log.value = null; // Clear previous state
    if (!userId.value) return;
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

  const addWorkoutLog = async (logData: NewWorkoutLogData) => {
    if (!userId.value) return null;
    try {
      isLoading.value = true;
      const logWithUserAndDate = {
        ...logData,
        userId: userId.value,
        date: new Date(),
      };
      const docRef = await addDoc(logsCollection, logWithUserAndDate);
      const newLog = { id: docRef.id, ...logWithUserAndDate } as WorkoutLog;
      logs.value.unshift(newLog);
      return newLog;
    } catch (error) {
      console.error('Error adding workout log: ', error);
      return null;
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
