<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import { showMessageAlert } from '../utils/alert';
import API from '../utils/baseApi';

const route = useRoute();
const router = useRouter();

const form = reactive({
    slug: '', // Only edit this field for roles
    permissions: [], // Array to hold selected permission IDs
});

const permissions = ref([]); // Holds all available permissions
const loading = ref(false);
const loadingFetch = ref(false);
const isEditMode = ref(false);

// Fetch permissions data
const fetchPermissions = async () => {
    try {
        const response = await axios.get(API.PERMISSIONS);
        permissions.value = response.data.data;
    } catch (error) {
        console.error('Error fetching permissions:', error);
    }
};

// Fetch role data if in edit mode
const fetchRole = async (id) => {
    try {
        loadingFetch.value = true;
        const response = await axios.get(API.ROLES + `${id}`);
        form.slug = response.data.data.slug;
        form.permissions = response.data.data.permissions.map(permission => permission.id);
    } catch (error) {
        console.error('Error fetching role:', error);
    } finally {
        loadingFetch.value = false;
    }
};

const handleSubmit = async () => {
    try {
        loading.value = true;
        const payload = {
            slug: form.slug,
            permissions: form.permissions, // Include selected permissions
        };

        if (isEditMode.value) {
            await axios.put(API.ROLES + `${route.params.id}`, payload);
            showMessageAlert({ message: 'Successfully updated role', type: 'success' });
        } else {
            await axios.post(API.ROLES, payload);
            showMessageAlert({ message: 'Successfully added role', type: 'success' });
        }
        router.push('/dashboard/roles'); // Redirect after success
    } catch (error) {
        showMessageAlert({ message: error.response?.data?.message || 'Something went wrong', type: 'error' });
        console.error('Error saving role:', error);
    } finally {
        loading.value = false;
    }
};

const handleCancel = () => {
    router.push('/dashboard/roles');
};

onMounted(() => {
    fetchPermissions(); // Load permissions
    if (route.name === 'EditRole') {
        isEditMode.value = true;
        fetchRole(route.params.id); // Load data for editing
    }
});
</script>

<template>
    <form @submit.prevent="handleSubmit">
        <div class="space-y-12 sm:space-y-16" v-loading="loadingFetch">
            <div>
                <h2 class="text-base/7 font-semibold text-gray-900">Role Information</h2>
                <div
                    class="mt-10 space-y-8 border-b border-gray-900/10 pb-12 sm:space-y-0 sm:divide-y sm:divide-gray-900/10 sm:border-t sm:pb-0">
                    <div class="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                        <label for="slug" class="block text-sm/6 font-medium text-gray-900 sm:pt-1.5">Name</label>
                        <div class="mt-2 sm:col-span-2 sm:mt-0">
                            <input type="text" id="slug" v-model="form.slug" autocomplete="slug"
                                class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm/6" />
                        </div>
                    </div>
                </div>
            </div>

            <!-- Permissions -->
            <div class="mt-8">
                <h3 class="text-base/7 font-semibold text-gray-900">Permissions</h3>
                <div class="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    <div v-for="permission in permissions" :key="permission.id" class="flex items-center">
                        <input type="checkbox" :id="`permission-${permission.id}`" :value="permission.id"
                            v-model="form.permissions"
                            class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
                        <label :for="`permission-${permission.id}`" class="ml-3 text-sm font-medium text-gray-700">{{
                            permission.slug }}</label>
                    </div>
                </div>
            </div>

        </div>

        <div class="mt-6 flex items-center justify-end gap-x-6">
            <button type="button" class="text-sm/6 font-semibold text-gray-900" @click="handleCancel">Cancel</button>
            <button type="submit" v-loading="loading"
                class="inline-flex justify-center rounded-md bg-slate-900 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                <p v-if="isEditMode">Edit</p>
                <p v-else-if="!isEditMode">Save</p>
            </button>
        </div>
    </form>
</template>


<style>
.example-showcase .el-loading-mask {
    z-index: 9;
}

svg.circular {
    width: 30px !important;
}
</style>
