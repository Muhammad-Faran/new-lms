<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { showMessageAlert } from '../utils/alert';
import API from '../utils/baseApi';

const router = useRouter();

const form = reactive({
    old_password: '',
    new_password: '',
    password_confirmation: '',
});

const loading = ref(false);

const handleSubmit = async () => {
    try {
        loading.value = true;

        const payload = {
            old_password: form.old_password,
            password: form.new_password,
            password_confirmation: form.password_confirmation,
        };

        await axios.post(API.CHANGE_PASSWORD, payload);
        showMessageAlert({ message: 'Password changed successfully', type: 'success' });
        form.old_password = '';
        form.new_password = '';
        form.password_confirmation = '';
        router.push('/dashboard');
    } catch (error) {
        showMessageAlert({ message: error.response?.data?.message || 'Something went wrong', type: 'error' });
        console.error('Error changing password:', error);
    } finally {
        loading.value = false;
    }
};

const handleCancel = () => {
    router.push('/dashboard');
};
</script>

<template>
    <form @submit.prevent="handleSubmit">
        <div class="space-y-12 sm:space-y-16" v-loading="loading">
            <div>
                <h2 class="text-base/7 font-semibold text-gray-900">Change Password</h2>
                <div
                    class="mt-10 space-y-8 border-b border-gray-900/10 pb-12 sm:space-y-0 sm:divide-y sm:divide-gray-900/10 sm:border-t sm:pb-0">
                    <!-- Old Password -->
                    <div class="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                        <label for="old-password" class="block text-sm/6 font-medium text-gray-900 sm:pt-1.5">
                            Current Password
                        </label>
                        <div class="mt-2 sm:col-span-2 sm:mt-0">
                            <input type="password" id="old-password" v-model="form.old_password"
                                placeholder="Enter current password"
                                class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm/6"
                                required />
                        </div>
                    </div>

                    <!-- New Password -->
                    <div class="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                        <label for="new-password" class="block text-sm/6 font-medium text-gray-900 sm:pt-1.5">
                            New Password
                        </label>
                        <div class="mt-2 sm:col-span-2 sm:mt-0">
                            <input type="password" id="new-password" v-model="form.new_password"
                                placeholder="Enter new password"
                                class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm/6"
                                required />
                        </div>
                    </div>

                    <!-- Confirm Password -->
                    <div class="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                        <label for="password-confirmation" class="block text-sm/6 font-medium text-gray-900 sm:pt-1.5">
                            Confirm New Password
                        </label>
                        <div class="mt-2 sm:col-span-2 sm:mt-0">
                            <input type="password" id="password-confirmation" v-model="form.password_confirmation"
                                placeholder="Confirm new password"
                                class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm/6"
                                required />
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Actions -->
        <div class="mt-6 flex items-center justify-end gap-x-6">
            <button type="button" class="text-sm/6 font-semibold text-gray-900" @click="handleCancel">Cancel</button>
            <button type="submit" v-loading="loading"
                class="inline-flex justify-center rounded-md bg-slate-900 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                <p>Change Password</p>
            </button>
        </div>
    </form>
</template>

<style scoped>
.example-showcase .el-loading-mask {
    z-index: 9;
}

svg.circular {
    width: 30px !important;
}
</style>
