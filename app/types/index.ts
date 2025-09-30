export interface BodyPart {
  id: string;
  name: string;
  imageUrl?: string;
}

export type ExerciseCategory = "Silový" | "Kardio" | "HIIT" | "Mobility";

export type ExerciseEquipment =
  | "Jednoručky"
  | "Tyčka"
  | "Multipress"
  | "Kladka"
  | "Kettlebell"
  | "Stroj";

export interface Exercise {
  id: string;
  name: string;
  description?: string;
  bodyPartId: BodyPart["id"];
  bodyPartName: BodyPart["name"];
  equipment?: ExerciseEquipment;
  imageUrl?: string;
}

export interface WorkoutSession {
  id: string;
  userId: string;
  title: string;
  date: Date;
  notes?: string;
}

export interface WorkoutLog {
  id: string;
  userId: string;
  sessionId: WorkoutSession["id"];
  exerciseId: Exercise["id"];
  exerciseName: Exercise["name"];
  sets: Set[];
  notes?: string;
}

// Helper interface for a single set
export interface Set {
  reps: number;
  weight: number;
}

export interface UserProfile {
  nickname: string;
  role: string;
  email: string;
  state: number;
}

// Helper types for creating new documents (without the Firestore-generated 'id')
export type NewExerciseData = Omit<Exercise, "id">;
export type NewWorkoutSessionData = Omit<WorkoutSession, "id">;
export type NewWorkoutLogData = Omit<WorkoutLog, "id">;
