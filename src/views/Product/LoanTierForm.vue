<template>
    <div>
        <div class="mt-5 mx-auto grid max-w-7xl grid-cols-1 lg:grid-cols-2">
            <div class="relative px-0 pb-20 pt-5 sm:pt-5 lg:static lg:px-4">
                <div class="mx-auto max-w-xl lg:mr-0 lg:max-w-lg">
                    <div class="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
                        <div class="sm:col-span-2">
                            <label for="name" class="block text-sm font-semibold text-gray-900">Tier Name
                                <span class="text-red-500">*</span>
                            </label>
                            <div class="mt-2.5">
                                <input type="text" id="name" v-model="loanTierFormData.name" placeholder="Enter name"
                                    class="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-600" />
                                <p v-if="errors.name" class="text-sm text-red-500">{{
                                    errors.name }}</p>
                            </div>
                        </div>

                        <!-- Order Threshold Field -->
                        <div class="sm:col-span-2">
                            <label for="order_threshold" class="block text-sm font-semibold text-gray-900">Order
                                Threshold
                            </label>
                            <div class="mt-2.5">
                                <input type="number" id="order_threshold"
                                    v-model.number="loanTierFormData.order_threshold"
                                    placeholder="Enter order threshold"
                                    class="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-600" />
                                <p v-if="errors.order_threshold" class="text-sm text-red-500">{{ errors.order_threshold
                                    }}</p>
                            </div>
                        </div>

                        <!-- Fixed Threshold Charges Field -->
                        <div class="sm:col-span-2">
                            <label for="fixed_threshold_charges" class="block text-sm font-semibold text-gray-900">Fixed
                                Threshold Charges
                            </label>
                            <div class="mt-2.5">
                                <input type="number" id="fixed_threshold_charges"
                                    v-model.number="loanTierFormData.fixed_threshold_charges"
                                    placeholder="Enter fixed threshold charges"
                                    class="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-600" />
                                <p v-if="errors.fixed_threshold_charges" class="text-sm text-red-500">{{
                                    errors.fixed_threshold_charges }}</p>
                            </div>
                        </div>


                        <div class="sm:col-span-2">
                            <label for="penalty_charges_unit" class="block text-sm font-semibold text-gray-900">Penalty
                                charges unit <span class="text-red-500">*</span></label>
                            <div class="mt-2.5">
                                <select id="penalty_charges_unit" v-model="loanTierFormData.penalty_charges_unit"
                                    class="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600">
                                    <option value="percentage">Percentage</option>
                                    <option value="fixed">Fixed</option>
                                </select>
                                <p v-if="errors.penalty_charges_unit" class="text-sm text-red-500">{{
                                    errors.penalty_charges_unit }}</p>
                            </div>
                        </div>

                        <div class="sm:col-span-2">
                            <label for="penalty_charges_value" class="block text-sm font-semibold text-gray-900">Penalty
                                charges value <span class="text-red-500">*</span></label>
                            <div class="mt-2.5">
                                <input type="number" id="penalty_charges_value"
                                    v-model.number="loanTierFormData.penalty_charges_value" min="1" max="10"
                                    placeholder="Enter charges value"
                                    class="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-600" />
                                <p v-if="errors.penalty_charges_value" class="text-sm text-red-500">{{
                                    errors.penalty_charges_value }}</p>
                            </div>
                        </div>

                        <div class="sm:col-span-2">
                            <label for="installment_grace_period" class="block text-sm font-semibold text-gray-900">
                                Installment Grace Period
                                <span class="text-red-500">*</span></label>
                            <div class="mt-2.5">
                                <input type="number" id="installment_grace_period"
                                    v-model.number="loanTierFormData.installment_grace_period" min="1" max="10"
                                    placeholder="Enter charges value"
                                    class="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-600" />
                                <p v-if="errors.installment_grace_period" class="text-sm text-red-500">{{
                                    errors.installment_grace_period }}</p>
                            </div>
                        </div>

                        <div class="sm:col-span-2">
                            <label for="installment_defaulter_days" class="block text-sm font-semibold text-gray-900">
                                Installment Defaulter Days
                                <span class="text-red-500">*</span></label>
                            <div class="mt-2.5">
                                <input type="number" id="installment_defaulter_days"
                                    v-model.number="loanTierFormData.installment_defaulter_days" min="1" max="10"
                                    placeholder="Enter charges value"
                                    class="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-600" />
                                <p v-if="errors.installment_defaulter_days" class="text-sm text-red-500">{{
                                    errors.installment_defaulter_days }}</p>
                            </div>
                        </div>

                        <div class="sm:col-span-2">
                            <label for="status" class="block text-sm font-semibold text-gray-900">Status
                                <span class="text-red-500">*</span></label>
                            <div class="mt-2.5">
                                <select id="status" v-model="loanTierFormData.status"
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
            </div>
            <div class="px-0 pb-24 pt-5 sm:pb-32 lg:px-4">
                <div class="mx-auto max-w-xl lg:mr-0 lg:max-w-lg">
                    <div class="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
                        <div v-if="totalCharges.length > 0"
                            class="sm:col-span-2 space-y-4 bg-white p-3 border-2 border-black rounded-md">
                            <div class="sm:col-span-2">
                                <label for="charge_condition" class="block text-sm font-semibold text-gray-900">New
                                    Charge</label>
                                <p v-if="errors.product_tier_charges" class="text-sm text-red-500">{{
                                    errors.product_tier_charges }}</p>
                                <div class="mt-2.5">
                                </div>
                            </div>
                            <div class="sm:col-span-2">
                                <label for="charge_condition" class="block text-sm font-semibold text-gray-900">
                                    Select Product Charge
                                </label>
                                <div class="mt-2.5">
                                    <select id="chargesDropdown" v-model="draftSelectedChargeTire.charge"
                                        class="w-full px-4 py-2 border border-gray-300 text-black rounded focus:outline-none focus:ring focus:ring-blue-300">
                                        <option value="" disabled>Select a charge</option>
                                        <option v-for="(item, index) in totalCharges" :key="item.charge_id"
                                            :value="item">
                                            {{ item.charge.name }} - {{ item.charge_condition }}
                                        </option>
                                    </select>
                                    <p v-if="errorsTierCharges.charge" class="text-sm text-red-500">{{
                                        errorsTierCharges.charge }}</p>
                                </div>
                            </div>
                            <div class="sm:col-span-2">
                                <label for="charge_condition" class="block text-sm font-semibold text-gray-900">
                                    Charge unit</label>
                                <div class="mt-2.5">
                                    <select id="fed_charge_unit" v-model="draftSelectedChargeTire.charges_unit"
                                        class="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600">
                                        <option value="percentage">Percentage</option>
                                        <option value="fixed">Fixed</option>
                                    </select>
                                    <p v-if="errorsTierCharges.charges_unit" class="text-sm text-red-500">{{
                                        errorsTierCharges.charges_unit }}</p>
                                </div>
                            </div>
                            <div class="sm:col-span-2">
                                <label for="charge_condition" class="block text-sm font-semibold text-gray-900">
                                    Charge value
                                </label>
                                <div class="mt-2.5">
                                    <input type="number" id="charges_value"
                                        v-model.number="draftSelectedChargeTire.charges_value"
                                        placeholder="Enter charges value"
                                        class="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-600" />
                                    <p v-if="errorsTierCharges.charges_value" class="text-sm text-red-500">{{
                                        errorsTierCharges.charges_value }}</p>
                                </div>
                            </div>
                            <div class="sm:col-span-2">
                                <label for="charge_condition" class="block text-sm font-semibold text-gray-900">
                                </label>
                                <div class="mt-2.5">
                                    <label class="inline-flex items-center space-x-2">
                                        <input type="checkbox" v-model="draftSelectedChargeTire.is_fed_inclusive"
                                            class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                                        <span class="text-sm text-gray-700">FED Inclusive</span>
                                    </label>
                                </div>
                            </div>
                            <button type="button" @click="handleAddTierCharges"
                                class="w-full rounded-md bg-slate-900 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900">
                                Add Charge
                            </button>
                        </div>

                        <div v-if="loanTierFormData.product_tier_charges.length > 0" class="sm:col-span-2">
                            <div class="sm:col-span-2">
                                <label for="charge_condition" class="block text-sm font-semibold text-gray-900">
                                    Total Charges
                                </label>
                                <div class="mt-2.5">
                                    <div
                                        class="block rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6">
                                        <div class="w-full mt-2 bg-white border rounded-md shadow-lg">
                                            <ul>
                                                <li v-for="(option, index) in loanTierFormData.product_tier_charges"
                                                    :key="index"
                                                    class="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center justify-between gap-2">
                                                    <span>
                                                        {{ index + 1 }}.
                                                        {{ option.charge.charge.name }} -
                                                        {{ option.charges_unit }}:
                                                        {{ option.charges_value }}
                                                    </span>
                                                    <span @click="deleteSelectedTierCharges(index)">
                                                        <TrashIcon class="w-4 h-4" />
                                                    </span>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
        <div class="mt-8 flex justify-end">
            <button type="button" @click="handleAddLoadTier"
                class="rounded-md bg-slate-900 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900">
                Add Product Tier
            </button>
        </div>
    </div>

    <div v-if="totalLoanTiers.length > 0">
        <div class="w-full mt-2 bg-slate-100 border rounded-md shadow-md">
            <label class="p-2 block text-sm font-semibold text-gray-900">
                Total Product Tier
            </label>

            <ul>
                <li v-for="(option, index) in totalLoanTiers" :key="index"
                    class="px-4 py-2 hover:bg-gray-100 cursor-pointer text-black flex justify-between items-center gap-2">
                    <span>
                        {{ index + 1 }}.
                        {{ option.name }}
                    </span>
                    <span @click="deleteSelectedTier(index)">
                        <TrashIcon class="w-4 h-4" />
                    </span>
                </li>
            </ul>
        </div>
        <div class="p-2 mt-4 flex justify-end">
            <button type="button" @click="emitHandleNext"
                class="rounded-md bg-slate-900 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900">
                Next
            </button>
        </div>
    </div>
