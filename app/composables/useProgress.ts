import { ref } from "vue";
import {
  collection,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore";
import { type WorkoutLog, type Exercise, type Set } from "~/types";

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
  // Use useState for global state caching across the app
  const personalRecords = useState<PersonalRecord[]>('personalRecords', () => []);
  const isLoading = useState<boolean>('personalRecordsLoading', () => false);
  const personalRecordSet = useState<Set | null>('personalRecordSet', () => null);
  const isPrSetLoading = useState<boolean>('prSetLoading', () => false);
  const lastCalculatedUserId = useState<string | null>('lastCalculatedUserId', () => null);

  // --- Dependencies ---
  const { userId } = useAuth();
  // We need the master list of exercises to get their names and body parts
  const { exercises, fetchExercises } = useExercises();
  const db = getFirestore();
  const logsCollection = collection(db, WORKOUT_LOGS_COLLECTION);

  // --- Actions ---

  /**
   * Calculates the all-time maximum weight for every exercise the user has logged.
   * The final list is sorted by body part, then by exercise name.
   * @param force If true, forces a refresh even if data is already cached.
   */
  const calculateAllPersonalRecords = async (force = false) => {
    if (!userId.value) {
      personalRecords.value = [];
      return;
    }

    // Skip calculation if already done for this user and not forcing refresh
    if (lastCalculatedUserId.value === userId.value && personalRecords.value.length > 0 && !force) {
      return;
    }

    isLoading.value = true;
    personalRecords.value = [];

    try {
      // Step 1: Ensure we have the master list of all exercises.
      // This list is already sorted by bodyPartName and name.
      if (exercises.value.length === 0) {
        await fetchExercises();
      }

      // Step 2: Fetch all workout logs for the current user in a single query.
      const q = query(logsCollection, where("userId", "==", userId.value));
      const querySnapshot = await getDocs(q);

      // Step 3: Process the logs to find the max weight, reps, and date for each exercise.
      // We use a Map for efficient lookups.
      const maxRecords = new Map<string, { weight: number; reps: number; date: Date }>();
      querySnapshot.forEach((doc) => {
        const log = doc.data() as WorkoutLog;
        const logDate = log.date?.toDate ? log.date.toDate() : new Date(log.date);

        log.sets.forEach((set) => {
          const currentRecord = maxRecords.get(log.exerciseId);

          // Update if: no record exists, higher weight, or same weight but more reps, or same weight/reps but more recent
          if (!currentRecord ||
              set.weight > currentRecord.weight ||
              (set.weight === currentRecord.weight && set.reps > currentRecord.reps) ||
              (set.weight === currentRecord.weight && set.reps === currentRecord.reps && logDate > currentRecord.date)) {
            maxRecords.set(log.exerciseId, {
              weight: set.weight,
              reps: set.reps,
              date: logDate
            });
          }
        });
      });

      // Step 4: Create the final, sorted list of records.
      const records: PersonalRecord[] = [];
      // We iterate through our pre-sorted `exercises` array to build the final list.
      // This ensures the final output is also sorted correctly.
      exercises.value.forEach((exercise) => {
        const record = maxRecords.get(exercise.id);
        // Only include exercises for which a record was found.
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

      personalRecords.value = records;
      lastCalculatedUserId.value = userId.value;
    } catch (error) {
      console.error("Error calculating personal records: ", error);
      personalRecords.value = [];
    } finally {
      isLoading.value = false;
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
      const querySnapshop = await getDocs(q);
      querySnapshop.forEach((doc) => {
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
      console.error("Error finding personal record set: ", error);
    } finally {
      isPrSetLoading.value = false;
    }
  };

  /**
   * Clears all progress state. Called during logout to prevent data leakage between users.
   */
  const clearProgressState = () => {
    personalRecords.value = [];
    personalRecordSet.value = null;
    isLoading.value = false;
    isPrSetLoading.value = false;
    lastCalculatedUserId.value = null;
  };

  // --- Public API ---
  return {
    personalRecords,
    isLoading,
    isPrSetLoading,
    personalRecordSet,
    calculateAllPersonalRecords,
    findPersonalRecordSet,
    clearProgressState,
  };
};
