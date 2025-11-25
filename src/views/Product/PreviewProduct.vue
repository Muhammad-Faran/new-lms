<template>
    <div class="overflow-hidden bg-white shadow sm:rounded-lg">
        <div class="flex items-center justify-between px-4 py-6 sm:px-6 bg-slate-100">
            <div>
                <h3 class="text-base/7 font-semibold text-gray-900">Product Information</h3>
                <p class="mt-1 max-w-2xl text-sm/6 text-gray-500">Basic information and Books details.</p>
            </div>
            <div @click="toggleSection('isExpandedBasicInformation')" class="cursor-pointer">
                <ChevronRightIcon v-if="!previewSetting.isExpandedBasicInformation" class="w-5 h-5 text-black"
                    aria-hidden="true" />
                <ChevronDownIcon v-if="previewSetting.isExpandedBasicInformation" class="w-5 h-5 text-black"
                    aria-hidden="true" />
            </div>
        </div>
        <div v-if="previewSetting.isExpandedBasicInformation === true" class="border-t border-gray-100">
            <dl class="divide-y divide-gray-100">
                <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt class="text-sm font-medium text-gray-900">Product name</dt>
                    <dd class="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">{{ form.name }}</dd>
                </div>
                <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt class="text-sm font-medium text-gray-900">Code</dt>
                    <dd class="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">{{ form.code }}</dd>
                </div>
                <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt class="text-sm font-medium text-gray-900">Per User Availability Limit</dt>
                    <dd class="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">{{ form.limit }} </dd>
                </div>
                <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt class="text-sm font-medium text-gray-900">Maximum Requested Amount</dt>
                    <dd class="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">{{ form.max_requested_amount }}</dd>
                </div>
                <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt class="text-sm font-medium text-gray-900">Minimum Requested Amount</dt>
                    <dd class="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">{{ form.min_requested_amount }}</dd>
                </div>
                <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt class="text-sm font-medium text-gray-900">Eligibility Criteria</dt>
                    <dd class="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">{{ form.eligibility_criteria }}</dd>
                </div>
                <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt class="text-sm font-medium text-gray-900">Application Status</dt>
                    <dd class="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">{{ form.default_status }}</dd>
                </div>
                <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt class="text-sm font-medium text-gray-900">Status</dt>
                    <dd class="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">{{ form.status }}</dd>
                </div>
                <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt class="text-sm font-medium text-gray-900">Terms & Conditions URL</dt>
                    <dd class="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">{{ form.tnc }}</dd>
                </div>
                <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt class="text-sm font-medium text-gray-900">Description</dt>
                    <dd class="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">{{ form.description }}</dd>
                </div>
                <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt class="text-sm/6 font-medium text-gray-900">Books</dt>
                    <dd class="mt-2 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                        <ul v-if="form.product_books.length > 0" role="list"
                            class="divide-y divide-gray-100 rounded-md border border-gray-200">
                            <li v-for="(option, index) in form.product_books" :key="option.id"
                                class="flex items-center justify-between py-4 pl-4 pr-5 text-sm/6">
                                <div class="flex w-0 flex-1 items-center">
                                    <BookOpenIcon class="size-5 shrink-0 text-gray-400" aria-hidden="true" />
                                    <div class="ml-4 flex min-w-0 flex-1 gap-2">
                                        <span class="truncate font-medium">{{ option.name }}</span>
                                        <span class="shrink-0 text-gray-400">preference: {{ index + 1 }}</span>
                                    </div>
                                </div>
                                <div class="ml-4 shrink-0">
                                    <a href="#" class="font-medium text-indigo-600 hover:text-indigo-500"></a>
                                </div>
                            </li>
                        </ul>
                    </dd>
                </div>
                <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt class="text-sm/6 font-medium text-gray-900">Charges</dt>
                    <dd class="mt-2 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                        <ul v-if="form.product_tier_charges.length > 0" role="list"
                            class="divide-y divide-gray-100 rounded-md border border-gray-200">
                            <li v-for="(option, index) in form.product_tier_charges" :key="option.id"
                                class="flex items-center justify-between py-4 pl-4 pr-5 text-sm/6">
                                <div class="flex w-0 flex-1 items-center">
                                    <PaperClipIcon class="size-5 shrink-0 text-gray-400" aria-hidden="true" />
                                    <!-- <span class="shrink-0 text-gray-400">{{ index + 1 }}:</span> -->
                                    <div class="ml-4 flex min-w-0 flex-1 gap-2">
                                        <span class="truncate font-medium">{{ option.charge.name }}</span>
                                        <span class="shrink-0 text-gray-400">
                                            Apply on: {{ option.charge_condition }}
                                        </span>
                                        <span class="flex gap-1 items-center text-gray-400">
                                            - Fed:
                                            <div v-if="option.apply_fed" class="flex items-center space-x-2 gap-2">
                                                <CheckCircleIcon class="w-5 h-5 shrink-0 text-green-500"
                                                    aria-hidden="true" />

                                                {{ option.fed_charges_value }} {{ option.fed_charges_unit ===
                                                    "percentage" ? '%' : option.fed_charges_unit }}
                                            </div>
                                            <div v-if="!option.apply_fed">
                                                <XCircleIcon class="w-5 h-5 shrink-0 text-red-500" aria-hidden="true" />
                                            </div>

                                        </span>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </dd>
                </div>
            </dl>
        </div>

        <div class="mt-2 flex items-center justify-between px-4 py-6 sm:px-6 bg-slate-100">
            <div>
                <h3 class="text-base/7 font-semibold text-gray-900">Product Tier Information</h3>
                <p class="mt-1 max-w-2xl text-sm/6 text-gray-500">Product Tier information and charges details.</p>
            </div>
            <div @click="toggleSection('isExpandedLoanTierInformation')" class="cursor-pointer">
                <ChevronRightIcon v-if="!previewSetting.isExpandedLoanTierInformation" class="w-5 h-5 text-black"
                    aria-hidden="true" />
                <ChevronDownIcon v-if="previewSetting.isExpandedLoanTierInformation" class="w-5 h-5 text-black"
                    aria-hidden="true" />
            </div>
        </div>

        <div v-if="previewSetting.isExpandedLoanTierInformation" class="border-t border-gray-100">
            <dl v-for="(tier, index) in form.product_tiers" :key="index" class="divide-y divide-gray-100">
                <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 bg-gray-100">
                    <dt class="text-sm font-medium text-gray-900 ">Tier Name</dt>
                    <dd class="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0"> {{ tier.name }}</dd>
                </div>
                <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt class="text-sm font-medium text-gray-900">Fed</dt>
                    <dd class="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
                        {{ tier.fed_charges_value }}

                        <span>
                            {{ tier.fed_charge_unit === 'percentage' || tier.fed_charges_unit === 'percentage'
                                ? '%' : 'fixed' }}
                        </span>
                    </dd>
                </div>
                <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt class="text-sm/6 font-medium text-gray-900">Charges</dt>
                    <dd class="mt-2 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                        <ul v-if="tier.product_tier_charges.length > 0" role="list"
                            class="divide-y divide-gray-100 rounded-md border border-gray-200">
                            <li v-for="(option, index) in tier.product_tier_charges" :key="option.id"
                                class="flex items-center justify-between py-4 pl-4 pr-5 text-sm/6">
                                <div class="flex w-0 flex-1 items-center">
                                    <PaperClipIcon class="size-5 shrink-0 text-gray-400" aria-hidden="true" />
                                    <div class="ml-4 flex min-w-0 flex-1 gap-2">
                                        <span v-if="option?.charge?.charge?.name" class="truncate font-medium">{{
                                            option.charge.charge.name }} hello</span>

                                        <span v-if="!option?.charge?.charge" class="truncate font-medium">{{
                                            option.charge
                                            }}</span>
                                        <span class="flex gap-1 items-center text-gray-400">

                                            {{ option.charges_value }} {{ option.charges_unit === 'percentage' ? '%' :
                                                'fixed' }}
                                        </span>

                                        <span class="flex gap-1 items-center text-gray-400">
                                            - Fed inclusive:
                                            <div v-if="option.is_fed_inclusive"
                                                class="flex items-center space-x-2 gap-2">
                                                <CheckCircleIcon class="w-5 h-5 shrink-0 text-green-500"
                                                    aria-hidden="true" />
                                            </div>
                                            <div v-if="!option.is_fed_inclusive">
                                                <XCircleIcon class="w-5 h-5 shrink-0 text-red-500" aria-hidden="true" />
                                            </div>

                                        </span>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </dd>
                </div>
            </dl>
        </div>

        <div class="mt-2 flex items-center justify-between px-4 py-6 sm:px-6 bg-slate-100">
            <div>
                <h3 class="text-base/7 font-semibold text-gray-900">Product Plan Information</h3>
                <p class="mt-1 max-w-2xl text-sm/6 text-gray-500">Product Plan information and tier details.</p>
            </div>
            <div @click="toggleSection('isExpandedLoanPlanInformation')" class="cursor-pointer">
                <ChevronRightIcon v-if="!previewSetting.isExpandedLoanPlanInformation" class="w-5 h-5 text-black"
                    aria-hidden="true" />
                <ChevronDownIcon v-if="previewSetting.isExpandedLoanPlanInformation" class="w-5 h-5 text-black"
                    aria-hidden="true" />
            </div>
        </div>

        <div v-if="previewSetting.isExpandedLoanPlanInformation" class="border-t border-gray-100">
            <dl v-for="(plan, index) in form.product_plans" :key="index" class="divide-y divide-gray-100">
                <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt class="text-sm font-medium text-gray-900 ">{{ index + 1 }} - {{ plan.name }}</dt>
                    <dd class="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
                        <ul role="list" class="divide-y divide-gray-100 rounded-md border border-gray-200">
                            <li class="flex items-center justify-between py-4 pl-4 pr-5 text-sm/6">
                                <div class="flex w-0 flex-1 items-center">
                                    <PaperClipIcon class="size-5 shrink-0 text-gray-400" aria-hidden="true" />
                                    <div class="ml-4 flex min-w-0 flex-1 gap-2">
                                        <span class="truncate font-medium">Duration</span>
                                        <span class="shrink-0 text-gray-400">{{ plan.duration_value }}</span>
                                        <span class="shrink-0 text-gray-400">{{ plan.duration_unit }}</span>
                                    </div>
                                </div>
                            </li>
                            <li class="flex items-center justify-between py-4 pl-4 pr-5 text-sm/6">
                                <div class="flex w-0 flex-1 items-center">
                                    <PaperClipIcon class="size-5 shrink-0 text-gray-400" aria-hidden="true" />
                                    <div class="ml-4 flex min-w-0 flex-1 gap-2">
                                        <span class="truncate font-medium">Tier</span>
                                        <span class="shrink-0 text-gray-400">{{ plan.product_tier.name }}</span>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </dd>
                </div>
            </dl>
        </div>
    </div>
</template>

<script>
import { ChevronDownIcon, ChevronRightIcon, BookOpenIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/vue/24/outline';
import { PaperClipIcon, } from '@heroicons/vue/20/solid'
import { ref } from 'vue';


export default {
    props: {
        form: Object,
    },
    components: {
        ChevronDownIcon, ChevronRightIcon, BookOpenIcon, CheckCircleIcon, XCircleIcon, PaperClipIcon// Register the icon component here
    },
    setup(props) {
        const previewSetting = ref({
            isExpandedBasicInformation: true,
            isExpandedLoanTierInformation: false,
            isExpandedLoanPlanInformation: false,
        });

        // Toggle function for sections
        const toggleSection = (sectionKey) => {
            previewSetting.value[sectionKey] = !previewSetting.value[sectionKey];
        };

        return {
            previewSetting,
            toggleSection
        };
    },
    emits: [],
    methods: {
        // emitHandleNext() {
        //     this.$emit('handleNext', this.totalLoanTiers);
        // },
    },
};
</script>