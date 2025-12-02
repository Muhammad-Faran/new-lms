<template>
    <div class="relative isolate bg-white px-2 sm:px-2 lg:px-4">
        <div class="sm:flex sm:items-center">
            <div class="sm:flex-auto">
                <h1 class="text-base font-semibold text-gray-900">Add Product</h1>
                <p class="mt-2 text-sm text-gray-700">Please fill the information carefully.</p>
            </div>
            <div class="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
                <!-- <button type="button"
                    class="block rounded-md bg-[#75ba2c] px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-[#78aa43] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    @click="goToAddUser">
                    Add user
                </button> -->
            </div>
        </div>

        <div v-if="!isPreview" class="flex flex-wrap">
            <div class="w-full">
                <ul class="flex mb-0 list-none flex-wrap pt-3 pb-4 flex-row">
                    <li v-if="validateTabs.tab1" class="-mb-px mr-2 last:mr-0 flex-auto text-center">
                        <a class="cursor-pointer text-xs font-bold uppercase px-5 py-3 shadow-lg rounded block leading-normal text-gray-800"
                            v-on:click="toggleTabs(1)"
                            v-bind:class="{ 'text-gray-700 bg-white': openTab !== 1, 'text-black bg-gray-400': openTab === 1 }">
                            Basic Information
                        </a>
                    </li>
                    <li v-if="validateTabs.tab2" class="-mb-px mr-2 last:mr-0 flex-auto text-center">
                        <a class="cursor-pointer text-xs font-bold uppercase px-5 py-3 shadow-lg rounded block leading-normal"
                            v-on:click="toggleTabs(2)"
                            v-bind:class="{ 'text-gray-700 bg-white': openTab !== 2, 'text-black bg-gray-400': openTab === 2 }">
                            Product Tier
                        </a>
                    </li>
                    <li v-if="validateTabs.tab3" class="-mb-px mr-2 last:mr-0 flex-auto text-center">
                        <a class="cursor-pointer text-xs font-bold uppercase px-5 py-3 shadow-lg rounded block leading-normal"
                            v-on:click="toggleTabs(3)"
                            v-bind:class="{ 'text-gray-700 bg-white': openTab !== 3, 'text-black bg-gray-400': openTab === 3 }">
                            Product Plan
                        </a>
                    </li>
                </ul>
                <div class="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded">
                    <div class="px-4 py-5 flex-auto">
                        <div class="tab-content tab-space">
                            <div v-bind:class="{ 'hidden': openTab !== 1, 'block': openTab === 1 }">
                                <div>
                                    <!-- <BasicInformationForm :form="form" :errors="errors" :selectedBooks="selectedBooks"
                                        :isBookDropdownOpen="isBookDropdownOpen" :books="books"
                                        @handleSubmit="handleStep1" @toggleDropdownBook="toggleDropdownBook"
                                        @toggleSelection="toggleSelection" /> -->

                                    <div class="mt-5 mx-auto grid max-w-7xl grid-cols-1 lg:grid-cols-2">
                                        <div class="relative px-0 pb-20 pt-5 sm:pt-5 lg:static lg:px-4">
                                            <div class="mx-auto max-w-xl lg:mr-0 lg:max-w-lg">
                                                <div class="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
                                                    <div class="sm:col-span-2">
                                                        <label for="name"
                                                            class="block text-sm font-semibold text-gray-900">Name
                                                            <span class="text-red-500">*</span>
                                                        </label>
                                                        <div class="mt-2.5">
                                                            <input type="text" id="name" v-model="form.name"
                                                                placeholder="Enter name"
                                                                class="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-600" />
                                                            <p v-if="errors.name" class="text-sm text-red-500">{{
                                                                errors.name }}</p>
                                                        </div>
                                                    </div>

                                                    <div class="sm:col-span-2">
                                                        <label for="code"
                                                            class="block text-sm font-semibold text-gray-900">Code <span
                                                                class="text-red-500">*</span></label>
                                                        <div class="mt-2.5">
                                                            <input type="text" id="code" v-model="form.code"
                                                                placeholder="Enter code"
                                                                class="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-600" />
                                                            <p v-if="errors.code" class="text-sm text-red-500">{{
                                                                errors.code }}</p>
                                                        </div>
                                                    </div>

                                                    <div class="sm:col-span-2">
                                                        <label for="limit"
                                                            class="block text-sm font-semibold text-gray-900">Per User
                                                            Availability
                                                            Limit <span class="text-red-500">*</span></label>
                                                        <div class="mt-2.5">
                                                            <input type="number" id="limit" v-model.number="form.limit"
                                                                min="1" placeholder="Enter limit"
                                                                class="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-600" />
                                                            <p v-if="errors.limit" class="text-sm text-red-500">{{
                                                                errors.limit }}</p>
                                                        </div>
                                                    </div>

                                                    <div class="sm:col-span-2">
                                                        <label for="max-loan"
                                                            class="block text-sm font-semibold text-gray-900">
                                                            Maximum Requested Amount <span
                                                                class="text-red-500">*</span></label>
                                                        <div class="mt-2.5">
                                                            <input type="number" id="max-loan"
                                                                v-model.number="form.max_requested_amount"
                                                                placeholder="Enter maximum amount"
                                                                class="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-600" />
                                                            <p v-if="errors.max_requested_amount"
                                                                class="text-sm text-red-500">
                                                                {{
                                                                    errors.max_requested_amount }}</p>
                                                        </div>
                                                    </div>

                                                    <div class="sm:col-span-2">
                                                        <label for="min-loan"
                                                            class="block text-sm font-semibold text-gray-900">
                                                            Minimum Requested Amount <span
                                                                class="text-red-500">*</span></label>
                                                        <div class="mt-2.5">
                                                            <input type="number" id="min-loan"
                                                                v-model.number="form.min_requested_amount"
                                                                placeholder="Enter minimum amount"
                                                                class="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-600" />
                                                            <p v-if="errors.min_requested_amount"
                                                                class="text-sm text-red-500">
                                                                {{
                                                                    errors.min_requested_amount }}</p>
                                                        </div>
                                                    </div>
                                                    <div class="sm:col-span-2">
                                                        <label for="loan-status"
                                                            class="block text-sm font-semibold text-gray-900">
                                                            Eligibility Criteria </label>
                                                        <div class="mt-2.5">
                                                            <select id="loan-status" v-model="form.eligibility_criteria"
                                                                class="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600">
                                                                <option value="arrived">Arrived</option>
                                                                <option value="delivered">Delivered</option>
                                                            </select>
                                                            <p v-if="errors.eligibility_criteria"
                                                                class="text-sm text-red-500">{{
                                                                    errors.eligibility_criteria }}</p>
                                                        </div>
                                                    </div>
                                                    <div class="sm:col-span-2">
                                                        <label for="loan-status"
                                                            class="block text-sm font-semibold text-gray-900">
                                                            Application Status <span
                                                                class="text-red-500">*</span></label>
                                                        <div class="mt-2.5">
                                                            <select id="loan-status" v-model="form.default_status"
                                                                class="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600">
                                                                <option value="review">Review</option>
                                                                <option value="approve">Approve</option>
                                                                <option value="reject">Reject</option>
                                                            </select>
                                                            <p v-if="errors.default_status"
                                                                class="text-sm text-red-500">{{
                                                                    errors.default_status }}</p>
                                                        </div>
                                                    </div>

                                                    <div class="sm:col-span-2">
                                                        <label for="status"
                                                            class="block text-sm font-semibold text-gray-900">Status
                                                            <span class="text-red-500">*</span></label>
                                                        <div class="mt-2.5">
                                                            <select id="status" v-model="form.status"
                                                                class="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600">
                                                                <option value="1">Active</option>
                                                                <option value="0">Inactive</option>
                                                            </select>
                                                            <p v-if="errors.status" class="text-sm text-red-500">{{
                                                                errors.status }}</p>
                                                        </div>
                                                    </div>

                                                    <div class="sm:col-span-2">
                                                        <label for="terms-url"
                                                            class="block text-sm font-semibold text-gray-900">Terms &
                                                            Conditions
                                                            URL <span class="text-red-500">*</span></label>
                                                        <div class="mt-2.5">
                                                            <input type="url" id="terms-url" v-model="form.tnc"
                                                                placeholder="Enter terms URL"
                                                                class="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-600" />
                                                            <p v-if="errors.tnc" class="text-sm text-red-500">{{
                                                                errors.tnc }}</p>
                                                        </div>
                                                    </div>

                                                    <div class="sm:col-span-2">
                                                        <label for="avatar"
                                                            class="block text-sm font-semibold text-gray-900">Avatar
                                                            (Image/Icon) <span class="text-red-500">*</span></label>
                                                        <div class="mt-2.5">
                                                            <input type="file" id="avatar" @change="handleFileUpload"
                                                                class="block w-full text-gray-900" />
                                                            <p v-if="errors.avatar" class="text-sm text-red-500">{{
                                                                errors.avatar }}</p>
                                                        </div>
                                                    </div>

                                                    <div class="sm:col-span-2">
                                                        <label for="description"
                                                            class="block text-sm font-semibold text-gray-900">Description
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
                                        <form action="#" method="POST" class="px-0 pb-24 pt-5 sm:pb-32 lg:px-4">
                                            <div class="mx-auto max-w-xl lg:mr-0 lg:max-w-lg">
                                                <div class="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
                                                    <div class="sm:col-span-2">
                                                        <label for="email"
                                                            class="block text-sm/6 font-semibold text-gray-900">Book
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
                                                                        {{selectedBooks.length > 0
                                                                            ? selectedBooks.map(option =>
                                                                                option.name).join(', ')
                                                                            : 'Select options'}}
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
                                                                                :checked="isSelected(option)"
                                                                                class="form-checkbox" />
                                                                            <span>{{ option.name }}</span>
                                                                        </li>
                                                                    </ul>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div v-if="selectedBooks.length > 0" class="sm:col-span-2">
                                                        <label for="email"
                                                            class="block text-sm/6 font-semibold text-gray-900">Book
                                                            preference</label>
                                                        <div class="mt-1">
                                                            <div
                                                                class="block rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6">
                                                                <div
                                                                    class="w-full mt-2 bg-white border rounded-md shadow-lg">
                                                                    <ul>
                                                                        <li v-for="(option, index) in selectedBooks"
                                                                            :key="option.id"
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
                                                        <label for="loan-status"
                                                            class="block text-sm font-semibold text-gray-900">
                                                            Select charge to apply
                                                            <span class="text-red-500">*</span>
                                                            <p v-if="errors.product_tier_charges"
                                                                class="text-sm text-red-500">
                                                                {{
                                                                    errors.product_tier_charges }}</p>
                                                        </label>
                                                        <div class="mt-2.5">
                                                            <select id="chargesList" v-model="selectedCharge"
                                                                class="w-full px-4 py-2 border border-gray-300 text-black rounded focus:outline-none focus:ring focus:ring-blue-300">
                                                                <option value="" disabled>Select a charge</option>
                                                                <option v-for="charge in chargesList" :key="charge.id"
                                                                    :value="charge">
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
                                                                <select id="charge_condition"
                                                                    v-model="draftCharge.charge_condition"
                                                                    class="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600">
                                                                    <option value="Order Amount">Order Amount</option>
                                                                    <option value="Financing Amount">Financing Amount
                                                                    </option>
                                                                </select>
                                                            </div>
                                                        </div>
                                                        <div class="sm:col-span-2">
                                                            <label for="charge_condition"
                                                                class="block text-sm font-semibold text-gray-900">
                                                                Apply FED
                                                            </label>
                                                            <div class="mt-2.5">
                                                                <label class="inline-flex items-center space-x-2">
                                                                    <input type="checkbox"
                                                                        v-model="draftCharge.apply_fed"
                                                                        class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                                                                    <span class="text-sm text-gray-700">Apply FED</span>
                                                                </label>
                                                            </div>
                                                        </div>

                                                        <div v-if="draftCharge.apply_fed" class="sm:col-span-2">
                                                            <label for="charge_condition"
                                                                class="block text-sm font-semibold text-gray-900">
                                                                FED charge unit
                                                            </label>
                                                            <div class="mt-2.5">
                                                                <select id="fed_charges_unit"
                                                                    v-model="draftCharge.fed_charges_unit"
                                                                    class="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600">
                                                                    <option value="percentage">Percentage</option>
                                                                    <option value="fixed">Fixed</option>
                                                                </select>
                                                                <p v-if="errors.fed_charges_unit"
                                                                    class="text-sm text-red-500">{{
                                                                        errors.fed_charges_unit }}</p>
                                                            </div>
                                                        </div>

                                                        <div v-if="draftCharge.apply_fed" class="sm:col-span-2">
                                                            <label for="fed_charges_value"
                                                                class="block text-sm font-semibold text-gray-900">
                                                                FED charges value
                                                                <span class="text-red-500">*</span></label>
                                                            <div class="mt-2.5">
                                                                <input type="number" id="fed_charges_value"
                                                                    v-model.number="draftCharge.fed_charges_value"
                                                                    min="1" max="10" placeholder="Enter charges value"
                                                                    class="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-600" />
                                                                <p v-if="errors.fed_charges_value"
                                                                    class="text-sm text-red-500">{{
                                                                        errors.fed_charges_value }}</p>
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
                                                                class="block text-sm font-semibold text-gray-900">
                                                                Total Charges
                                                            </label>
                                                            <div class="mt-2.5">
                                                                <div
                                                                    class="block rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6">
                                                                    <div
                                                                        class="w-full mt-2 bg-white border rounded-md shadow-lg">
                                                                        <ul>
                                                                            <li v-for="(option, index) in totalCharges"
                                                                                :key="option.id"
                                                                                class="flex items-center justify-between px-4 py-2 hover:bg-gray-100 cursor-pointer gap-2">
                                                                                <span>
                                                                                    {{ index + 1 }}.
                                                                                    {{ option.charge.name }} -
                                                                                    {{ option.charge_condition }} FED
                                                                                    ({{ option.apply_fed }})

                                                                                    {{ option.apply_fed ?
                                                                                        option.fed_charges_value : '' }}
                                                                                    {{ option.fed_charges_unit ===
                                                                                        'percentage' ? '%' :
                                                                                        option.fed_charges_unit }}
                                                                                </span>
                                                                                <span
                                                                                    @click="deleteSelectedCharges(option.id)">
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
                                        </form>
                                    </div>
                                    <div class="mt-8 flex justify-end">
                                        <button type="button" @click="handleStep1"
                                            class="rounded-md bg-slate-900 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                                            Next
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div v-bind:class="{ 'hidden': openTab !== 2, 'block': openTab === 2 }">
                                <div>
                                    <LoanTierForm :totalCharges="totalCharges" :product_tiers="form.product_tiers"
                                        @handleNext="handleStep2" />
                                </div>
                            </div>
                            <div v-bind:class="{ 'hidden': openTab !== 3, 'block': openTab === 3 }">
                                <div>
                                    <LoanPlanForm :totalLoanTiers="form.product_tiers"
                                        :product_plans="form.product_plans" @handleNext="handleStep3" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="isPreview" class="pt-8">
            <PreviewProduct :form="form" />

            <div class="space-x-2 p-2 mt-4 flex justify-end">
                <button type="button" @click="handleCancel"
                    class="rounded-md bg-slate-900 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                    Cancel
                </button>
                <button type="button" @click="handleSubmit"
                    class="rounded-md bg-slate-900 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                    Create Product
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { ChevronDownIcon, TrashIcon } from '@heroicons/vue/24/outline';
import axios from 'axios';
import API from '../../utils/baseApi';
import BasicInformationForm from './BasicInformationForm.vue';
import LoanTierForm from './LoanTierForm.vue';
import LoanPlanForm from './LoanPlanForm.vue';
import { schemaBasicInformation } from './Validation/BasicInformationForm.validation';
import PreviewProduct from './PreviewProduct.vue';
import { showMessageAlert } from '../../utils/alert';
import { useRouter } from 'vue-router';

