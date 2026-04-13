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
  QueryDocumentSnapshot,
  limit,
  startAfter,
} from "firebase/firestore";
import type {
  WorkoutSession,
  NewWorkoutSessionData,
  BodyPart,
  CreateSessionInput,
} from "~/types";

const PAGE_SIZE = 5;
const DB_NAME_WORKOUTS = "workoutSessions";
const DB_NAME_WORKOUT_LOGS = "workoutLogs";

export const useWorkoutSessions = () => {
  // --- State ---
  const sessions = useState<WorkoutSession[]>('workoutSessions', () => []);
  const session = useState<WorkoutSession | null>('currentWorkoutSession', () => null);
  const isLoading = useState<boolean>('workoutSessionsLoading', () => false);
  const lastVisible = useState<QueryDocumentSnapshot | null>('lastVisibleSession', () => null);
  const hasMore = useState<boolean>('sessionsHasMore', () => true);

  // --- Dependencies ---
  const { userId } = useAuth();
  const { notify } = useNotification();
  const db = getFirestore();
  const sessionsCollection = collection(db, DB_NAME_WORKOUTS);
  const logsCollection = collection(db, DB_NAME_WORKOUT_LOGS);

  // --- Actions ---

  /**
   * Fetches the first page of workout sessions for the current user.
   * @param force If true, forces a refresh even if data is already cached.
   */
  const fetchWorkoutSessions = async (force = false) => {
    if (!userId.value) {
      sessions.value = [];
      return;
    }

    if (sessions.value.length > 0 && !force) {
      return;
    }

    try {
      isLoading.value = true;
      const q = query(
        sessionsCollection,
        where("userId", "==", userId.value),
        orderBy("date", "desc"),
        limit(PAGE_SIZE)
      );

      const querySnapshot = await getDocs(q);
      const fetchedSessions: WorkoutSession[] = [];
      lastVisible.value = querySnapshot.docs[querySnapshot.docs.length - 1] ?? null;
      hasMore.value = querySnapshot.docs.length === PAGE_SIZE;

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        fetchedSessions.push({
          id: doc.id,
          ...data,
          date: (data.date as Timestamp).toDate(),
        } as WorkoutSession);
      });

      sessions.value = fetchedSessions;
    } catch (error) {
      console.error("Error fetching workout sessions: ", error);
      notify('Failed to load workout sessions. Please try again.', 'error');
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Fetches the next page of sessions and appends them to the list.
   */
  const fetchMoreSessions = async () => {
    if (!lastVisible.value || !hasMore.value || !userId.value) return;

    try {
      isLoading.value = true;
      const q = query(
        sessionsCollection,
        where("userId", "==", userId.value),
        orderBy("date", "desc"),
        startAfter(lastVisible.value),
        limit(PAGE_SIZE)
      );
      const snapshot = await getDocs(q);
      const moreSessions: WorkoutSession[] = snapshot.docs.map((doc) => {
        const data = doc.data();
        return { id: doc.id, ...data, date: (data.date as Timestamp).toDate() } as WorkoutSession;
      });

      sessions.value.push(...moreSessions);
      lastVisible.value = snapshot.docs[snapshot.docs.length - 1] ?? null;
      hasMore.value = snapshot.docs.length === PAGE_SIZE;
    } catch (error) {
      console.error("Error fetching more sessions: ", error);
      notify('Failed to load more sessions. Please try again.', 'error');
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Fetches a single workout session by its ID. Checks cache first.
   */
  const fetchSessionById = async (sessionId: string) => {
    try {
      const cachedSession = sessions.value.find((s) => s.id === sessionId);
      if (cachedSession) {
        session.value = cachedSession;
        return;
      }

      isLoading.value = true;
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
      notify('Failed to load session. Please try again.', 'error');
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Adds a new workout session for the current user based on selected body parts.
   */
  const addWorkoutSession = async (sessionData: CreateSessionInput) => {
    if (!userId.value) {
      console.error("Cannot add session: User not authenticated.");
      return null;
    }
    try {
      const bodyPartNames = sessionData.bodyParts.map((p) => p.name);
      const bodyPartIds = sessionData.bodyParts.map((p) => p.id);

      let dayOfWeek = new Date().toLocaleDateString("sk-SK", { weekday: "long" });
      dayOfWeek = capitalizeFirstLetter(dayOfWeek);
      const title = `${bodyPartNames.join(" + ")} | ${dayOfWeek}`;

      const newSessionData: NewWorkoutSessionData = {
        userId: userId.value,
        title: title,
        bodyPartIds: bodyPartIds,
        bodyPartNames: bodyPartNames,
        date: new Date(),
        notes: sessionData.notes || "",
      };

      const docRef = await addDoc(sessionsCollection, newSessionData);
      const newSession: WorkoutSession = { id: docRef.id, ...newSessionData };

      sessions.value.unshift(newSession);
      return newSession;
    } catch (error) {
      console.error("Error adding workout session: ", error);
      notify('Failed to create workout session. Please try again.', 'error');
      return null;
    }
  };

  /**
   * Updates an existing workout session AND backfills the 'date' field
   * on all its child WorkoutLogs if they are missing it.
   */
  const updateWorkoutSession = async (
    sessionId: string,
    sessionData: CreateSessionInput
  ) => {
    if (!userId.value) return;
    try {
      const bodyPartNames = sessionData.bodyParts.map((p) => p.name);
      const bodyPartIds = sessionData.bodyParts.map((p) => p.id);

      const existingSession = sessions.value.find((s) => s.id === sessionId);
      const sessionDate = existingSession ? existingSession.date : new Date();
      const dayOfWeek = sessionDate.toLocaleDateString("sk-SK", { weekday: "long" });
      const capitalizedDayOfWeek = capitalizeFirstLetter(dayOfWeek);
      const title = `${bodyPartNames.join(" + ")} | ${capitalizedDayOfWeek}`;

      const updateData = {
        title: title,
        bodyPartIds: bodyPartIds,
        bodyPartNames: bodyPartNames,
        notes: sessionData.notes || "",
      };

      const batch = writeBatch(db);
      const sessionDocRef = doc(db, "workoutSessions", sessionId);
      batch.update(sessionDocRef, updateData);

      const logsQuery = query(
        logsCollection,
        where("sessionId", "==", sessionId),
        where("userId", "==", userId.value)
      );
      const logsSnapshot = await getDocs(logsQuery);

      logsSnapshot.forEach((logDoc) => {
        const logData = logDoc.data();
        if (!logData.date) {
          batch.update(logDoc.ref, { date: sessionDate });
        }
      });

      await batch.commit();

      const index = sessions.value.findIndex((s) => s.id === sessionId);
      if (index !== -1 && sessions.value[index]) {
        sessions.value[index] = { ...sessions.value[index], ...updateData };
      }
    } catch (error) {
      console.error("Error updating session: ", error);
      notify('Failed to update workout session. Please try again.', 'error');
    }
  };

  /**
   * Deletes a workout session and all of its associated logs atomically.
   */
  const deleteWorkoutSession = async (sessionId: string) => {
    if (!userId.value) return;
    try {
      const logsQuery = query(
        logsCollection,
        where("sessionId", "==", sessionId),
        where("userId", "==", userId.value)
      );
      const logsSnapshot = await getDocs(logsQuery);

      const batch = writeBatch(db);
      logsSnapshot.forEach((logDoc) => {
        batch.delete(logDoc.ref);
      });
      const sessionDocRef = doc(db, DB_NAME_WORKOUTS, sessionId);
      batch.delete(sessionDocRef);

      await batch.commit();

      sessions.value = sessions.value.filter((s) => s.id !== sessionId);
    } catch (error) {
      console.error("Error deleting session and logs: ", error);
      notify('Failed to delete workout session. Please try again.', 'error');
    }
  };

  /**
   * Clears all session state. Called during logout to prevent data leakage between users.
   */
  const clearSessionState = () => {
    sessions.value = [];
    session.value = null;
    isLoading.value = false;
    lastVisible.value = null;
    hasMore.value = true;
  };

  // --- Public API ---
  return {
    session,
    sessions,
    isLoading,
    hasMore,
    fetchWorkoutSessions,
    fetchMoreSessions,
    fetchSessionById,
    addWorkoutSession,
    updateWorkoutSession,
    deleteWorkoutSession,
    clearSessionState,
  };
};