</template>

<script>
import { ref, toRef, watch } from 'vue';
import { loanTierSchema, productTierChargeSchema } from './Validation/LoanTierForm.validation';
import { showMessageAlert } from '../../utils/alert';
import { TrashIcon } from '@heroicons/vue/24/outline';

export default {
    props: {
        totalCharges: Array,
        product_tiers: Array,
    },
    components: {
        TrashIcon
    },
    setup(props) {
        const totalChargesFromStep1Ref = toRef(props, 'totalCharges');
        const totalProductTiersRef = toRef(props, 'product_tiers');

        const totalLoanTiers = ref([...totalProductTiersRef.value])
        const loanTierFormData = ref({
            name: "",
            fed_charge_unit: "percentage",
            fed_charges_value: 0,
            order_threshold: 0,  // New field
            fixed_threshold_charges: 0,  // New field
            penalty_charges_unit: "percentage",
            penalty_charges_value: 0,
            installment_grace_period: 0,
            installment_defaulter_days: 0,
            status: "1",
            product_tier_charges: [],
        });

        const errors = ref({});
        const errorsTierCharges = ref({});

        const draftSelectedChargeTire = ref({
            charge: {},
            charge_id: '',
            charges_unit: "percentage",
            charges_value: 0,
            is_fed_inclusive: false,
        });

        const validateDraftSelectedChargeTire = async () => {
            try {
                await productTierChargeSchema.validate(draftSelectedChargeTire.value, { abortEarly: false });
                errorsTierCharges.value = {};
                return true
            } catch (err) {
                errorsTierCharges.value = {};
                err.inner.forEach((validationError) => {
                    errorsTierCharges.value[validationError.path] = validationError.message;
                });
                showMessageAlert({ message: 'Please fill all information to add product Product tier charge.', type: 'error' });
                console.error("Form has errors:", errorsTierCharges.value);
            }
        };

        const handleAddTierCharges = async () => {
            const isValid = await validateDraftSelectedChargeTire();

            if (isValid) {
                loanTierFormData.value = {
                    ...loanTierFormData.value, product_tier_charges: [...loanTierFormData.value.product_tier_charges, {
                        charge: draftSelectedChargeTire.value.charge,
                        charge_id: draftSelectedChargeTire.value.charge.id,
                        charges_unit: draftSelectedChargeTire.value.charges_unit,
                        charges_value: draftSelectedChargeTire.value.charges_value,
                        is_fed_inclusive: draftSelectedChargeTire.value.is_fed_inclusive
                    }]
                }

                draftSelectedChargeTire.value = {
                    charge: {},
                    charge_id: '',
                    charges_unit: "percentage",
                    charges_value: 0,
                    is_fed_inclusive: false,
                }
            }
        };

        const deleteSelectedTierCharges = (chargeIndex) => {
            loanTierFormData.value = {
                ...loanTierFormData.value,
                product_tier_charges: loanTierFormData.value.product_tier_charges.filter((item, index) => index !== chargeIndex)
            }
        }

        const deleteSelectedTier = (tierIndex) => {
            totalLoanTiers.value = totalLoanTiers.value.filter((item, index) => index !== tierIndex)
        }

        const validateLoanTierFormData = async () => {
            try {
                await loanTierSchema.validate(loanTierFormData.value, { abortEarly: false });
                errors.value = {};
                console.log("Form is valid!");

                return true
            } catch (err) {
                errors.value = {};
                console.log(err, "err")
                err.inner.forEach((validationError) => {
                    errors.value[validationError.path] = validationError.message;
                });
                showMessageAlert({ message: 'Please fill all information to add Product tier.', type: 'error' });
                console.error("Form has errors:", errors.value);
            }
        };

        const handleAddLoadTier = async () => {
            const isValid = await validateLoanTierFormData();

            if (isValid) {
                totalLoanTiers.value = [
                    ...totalLoanTiers.value,
                    {
                        id: totalLoanTiers.value.length + 1,
                        ...loanTierFormData.value
                    }
                ]

                loanTierFormData.value = {
                    name: "",
                    fed_charge_unit: "percentage",
                    fed_charges_value: 0,
                    order_threshold: 0,  // Reset
                    fixed_threshold_charges: 0,  // Reset
                    penalty_charges_unit: "percentage",
                    penalty_charges_value: 0,
                    installment_grace_period: 0,
                    installment_defaulter_days: 0,
                    status: "1",
                    product_tier_charges: [],
                }
            }
        }

        // watch(totalProductTiersRef, (newVal, oldVal) => {

        //     console.log(totalProductTiersRef, "totalProductTiers")
        //     console.log(newVal, "totalProductTiers_newVal")
        //     console.log(oldVal, "totalProductTiers_oldVal")
        //     totalLoanTiers.value = [...totalProductTiersRef.value]

        // });

        watch(totalChargesFromStep1Ref, (newVal, oldVal) => {
            // totalLoanTiers.value = [],
            loanTierFormData.value = {
                name: "",
                fed_charge_unit: "percentage",
                fed_charges_value: 0,
                penalty_charges_unit: "percentage",
                penalty_charges_value: 0,
                installment_grace_period: 0,
                installment_defaulter_days: 0,
                status: "1",
                product_tier_charges: [],
            }
        });

        return {
            loanTierFormData,
            errors,
            errorsTierCharges,
            draftSelectedChargeTire,
            handleAddTierCharges,
            handleAddLoadTier,
            totalLoanTiers,
            deleteSelectedTierCharges,
            deleteSelectedTier
        };
    },
    emits: ['handleNext'],
    methods: {
        emitHandleNext() {
            this.$emit('handleNext', this.totalLoanTiers);
        },
    },
};
</script>