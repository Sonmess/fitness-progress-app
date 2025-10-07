import { ref } from "vue";
import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  getFirestore,
  query,
  where,
  orderBy,
  doc,
  Timestamp,
  updateDoc,
  writeBatch,
} from "firebase/firestore";
import type { WorkoutSession, NewWorkoutSessionData } from "~/types";

const DB_NAME_WORKOUTS = "workoutSessions";
const DB_NAME_WORKOUT_LOGS = "workoutLogs";

export const useWorkoutSessions = () => {
  // --- State ---
  const sessions = ref<WorkoutSession[]>([]);
  const session = ref<WorkoutSession | null>(null); // For the detail view

  // --- Dependencies ---
  const { userId } = useAuth(); // Get the current user's ID
  const db = getFirestore();
  const sessionsCollection = collection(db, DB_NAME_WORKOUTS);
  const logsCollection = collection(db, DB_NAME_WORKOUT_LOGS); // For deleting associated logs

  // --- Actions ---

  /**
   * Fetches all workout sessions for the current user from Firestore.
   */
  const fetchWorkoutSessions = async () => {
    // Ensure we have a user before querying
    if (!userId.value) {
      sessions.value = [];
      return;
    }

    try {
      // Create a query to get documents where 'userId' matches the current user,
      // and order them by date with the newest first.
      const q = query(
        sessionsCollection,
        where("userId", "==", userId.value),
        orderBy("date", "desc")
      );

      const querySnapshot = await getDocs(q);
      const fetchedSessions: WorkoutSession[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        // Convert the Firestore Timestamp back into a JavaScript Date object
        const session: WorkoutSession = {
          id: doc.id,
          userId: data.userId,
          title: data.title,
          date: data.date.toDate(),
          notes: data.notes,
        };
        fetchedSessions.push(session);
      });

      sessions.value = fetchedSessions;
    } catch (error) {
      console.error("Error fetching workout sessions: ", error);
    }
  };

  /**
   * Fetches a single workout session by its ID.
   * @param sessionId The ID of the document to fetch.
   */
  const fetchSessionById = async (sessionId: string) => {
    try {
      const docRef = doc(db, DB_NAME_WORKOUTS, sessionId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        session.value = {
          id: docSnap.id,
          ...data,
          date: (data.date as Timestamp).toDate(),
        } as WorkoutSession;
      } else {
        console.warn("Workout session not found for ID:", sessionId);
        session.value = null;
      }
    } catch (error) {
      console.error("Error fetching session by ID:", error);
    }
  };

  /**
   * Adds a new workout session for the current user.
   * @param sessionData - The title and optional notes for the new session.
   * @returns The newly created session object or null on error.
   */
  const addWorkoutSession = async (sessionData: {
    title: string;
    notes?: string;
  }) => {
    if (!userId.value) {
      console.error("Cannot add session: User not authenticated.");
      return null;
    }

    try {
      const newSessionData: NewWorkoutSessionData = {
        userId: userId.value,
        title: sessionData.title,
        date: new Date(), // Set the current date for the session
        notes: sessionData.notes || "",
      };

      const docRef = await addDoc(sessionsCollection, newSessionData);

      // For instant UI feedback, add the new session to the local state
      const sessionWithId: WorkoutSession = {
        id: docRef.id,
        ...newSessionData,
      };
      sessions.value.unshift(sessionWithId); // unshift() adds to the beginning of the array

      return sessionWithId;
    } catch (error) {
      console.error("Error adding workout session: ", error);
      return null;
    }
  };

  /**
   * Updates an existing workout session.
   */
  const updateWorkoutSession = async (
    sessionId: string,
    sessionData: { title: string; notes?: string }
  ) => {
    try {
      const docRef = doc(db, DB_NAME_WORKOUTS, sessionId);
      await updateDoc(docRef, sessionData);
      // Update local state for instant UI feedback
      const index = sessions.value.findIndex((s) => s.id === sessionId);
      if (index !== -1) {
        sessions.value[index] = {
          ...sessions.value[index],
          ...sessionData,
        } as WorkoutSession;
      }
    } catch (error) {
      console.error("Error updating session: ", error);
    }
  };

  /**
   * Deletes a workout session and all of its associated logs.
   */
  const deleteWorkoutSession = async (sessionId: string) => {
    if (!userId.value) return;
    try {
      // Step 1: Find all logs for this session
      const logsQuery = query(
        logsCollection,
        where("sessionId", "==", sessionId),
        where("userId", "==", userId.value)
      );
      const logsSnapshot = await getDocs(logsQuery);

      // Step 2: Use a batch write to delete the session and all logs atomically
      const batch = writeBatch(db);
      logsSnapshot.forEach((logDoc) => {
        batch.delete(logDoc.ref);
      });
      const sessionDocRef = doc(db, DB_NAME_WORKOUTS, sessionId);
      batch.delete(sessionDocRef);

      await batch.commit();

      // Step 3: Update local state
      sessions.value = sessions.value.filter((s) => s.id !== sessionId);
    } catch (error) {
      console.error("Error deleting session and logs: ", error);
    }
  };

  // --- Public API ---
  return {
    session,
    sessions,
    fetchWorkoutSessions,
    fetchSessionById,
    addWorkoutSession,
    updateWorkoutSession,
    deleteWorkoutSession,
  };
};
