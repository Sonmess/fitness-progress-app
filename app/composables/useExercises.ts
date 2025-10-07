import { ref } from "vue";
import { type Exercise, type NewExerciseData } from "~/types";
import {
  collection,
  getDocs,
  addDoc,
  Firestore,
  query,
  orderBy,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { useNuxtApp } from "#app";

const EXERCISE_COLLECTION = "exercises";

export const useExercises = () => {
  const { $firestore } = useNuxtApp();
  const exercises = ref<Exercise[]>([]);
  const exercise = ref<Exercise | null>(null);

  // Create a reference to the 'exercises' collection in Firestore
  const exercisesCollection = collection(
    $firestore as Firestore,
    EXERCISE_COLLECTION
  );

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
      exercises.value = snapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          } as Exercise)
      );
    } catch (error) {
      console.error("Error fetching exercises:", error);
    }
  };

  const getExerciseById = async (exerciseId: string) => {
    try {
      // const docRef = doc($firestore as Firestore, "exercises", exerciseId);
      const docRef = doc(exercisesCollection, exerciseId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        exercise.value = {
          id: docSnap.id,
          ...docSnap.data(),
        } as Exercise;
      } else {
        throw new Error("Exercise not found by ID: " + exerciseId);
      }
    } catch (error) {
      console.error("Error fetching and exercise", error);
    }
  };

  const updateExerciseById = async (
    exerciseId: string,
    exerciseData: Partial<NewExerciseData>
  ) => {
    try {
      const docRef = doc(
        $firestore as Firestore,
        EXERCISE_COLLECTION,
        exerciseId
      );
      await updateDoc(docRef, exerciseData);
      const index = exercises.value.findIndex((ex) => ex.id === exerciseId);
      if (index !== -1) {
        exercises.value[index] = {
          ...exercises.value[index],
          ...exerciseData,
        } as Exercise;
      }

      if (exercise.value?.id === exerciseId) {
        exercise.value = {
          ...exercise.value,
          ...exerciseData,
        } as Exercise;
      }
    } catch (error) {
      console.error("Error updating exercise", error);
    }
  };

  const deleteExercise = async (exerciseId: string) => {
    try {
      const docRef = doc(
        $firestore as Firestore,
        EXERCISE_COLLECTION,
        exerciseId
      );
      await deleteDoc(docRef);
      exercises.value = exercises.value.filter((ex) => ex.id !== exerciseId);
    } catch (error) {
      console.error("Error deleting exercise", error);
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
    exercise,
    exercises,
    fetchExercises,
    addExercise,
    getExerciseById,
    updateExerciseById,
    deleteExercise,
  };
};
