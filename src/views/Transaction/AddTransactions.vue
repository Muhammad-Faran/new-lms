<script setup>
import { ref, computed } from 'vue';
import { Combobox, ComboboxInput, ComboboxOptions, ComboboxOption, ComboboxButton } from '@headlessui/vue';
import { ChevronUpDownIcon, CheckIcon } from '@heroicons/vue/20/solid';
import { showMessageAlert } from '../../utils/alert';

// Mock data for FE search
const applicants = ref([
    {
        id: 1,
        first_name: 'Ali',
        last_name: 'Khan',
        email: 'ali.khan@example.com',
        mobile_no: '0300-1234567',
        credit: { score: 740, category: 'Good', limit: 500000 },
        products: [
            { id: 'P1', name: 'Working Capital', code: 'WC-01' },
            { id: 'P2', name: 'Invoice Financing', code: 'INV-02' },
        ],
    },
    {
        id: 2,
        first_name: 'Sara',
        last_name: 'Ahmed',
        email: 'sara.ahmed@example.com',
        mobile_no: '0301-7654321',
        credit: { score: 680, category: 'Fair', limit: 300000 },
        products: [
            { id: 'P3', name: 'Short Term Loan', code: 'STL-03' },
            { id: 'P4', name: 'Trade Finance', code: 'TF-04' },
        ],
    },
    {
        id: 3,
        first_name: 'Umair',
        last_name: 'Raza',
        email: 'umair.raza@example.com',
        mobile_no: '0302-4567890',
        credit: { score: 820, category: 'Excellent', limit: 800000 },
        products: [
            { id: 'P5', name: 'Revolving Credit', code: 'RC-05' },
            { id: 'P6', name: 'Bridge Loan', code: 'BL-06' },
        ],
    },
]);

const products = ref([]);
const applicantQuery = ref('');
const productQuery = ref('');
const selectedApplicant = ref(null);
const selectedProduct = ref(null);
const creditScore = ref(null);

const filteredApplicants = computed(() => {
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

const selectApplicant = (applicant) => {
    selectedApplicant.value = applicant;
    products.value = applicant?.products || [];
    selectedProduct.value = null;
    creditScore.value = applicant?.credit || null;
};

const selectProduct = (product) => {
    selectedProduct.value = product;
};

const handleApply = () => {
    if (!selectedApplicant.value || !selectedProduct.value) {
        showMessageAlert({ message: 'Select an applicant and a product before applying.', type: 'warning' });
        return;
    }
    showMessageAlert({
        message: `Applied ${selectedProduct.value.name || selectedProduct.value.code} for ${selectedApplicant.value.first_name}`,
        type: 'success',
    });
};
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
                                <div v-if="!filteredApplicants.length"
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
                                            <p class="text-xs text-slate-400">{{ applicant.email }} · {{
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
                            <p class="text-sm text-white">Credit Score</p>
                            <p class="text-2xl font-semibold text-slate-50">
                                {{ creditScore?.score ?? '—' }}
                            </p>
                        </div>
                        <div v-if="creditScore?.category"
                            class="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-300">
                            {{ creditScore.category }}
                        </div>
                    </div>
                    <div class="mt-2 flex items-center justify-between text-sm text-slate-300">
                        <span>Credit Limit</span>
                        <span class="font-semibold text-slate-100">
                            {{ creditScore?.limit ? creditScore.limit.toLocaleString() : '—' }}
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
            </div>

            <div class="mt-8 flex justify-end">
                <button type="button"
                    class="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-emerald-500/30 hover:from-emerald-500 hover:to-emerald-600 disabled:opacity-50"
                    :disabled="!selectedApplicant || !selectedProduct" @click="handleApply">
                    Apply
                </button>
            </div>
        </div>
    </div>
</template>
