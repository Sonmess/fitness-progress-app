export default defineAppConfig({
  meta: {
    title: 'SEO TITLE - FITNESS PROGRESS',
    desc: 'SEO DESCRIPTION - FITNESS PROGRESS',
    headline : 'Fitness progress',
    perex: 'Track your workouts, monitor your progress, and achieve your fitness goals.'
  },
  author: {
    name: "Matej Mess Boháč",
    email: "INSERT SPECIAL EMAIL HERE",
    repo: "https://github.com/Sonmess/fitness-progress-app",
  },
  localStorages: { auth: "fitness-auth" },
  theme: {
    dark: true,
    colors: {
      primary: "#27005D",
      secondary: "#9400FF",
      main_light: "#AED2FF",
      secondary_light: "#E4F1FF",
    },
  },
});
