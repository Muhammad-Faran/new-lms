<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import { showMessageAlert } from '../../utils/alert';
import API from '../../utils/baseApi';

const route = useRoute();
const router = useRouter();

const form = reactive({
    selectedProducts: [], // Stores selected products for sync
    applicant: {
        name: ''
    },
    productRules: {}, // Stores applicant-specific rules for charges
    order_threshold: '',
    fixed_threshold_charges: ''
});

const ApplicantData = window.history.state?.ApplicantData;

if (ApplicantData) {
    const data = JSON.parse(ApplicantData);
    form.applicant = { ...data, name: `${data.first_name} ${data.last_name}` };

    // Pre-fill selected products and applicant product rules
    form.selectedProducts = data.products.map(product => product.id);
    form.productRules = data.products.reduce((acc, product) => {
        acc[product.id] = {
            enabled: product.charge_unit !== null,
            charge_unit: product.charge_unit,
            charge_value: product.charge_value,
        };
        return acc;
    }, {});

    if (data.applicant_threshold) {
        form.order_threshold = data.applicant_threshold?.order_threshold || ''
        form.fixed_threshold_charges = data.applicant_threshold?.fixed_threshold_charges || ''
    }
}

const productListing = ref([]);
const loading = ref(false);
const loadingFetch = ref(false);

// Fetch available products
const fetchProducts = async () => {
    loadingFetch.value = true;
    try {
        const response = await axios.get(API.PRODUCTS);
        productListing.value = response.data.data.filter((item) => item.status === 1);
    } catch (error) {
        console.error('Error fetching product:', error);
    } finally {
        loadingFetch.value = false;
    }
};

// Handle applicant rule toggle
const toggleApplicantRule = (productId) => {
    if (!form.productRules[productId]) {
        form.productRules[productId] = { enabled: true, charge_unit: null, charge_value: null };
    } else {
        form.productRules[productId].enabled = !form.productRules[productId].enabled;
    }
};

// Handle form submission
const handleSubmit = async () => {
    try {
        loading.value = true;

        // Prepare payload with product rules
        const payload = {
            product_ids: productListing.value
                .filter(product => form.selectedProducts.includes(product.id))
                .map(product => ({
                    id: product.id,
                    charge_unit: form.productRules[product.id]?.enabled ? form.productRules[product.id]?.charge_unit : null,
                    charge_value: form.productRules[product.id]?.enabled ? form.productRules[product.id]?.charge_value : null,
                })),
            order_threshold: form.order_threshold,
            fixed_threshold_charges: form.fixed_threshold_charges
        };

        await axios.post(API.APPLICANTS_PRODUCTS_SYNC.replace('{applicant}', route.params.id), payload);
        showMessageAlert({ message: 'Successfully synced products', type: 'success' });
        router.push('/dashboard/applicants');
    } catch (error) {
        showMessageAlert({ message: error.response?.data?.message || 'Something went wrong', type: 'error' });
        console.error('Error syncing products:', error);
    } finally {
        loading.value = false;
    }
};

const handleCancel = () => {
    router.push('/dashboard/applicants');
};

onMounted(() => {
    fetchProducts();
});
</script>

---

### **Template Section**

```html
<template>
    <form @submit.prevent="handleSubmit">
        <div class="space-y-12 sm:space-y-16" v-loading="loadingFetch">
            <div>
                <h2 class="text-base/7 font-semibold text-gray-900">Sync Applicant Products</h2>
                <div
                    class="mt-10 space-y-8 border-b border-gray-900/10 pb-12 sm:space-y-0 sm:divide-y sm:divide-gray-900/10 sm:border-t sm:pb-0">
                    <div class="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                        <label for="slug" class="block text-sm/6 font-medium text-gray-900 sm:pt-1.5">
                            Applicant Name
                        </label>
                        <div class="mt-2 sm:col-span-2 sm:mt-0">
                            <input type="text" id="slug" v-model="form.applicant.name" disabled
                                class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm/6" />
                        </div>
                    </div>
                    <div class="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                        <label for="slug" class="block text-sm/6 font-medium text-gray-900 sm:pt-1.5">
                            Order Threshold
                        </label>
                        <div class="mt-2 sm:col-span-2 sm:mt-0">
                            <input type="text" id="order_threshold" v-model="form.order_threshold"
                                class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm/6" />
                        </div>
                    </div>
                    <div class="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                        <label for="slug" class="block text-sm/6 font-medium text-gray-900 sm:pt-1.5">
                            Fixed Threshold Charges
                        </label>
                        <div class="mt-2 sm:col-span-2 sm:mt-0">
                            <input type="text" id="fixed_threshold_charges" v-model="form.fixed_threshold_charges"
                                class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm/6" />
                        </div>
                    </div>
                </div>
            </div>

            <div class="mt-8">
                <h3 class="text-base/7 font-semibold text-gray-900">Select Products and Define Charges</h3>
                <div class="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    <div v-for="product in productListing" :key="product.id" class="border p-4 rounded-md">
                        <input type="checkbox" :id="`product-${product.id}`" :value="product.id"
                            v-model="form.selectedProducts"
                            class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
                        <label :for="`product-${product.id}`" class="ml-3 text-sm font-medium text-gray-700">
                            {{ product.name }}
                        </label>

                        <!-- Display existing charge -->
                        <p class="text-sm mt-2 text-gray-600 flex items-center">
                            <strong class="mr-2">Current Charge:</strong>
                            <span
                                v-if="product.product_tiers.length && product.product_tiers[0].product_tier_charges.length"
                                class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium 
                                       bg-blue-100 text-blue-800 border border-blue-300">
                                {{ product.product_tiers[0].product_tier_charges[0]?.charges_value || 0 }}
                                <span
                                    v-if="product.product_tiers[0].product_tier_charges[0]?.charges_unit === 'percentage'">&nbsp;%</span>
                                <span
                                    v-else-if="product.product_tiers[0].product_tier_charges[0]?.charges_unit === 'fixed'">&nbsp;(Fixed)</span>
                            </span>
                            <span v-else class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium 
                                       bg-gray-100 text-gray-800 border border-gray-300">
                                N/A
                            </span>
                        </p>


                        <!-- Applicant rule toggle -->
                        <div class="mt-2">
                            <label class="text-sm font-semibold text-gray-700 flex items-center">
                                <input type="checkbox" @change="toggleApplicantRule(product.id)"
                                    :checked="form.productRules[product.id]?.enabled"
                                    class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded mr-2" />
                                Apply Applicant Rule
                            </label>
                        </div>

                        <!-- Applicant Rule Inputs -->
                        <div v-if="form.productRules[product.id]?.enabled" class="mt-2">
                            <label class="text-sm text-gray-700">Charge Unit</label>
                            <select v-model="form.productRules[product.id].charge_unit"
                                class="block w-full rounded-md border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 text-sm">
                                <option value="" disabled>Select Charge Unit</option>
                                <option value="percentage">Percentage</option>
                                <option value="fixed">Fixed</option>
                            </select>

                            <label class="text-sm text-gray-700 mt-2">Charge Value</label>
                            <input type="number" v-model="form.productRules[product.id].charge_value" min="0"
                                step="0.01"
                                class="block w-full rounded-md border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 text-sm mt-1"
                                placeholder="Enter charge value" />

                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="mt-6 flex items-center justify-end gap-x-6">
            <button type="button" class="text-sm/6 font-semibold text-gray-900" @click="handleCancel">Cancel</button>
            <button type="submit" v-loading="loading"
                class="inline-flex justify-center rounded-md bg-[#75ba2c] px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                Sync
            </button>
        </div>
    </form>
</template>
