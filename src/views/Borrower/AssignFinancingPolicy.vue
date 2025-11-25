<script setup>
import { ref, reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import { showMessageAlert } from '../../utils/alert';
import API from '../../utils/baseApi';

const route = useRoute();
const router = useRouter();

const form = reactive({
    borrower: {
        name: '',
        financing_percentage: null, // New field for financing policy
    }
});

const BorrowerData = window.history.state?.BorrowerData;

if (BorrowerData) {
    const data = JSON.parse(BorrowerData);

    form.borrower = {
        ...data,
        name: `${data.first_name} ${data.last_name}`, // Set borrower name
        financing_policy: data.financing_policy ? parseFloat(data.financing_policy.financing_percentage) : null, // Prefill financing_policy if exists
    };
} else {
    console.log('No BorrowerData found');
}

const loading = ref(false);

const handleSubmit = async () => {
    try {
        loading.value = true;
        const payload = {
            financing_percentage: form.borrower.financing_policy, // Send only the financing_policy
        };

        await axios.post(API.BORROWERS_ASSIGN_FINANCING_POLICY.replace('{borrower}', route.params.id), payload);
        showMessageAlert({ message: 'financing policy assigned successfully', type: 'success' });
        router.push('/dashboard/borrowers');
    } catch (error) {
        showMessageAlert({ message: error.response?.data?.message || 'Something went wrong', type: 'error' });
        console.error('Error assigning financing policy:', error);
    } finally {
        loading.value = false;
    }
};

const handleCancel = () => {
    router.push('/dashboard/borrowers');
};
</script>

<template>
    <form @submit.prevent="handleSubmit">
        <div class="space-y-12 sm:space-y-16" v-loading="loading">
            <div>
                <h2 class="text-base/7 font-semibold text-gray-900">Assign financing policy</h2>
                <div
                    class="mt-10 space-y-8 border-b border-gray-900/10 pb-12 sm:space-y-0 sm:divide-y sm:divide-gray-900/10 sm:border-t sm:pb-0">
                    <!-- Borrower Name -->
                    <div class="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                        <label for="borrower-name" class="block text-sm/6 font-medium text-gray-900 sm:pt-1.5">
                            Borrower Name
                        </label>
                        <div class="mt-2 sm:col-span-2 sm:mt-0">
                            <input type="text" id="borrower-name" v-model="form.borrower.name" disabled
                                class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm/6" />
                        </div>
                    </div>

                    <!-- financing policy -->
                    <div class="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                        <label for="financing-policy" class="block text-sm/6 font-medium text-gray-900 sm:pt-1.5">
                            financing percentage (%)
                        </label>
                        <div class="mt-2 sm:col-span-2 sm:mt-0">
                            <input type="number" id="financing-policy" v-model="form.borrower.financing_policy"
                                placeholder="Enter financing policy"
                                class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm/6" />
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Actions -->
        <div class="mt-6 flex items-center justify-end gap-x-6">
            <button type="button" class="text-sm/6 font-semibold text-gray-900" @click="handleCancel">Cancel</button>
            <button type="submit" v-loading="loading"
                class="inline-flex justify-center rounded-md bg-[#75ba2c] px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                <p>Assign</p>
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
