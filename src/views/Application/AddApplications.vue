<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { Combobox, ComboboxInput, ComboboxOptions, ComboboxOption, ComboboxButton } from '@headlessui/vue';
import { ChevronUpDownIcon, CheckIcon } from '@heroicons/vue/20/solid';
import axios from 'axios';
import { showMessageAlert } from '../../utils/alert';
import API from '../../utils/baseApi';

const applicants = ref([]);
const products = ref([]);
const plans = ref([]);
const applicantQuery = ref('');
const productQuery = ref('');
const planQuery = ref('');
const amount = ref('');
const selectedApplicant = ref(null);
const selectedProduct = ref(null);
const selectedPlan = ref(null);
const creditScore = ref(null);
const loadingApplicants = ref(false);
const loadingApplicantDetail = ref(false);
const isCalculating = ref(false);
const isApplying = ref(false);
const calculationResult = ref(null);
const showCalculationModal = ref(false);
let applicantSearchTimeout;
const router = useRouter();

const filteredApplicants = computed(() => {
    if (!applicantQuery.value) return applicants.value;
    const q = applicantQuery.value.toLowerCase();
    return applicants.value.filter((a) =>
        [a.first_name, a.last_name, a.email, a.mobile_no].some((field) =>
            field?.toLowerCase().includes(q)
        )
    );
});

const filteredProducts = computed(() => {
    const q = productQuery.value.toLowerCase();
    return products.value.filter((p) =>
        [p.name, p.code]?.some((field) => field?.toLowerCase().includes(q))
    );
});

const filteredPlans = computed(() => {
    const q = planQuery.value.toLowerCase();
    return plans.value.filter((p) => p.name?.toLowerCase().includes(q));
});

const selectApplicant = async (applicant) => {
    selectedApplicant.value = applicant;
    products.value = [];
    plans.value = [];
    selectedProduct.value = null;
    selectedPlan.value = null;
    creditScore.value = null;
    if (applicant?.id) {
        await fetchApplicantDetail(applicant.id);
    }
};

const selectProduct = (product) => {
    selectedProduct.value = product;
    plans.value = product?.plans || [];
    selectedPlan.value = null;
    planQuery.value = '';
};

const handleApply = async () => {
    if (!selectedApplicant.value || !selectedProduct.value || !selectedPlan.value || !amount.value) {
        showMessageAlert({ message: 'Select an applicant, product, plan and amount before applying.', type: 'warning' });
        return;
    }
    const numericAmount = Number(amount.value);
    const limit = creditScore.value
    const availableLimit = Number(limit?.available_limit ?? 0);

    if (numericAmount > availableLimit) {
        showMessageAlert({ message: `Amount cannot exceed available limit of ${availableLimit}.`, type: 'warning' });
        return;
    }

    const payload = {
        loan_amount: numericAmount,
        plan_id: selectedPlan.value.id,
        product_id: selectedProduct.value.id,
        applicant_id: selectedApplicant.value.id,
    };

    try {
        isCalculating.value = true;
        const response = await axios.post(API.APPLICATIONS_CALCULATE, payload);
        calculationResult.value = response.data;
        showCalculationModal.value = true;
    } catch (error) {
        console.error('Error calculating application:', error?.response?.data || error.message);
        const message = error?.response?.data?.message || 'Unable to calculate application.';
        showMessageAlert({ message, type: 'error' });
    } finally {
        isCalculating.value = false;
    }
};

const confirmInitiate = async () => {
    if (!calculationResult.value) return;
    const payload = {
        loan_amount: Number(amount.value),
        plan_id: selectedPlan.value.id,
        product_id: selectedProduct.value.id,
        applicant_id: selectedApplicant.value.id,
    };
    try {
        isApplying.value = true;
        const response = await axios.post(API.APPLICATIONS_INITIATE, payload);
        const message = response.data?.message || 'Application initiated successfully.';
        showMessageAlert({ message, type: 'success' });
        showCalculationModal.value = false;
        router.push('/dashboard/applications');
    } catch (error) {
        console.error('Error initiating application:', error?.response?.data || error.message);
        const message = error?.response?.data?.message || 'Unable to initiate application.';
        showMessageAlert({ message, type: 'error' });
    } finally {
        isApplying.value = false;
    }
};

const fetchApplicantData = async (search = '') => {
    loadingApplicants.value = true;
    try {
        const params = {
            pagination: true,
            page: 1,
            per_page: 10,
            search: search.trim(),
            sort_field: 'applicants.id',
            sort_order: 'DESC'
        };

        const response = await axios.get(API.APPLICANTS, { params });
        const { data } = response.data;
        applicants.value = data || [];
    } catch (error) {
        console.error('Error fetching applicants:', error?.response?.data || error.message);
        showMessageAlert({ message: 'Unable to load applicants.', type: 'error' });
    } finally {
        loadingApplicants.value = false;
    }
};

