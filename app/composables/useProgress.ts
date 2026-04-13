import {
  collection,
  getDocs,
  getFirestore,
  query,
  type Timestamp,
  where,
} from "firebase/firestore";
import { type WorkoutLog, type Set } from "~/types";

// Define a new type for our enriched personal record object
export interface PersonalRecord {
  exerciseId: string;
  exerciseName: string;
  bodyPartName: string;
  maxWeight: number;
  maxReps: number;
  achievedDate: Date;
}

const WORKOUT_LOGS_COLLECTION = "workoutLogs";

export const useProgress = () => {
  // --- State ---
  // Cache keyed by bodyPartId — only loaded when the user expands that body part
  const recordsByBodyPart = useState<Record<string, PersonalRecord[]>>('recordsByBodyPart', () => ({}));
  const loadingBodyParts = useState<string[]>('loadingBodyParts', () => []);
  const personalRecordSet = useState<Set | null>('personalRecordSet', () => null);
  const isPrSetLoading = useState<boolean>('prSetLoading', () => false);

  // --- Dependencies ---
  const { userId } = useAuth();
  const { notify } = useNotification();
  const { exercises, fetchExercises } = useExercises();
  const db = getFirestore();
  const logsCollection = collection(db, WORKOUT_LOGS_COLLECTION);

  // --- Helpers ---

  /**
   * Returns true if records for the given body part are currently being fetched.
   */
  const isBodyPartLoading = (bodyPartId: string) =>
    loadingBodyParts.value.includes(bodyPartId);

  // --- Actions ---

  /**
   * Fetches and calculates PRs for a single body part on demand.
   * Results are cached per bodyPartId — subsequent calls for the same ID are instant.
   * @param bodyPartId The body part to calculate records for.
   * @param force If true, forces a refresh even if data is already cached.
   */
  const calculateRecordsForBodyPart = async (bodyPartId: string, force = false) => {
    if (!userId.value) return;

    // Return from cache if available and not forcing refresh
    if (recordsByBodyPart.value[bodyPartId] && !force) return;

    // Mark as loading
    loadingBodyParts.value = [...loadingBodyParts.value, bodyPartId];

    try {
      // Step 1: Ensure exercises are loaded (uses cache if already fetched)
      if (exercises.value.length === 0) {
        await fetchExercises();
      }

      // Step 2: Get only the exercises belonging to this body part
      const bodyPartExercises = exercises.value.filter(
        (ex) => ex.bodyPartId === bodyPartId
      );

      if (bodyPartExercises.length === 0) {
        recordsByBodyPart.value = { ...recordsByBodyPart.value, [bodyPartId]: [] };
        return;
      }

      const exerciseIds = bodyPartExercises.map((ex) => ex.id);

      // Step 3: Query logs for these exercises.
      // Firestore 'in' supports max 30 values, so we chunk and run queries in parallel.
      const CHUNK_SIZE = 30;
      const chunks: string[][] = [];
      for (let i = 0; i < exerciseIds.length; i += CHUNK_SIZE) {
        chunks.push(exerciseIds.slice(i, i + CHUNK_SIZE));
      }

      const snapshots = await Promise.all(
        chunks.map((chunk) =>
          getDocs(
            query(
              logsCollection,
              where("userId", "==", userId.value),
              where("exerciseId", "in", chunk)
            )
          )
        )
      );

      // Step 4: Calculate the PR for each exercise across all query results
      const maxRecords = new Map<string, { weight: number; reps: number; date: Date }>();
      snapshots.forEach((querySnapshot) => querySnapshot.forEach((doc) => {
        const data = doc.data();
        const logDate = (data.date as Timestamp).toDate();
        const log = { ...data, date: logDate } as WorkoutLog;

        log.sets.forEach((set) => {
          const current = maxRecords.get(log.exerciseId);
          if (
            !current ||
            set.weight > current.weight ||
            (set.weight === current.weight && set.reps > current.reps) ||
            (set.weight === current.weight && set.reps === current.reps && logDate > current.date)
          ) {
            maxRecords.set(log.exerciseId, { weight: set.weight, reps: set.reps, date: logDate });
          }
        });
      }));

      // Step 5: Build the final list in exercise order (bodyPartExercises is already sorted)
      const records: PersonalRecord[] = [];
      bodyPartExercises.forEach((exercise) => {
        const record = maxRecords.get(exercise.id);
        if (record && record.weight > 0) {
          records.push({
            exerciseId: exercise.id,
            exerciseName: exercise.name,
            bodyPartName: exercise.bodyPartName,
            maxWeight: record.weight,
            maxReps: record.reps,
            achievedDate: record.date,
          });
        }
      });

      recordsByBodyPart.value = { ...recordsByBodyPart.value, [bodyPartId]: records };
      notify('Personal records updated', 'success');
    } catch (error) {
      console.error("Error calculating records for body part:", error);
      notify('Failed to load personal records. Please try again.', 'error');
    } finally {
      loadingBodyParts.value = loadingBodyParts.value.filter((id) => id !== bodyPartId);
    }
  };

  const findPersonalRecordSet = async (exerciseId: string) => {
    if (!userId.value) {
      personalRecordSet.value = null;
      return;
    }

    isPrSetLoading.value = true;
    let bestSet: Set = { reps: 0, weight: 0 };

    try {
      const q = query(
        logsCollection,
        where("userId", "==", userId.value),
        where("exerciseId", "==", exerciseId)
      );
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        const log = doc.data() as WorkoutLog;
        log.sets.forEach((set) => {
          if (set.weight > bestSet.weight) {
            bestSet = set;
          } else if (set.weight === bestSet.weight && set.reps > bestSet.reps) {
            bestSet = set;
          }
        });
      });

      personalRecordSet.value = bestSet;
    } catch (error) {
      console.error("Error finding personal record set:", error);
      notify('Failed to load personal record. Please try again.', 'error');
    } finally {
      isPrSetLoading.value = false;
    }
  };

  /**
   * Clears all progress state. Called during logout to prevent data leakage between users.
   */
  const clearProgressState = () => {
    recordsByBodyPart.value = {};
    loadingBodyParts.value = [];
    personalRecordSet.value = null;
    isPrSetLoading.value = false;
  };

  // --- Public API ---
  return {
    recordsByBodyPart,
    isBodyPartLoading,
    isPrSetLoading,
    personalRecordSet,
    calculateRecordsForBodyPart,
    findPersonalRecordSet,
    clearProgressState,
  };
};
