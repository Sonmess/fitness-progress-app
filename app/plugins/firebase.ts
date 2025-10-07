import { initializeApp, getApps, type FirebaseOptions } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

export default defineNuxtPlugin((nuxtApp) => {
  // Use the runtime config which is populated by the .env file
  const config = useRuntimeConfig();

  const firebaseConfig: FirebaseOptions = {
    apiKey: config.public.firebaseApiKey as string,
    authDomain: config.public.firebaseAuthDomain as string,
    projectId: config.public.firebaseProjectId as string,
    storageBucket: config.public.firebaseStorageBucket as string,
    messagingSenderId: config.public.firebaseMessagingSenderId as string,
    appId: config.public.firebaseAppId as string,
  };

  // --- 1. Initialize Firebase App ---
  // We check if the app is already initialized to prevent errors on hot reloads.
  if (!getApps().length) {
    initializeApp(firebaseConfig);
  }
  const auth = getAuth();
  const firestore = getFirestore();

  // --- 2. Create the Auth Ready Promise ---
  // This promise resolves once the initial authentication state is confirmed.
  const authReadyPromise = new Promise<void>((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      resolve();
      unsubscribe();
    });
  });

  // Provide the firestore instance to the Nuxt app context
  // It will now be available anywhere in your app
  nuxtApp.provide("firestore", firestore);
  nuxtApp.provide("authReady", authReadyPromise);
});
