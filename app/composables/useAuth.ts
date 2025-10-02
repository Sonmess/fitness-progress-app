import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User,
} from "firebase/auth";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import type { UserProfile } from "~/types";

export const useAuth = () => {
  // --- State ---
  const user = useState<User | null>("user", () => null);
  const userProfile = useState<UserProfile | null>("userProfile", () => null);
  const isAuthReady = useState<boolean>("isAuthReady", () => false);

  const auth = getAuth();
  const db = getFirestore();
  const router = useRouter();

  // --- Auth State Listener ---
  // This is the core of the composable. It listens for changes in auth state.
  onAuthStateChanged(auth, async (firebaseUser) => {
    if (firebaseUser) {
      console.log(firebaseUser);

      user.value = firebaseUser;

      // User is logged in, now fetch their profile from Firestore
      const docRef = doc(db, "users", firebaseUser.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        userProfile.value = docSnap.data() as UserProfile;
      } else {
        // Handle case where user exists in Auth but not in Firestore
        console.warn(
          "User document not found in Firestore for UID:",
          firebaseUser.uid
        );
        userProfile.value = null;
      }
    } else {
      // User is logged out, clear all state
      user.value = null;
      userProfile.value = null;
    }
    isAuthReady.value = true;
  });

  // --- Actions ---
  const login = async (email: string, password: string) => {
    let error = null;
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (e: any) {
      error = e;
    }
    return { error };
  };

  const logout = async () => {
    await signOut(auth);
    // Redirect to login page after logout
    await router.push({ name: "login" });
  };

  // --- Computed Properties (Getters) ---
  const isAuthenticated = computed(() => !!user.value);
  const userId = computed(() => user.value?.uid);
  const userRole = computed(() => userProfile.value?.role);
  const userNickname = computed(() => userProfile.value?.nickname);
  const userState = computed(() => userProfile.value?.state);

  // --- Public API ---
  return {
    user,
    userId,
    userProfile,
    userRole,
    userNickname,
    userState,
    isAuthenticated,
    isAuthReady,
    login,
    logout,
  };
};