const fetchApplicantDetail = async (applicantId) => {
    loadingApplicantDetail.value = true;
    try {
        const response = await axios.get(`${API.APPLICANTS}${applicantId}`);
        const detail = response.data?.data || response.data;
        selectedApplicant.value = detail || selectedApplicant.value;
        products.value = detail?.products || [];
        plans.value = [];
        creditScore.value = detail?.credit_limit || null;
    } catch (error) {
        console.error('Error fetching applicant detail:', error?.response?.data || error.message);
        showMessageAlert({ message: 'Unable to load applicant details.', type: 'error' });
    } finally {
        loadingApplicantDetail.value = false;
    }
};

watch(applicantQuery, (newQuery) => {
    if (applicantSearchTimeout) clearTimeout(applicantSearchTimeout);
    applicantSearchTimeout = setTimeout(() => fetchApplicantData(newQuery), 300);
});

onMounted(() => {
    fetchApplicantData();
});

</script>

<template>
    <div class="">
        <div class="rounded-2xl p-6 shadow-xl shadow-black/50">
            <h2 class="text-lg font-semibold text-black">Add Transaction</h2>
            <p class="text-sm text-black">Select an applicant, review credit, then choose a product.</p>

            <div class="mt-6 space-y-6">
                <div>
                    <label class="block text-sm font-medium text-black">Applicant</label>
                    <Combobox v-model="selectedApplicant" @update:modelValue="selectApplicant">
                        <div class="relative mt-2 w-80">
                            <div
                                class="relative cursor-default overflow-hidden rounded-xl border border-slate-700 bg-slate-900/70 text-left shadow-inner shadow-black/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/40 sm:text-sm">
                                <ComboboxInput
                                    class="w-full border-none bg-transparent py-2 pl-3 pr-10 text-sm text-white placeholder:text-white focus:ring-0"
                                    placeholder="Search applicants by name"
                                    :displayValue="(app) => app ? `${app.first_name} ${app.last_name}` : ''"
                                    @change="applicantQuery = $event.target.value" />
                                <ComboboxButton class="absolute inset-y-0 right-0 flex items-center pr-2 text-white">
                                    <ChevronUpDownIcon class="h-5 w-5" aria-hidden="true" />
                                </ComboboxButton>
                            </div>
                            <ComboboxOptions
                                class="absolute z-20 mt-2 max-h-56 w-full overflow-auto rounded-xl border border-slate-800 bg-slate-900/95 py-1 shadow-xl shadow-black/40 focus:outline-none">
                                <div v-if="loadingApplicants"
                                    class="cursor-default select-none px-4 py-2 text-sm text-slate-200">
                                    Loading applicants...
                                </div>
                                <div v-else-if="!filteredApplicants.length"
                                    class="cursor-default select-none px-4 py-2 text-sm text-black">
                                    No applicants found.
                                </div>
                                <ComboboxOption v-for="applicant in filteredApplicants" :key="applicant.id"
                                    :value="applicant" v-slot="{ active, selected }">
                                    <div :class="[
                                        'flex w-full items-center justify-between px-3 py-2 text-sm',
                                        active ? 'bg-slate-800 text-slate-100' : 'text-slate-200'
                                    ]">
                                        <div>
                                            <p class="font-semibold">{{ applicant.first_name }} {{ applicant.last_name
                                            }}</p>
                                            <p class="text-xs text-slate-400">{{ applicant.email }} - {{
                                                applicant.mobile_no }}</p>
                                        </div>
                                        <CheckIcon v-if="selected" class="h-5 w-5 text-emerald-400"
                                            aria-hidden="true" />
                                    </div>
                                </ComboboxOption>
                            </ComboboxOptions>
                        </div>
                    </Combobox>
                </div>

                <div v-if="selectedApplicant"
                    class="rounded-xl w-80 border border-slate-800 bg-slate-900/70 px-4 py-3 shadow-inner shadow-black/30">
                    <div class="flex  items-center justify-between">
                        <div>
                            <p class="text-sm text-white">Credit Limit</p>
                            <p class="text-2xl font-semibold text-slate-50">
                                {{ creditScore?.credit_limit ?? '--' }}
                            </p>
                        </div>
                        <div v-if="creditScore?.status"
                            class="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-300">
                            {{ creditScore.status }}
                        </div>
                    </div>
                    <div class="mt-2 flex items-center justify-between text-sm text-slate-300">
                        <span>Available Credit Limit</span>
                        <span class="font-semibold text-slate-100">
                            {{ creditScore?.available_limit ? creditScore.available_limit.toLocaleString() : '--' }}
                        </span>
                    </div>
                </div>

                <div v-if="selectedApplicant">
                    <label class="block text-sm font-medium text-black">Product</label>
                    <Combobox v-model="selectedProduct" :disabled="!selectedApplicant"
                        @update:modelValue="selectProduct">
                        <div class="relative mt-2 w-80">
                            <div :class="[
                                'relative w-full cursor-default overflow-hidden rounded-xl border px-3 py-2 text-left shadow-inner focus:outline-none sm:text-sm',
                                selectedApplicant ? 'border-slate-700 bg-slate-900/70 text-white shadow-black/30' : 'border-slate-800 bg-slate-900/50 text-slate-500'
                            ]">
                                <ComboboxInput
                                    class="w-full border-none bg-transparent py-1.5 pr-10 text-sm focus:ring-0 placeholder:text-white"
                                    placeholder="Search products"
                                    :displayValue="(prod) => prod ? (prod.name || prod.code) : ''"
                                    :disabled="!selectedApplicant" @change="productQuery = $event.target.value" />
                                <ComboboxButton
                                    class="absolute inset-y-0 right-0 flex items-center pr-2 text-slate-400">
                                    <ChevronUpDownIcon class="h-5 w-5" aria-hidden="true" />
                                </ComboboxButton>
                            </div>
                            <ComboboxOptions v-if="selectedApplicant"
                                class="absolute z-20 mt-2 max-h-56 w-full overflow-auto rounded-xl border border-slate-800 bg-slate-900/95 py-1 shadow-xl shadow-black/40 focus:outline-none">
                                <div v-if="!filteredProducts.length"
                                    class="cursor-default select-none px-4 py-2 text-sm text-slate-400">
                                    No products found.
                                </div>
                                <ComboboxOption v-for="product in filteredProducts" :key="product.id" :value="product"
                                    v-slot="{ active, selected }">
                                    <div :class="[
                                        'flex w-full items-center justify-between px-3 py-2 text-sm',
                                        active ? 'bg-slate-800 text-slate-100' : 'text-slate-200'
                                    ]">
                                        <div>
                                            <p class="font-semibold">{{ product.name || product.code }}</p>
                                            <p class="text-xs text-slate-400">{{ product.code }}</p>
                                        </div>
                                        <CheckIcon v-if="selected" class="h-5 w-5 text-emerald-400"
                                            aria-hidden="true" />
                                    </div>
                                </ComboboxOption>
                            </ComboboxOptions>
                        </div>
                    </Combobox>
                </div>

                <div v-if="selectedProduct">
                    <label class="block text-sm font-medium text-black">Plan</label>
                    <Combobox v-model="selectedPlan" :disabled="!selectedProduct">
                        <div class="relative mt-2 w-80">
                            <div :class="[
                                'relative w-full cursor-default overflow-hidden rounded-xl border px-3 py-2 text-left shadow-inner focus:outline-none sm:text-sm',
                                selectedProduct ? 'border-slate-700 bg-slate-900/70 text-white shadow-black/30' : 'border-slate-800 bg-slate-900/50 text-slate-500'
                            ]">
                                <ComboboxInput
                                    class="w-full border-none bg-transparent py-1.5 pr-10 text-sm focus:ring-0 placeholder:text-white"
                                    placeholder="Search plans" :displayValue="(plan) => plan ? plan.name : ''"
                                    :disabled="!selectedProduct" @change="planQuery = $event.target.value" />
                                <ComboboxButton
                                    class="absolute inset-y-0 right-0 flex items-center pr-2 text-slate-400">
                                    <ChevronUpDownIcon class="h-5 w-5" aria-hidden="true" />
                                </ComboboxButton>
                            </div>
                            <ComboboxOptions v-if="selectedProduct"
                                class="absolute z-20 mt-2 max-h-56 w-full overflow-auto rounded-xl border border-slate-800 bg-slate-900/95 py-1 shadow-xl shadow-black/40 focus:outline-none">
                                <div v-if="!filteredPlans.length"
                                    class="cursor-default select-none px-4 py-2 text-sm text-slate-400">
                                    No plans found.
                                </div>
                                <ComboboxOption v-for="plan in filteredPlans" :key="plan.id" :value="plan"
                                    v-slot="{ active, selected }">
                                    <div :class="[
                                        'flex w-full items-center justify-between px-3 py-2 text-sm',
                                        active ? 'bg-slate-800 text-slate-100' : 'text-slate-200'
                                    ]">
                                        <div>
                                            <p class="font-semibold">{{ plan.name }}</p>
                                            <p class="text-xs text-slate-400">{{ plan.duration_value }} {{
                                                plan.duration_unit }}</p>
                                        </div>
                                        <CheckIcon v-if="selected" class="h-5 w-5 text-emerald-400"
                                            aria-hidden="true" />
                                    </div>
                                </ComboboxOption>
                            </ComboboxOptions>
                        </div>
                    </Combobox>
                </div>

                <div v-if="selectedPlan" class="w-80">
                    <label class="block text-sm font-medium text-black">Amount</label>
                    <input v-model="amount" type="number" min="0"
                        class="mt-2 w-full rounded-xl border border-slate-700 bg-slate-900/70 px-3 py-2 text-sm text-white placeholder:text-white shadow-inner shadow-black/30 focus:outline-none focus:ring-2 focus:ring-emerald-400/40"
                        placeholder="Enter amount" />
                </div>
            </div>

            <div class="mt-8 flex justify-end">
                <button type="button"
                    class="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-emerald-500/30 hover:from-emerald-500 hover:to-emerald-600 disabled:opacity-50"
                    :disabled="!selectedApplicant || !selectedProduct || !selectedPlan || !amount || isApplying || isCalculating"
                    @click="handleApply">
                    {{ isCalculating ? 'Calculating...' : isApplying ? 'Applying...' : 'Apply' }}
                </button>
            </div>
        </div>
    </div>

    <div v-if="showCalculationModal"
        class="fixed inset-0 z-40 flex items-center justify-center bg-black/60 px-4 py-6 backdrop-blur">
        <div class="w-full max-w-3xl rounded-2xl bg-white p-6 shadow-2xl">
            <div class="flex items-start justify-between">
                <div>
                    <h3 class="text-lg font-semibold text-gray-900">Application Summary</h3>
                    <p class="text-sm text-gray-600">{{ calculationResult?.message }}</p>
                </div>
                <button class="text-gray-500 hover:text-gray-700" @click="showCalculationModal = false">✕</button>
            </div>

            <div class="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
                <div class="rounded-lg border border-gray-200 p-4">
                    <p class="text-sm text-gray-500">Requested</p>
                    <p class="text-xl font-semibold text-gray-900">{{ calculationResult?.loan_amount }}</p>
                </div>
                <div class="rounded-lg border border-gray-200 p-4">
                    <p class="text-sm text-gray-500">Approved</p>
                    <p class="text-xl font-semibold text-gray-900">{{ calculationResult?.approved_amount }}</p>
                </div>
                <div class="rounded-lg border border-gray-200 p-4">
                    <p class="text-sm text-gray-500">Disbursed</p>
                    <p class="text-xl font-semibold text-gray-900">{{ calculationResult?.disbursed_amount }}</p>
                </div>
            </div>

            <div class="mt-6">
                <h4 class="text-sm font-semibold text-gray-800">Charges (Total: {{ calculationResult?.total_charges }})
                </h4>
                <div class="mt-2 space-y-2 rounded-lg border border-gray-200 p-3 max-h-40 overflow-auto">
                    <div v-if="!calculationResult?.charges?.length" class="text-sm text-gray-500">No charges.</div>
                    <div v-for="(charge, idx) in calculationResult?.charges || []" :key="idx"
                        class="flex items-center justify-between text-sm text-gray-700">
                        <span>{{ charge.charge_condition || 'Charge' }}</span>
                        <span class="font-semibold">{{ charge.charge_amount }}</span>
                    </div>
                </div>
            </div>

            <div class="mt-6">
                <h4 class="text-sm font-semibold text-gray-800">Installments</h4>
                <div class="mt-2 max-h-56 overflow-auto rounded-lg border border-gray-200">
                    <table class="min-w-full text-sm text-gray-800">
                        <thead class="bg-gray-50 text-left">
                            <tr>
                                <th class="px-3 py-2 font-semibold">Amount</th>
                                <th class="px-3 py-2 font-semibold">Due Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(inst, idx) in calculationResult?.installments || []" :key="idx"
                                class="border-t">
                                <td class="px-3 py-2">{{ inst.amount }}</td>
                                <td class="px-3 py-2">{{ inst.due_date }}</td>
                            </tr>
                            <tr v-if="!calculationResult?.installments?.length">
                                <td colspan="2" class="px-3 py-2 text-gray-500">No installments.</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div class="mt-6 flex justify-end gap-3">
                <button type="button"
                    class="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100"
                    @click="showCalculationModal = false">
                    Cancel
                </button>
                <button type="button"
                    class="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-emerald-500/30 disabled:opacity-50"
                    :disabled="isApplying" @click="confirmInitiate">
                    {{ isApplying ? 'Confirming...' : 'Confirm & Apply' }}
                </button>
            </div>
        </div>
    </div>
</template>
