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
import type {
  WorkoutSession,
  NewWorkoutSessionData,
  BodyPart,
  CreateSessionInput,
} from "~/types";

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
        fetchedSessions.push({
          id: doc.id,
          ...data,
          date: (data.date as Timestamp).toDate(), // Convert firestore timestamp to JS date
        } as WorkoutSession);
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
   * Adds a new workout session for the current user based on selected body parts.
   * @param sessionData The data from the modal, containing selected body parts and notes.
   * @returns The newly created WorkoutSession object or null on failure.
   */
  const addWorkoutSession = async (sessionData: CreateSessionInput) => {
    if (!userId.value) {
      console.error("Cannot add session: User not authenticated.");
      return null;
    }
    try {
      // 1. Get names and IDs from the selected body parts
      const bodyPartNames = sessionData.bodyParts.map((p) => p.name);
      const bodyPartIds = sessionData.bodyParts.map((p) => p.id);

      // 2. Auto-generate the title
      let dayOfWeek = new Date().toLocaleDateString("sk-SK", {
        weekday: "long",
      });
      dayOfWeek = capitalizeFirstLetter(dayOfWeek);
      const title = `${bodyPartNames.join(" + ")} | ${dayOfWeek}`;

      // 3. Create the new data object to save to Firestore
      const newSessionData: NewWorkoutSessionData = {
        userId: userId.value,
        title: title,
        bodyPartIds: bodyPartIds,
        bodyPartNames: bodyPartNames,
        date: new Date(), // Set current date and time
        notes: sessionData.notes || "",
      };

      const docRef = await addDoc(sessionsCollection, newSessionData);

      // 4. Create the final object to return (with the new ID)
      const newSession: WorkoutSession = {
        id: docRef.id,
        ...newSessionData,
      };

      sessions.value.unshift(newSession); // Add to the beginning of the local list
      return newSession;
    } catch (error) {
      console.error("Error adding workout session: ", error);
      return null;
    }
  };

  /**
   * Updates an existing workout session based on selected body parts and notes.
   * Regenerates the title based on the new body parts.
   */
  const updateWorkoutSession = async (
    sessionId: string,
    sessionData: CreateSessionInput
  ) => {
    if (!userId.value) return;
    try {
      // 1. Get names and IDs from the updated body parts selection
      const bodyPartNames = sessionData.bodyParts.map((p) => p.name);
      const bodyPartIds = sessionData.bodyParts.map((p) => p.id);

      // 2. Regenerate title using the session's original date
      // Find the existing session in the local state to get its date
      const existingSession = sessions.value.find((s) => s.id === sessionId);
      const date = existingSession ? existingSession.date : new Date(); // Use existing date, fallback to now
      let dayOfWeek = date.toLocaleDateString("sk-SK", { weekday: "long" });
      dayOfWeek = capitalizeFirstLetter(dayOfWeek);
      const title = `${bodyPartNames.join(" + ")} | ${dayOfWeek}`;

      // 3. Prepare the data object for Firestore update
      const updateData = {
        title: title,
        bodyPartIds: bodyPartIds,
        bodyPartNames: bodyPartNames,
        notes: sessionData.notes || "",
      };

      const docRef = doc(db, "workoutSessions", sessionId);
      await updateDoc(docRef, updateData);

      // 4. Update local state for instant UI feedback
      const index = sessions.value.findIndex((s) => s.id === sessionId);
      if (index !== -1) {
        // Merge existing data with the updated fields
        if (sessions.value[index]) {
          sessions.value[index] = { ...sessions.value[index], ...updateData };
        }
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
