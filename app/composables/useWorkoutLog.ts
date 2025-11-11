import { ref } from "vue";
import {
  collection,
  addDoc,
  getDocs,
  getFirestore,
  query,
  where,
  orderBy,
  doc,
  updateDoc,
  deleteDoc,
  Timestamp,
  limit,
} from "firebase/firestore";
import type { WorkoutLog, NewWorkoutLogData, Set } from "~/types";

const WORKOUT_LOGS_COLLECTION = "workoutLogs";

export const useWorkoutLogs = () => {
  // --- State ---
  const logs = ref<WorkoutLog[]>([]);
  const recentLog = ref<WorkoutLog | null>(null);
  const isRecentLoading = ref(false);

  // --- Dependencies ---
  const { userId } = useAuth();
  const db = getFirestore();
  const logsCollection = collection(db, WORKOUT_LOGS_COLLECTION);

  // --- Actions ---

  /**
   * Fetches all logs for a specific workout session.
   * @param sessionId The ID of the workout session.
   */
  const fetchLogsForSession = async (sessionId: string) => {
    if (!userId.value) {
      logs.value = [];
      return;
    }
    try {
      const q = query(
        logsCollection,
        where("userId", "==", userId.value),
        where("sessionId", "==", sessionId)
      );
      const querySnapshot = await getDocs(q);
      const fetchedLogs: WorkoutLog[] = [];
      querySnapshot.forEach((doc) => {
        fetchedLogs.push({ id: doc.id, ...doc.data() } as WorkoutLog);
      });
      logs.value = fetchedLogs;
    } catch (error) {
      console.error("Error fetching workout logs: ", error);
    }
  };

  const fetchRecentLogForExercise = async (exerciseId: string) => {
    if (!userId.value) {
      recentLog.value = null;
      return;
    }

    try {
      isRecentLoading.value = true;
      const q = query(
        logsCollection,
        where("userId", "==", userId.value),
        where("exerciseId", "==", exerciseId),
        orderBy("date", "desc"),
        limit(1)
      );
      const querySnapshop = await getDocs(q);
      if (!querySnapshop.empty) {
        const doc = querySnapshop.docs[0];
        if (doc && doc.data()) {
          const data = doc.data();
          recentLog.value = {
            id: doc.id,
            ...data,
            date: (data.date as Timestamp).toDate(),
          } as WorkoutLog;
        }
      }
    } catch (error) {
      console.error("Error fetching recent log: ", error);
    } finally {
      isRecentLoading.value = false;
    }
  };

  /**
   * Adds a new exercise log to a workout session.
   * @param logData The data for the new log.
   */
  const addWorkoutLog = async (logData: NewWorkoutLogData) => {
    if (!userId.value) {
      console.error("Cannot add log: User not authenticated.");
      return null;
    }
    try {
      const logWithUser: NewWorkoutLogData = {
        ...logData,
        userId: userId.value,
      };
      const docRef = await addDoc(logsCollection, logWithUser);
      const newLog = { id: docRef.id, ...logWithUser } as WorkoutLog;
      logs.value.push(newLog); // Optimistically update UI
      return newLog;
    } catch (error) {
      console.error("Error adding workout log: ", error);
      return null;
    }
  };

  /**
   * Updates the sets for a specific workout log.
   * @param logId The ID of the log document to update.
   * @param updatedSets The new array of sets.
   */
  const updateWorkoutLog = async (logId: string, updatedSets: Set[]) => {
    try {
      const docRef = doc(db, "workoutLogs", logId);
      await updateDoc(docRef, { sets: updatedSets });

      // Update local state for instant UI feedback
      const index = logs.value.findIndex((log) => log.id === logId);
      if (index !== -1 && logs.value[index]) {
        logs.value[index].sets = updatedSets;
      }
    } catch (error) {
      console.error("Error updating workout log:", error);
    }
  };

  /**
   * Deletes a specific workout log.
   * @param logId The ID of the log document to delete.
   */
  const deleteWorkoutLog = async (logId: string) => {
    try {
      const docRef = doc(db, "workoutLogs", logId);
      await deleteDoc(docRef);

      // Update local state for instant UI feedback
      logs.value = logs.value.filter((log) => log.id !== logId);
    } catch (error) {
      console.error("Error deleting workout log:", error);
    }
  };

  // --- Public API ---
  return {
    logs,
    recentLog,
    isRecentLoading,
    fetchLogsForSession,
    fetchRecentLogForExercise,
    addWorkoutLog,
    updateWorkoutLog,
    deleteWorkoutLog,
  };
};
