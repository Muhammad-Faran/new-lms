<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import { showMessageAlert } from '../utils/alert';
import API from '../utils/baseApi';

const route = useRoute();
const router = useRouter();

const form = reactive({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    password: '',
    password_confirmation: '',
    role_id: '',
});

const roles = ref([]); // Store roles
const loading = ref(false);
const loadingFetch = ref(false);

const isEditMode = ref(false);

const fetchRoles = async () => {
    try {
        const response = await axios.get(API.ROLES);

        roles.value = response.data.data;
    } catch (error) {
        console.error('Error fetching roles:', error);
    }
};

const fetchTeamMember = async (id) => {
    try {
        loadingFetch.value = true;
        const response = await axios.get(API.USERS + `${id}`);

        Object.assign(form, response.data.data);
    } catch (error) {
        console.error('Error fetching team member:', error);
    } finally {
        loadingFetch.value = false;
    }
};

const handleSubmit = async () => {
    try {
        loading.value = true;
        if (isEditMode.value) {
            await axios.put(API.USERS + `${route.params.id}`, form);
            showMessageAlert({ message: 'Successfully updated user', type: 'success' });
        } else {
            await axios.post(API.USERS, form);
            showMessageAlert({ message: 'Successfully added user', type: 'success' });
        }
        router.push('/dashboard/team');
    } catch (error) {
        showMessageAlert({ message: error.response?.data?.message || 'Something went wrong', type: 'error' });
        console.error('Error saving team member:', error);
    } finally {
        loading.value = false;
    }
};

const handleCancel = () => {
    router.push('/dashboard/team');
};

onMounted(() => {
    fetchRoles(); // Fetch roles when component is mounted
    if (route.name === 'EditTeam') {
        isEditMode.value = true;
        fetchTeamMember(route.params.id); // Load data for editing
    }
});
</script>


<template>
    <form @submit.prevent="handleSubmit">
        <div class="space-y-12 sm:space-y-16" v-loading="loadingFetch">
            <div>
                <h2 class="text-base/7 font-semibold text-gray-900">Personal Information</h2>
                <p class="mt-1 max-w-2xl text-sm/6 text-gray-600">
                    Use a permanent address where you can receive mail.
                </p>

                <div
                    class="mt-10 space-y-8 border-b border-gray-900/10 pb-12 sm:space-y-0 sm:divide-y sm:divide-gray-900/10 sm:border-t sm:pb-0">
                    <div class="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                        <label for="first-name" class="block text-sm/6 font-medium text-gray-900 sm:pt-1.5">First
                            name</label>
                        <div class="mt-2 sm:col-span-2 sm:mt-0">
                            <input type="text" name="first-name" id="first-name" v-model="form.first_name"
                                autocomplete="given-name"
                                class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm/6" />
                        </div>
                    </div>

                    <div class="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                        <label for="last-name" class="block text-sm/6 font-medium text-gray-900 sm:pt-1.5">Last
                            name</label>
                        <div class="mt-2 sm:col-span-2 sm:mt-0">
                            <input type="text" name="last-name" id="last-name" v-model="form.last_name"
                                autocomplete="family-name"
                                class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm/6" />
                        </div>
                    </div>

                    <div class="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                        <label for="email" class="block text-sm/6 font-medium text-gray-900 sm:pt-1.5">Email
                            address</label>
                        <div class="mt-2 sm:col-span-2 sm:mt-0">
                            <input id="email" name="email" v-model="form.email" type="email" autocomplete="email"
                                class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm/6" />
                        </div>
                    </div>

                    <div v-if="!isEditMode" class="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                        <label for="password"
                            class="block text-sm/6 font-medium text-gray-900 sm:pt-1.5">Password</label>
                        <div class="mt-2 sm:col-span-2 sm:mt-0">
                            <input id="password" name="password" v-model="form.password" type="text"
                                autocomplete="password"
                                class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm/6" />
                        </div>
                    </div>

                    <div v-if="!isEditMode" class="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                        <label for="password" class="block text-sm/6 font-medium text-gray-900 sm:pt-1.5">Password
                            confirmation</label>
                        <div class="mt-2 sm:col-span-2 sm:mt-0">
                            <input id="password_confirmation" name="password_confirmation"
                                v-model="form.password_confirmation" type="text" autocomplete="password"
                                class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm/6" />
                        </div>
                    </div>

                    <div class="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                        <label for="Phone" class="block text-sm/6 font-medium text-gray-900 sm:pt-1.5">Phone</label>
                        <div class="mt-2 sm:col-span-2 sm:mt-0">
                            <input id="phone" name="phone" v-model="form.phone" type="text" autocomplete="phone"
                                class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm/6" />
                        </div>
                    </div>

                    <div class="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                        <label for="role" class="block text-sm/6 font-medium text-gray-900 sm:pt-1.5">Role</label>
                        <div class="mt-2 sm:col-span-2 sm:mt-0">
                            <select id="role" v-model="form.role_id"
                                class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm/6">
                                <option value="" disabled>Select a role</option>
                                <option v-for="role in roles" :key="role.id" :value="role.id">
                                    {{ role.slug }}
                                </option>
                            </select>
                        </div>
                    </div>


                </div>
            </div>

        </div>

        <div class="mt-6 flex items-center justify-end gap-x-6">
            <button type="button" class="text-sm/6 font-semibold text-gray-900" @click="handleCancel">Cancel</button>
            <button type="submit" v-loading="loading"
                class="inline-flex justify-center rounded-md bg-[#75ba2c] px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
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