<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRoute, useRouter } from 'vue-router';
import { showMessageAlert } from '../utils/alert';
import API from '../utils/baseApi';

const route = useRoute();
const router = useRouter();
const allPermissions = ref([]); // Holds all permissions
const selectedPermissions = ref([]); // Tracks selected permissions
const loading = ref(false); // Indicates loading state

const fetchPermissions = async () => {
  loading.value = true;
  try {
    const response = await axios.get(API.PERMISSIONS);
    allPermissions.value = response.data.data;
  } catch (error) {
    console.error('Error fetching permissions:', error);
    showMessageAlert({ message: 'Failed to load permissions!', type: 'error' });
  } finally {
    loading.value = false;
  }
};

const handleSavePermissions = async () => {
  try {
    const response = await axios.post(API.SYNC_USERS_PERMISSIONS,
      {
        user_id: route.params.userId,
        permissions: selectedPermissions.value,
      }
    );
    showMessageAlert({ message: 'Permissions updated successfully!', type: 'success' });
    router.push('/dashboard/team');
  } catch (error) {
    console.error('Error saving permissions:', error);
    showMessageAlert({ message: 'Failed to update permissions!', type: 'error' });
  }
};

const handleCancel = () => {
  router.push('/dashboard/team');
};

onMounted(() => {
  const storedPermissions = localStorage.getItem('user_permissions');
  if (storedPermissions) {
    selectedPermissions.value = JSON.parse(storedPermissions);
    localStorage.removeItem('permissions');
  }
  fetchPermissions();
});

</script>

<template>
  <div class="px-4 sm:px-6 lg:px-8">
    <h1 class="text-2xl font-semibold text-gray-900 mb-4">Manage Permissions</h1>
    <p class="mb-4 text-sm text-gray-700">Assign or remove permissions from the available list.</p>

    <!-- Loading Indicator -->
    <div v-if="loading" class="text-center">Loading...</div>

    <!-- Permissions Grid -->
    <div v-if="!loading" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      <div v-for="permission in allPermissions" :key="permission.id"
        class="p-4 border rounded-md shadow-sm bg-white flex items-center">
        <label :for="`permission-${permission.id}`" class="inline-flex items-center w-full">
          <input type="checkbox" :id="`permission-${permission.id}`" :value="permission.id"
            v-model="selectedPermissions" class="mr-2" />
          {{ permission.slug }}
        </label>
      </div>
    </div>

    <!-- Save Button -->
    <div class="mt-6 flex items-center justify-end gap-x-6">
      <button type="button" class="text-sm/6 font-semibold text-gray-900" @click="handleCancel">Cancel</button>
      <button @click="handleSavePermissions" v-loading="loading"
        class="inline-flex justify-center rounded-md bg-slate-900 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
        <p>Save</p>
      </button>
    </div>
  </div>
</template>
