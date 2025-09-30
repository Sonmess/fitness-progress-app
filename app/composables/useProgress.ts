import { ref } from 'vue';
import { collection, getDocs, getFirestore, query, where } from 'firebase/firestore';
import type { WorkoutLog, Exercise } from '~/types';

// Define a new type for our enriched personal record object
export interface PersonalRecord {
  exerciseId: string;
  exerciseName: string;
  bodyPartName: string;
  maxWeight: number;
}

export const useProgress = () => {
  // --- State ---
  // Stores the list of all calculated personal records.
  const personalRecords = ref<PersonalRecord[]>([]);
  const isLoading = ref(false);

  // --- Dependencies ---
  const { userId } = useAuth();
  // We need the master list of exercises to get their names and body parts
  const { exercises, fetchExercises } = useExercises();
  const db = getFirestore();
  const logsCollection = collection(db, 'workoutLogs');

  // --- Actions ---

  /**
   * Calculates the all-time maximum weight for every exercise the user has logged.
   * The final list is sorted by body part, then by exercise name.
   */
  const calculateAllPersonalRecords = async () => {
    if (!userId.value) {
      personalRecords.value = [];
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
      const q = query(logsCollection, where('userId', '==', userId.value));
      const querySnapshot = await getDocs(q);
      
      // Step 3: Process the logs to find the max weight for each exercise.
      // We use a Map for efficient lookups.
      const maxWeights = new Map<string, number>();
      querySnapshot.forEach((doc) => {
        const log = doc.data() as WorkoutLog;
        log.sets.forEach((set) => {
          const currentMax = maxWeights.get(log.exerciseId) || 0;
          if (set.weight > currentMax) {
            maxWeights.set(log.exerciseId, set.weight);
          }
        });
      });

      // Step 4: Create the final, sorted list of records.
      const records: PersonalRecord[] = [];
      // We iterate through our pre-sorted `exercises` array to build the final list.
      // This ensures the final output is also sorted correctly.
      exercises.value.forEach(exercise => {
        const maxWeight = maxWeights.get(exercise.id);
        // Only include exercises for which a record was found.
        if (maxWeight && maxWeight > 0) {
          records.push({
            exerciseId: exercise.id,
            exerciseName: exercise.name,
            bodyPartName: exercise.bodyPartName,
            maxWeight: maxWeight,
          });
        }
      });
      
      personalRecords.value = records;

    } catch (error) {
      console.error("Error calculating personal records: ", error);
      personalRecords.value = [];
    } finally {
      isLoading.value = false;
    }
  };

  // --- Public API ---
  return {
    personalRecords,
    isLoading,
    calculateAllPersonalRecords,
  };
};

