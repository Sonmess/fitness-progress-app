export default defineNuxtRouteMiddleware(async (to, from) => {
  console.log("middleware to", to);
  console.log("middleware from", from);

  // Use the useAuth composable to check the authentication state.
  // Composables are auto-imported and can be used directly in middleware.
  const { isAuthenticated, isAuthReady } = useAuth();

  // The login page is the only public route that doesn't require authentication.
  const isPublicRoute = to.name === "login";

  // If the auth state is not ready yet, we need to wait for it.
  // This watcher will resolve a promise once isAuthReady becomes true.
  console.log("authReady", isAuthReady.value);
  console.log("isLoggin", isAuthenticated.value);

  if (!isAuthReady.value) {
    await new Promise((resolve) => {
      const unwatch = watch(isAuthReady, (value) => {
        if (value) {
          unwatch();
          resolve(true);
        }
      });
    });
  }

  // Case 1: User is NOT authenticated
  if (!isAuthenticated.value && !isPublicRoute) {
    return navigateTo({ name: "login" });
  }

  // Case 2: User IS authenticated
  // If they are logged in and try to visit the login page again,
  // redirect them to the homepage.
  if (isAuthenticated.value && isPublicRoute) {
    return navigateTo({ name: "index" });
  }
});
