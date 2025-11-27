<script setup>
import { ref, reactive, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";
import { showMessageAlert } from "../../utils/alert";
import API from "../../utils/baseApi";

const route = useRoute();
const router = useRouter();

const isEditMode = ref(route.path.includes("/edit"));

const form = reactive({
    first_name: "",
    last_name: "",
    cnic: "",
    cnic_front_image: null,
    cnic_back_image: null,
    cnic_issuance_date: "",
    mobile_no: "",
    wallet_id: "",
    shipper_name: "",
    shipper_id: "",
    email: "",
    father_name: "",
    mother_name: "",
    address: "",
    city: "",
    dob: "",
});

const loading = ref(false);
const loadingFetch = ref(false);

const fetchApplicant = async (id) => {
    try {
        loadingFetch.value = true;
        const response = await axios.get(API.APPLICANTS + `${id}`);
        Object.assign(form, response.data.data);
    } catch (error) {
        console.error("Error fetching applicant data:", error);
        showMessageAlert({
            message: error.response?.data?.message || "Failed to load applicant data.",
            type: "error",
        });
    } finally {
        loadingFetch.value = false;
    }
};

const handleSubmit = async () => {
    try {
        loading.value = true;
        await axios.put(API.APPLICANTS + `${route.params.id}`, form);
        showMessageAlert({ message: "Successfully updated applicant", type: "success" });
        handleCancel()
    } catch (error) {
        console.error("Error saving applicant data:", error);
        showMessageAlert({
            message: error.response?.data?.message || "Failed to save applicant data.",
            type: "error",
        });
    } finally {
        loading.value = false;
    }
};

const handleFileUpload = (field, event) => {
    form[field] = event.target.files[0];
    console.log(`${field} updated:`, form[field]);
};


const handleCancel = () => {
    router.push('/dashboard/applicants');
};

onMounted(() => {
    fetchApplicant(route.params.id);
});
</script>


<template>
    <form @submit.prevent="handleSubmit">
        <div class="space-y-12 sm:space-y-16" v-loading="loadingFetch">
            <div>
                <h2 class="text-base/7 font-semibold text-gray-900">
                    {{ isEditMode ? "Edit Applicant Information" : "Applicant Information" }}
                </h2>
                <p class="mt-1 max-w-2xl text-sm/6 text-gray-600">
                    Please review the applicant's information.
                </p>

                <div
                    class="mt-10 space-y-8 border-b border-gray-900/10 pb-12 sm:space-y-0 sm:divide-y sm:divide-gray-900/10 sm:border-t sm:pb-0">
                    <!-- First Name -->
                    <div class="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                        <label for="first_name" class="block text-sm/6 font-medium text-gray-900 sm:pt-1.5">First
                            Name</label>
                        <div class="mt-2 sm:col-span-2 sm:mt-0">
                            <input type="text" id="first_name" v-model="form.first_name" :disabled="!isEditMode"
                                class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm/6" />
                        </div>
                    </div>

                    <!-- Last Name -->
                    <div class="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                        <label for="last_name" class="block text-sm/6 font-medium text-gray-900 sm:pt-1.5">Last
                            Name</label>
                        <div class="mt-2 sm:col-span-2 sm:mt-0">
                            <input type="text" id="last_name" v-model="form.last_name" :disabled="!isEditMode"
                                class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm/6" />
                        </div>
                    </div>

                    <!-- CNIC -->
                    <div class="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                        <label for="cnic" class="block text-sm/6 font-medium text-gray-900 sm:pt-1.5">CNIC</label>
                        <div class="mt-2 sm:col-span-2 sm:mt-0">
                            <input type="text" id="cnic" v-model="form.cnic" :disabled="!isEditMode"
                                class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm/6" />
                        </div>
                    </div>

                    <!-- CNIC Issuance Date -->
                    <div class="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                        <label for="cnic_issuance_date" class="block text-sm/6 font-medium text-gray-900 sm:pt-1.5">CNIC
                            Issuance Date</label>
                        <div class="mt-2 sm:col-span-2 sm:mt-0">
                            <input type="date" id="cnic_issuance_date" v-model="form.cnic_issuance_date"
                                :disabled="!isEditMode"
                                class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm/6" />
                        </div>
                    </div>

                    <!-- Wallet ID -->
                    <div class="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                        <label for="wallet_id" class="block text-sm/6 font-medium text-gray-900 sm:pt-1.5">Wallet
                            ID</label>
                        <div class="mt-2 sm:col-span-2 sm:mt-0">
                            <input type="text" id="wallet_id" v-model="form.wallet_id" :disabled="!isEditMode"
                                class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm/6" />
                        </div>
                    </div>

                    <!-- Shipper name -->
                    <div class="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                        <label for="shipper_name" class="block text-sm/6 font-medium text-gray-900 sm:pt-1.5">Shipper
                            Name</label>
                        <div class="mt-2 sm:col-span-2 sm:mt-0">
                            <input type="text" id="shipper_name" v-model="form.shipper_name" :disabled="!isEditMode"
                                class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm/6" />
                        </div>
                    </div>

                    <!-- Shipper ID -->
                    <div class="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                        <label for="shipper_id" class="block text-sm/6 font-medium text-gray-900 sm:pt-1.5">Shipper
                            ID</label>
                        <div class="mt-2 sm:col-span-2 sm:mt-0">
                            <input type="text" id="shipper_id" v-model="form.shipper_id" :disabled="!isEditMode"
                                class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm/6" />
                        </div>
                    </div>

                    <!-- Mobile Number -->
                    <div class="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                        <label for="mobile_no" class="block text-sm/6 font-medium text-gray-900 sm:pt-1.5">Mobile
                            Number</label>
                        <div class="mt-2 sm:col-span-2 sm:mt-0">
                            <input type="text" id="mobile_no" v-model="form.mobile_no" :disabled="!isEditMode"
                                class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm/6" />
                        </div>
                    </div>

                    <!-- Email -->
                    <div class="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                        <label for="email" class="block text-sm/6 font-medium text-gray-900 sm:pt-1.5">Email</label>
                        <div class="mt-2 sm:col-span-2 sm:mt-0">
                            <input type="email" id="email" v-model="form.email" :disabled="!isEditMode"
                                class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm/6" />
                        </div>
                    </div>

                    <!-- Father Name -->
                    <div class="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                        <label for="father_name" class="block text-sm/6 font-medium text-gray-900 sm:pt-1.5">Father
                            Name</label>
                        <div class="mt-2 sm:col-span-2 sm:mt-0">
                            <input type="text" id="father_name" v-model="form.father_name" :disabled="!isEditMode"
                                class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm/6" />
                        </div>
                    </div>

                    <!-- Mother Name -->
                    <div class="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                        <label for="mother_name" class="block text-sm/6 font-medium text-gray-900 sm:pt-1.5">Mother
                            Name</label>
                        <div class="mt-2 sm:col-span-2 sm:mt-0">
                            <input type="text" id="mother_name" v-model="form.mother_name" :disabled="!isEditMode"
                                class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm/6" />
                        </div>
                    </div>

                    <!-- Address -->
                    <div class="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                        <label for="address" class="block text-sm/6 font-medium text-gray-900 sm:pt-1.5">Address</label>
                        <div class="mt-2 sm:col-span-2 sm:mt-0">
                            <textarea id="address" v-model="form.address" :disabled="!isEditMode"
                                class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm/6"></textarea>
                        </div>
                    </div>

                    <!-- City -->
                    <div class="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                        <label for="city" class="block text-sm/6 font-medium text-gray-900 sm:pt-1.5">City</label>
                        <div class="mt-2 sm:col-span-2 sm:mt-0">
                            <input type="text" id="city" v-model="form.city" :disabled="!isEditMode"
                                class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm/6" />
                        </div>
                    </div>

                    <!-- Date of Birth -->
                    <div class="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                        <label for="dob" class="block text-sm/6 font-medium text-gray-900 sm:pt-1.5">Date of
                            Birth</label>
                        <div class="mt-2 sm:col-span-2 sm:mt-0">
                            <input type="date" id="dob" v-model="form.dob" :disabled="!isEditMode"
                                class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm/6" />
                        </div>
                    </div>

                    <div class="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                        <label for="cnic_front_image" class="block text-sm/6 font-medium text-gray-900 sm:pt-1.5">
                            CNIC Front Image
                        </label>
                        <div v-if="isEditMode" class="mt-2 sm:col-span-2 sm:mt-0">
                            <input type="file" id="cnic_front_image"
                                @change="handleFileUpload('cnic_front_image', $event)" :disabled="!isEditMode"
                                class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm/6" />
                        </div>

                        <div v-if="!isEditMode" class="mt-2 sm:col-span-2 sm:mt-0">
                            <img :src="form.cnic_front_image" alt="CNIC Front"
                                class="w-auto h-32 object-cover rounded shadow" />
                        </div>
                    </div>

                    <div class="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                        <label for="cnic_back_image" class="block text-sm/6 font-medium text-gray-900 sm:pt-1.5">
                            CNIC Back Image
                        </label>
                        <div v-if="isEditMode" class="mt-2 sm:col-span-2 sm:mt-0">
                            <input type="file" id="cnic_back_image"
                                @change="handleFileUpload('cnic_back_image', $event)" :disabled="!isEditMode"
                                class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm/6" />
                        </div>
                        <div v-if="!isEditMode" class="mt-2 sm:col-span-2 sm:mt-0">
                            <img :src="form.cnic_back_image" alt="CNIC Front"
                                class="w-auto h-32 object-cover rounded shadow" />
                        </div>
                    </div>

                </div>
            </div>
        </div>

        <div class="mt-6 flex items-center justify-end gap-x-6">
            <button v-if="!isEditMode" type="button" class="text-sm font-semibold text-gray-900" @click="handleCancel">
                Cancel
            </button>
            <button v-if="isEditMode" type="submit" class="bg-green-500 text-white px-4 py-2 rounded">
                Save
            </button>
        </div>
    </form>


</template>