const router = useRouter();

const form = ref({
    name: '',
    code: '',
    limit: null,
    max_requested_amount: null,
    min_requested_amount: null,
    eligibility_criteria: '',
    default_status: 'review',
    status: '1',
    tnc: '',
    avatar: null,
    description: '',
    product_books: [],
    product_tier_charges: [],
    selected_charges: [],
    product_tiers: [],
    product_plans: [],
});

const validateTabs = ref({
    tab1: true,
    tab2: false,
    tab3: false,
});
const isPreview = ref(false);

const isBookDropdownOpen = ref(false);
const books = ref([]);
const chargesList = ref([]);
const selectedBooks = ref([]);
const selectedCharge = ref(null);
const openTab = ref(1);
const totalCharges = ref([]);
const draftCharge = ref({
    apply_fed: false,
    fed_charges_unit: null,
    fed_charges_value: null,
    charge_condition: 'Order Amount',
    charge_id: null,
    charge: null,
});
const errors = ref({});

const handleFileUpload = (event) => {
    form.value.avatar = event.target.files[0];
};

const toggleDropdownBook = () => {
    isBookDropdownOpen.value = !isBookDropdownOpen.value;
};

const toggleSelection = (option) => {
    const index = selectedBooks.value.findIndex(
        (selected) => selected.id === option.id
    );
    if (index > -1) {
        selectedBooks.value.splice(index, 1); // Remove the option
    } else {
        selectedBooks.value.push(option); // Add the option
    }
};

