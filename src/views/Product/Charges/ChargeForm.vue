<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import { showMessageAlert } from '../../../utils/alert';
import API from '../../../utils/baseApi';

const route = useRoute();
const router = useRouter();

const form = reactive({
    name: '',
    max_allowed_amount: '',
    min_allowed_amount: '',
    status: 1,
});

const roles = ref([]); // Store roles
const loading = ref(false);
const loadingFetch = ref(false);

const isEditMode = ref(false);


const fetchCharge = async (id) => {
    try {
        loadingFetch.value = true;
        const response = await axios.get(API.CHARGES + `${id}`);
        Object.assign(form, response.data.data);
    } catch (error) {
        console.error('Error fetching charges:', error);
    } finally {
        loadingFetch.value = false;
    }
};

const handleSubmit = async () => {
    try {
        loading.value = true;
        if (isEditMode.value) {
            await axios.put(API.CHARGES + `${route.params.id}`, form);
            showMessageAlert({ message: 'Successfully updated charge', type: 'success' });
        } else {
            await axios.post(API.CHARGES, form);
            showMessageAlert({ message: 'Successfully added charge', type: 'success' });
        }
        router.push('/dashboard/charges');
    } catch (error) {
        showMessageAlert({ message: error.response?.data?.message || 'Something went wrong', type: 'error' });
        console.error('Error saving charge:', error);
    } finally {
        loading.value = false;
    }
};

const handleCancel = () => {
    router.push('/dashboard/charges');
};

onMounted(() => {
    if (route.name === 'EditCharge') {
        isEditMode.value = true;
        fetchCharge(route.params.id);
    }
});
</script>


<template>
    <form @submit.prevent="handleSubmit">
        <div class="space-y-12 sm:space-y-16" v-loading="loadingFetch">
            <div>
                <h2 class="text-base/7 font-semibold text-gray-900">Charge Information</h2>
                <p class="mt-1 max-w-2xl text-sm/6 text-gray-600">
                    Please fill information carefully.
                </p>

                <div
                    class="mt-10 space-y-8 border-b border-gray-900/10 pb-12 sm:space-y-0 sm:divide-y sm:divide-gray-900/10 sm:border-t sm:pb-0">
                    <div class="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                        <label for="name" class="block text-sm/6 font-medium text-gray-900 sm:pt-1.5">Name</label>
                        <div class="mt-2 sm:col-span-2 sm:mt-0">
                            <input type="text" name="name" id="name" v-model="form.name" autocomplete="given-name"
                                class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm/6" />
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