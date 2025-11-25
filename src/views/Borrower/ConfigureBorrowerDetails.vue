<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import { showMessageAlert } from '../../utils/alert';
import API from '../../utils/baseApi';

const route = useRoute();
const router = useRouter();

const form = reactive({
    borrower: {
        name: '',
        credit_limit: null,
        financing_percentage: null,
    },
    selectedProducts: [],
    productRules: {},
    order_threshold: '',
    fixed_threshold_charges: '',
});

const BorrowerData = window.history.state?.BorrowerData;

if (BorrowerData) {
    const data = JSON.parse(BorrowerData);

    form.borrower = {
        ...data,
        name: `${data.first_name} ${data.last_name}`,
        credit_limit: data.credit_limit ? parseFloat(data.credit_limit.credit_limit) : null,
        financing_percentage: data.financing_policy ? parseFloat(data.financing_policy.financing_percentage) : null,
    };

    form.selectedProducts = data.products.map((product) => product.id);
    form.productRules = data.products.reduce((acc, product) => {
        acc[product.id] = {
            enabled: product.charge_unit !== null,
            charge_unit: product.charge_unit,
            charge_value: product.charge_value,
        };
        return acc;
    }, {});

    if (data.borrower_threshold) {
        form.order_threshold = data.borrower_threshold?.order_threshold || '';
        form.fixed_threshold_charges = data.borrower_threshold?.fixed_threshold_charges || '';
    }
}

const productListing = ref([]);
const loading = ref(false);
const loadingFetch = ref(false);

const fetchProducts = async () => {
    loadingFetch.value = true;
    try {
        const response = await axios.get(API.PRODUCTS);
        productListing.value = response.data.data.filter((item) => item.status === 1);
    } catch (error) {
        console.error('Error fetching products:', error);
    } finally {
        loadingFetch.value = false;
    }
};

const toggleBorrowerRule = (productId) => {
    if (!form.productRules[productId]) {
        form.productRules[productId] = { enabled: true, charge_unit: null, charge_value: null };
    } else {
        form.productRules[productId].enabled = !form.productRules[productId].enabled;
    }
};

const handleSubmit = async () => {
    try {
        loading.value = true;

        // Prepare payload for credit limit assignment
        const creditLimitPayload = {
            credit_limit: form.borrower.credit_limit,
        };
        await axios.post(API.BORROWERS_ASSIGN_CREDIT_LIMIT.replace('{borrower}', route.params.id), creditLimitPayload);

        // Prepare payload for financing policy assignment
        const financingPolicyPayload = {
            financing_percentage: form.borrower.financing_percentage,
        };
        await axios.post(API.BORROWERS_ASSIGN_FINANCING_POLICY.replace('{borrower}', route.params.id), financingPolicyPayload);

        // Prepare payload for syncing borrower products
        const syncProductsPayload = {
            product_ids: productListing.value
                .filter((product) => form.selectedProducts.includes(product.id))
                .map((product) => ({
                    id: product.id,
                    charge_unit: form.productRules[product.id]?.enabled ? form.productRules[product.id]?.charge_unit : null,
                    charge_value: form.productRules[product.id]?.enabled ? form.productRules[product.id]?.charge_value : null,
                })),
            order_threshold: form.order_threshold,
            fixed_threshold_charges: form.fixed_threshold_charges,
        };
        await axios.post(API.BORROWERS_PRODUCTS_SYNC.replace('{borrower}', route.params.id), syncProductsPayload);

        showMessageAlert({ message: 'Details saved successfully', type: 'success' });
        router.push('/dashboard/borrowers');
    } catch (error) {
        showMessageAlert({ message: error.response?.data?.message || 'Something went wrong', type: 'error' });
        console.error('Error saving borrower details:', error);
    } finally {
        loading.value = false;
    }
};

const handleCancel = () => {
    router.push('/dashboard/borrowers');
};

