<template>
    <div>
        <div class="mt-5 mx-auto grid max-w-7xl grid-cols-1 lg:grid-cols-2">
            <div class="relative px-0 pb-20 pt-5 sm:pt-5 lg:static lg:px-4">
                <div class="mx-auto max-w-xl lg:mr-0 lg:max-w-lg">
                    <div class="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
                        <div class="sm:col-span-2">
                            <label for="name" class="block text-sm font-semibold text-gray-900">Name
                                <span class="text-red-500">*</span>
                            </label>
                            <div class="mt-2.5">
                                <input type="text" id="name" v-model="loanPlanFormData.name" placeholder="Enter name"
                                    class="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-600" />
                                <p v-if="errors.name" class="text-sm text-red-500">{{
                                    errors.name }}</p>
                            </div>
                        </div>

                        <div class="sm:col-span-2">
                            <label for="code" class="block text-sm font-semibold text-gray-900">Duration unit<span
                                    class="text-red-500">*</span></label>
                            <div class="mt-2.5">
                                <select id="duration_unit" v-model="loanPlanFormData.duration_unit"
                                    class="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600">
                                    <option value="days">Days</option>
                                    <option value="months">Months</option>
                                    <option value="years">Years</option>
                                </select>
                                <p v-if="errors.duration_unit" class="text-sm text-red-500">{{
                                    errors.duration_unit }}</p>
                            </div>
                        </div>

                        <div class="sm:col-span-2">
                            <label for="duration_value" class="block text-sm font-semibold text-gray-900">Duration
                                value<span class="text-red-500">*</span></label>
                            <div class="mt-2.5">
                                <input type="number" id="duration_value"
                                    v-model.number="loanPlanFormData.duration_value" min="1" max="10"
                                    placeholder="Enter charges value"
                                    class="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-600" />
                                <p v-if="errors.duration_value" class="text-sm text-red-500">{{
                                    errors.duration_value }}</p>
                            </div>
                        </div>

                        <div class="sm:col-span-2">
                            <label for="charge_condition" class="block text-sm font-semibold text-gray-900">
                                Available product Tier
                            </label>
                            <div class="mt-2.5">
                                <select id="product_tier" v-model="loanPlanFormData.product_tier"
                                    class="w-full px-4 py-2 border border-gray-300 rounded text-black focus:outline-none focus:ring focus:ring-blue-300">
                                    <option value="" disabled>Select a loan tier</option>
                                    <option v-for="(item, index) in totalLoanTiers" :key="item.id" :value="item">
                                        {{ item.name }}
                                    </option>
                                </select>
                                <p v-if="errors.product_tier" class="text-sm text-red-500">{{
                                    errors.product_tier }}</p>
                            </div>
                        </div>

                        <div class="sm:col-span-2">
                            <label for="status" class="block text-sm font-semibold text-gray-900">Status
                                <span class="text-red-500">*</span></label>
                            <div class="mt-2.5">
                                <select id="status" v-model="loanPlanFormData.status"
                                    class="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600">
                                    <option value="1">Active</option>
                                    <option value="0">Inactive</option>
                                </select>
                                <p v-if="errors.status" class="text-sm text-red-500">{{
                                    errors.status }}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="mt-8 flex justify-end">
                    <button type="button" @click="handleAddLoanPlan"
                        class="rounded-md bg-slate-900 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900">
                        Add Plan
                    </button>
                </div>
            </div>
            <div class="px-0 pb-24 pt-5 sm:pb-32 lg:px-4">

            </div>

        </div>

        <div class="px-4 sm:px-6 lg:px-8">
            <div class="sm:flex sm:items-center">
                <div class="sm:flex-auto">
                    <h1 class="text-base font-semibold text-gray-900">Total Product Plan</h1>
                    <p class="mt-2 text-sm text-gray-700">A list of all the Product plan.</p>
                </div>
                <!-- <div class="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
                    <button type="button"
                        class="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Add
                        user</button>
                </div> -->
            </div>
            <div class="mt-8 flow-root">
                <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                        <table class="min-w-full divide-y divide-gray-300">
                            <thead>
                                <tr>
                                    <th scope="col"
                                        class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">
                                        Plan Name</th>
                                    <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                        Duration</th>
                                    <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                        Tier Name </th>
                                    <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-0">
                                        <span class="sr-only">Edit</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-gray-200">
                                <tr v-for="(loanPlan, index) in totalLoanPlanData" :key="totalLoanPlanData.id">
                                    <td
                                        class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                                        {{ loanPlan.name }}</td>
                                    <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{
                                        loanPlan.duration_value }}
                                    </td>
                                    <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{
                                        loanPlan.product_tier.name }}
                                    </td>
                                    <td
                                        class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">

                                        <span @click="deleteSelectedPlan(index)">
                                            <TrashIcon class="w-4 h-4" />
                                        </span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>

        <div class="mt-8 flex justify-end">
            <button type="button" @click="emitHandleNext"
                class="rounded-md bg-slate-900 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900">
                Preview
            </button>
        </div>
    </div>
