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
const applicantLoanDetail = ref(null);
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
    applicantLoanDetail.value = null;
    if (applicant?.id) {
        await fetchApplicantLoanDetail(applicant.id);
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

const fetchApplicantLoanDetail = async (applicantId) => {
    loadingApplicantDetail.value = true;
    try {
        const response = await axios.get(`${API.APPLICATIONS_LOAN_DETAILS}${applicantId}`);
        const detail = response.data?.data || response.data;
        applicantLoanDetail.value = detail || null;
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

const applicantApplications = computed(() => applicantLoanDetail.value?.applications || []);

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
        <div class="rounded-2xl p-6 shadow-lg    shadow-black/50">
            <h2 class="text-lg font-semibold text-black">Add Repayments</h2>
            <p class="text-sm text-black">Select an applicant, review loans, then choose a loan payment.</p>

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

            </div>
        </div>
    </div>

    <div class="mt-6 rounded-2xl p-6 shadow-lg shadow-black/50">
        <div class="flex items-center justify-between">
            <div>
                <h3 class="text-lg font-semibold text-black">Applicant Applications</h3>
                <p class="text-sm text-black">All applications for the selected applicant.</p>
            </div>
            <div v-if="selectedApplicant" class="text-sm text-slate-600">
                Viewing {{ selectedApplicant.first_name }} {{ selectedApplicant.last_name }}
            </div>
        </div>

        <div class="mt-4">
            <div v-if="!selectedApplicant"
                class="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-700">
                Select an applicant to load applications.
            </div>

            <div v-else-if="loadingApplicantDetail"
                class="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-700">
                Loading applications...
            </div>

            <div v-else-if="!applicantApplications.length"
                class="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-700">
                No applications found for this applicant.
            </div>

            <div v-else class="overflow-hidden rounded-xl border border-slate-200 bg-white">
                <div class="overflow-x-auto">
                    <table class="min-w-full divide-y divide-slate-200 text-sm text-slate-900">
                        <thead class="bg-slate-50">
                            <tr>
                                <th class="px-4 py-3 text-left font-semibold">Application #</th>
                                <th class="px-4 py-3 text-left font-semibold">Product</th>
                                <th class="px-4 py-3 text-left font-semibold">Plan</th>
                                <th class="px-4 py-3 text-left font-semibold">Loan Amount</th>
                                <th class="px-4 py-3 text-left font-semibold">Disbursed</th>
                                <th class="px-4 py-3 text-left font-semibold">Outstanding</th>
                                <th class="px-4 py-3 text-left font-semibold">Installments</th>
                                <th class="px-4 py-3 text-left font-semibold">Status</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-200">
                            <tr v-for="application in applicantApplications" :key="application.id"
                                class="hover:bg-slate-50">
                                <td class="px-4 py-3">{{ application.id }}</td>
                                <td class="px-4 py-3">{{ application.product?.name || application.product_id }}</td>
                                <td class="px-4 py-3">{{ application.plan?.name || application.plan_id }}</td>
                                <td class="px-4 py-3">{{ application.loan_amount }}</td>
                                <td class="px-4 py-3">{{ application.disbursed_amount }}</td>
                                <td class="px-4 py-3">{{ application.outstanding_amount }}</td>
                                <td class="px-4 py-3">{{ application.installments?.length || 0 }}</td>
                                <td class="px-4 py-3">
                                    <span :class="[
                                        application.status === 'disbursed'
                                            ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                                            : application.status === 'completed'
                                                ? 'bg-blue-100 text-blue-800 border-blue-200'
                                                : 'bg-amber-100 text-amber-800 border-amber-200',
                                        'inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold'
                                    ]">
                                        {{ application.status }}
                                    </span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>

</template>
