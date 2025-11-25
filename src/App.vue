<template>
  <router-view />
</template>

<script>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';

export default {
  setup() {
    const router = useRouter();

    // Check if the user is logged in (i.e., if auth_token exists)
    onMounted(() => {
      const token = localStorage.getItem('auth_token');

      if (token) {
        // If token exists, redirect to the dashboard only if the current route is Login
        if (router.currentRoute.value.name === 'Login') {
          router.push('/dashboard'); // Redirect to dashboard if already logged in
        }
      } else {
        // If no token, stay on the login page
        if (router.currentRoute.value.name !== 'Login') {
          router.push('/'); // Redirect to login page if not authenticated
        }
      }
    });
  },
};
</script>