const isSelected = (option) => {
    return selectedBooks.value.some(selected => selected.id === option.id);
};

const resetForm = () => {
    form.value = {
        name: '',
        code: '',
        limit: null,
        max_requested_amount: null,
        min_requested_amount: null,
        default_status: 'review',
        eligibility_criteria: '',
        status: '0',
        tnc: '',
        avatar: null,
        description: '',
    };
};

const fetchBook = async () => {
    try {
        const response = await axios.get(API.BOOKS);
        books.value = [...response.data.data]
    } catch (error) {
        console.error('Error fetching books:', error);
    }
};

const fetchCharge = async () => {
    try {
        const response = await axios.get(API.CHARGES);
        chargesList.value = [...response.data.data]
    } catch (error) {
        console.error('Error fetching books:', error);
    }
};


const toggleTabs = async (tabNumber) => {
    console.log(tabNumber, "tabNumber")
    if (tabNumber === 2) {
        const isValid = await validateForm();
        if (!isValid) {
            return;
        }
    }

    openTab.value = tabNumber;
};


const handleAddCharges = () => {
    totalCharges.value = [
        ...totalCharges.value,
        {
            id: totalCharges.value.length + 1,
            ...draftCharge.value,
            charge: selectedCharge.value,
            charge_id: selectedCharge.value.id,
        }
    ];
    draftCharge.value = {
        apply_fed: false,
        fed_charges_unit: null,
        fed_charges_value: null,
        charge_condition: null,
        charge_id: null,
        charge: null,
    }
    selectedCharge.value = null
};

