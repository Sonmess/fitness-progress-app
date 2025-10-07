export default defineNuxtRouteMiddleware(async (to, from) => {
  // Use the useAuth composable to check the authentication state.
  // Composables are auto-imported and can be used directly in middleware.
  const { isAuthenticated } = useAuth();
  const nuxtApp = useNuxtApp();

  // The login page is the only public route that doesn't require authentication.
  const isPublicRoute = to.name === "login";

  // Waiting for promise to be resolved
  await nuxtApp.$authReady;

  // Case 1: User is NOT authenticated
  if (!isAuthenticated.value && !isPublicRoute) {
    return navigateTo({ name: "login", query: { redirect: to.fullPath } });
  }

  // Case 2: User IS authenticated
  // If they are logged in and try to visit the login page again,
  // redirect them to the homepage.
  if (isAuthenticated.value && isPublicRoute) {
    if (from.query.redirect) {
      return navigateTo(String(from.query.redirect));
    } else {
      return navigateTo({ name: "index" });
    }
  }
});
