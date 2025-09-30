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
} from "firebase/firestore";
import type { WorkoutSession, NewWorkoutSessionData } from "~/types";

export const useWorkoutSessions = () => {
  // --- State ---
  const sessions = ref<WorkoutSession[]>([]);
  const session = ref<WorkoutSession | null>(null); // For the detail view

  // --- Dependencies ---
  const { userId } = useAuth(); // Get the current user's ID
  const db = getFirestore();
  const sessionsCollection = collection(db, "workoutSessions");

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
      const docRef = doc(db, "workoutSessions", sessionId);
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

  // --- Public API ---
  return {
    session,
    sessions,
    fetchWorkoutSessions,
    fetchSessionById,
    addWorkoutSession,
  };
};
