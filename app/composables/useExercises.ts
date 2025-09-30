import { ref } from "vue";
import { type Exercise, type NewExerciseData } from "~/types";
import {
  collection,
  getDocs,
  addDoc,
  Firestore,
  query,
  orderBy,
} from "firebase/firestore";
import { useNuxtApp } from "#app";

export const useExercises = () => {
  const { $firestore } = useNuxtApp();
  const exercises = ref<Exercise[]>([]);

  // Create a reference to the 'exercises' collection in Firestore
  const exercisesCollection = collection($firestore as Firestore, "exercises");

  /**
   * Fetches all exercises from the Firestore database and updates the local state.
   */
  const fetchExercises = async () => {
    try {
      const q = query(
        exercisesCollection,
        orderBy("bodyPartName"),
        orderBy("name")
      );
      const snapshot = await getDocs(q);
      const exercisesList: Exercise[] = [];
      snapshot.forEach((doc) => {
        exercisesList.push({
          id: doc.id,
          ...doc.data(),
        } as Exercise);
      });
      exercises.value = exercisesList;
    } catch (error) {
      console.error("Error fetching exercises:", error);
    }
  };

  /**
   * Adds a new exercise document to the Firestore database.
   * @param exerciseData The exercise data to save.
   */
  const addExercise = async (exerciseData: NewExerciseData) => {
    try {
      const docRef = await addDoc(exercisesCollection, exerciseData);
      // Optimistically update the local state to provide instant UI feedback
      exercises.value.push({ id: docRef.id, ...exerciseData });
      // Re-sort the local array to match the new fetching order
      exercises.value.sort((a, b) => {
        if (a.bodyPartName < b.bodyPartName) return -1;
        if (a.bodyPartName > b.bodyPartName) return 1;
        return a.name.localeCompare(b.name);
      });
    } catch (error) {
      console.error("Error adding exercise: ", error);
    }
  };

  return {
    exercises,
    fetchExercises,
    addExercise,
  };
};