</template>

<script>
import { ref, toRef, watch } from 'vue';
import { showMessageAlert } from '../../utils/alert';
import { loanPlanFormSchema } from './Validation/LoanPlanForm.validation';
import { TrashIcon } from '@heroicons/vue/24/outline';

export default {
    props: {
        totalLoanTiers: Array,
        product_plans: Array,
    },
    components: {
        TrashIcon
    },
    setup(props) {
        const totalLoanTierStep2Ref = toRef(props, 'totalLoanTiers');
        const totalProductPlansRef = toRef(props, 'product_plans');

        const totalLoanPlanData = ref([...totalProductPlansRef.value])
        const loanPlanFormData = ref({
            product_tier: {},
            product_tier_id: null,
            name: "",
            duration_unit: "",
            duration_value: 0,
            status: "1"
        });
        const errors = ref({});

        const validateDraftLoanPlan = async () => {
            try {
                await loanPlanFormSchema.validate(loanPlanFormData.value, { abortEarly: false });
                errors.value = {};
                return true
            } catch (err) {
                errors.value = {};
                err.inner.forEach((validationError) => {
                    errors.value[validationError.path] = validationError.message;
                });
                showMessageAlert({ message: 'Please fill all information to add product loan Plan.', type: 'error' });
                console.error("Form has errors:", errors.value);
            }
        };

        const handleAddLoanPlan = async () => {
            const { product_tier_id, ...rest } = loanPlanFormData.value

            const isValid = await validateDraftLoanPlan();

            if (isValid) {
                totalLoanPlanData.value = [
                    ...totalLoanPlanData.value,
                    {
                        id: totalLoanPlanData.value.length + 1,
                        product_tier_id: rest.product_tier.id,
                        ...rest,
                    },
                ];

                loanPlanFormData.value = {
                    product_tier: {},
                    product_tier_id: null,
                    name: "",
                    duration_unit: "",
                    duration_value: 0,
                    status: "1",
                };
            }
        };

        const deleteSelectedPlan = (planIndex) => {
            totalLoanPlanData.value = totalLoanPlanData.value.filter((item, index) => index !== planIndex)
        }

        watch(totalProductPlansRef, (newVal, oldVal) => {
            totalLoanPlanData.value = [...totalProductPlansRef.value]
        });

        watch(totalLoanTierStep2Ref, (newVal, oldVal) => {
            // totalLoanPlanData.value = []
            loanPlanFormData.value = {
                product_tier: {},
                product_tier_id: null,
                name: "",
                duration_unit: "",
                duration_value: 0,
                status: "1"
            }
        });

        return {
            totalLoanPlanData,
            loanPlanFormData,
            errors,
            handleAddLoanPlan,
            deleteSelectedPlan,
        };
    },
    emits: ['handleNext'],
    methods: {
        emitHandleNext() {
            this.$emit('handleNext', this.totalLoanPlanData);
        },
    },
};
</script>