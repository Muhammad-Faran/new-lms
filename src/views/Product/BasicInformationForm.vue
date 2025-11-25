<template>
    <form @submit.prevent="handleSubmit">
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
                                    <input type="text" id="name" v-model="form.name" placeholder="Enter name"
                                        class="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-600" />
                                    <p v-if="errors.name" class="text-sm text-red-500">{{
                                        errors.name }}</p>
                                </div>
                            </div>

                            <!-- Code -->
                            <div class="sm:col-span-2">
                                <label for="code" class="block text-sm font-semibold text-gray-900">Code <span
                                        class="text-red-500">*</span></label>
                                <div class="mt-2.5">
                                    <input type="text" id="code" v-model="form.code" placeholder="Enter code"
                                        class="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-600" />
                                    <p v-if="errors.code" class="text-sm text-red-500">{{
                                        errors.code }}</p>
                                </div>
                            </div>

                            <!-- Per User Availability Limit -->
                            <div class="sm:col-span-2">
                                <label for="limit" class="block text-sm font-semibold text-gray-900">Per User
                                    Availability
                                    Limit (1-10) <span class="text-red-500">*</span></label>
                                <div class="mt-2.5">
                                    <input type="number" id="limit" v-model.number="form.limit" min="1"
                                        placeholder="Enter limit"
                                        class="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-600" />
                                    <p v-if="errors.limit" class="text-sm text-red-500">{{
                                        errors.limit }}</p>
                                </div>
                            </div>

                            <!-- Maximum Loan Amount -->
                            <div class="sm:col-span-2">
                                <label for="max-loan" class="block text-sm font-semibold text-gray-900">
                                    Maximum Requested Amount <span class="text-red-500">*</span></label>
                                <div class="mt-2.5">
                                    <input type="number" id="max-loan" v-model.number="form.maxLoanAmount"
                                        placeholder="Enter maximum amount"
                                        class="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-600" />
                                    <p v-if="errors.maxLoanAmount" class="text-sm text-red-500">
                                        {{
                                            errors.maxLoanAmount }}</p>
                                </div>
                            </div>

                            <!-- Minimum Loan Amount -->
                            <div class="sm:col-span-2">
                                <label for="min-loan" class="block text-sm font-semibold text-gray-900">
                                    Minimum Requested Amount <span class="text-red-500">*</span></label>
                                <div class="mt-2.5">
                                    <input type="number" id="min-loan" v-model.number="form.minLoanAmount"
                                        placeholder="Enter minimum amount"
                                        class="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-600" />
                                    <p v-if="errors.minLoanAmount" class="text-sm text-red-500">
                                        {{
                                            errors.minLoanAmount }}</p>
                                </div>
                            </div>

                            <!-- Loan Application Status -->
                            <div class="sm:col-span-2">
                                <label for="loan-status" class="block text-sm font-semibold text-gray-900">
                                    Application Status <span class="text-red-500">*</span></label>
                                <div class="mt-2.5">
                                    <select id="loan-status" v-model="form.loanStatus"
                                        class="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600">
                                        <option value="Review">Review</option>
                                        <option value="Approve">Approve</option>
                                    </select>
                                    <p v-if="errors.loanStatus" class="text-sm text-red-500">{{
                                        errors.loanStatus }}</p>
                                </div>
                            </div>

                            <!-- Status -->
                            <div class="sm:col-span-2">
                                <label for="status" class="block text-sm font-semibold text-gray-900">Status
                                    <span class="text-red-500">*</span></label>
                                <div class="mt-2.5">
                                    <select id="status" v-model="form.status"
                                        class="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600">
                                        <option value="Active">Active</option>
                                        <option value="Inactive">Inactive</option>
                                    </select>
                                    <p v-if="errors.status" class="text-sm text-red-500">{{
                                        errors.status }}</p>
                                </div>
                            </div>

                            <!-- Terms & Conditions URL -->
                            <div class="sm:col-span-2">
                                <label for="terms-url" class="block text-sm font-semibold text-gray-900">Terms &
                                    Conditions
                                    URL <span class="text-red-500">*</span></label>
                                <div class="mt-2.5">
                                    <input type="url" id="terms-url" v-model="form.termsUrl"
                                        placeholder="Enter terms URL"
                                        class="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-600" />
                                    <p v-if="errors.termsUrl" class="text-sm text-red-500">{{
                                        errors.termsUrl }}</p>
                                </div>
                            </div>

                            <!-- Avatar -->
                            <div class="sm:col-span-2">
                                <label for="avatar" class="block text-sm font-semibold text-gray-900">Avatar
                                    (Image/Icon) <span class="text-red-500">*</span></label>
                                <div class="mt-2.5">
                                    <input type="file" id="avatar" @change="handleFileUpload"
                                        class="block w-full text-gray-900" />
                                    <p v-if="errors.avatar" class="text-sm text-red-500">{{
                                        errors.avatar }}</p>
                                </div>
                            </div>

                            <!-- Description -->
                            <div class="sm:col-span-2">
                                <label for="description" class="block text-sm font-semibold text-gray-900">Description
                                    <span class="text-red-500">*</span></label>
                                <div class="mt-2.5">
                                    <textarea id="description" v-model="form.description"
                                        placeholder="Enter description"
                                        class="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-600"
                                        rows="4"></textarea>
                                    <p v-if="errors.description" class="text-sm text-red-500">{{
                                        errors.description }}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="px-0 pb-24 pt-5 sm:pb-32 lg:px-4">
                    <div class="mx-auto max-w-xl lg:mr-0 lg:max-w-lg">
                        <div class="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
                            <div class="sm:col-span-2">
                                <label for="email" class="block text-sm/6 font-semibold text-gray-900">Book
                                    <span class="text-red-500">*</span>
                                    <p v-if="errors.product_books" class="text-sm text-red-500">
                                        {{
                                            errors.product_books }}</p>
                                </label>
                                <div class="mt-1">
                                    <div
                                        class="relative block w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6">
                                        <div @click="toggleDropdownBook"
                                            class="w-full px-4 py-2 border rounded-md bg-white cursor-pointer flex justify-between items-center">
                                            <span>
                                                {{ selectedBooks.length > 0
                                                    ? selectedBooks.map(option =>
                                                        option.name).join(', ')
                                                    : 'Select options' }}
                                            </span>
                                            <ChevronDownIcon class="w-4 h-4" />
                                        </div>

                                        <div v-if="isBookDropdownOpen"
                                            class="absolute z-10 w-full mt-2 bg-white border rounded-md shadow-lg">
                                            <ul>
                                                <li v-for="option in books" :key="option.id"
                                                    class="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
                                                    @click.stop="toggleSelection(option)">
                                                    <input type="checkbox" :value="option.id"
                                                        :checked="isSelected(option)" class="form-checkbox" />
                                                    <span>{{ option.name }}</span>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <!-- <div v-if="selectedBooks.length > 0" class="sm:col-span-2">
                                <label for="email" class="block text-sm/6 font-semibold text-gray-900">Book
                                    preference</label>
                                <div class="mt-1">
                                    <div
                                        class="block rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6">
                                        <div class="w-full mt-2 bg-white border rounded-md shadow-lg">
                                            <ul>
                                                <li v-for="(option, index) in selectedBooks" :key="option.id"
                                                    class="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2">
                                                    <span>{{ index + 1 }}. {{ option.name
                                                        }}</span>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="sm:col-span-2">
                                <label for="loan-status" class="block text-sm font-semibold text-gray-900">Select
                                    charge to apply <span class="text-red-500">*</span>
                                    <p v-if="errors.product_tier_charges" class="text-sm text-red-500">
                                        {{
                                            errors.product_tier_charges }}</p>
                                </label>
                                <div class="mt-2.5">
                                    <select id="chargesList" v-model="selectedCharge"
                                        class="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300">
                                        <option value="" disabled>Select a charge</option>
                                        <option v-for="charge in chargesList" :key="charge.id" :value="charge">
                                            {{ charge.name }}
                                        </option>
                                    </select>
                                </div>
                            </div>

                            <div v-if="selectedCharge"
                                class="sm:col-span-2 space-y-4 bg-slate-100 p-3 border-2 border-black rounded-md">
                                <div class="sm:col-span-2">
                                    <label for="charge_condition"
                                        class="block text-sm font-semibold text-gray-900">Apply
                                        On</label>
                                    <div class="mt-2.5">
                                        <select id="charge_condition" v-model="draftCharge.charge_condition"
                                            class="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600">
                                            <option value="installments">Installments</option>
                                            <option value="Requested Amount">Requested Amount
                                            </option>
                                            <option value="Percentage of full amount">Percentage
                                                of
                                                full amount</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="sm:col-span-2">
                                    <label for="charge_condition"
                                        class="block text-sm font-semibold text-gray-900">Apply
                                        FED</label>
                                    <div class="mt-2.5">
                                        <label class="inline-flex items-center space-x-2">
                                            <input type="checkbox" v-model="draftCharge.apply_fed"
                                                class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                                            <span class="text-sm text-gray-700">Apply FED</span>
                                        </label>
                                    </div>
                                </div>
                                <button type="button" @click="handleAddCharges"
                                    class="w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                                    Add Charge
                                </button>
                            </div>

                            <div v-if="totalCharges.length > 0" class="sm:col-span-2">
                                <div class="sm:col-span-2">
                                    <label for="charge_condition"
                                        class="block text-sm font-semibold text-gray-900">Total
                                        Charges</label>
                                    <div class="mt-2.5">
                                        <div
                                            class="block rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6">
                                            <div class="w-full mt-2 bg-white border rounded-md shadow-lg">
                                                <ul>
                                                    <li v-for="(option, index) in totalCharges" :key="option.id"
                                                        class="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2">
                                                        <span>{{ index + 1 }}. {{
                                                            option.charge.name
                                                        }} - {{
                                                                option.charge_condition
                                                            }} FED ({{ option.apply_fed
                                                            }})</span>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div v-if="totalCharges.length > 0" class="mt-4">
                                <p>Selected Charge Object:</p>
                                <pre>{{ totalCharges }}</pre>
                            </div> -->
                        </div>
                    </div>
                </div>
            </div>

            <div class="mt-8 flex justify-end">
                <button type="button" @click="handleStep1"
                    class="rounded-md bg-indigo-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                    Next
                </button>
            </div>

            {{ hello }}

        </div>
    </form>
</template>

<script>

import axios from 'axios';
import { onMounted, ref } from 'vue';
import API from '../../utils/baseApi';

export default {
    props: {
        form: Object,
        selectedBooks: Array,
        // books: Array,
        isBookDropdownOpen: Boolean,
        errors: Object,
    },
    emits: ['handleSubmit', 'toggleDropdownBook', 'toggleSelection'
        // 'isSelected'
    ],
    setup() {
        const books = ref([]);

        const fetchBooks = async () => {
            try {
                const response = await axios.get(API.BOOKS);
                books.value = [...response.data.data]
            } catch (error) {
                console.error('Error fetching books:', error);
            }
        };

        onMounted(() => {
            fetchBooks();
        });

        return {
            books,
        };
    },
    methods: {
        handleSubmit() {
            this.$emit('handleSubmit');
        },
        toggleDropdownBook() {
            this.$emit('toggleDropdownBook');
        },
        toggleSelection() {
            this.$emit('toggleSelection');
        },
        isSelected() {
            this.selectedBooks.some(selected => selected.id === option.id) || [];
        },
    },
};
</script>