const deleteSelectedCharges = (chargeId) => {
    totalCharges.value = totalCharges.value.filter((item) => item.id !== chargeId)
    form.value = {
        ...form.value,
        product_tier_charges: [],
        selected_charges: [],
        product_tiers: [],
        product_plans: [],
    }
}

const validateForm = async () => {
    try {
        await schemaBasicInformation.validate(form.value, { abortEarly: false });
        errors.value = {};
        return true;
    } catch (err) {
        // Populate errors
        errors.value = {};
        err.inner.forEach((validationError) => {
            errors.value[validationError.path] = validationError.message;
        });
        return false;
    }
};

const handleStep1 = async () => {
    form.value = {
        ...form.value,
        tnc: form.value.tnc,
        product_books: selectedBooks.value.map((item, index) => ({
            ...item,
            book_id: item.id,
            preference: index + 1,
        })),
        product_tier_charges: totalCharges.value,
        selected_charges: totalCharges.value
    };

    const isValid = await validateForm();
    if (isValid) {
        validateTabs.value = { ...validateTabs.value, tab2: true };
        openTab.value = 2;
    }
};

const handleStep2 = async (productTiers) => {
    form.value = {
        ...form.value,
        product_tiers: productTiers,
    };

    validateTabs.value = { ...validateTabs.value, tab3: true };
    openTab.value = 3;
};

const handleStep3 = async (productPlan) => {
    form.value = {
        ...form.value,
        product_plans: productPlan,
    };

    isPreview.value = true
};


const handleSubmit = async () => {
    const { ...rest } = form.value
    const payload = { ...rest }

    try {
        await axios.post(API.ADD_PRODUCTS, payload);
        showMessageAlert({ message: 'Successfully added product', type: 'success' });
        router.push('/dashboard/products');
    } catch (error) {
        showMessageAlert({ message: error.response?.data?.message || 'Something went wrong', type: 'error' });
        console.error('Error saving product:', error);
    } finally {
        // loading.value = false;
    }
};

const handleCancel = () => {
    isPreview.value = false
}

onMounted(() => {
    fetchBook();
    fetchCharge();
});

</script>