onMounted(() => {
    fetchProducts();
});
</script>

<template>
    <form @submit.prevent="handleSubmit">
        <div class="space-y-12 sm:space-y-16" v-loading="loading">
            <!-- Borrower Details Section -->
            <div>
                <h2 class="text-base/7 font-semibold text-gray-900">Configure Borrower Details</h2>
                <div
                    class="mt-10 space-y-8 border-b border-gray-900/10 pb-12 sm:space-y-0 sm:divide-y sm:divide-gray-900/10 sm:border-t sm:pb-0">
                    <div class="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                        <label for="borrower-name" class="block text-sm/6 font-medium text-gray-900 sm:pt-1.5">Borrower
                            Name</label>
                        <div class="mt-2 sm:col-span-2 sm:mt-0">
                            <input type="text" id="borrower-name" v-model="form.borrower.name" disabled
                                class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm/6" />
                        </div>
                    </div>

                    <!-- Credit Limit Section -->
                    <div class="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                        <label for="credit-limit" class="block text-sm/6 font-medium text-gray-900 sm:pt-1.5">Credit
                            Limit</label>
                        <div class="mt-2 sm:col-span-2 sm:mt-0">
                            <input type="number" id="credit-limit" v-model="form.borrower.credit_limit"
                                placeholder="Enter credit limit"
                                class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm/6" />
                        </div>
                    </div>

                    <!-- Financing Policy Section -->
                    <div class="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                        <label for="financing-policy"
                            class="block text-sm/6 font-medium text-gray-900 sm:pt-1.5">Financing Percentage (%)</label>
                        <div class="mt-2 sm:col-span-2 sm:mt-0">
                            <input type="number" id="financing-policy" v-model="form.borrower.financing_percentage"
                                placeholder="Enter financing policy"
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

            <!-- Product Sync Section -->
            <div class="mt-8">
                <h3 class="text-base/7 font-semibold text-gray-900">Select Products and Define Charges</h3>
                <div class="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    <div v-for="product in productListing" :key="product.id" class="border p-4 rounded-md">
                        <input type="checkbox" :id="`product-${product.id}`" :value="product.id"
                            v-model="form.selectedProducts"
                            class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
                        <label :for="`product-${product.id}`" class="ml-3 text-sm font-medium text-gray-700">{{
                            product.name }}</label>

                        <!-- Display existing charge -->
                        <p class="text-sm mt-2 text-gray-600 flex items-center">
                            <strong class="mr-2">Current Charge:</strong>
                            <span
                                v-if="product.product_tiers.length && product.product_tiers[0].product_tier_charges.length"
                                class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-300">
                                {{ product.product_tiers[0].product_tier_charges[0]?.charges_value || 0 }}
                                <span
                                    v-if="product.product_tiers[0].product_tier_charges[0]?.charges_unit === 'percentage'">&nbsp;%</span>
                                <span
                                    v-else-if="product.product_tiers[0].product_tier_charges[0]?.charges_unit === 'fixed'">&nbsp;(Fixed)</span>
                            </span>
                            <span v-else
                                class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-300">
                                N/A
                            </span>
                        </p>

                        <!-- Borrower rule toggle -->
                        <div class="mt-2">
                            <label class="text-sm font-semibold text-gray-700 flex items-center">
                                <input type="checkbox" @change="toggleBorrowerRule(product.id)"
                                    :checked="form.productRules[product.id]?.enabled"
                                    class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded mr-2" />
                                Apply Borrower Rule
                            </label>
                        </div>

                        <!-- Borrower Rule Inputs -->
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

        <!-- Actions -->
        <div class="mt-6 flex items-center justify-end gap-x-6">
            <button type="button" class="text-sm/6 font-semibold text-gray-900" @click="handleCancel">Cancel</button>
            <button type="submit" v-loading="loading"
                class="inline-flex justify-center rounded-md bg-[#75ba2c] px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                Save
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
