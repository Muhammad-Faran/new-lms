<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'; // Import useRouter


import { Menu, MenuButton, MenuItems, MenuItem, Dialog, DialogPanel, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { EllipsisVerticalIcon } from '@heroicons/vue/20/solid'
import Table from '../../components/Table.vue';
import { showMessageAlert } from '../../utils/alert';
import API from '../../utils/baseApi';
import { XMarkIcon } from '@heroicons/vue/24/outline'
import { ChevronDownIcon } from '@heroicons/vue/16/solid'
import SectionHeader from './SectionHeader.vue';
import TabContent from './TabContent.vue';

const router = useRouter();

const columns = [
    { Header: 'ID', accessor: 'id' },
    { Header: 'First Name', accessor: 'first_name' },
    { Header: 'Last Name', accessor: 'last_name' },
    { Header: 'Mobile', accessor: 'mobile_no' },
    { Header: 'Email', accessor: 'email' },
    { Header: 'CNIC', accessor: 'cnic' },
    { Header: 'Status', accessor: 'status', slotName: "status" },
    { Header: 'Action', accessor: 'actions', slotName: "actions" },
]
const showTasdeeqReport = ref(false)

const showDataCheckReport = ref(false)

const dataCheckDummy = ref({
  individual_detail: {
    FILE_NO: 'DC-000123',
    CREATION_DATE: '22/12/2025',
    FIRST_NAME: 'Muhammad',
    MIDDLE_NAME: 'Faran',
    LAST_NAME: 'Khan',
    CNIC: '36302-2315858-9',
    TRANX_NO: 'TRX-998877',
    TRANX_DATE: '22/12/2025',
    NIC: 'N/A',
    GENDER: 'Male',
    MAKER: 'Maker User',
    CHECKER: 'Checker User',
    DOB: '01/01/1995',

    FATHER_HUSBAND_FNAME: 'Abc',
    FATHER_HUSBAND_MNAME: '',
    FATHER_HUSBAND_LNAME: 'Father',

    // Blade @foreach homeInformation
    homeInformation: [
      {
        SEQ_NO: '1st',
        REPORTED_ON: '20/12/2025',
        ADDRESS: 'House 123, Street 5',
        CITY: 'Karachi',
        PHONE1: '021-1234567',
        PHONE2: '0322-6457336',
        employerInformationF: {
          REPORTED_ON: '19/12/2025',
          EMPLOYER: 'Faran Tech Pvt Ltd',
          ADDRESS: 'Office 12, Shahrah-e-Faisal',
          CITY: 'Karachi',
          PHONE1: '021-2222222',
          PHONE2: '0300-1111111',
        },
      },
    ],

    // Blade @foreach dataCheckDefaults
    dataCheckDefaults: [
      {
        MEM_NAME: 'Dummy Member',
        SUBBRN_NAME: 'Dummy Branch',
        UPD_STATUS_DATE: '15/12/2025',
        ORG_STATUS_DATE: '10/12/2025',
        UPD_ACCT_NO: 'ACC-UPDATED-01',
        ORG_ACCT_NO: 'ACC-ORIG-01',
        UPD_AMOUNT: 'PKR 10,000',
        ORG_AMOUNT: 'PKR 9,500',
        UPD_ACCT_TY: 'PL',
        ORG_ACCT_TY: 'PL',
        UPD_STATUS: 'Active',
        ORG_STATUS: 'Active',
        UPD_RTR: 'N/A',
        ORG_RTR: 'N/A',
        ASSOC_TY: 'PRN',
        GROUP_ID: 'G-1001',
      },
    ],

    // Blade @foreach dataCheckCcpMaster
    dataCheckCcpMaster: [
      {
        applicationId: 1,
        MEM_NAME: 'Dummy Member',
        SUBBRN_NAME: 'Branch A',
        ACCT_NO: 'CCP-ACC-001',
        TERM: '12M',
        ACCT_TY: 'PL',
        ACCT_STATUS: 'OK',
        MASTER_LIMIT: 'PKR 50,000',
        OPEN_DATE: '01/01/2025',
        MATURITY_DATE: '01/01/2026',
        STATUS_DATE: '20/12/2025',
        LAST_PAYMENT: '15/12/2025',
        OVERDUEAMOUNT: '0',
        BALANCE: 'PKR 25,000',
        PAYMENT_STATUS: 'OK',

        // simulating $dataCheckCcpMaster->dataCheckCcpDetailF(...)
        ccpDetails: [
          { STATUS_MONTH: '112025', PAYMENT_STATUS: 'OK' },
          { STATUS_MONTH: '102025', PAYMENT_STATUS: 'OK' },
          { STATUS_MONTH: '092025', PAYMENT_STATUS: 'OK' },
          { STATUS_MONTH: '082025', PAYMENT_STATUS: 'OK' },
        ],

        // simulating $dataCheckCcpMaster->dataCheckCcpSummaryF(...)
        ccpSummary: { OK: 10, X: 0, P30: 0, P60: 0, P90: 0, P120: 0, P150: 0, P180: 0 },
      },
    ],

    dataCheckCcpSummaryTotal: { OK: 10, X: 0, P30: 0, P60: 0, P90: 0, P120: 0, P150: 0, P180: 0 },

    // Blade @foreach dataCheckEnquiries
    dataCheckEnquiries: [
      { MEM_NAME: 'Member A', SUBBRN_NAME: 'Branch A', REFERENCE_DATE: '10/11/2025', REFERENCE_NO: 'APP-001', AMOUNT: 'PKR 20,000', ACCT_TY: 'PL', ASSOC_TY: 'PRN' },
      { MEM_NAME: 'Member B', SUBBRN_NAME: 'Branch B', REFERENCE_DATE: '01/10/2025', REFERENCE_NO: 'APP-002', AMOUNT: 'PKR 15,000', ACCT_TY: 'GL', ASSOC_TY: 'COB' },
    ],

    // Blade @foreach dataCheckReview
    dataCheckReview: [
      { MEMBER: 'Member A', REVIEWS: 2 },
      { MEMBER: 'Member B', REVIEWS: 1 },
    ],
  },
})

const getDataCheckReport = () => {
  showDataCheckReport.value = true
}

const handleDialogClose = () => {
  open.value = false;
  resetTab();
  showTasdeeqReport.value = false;
  showDataCheckReport.value = false; // ✅ reset
};



const tasdeeqDummy = ref({
  other_details: {
    reportDate: '22/12/2025',
    reportTime: '10:45 AM',
    refNo: 'TSDQ-REF-123456',
    noOfCreditEnquiry: '03',
    noOfActiveAccounts: '02',
    totalOutstandingBalance: 'PKR 45,000',
    Remarks: 'This is a dummy remark for Tasdeeq report.',
  },
  personal: {
    NAME: 'Muhammad Faran',
    FATHER_OR_HUSBAND_NAME: 'Abc Father',
    GENDER: 'Male',
    CNIC: '36302-2315858-9',
    PASSPORT: 'N/A',
    DOB: '01/01/1995',
    NIC: 'N/A',
    BUSINESS_OR_PROFESSION: 'Software Engineer',
    NATIONALITY: 'Pakistani',
    NTN: 'N/A',
    BORROWER_TYPE: 'Individual',
    CURRENT_RESIDENTIAL_ADDRESS: 'House 123, Street 5, Karachi',
    CURRENT_RESIDENTIAL_ADDRESS_DATE: '01/10/2025',
    PERMANENT_ADDRESS: 'Village XYZ, District ABC',
    PERMANENT_ADDRESS_DATE: '01/01/2020',
    PREVIOUS_RESIDENTIAL_ADDRESS: 'Old Address Dummy',
    PREVIOUS_RESIDENTIAL_ADDRESS_DATE: '01/06/2018',
    EMPLOYER_OR_BUSINESS: 'Faran Tech Pvt Ltd',
    EMPLOYER_OR_BUSINESS_DATE: '01/03/2023',
  },
})

// click handler
const getTasdeeqReport = () => {
  // later you will call API here, and set tasdeeq data from response
  showTasdeeqReport.value = true
}

const printerData = ref([])
const loading = ref(false)
const pageCount = ref(0)
const recordCount = ref(0)

const showModal = ref(false);
const modalImage = ref(null);

const open = ref(false)
const selectedRowData = ref(null);

const tabs = ref([
    { name: 'Applicant', current: true },
    { name: 'Tasdeeq', current: false },
    { name: 'Data Check', current: false },
    { name: 'Ofac Nacta', current: false }
]);



const currentTab = ref('Applicant');

const changeTab = (tabName) => {
    currentTab.value = tabName;
};
const resetTab = () => {
    currentTab.value = 'Applicant';
};

const openImageModal = (imageUrl) => {
    modalImage.value = imageUrl;
    showModal.value = true;
};

const isShowPreview = ref(false)
const form = ref({
    name: '',
    code: '',
    limit: null,
    max_requested_amount: null,
    min_requested_amount: null,
    default_status: 'review',
    status: '1',
    tnc: '',
    avatar: null,
    description: '',
    product_books: [],
    product_tier_charges: [],
    product_tiers: [],
    product_plans: [],
});

const fetchPrinterData = async ({ pageIndex = 0, pageSize = 10, search = '' }) => {
    loading.value = true;

    try {
        const params = {
            pagination: true,
            page: pageIndex + 1, // Convert 0-based index to 1-based
            per_page: pageSize,
            search: search.trim(), // Trim whitespace from the search query
            sort_field: "applicants.id",
            sort_order: "DESC"
        };

        const response = await axios.get(API.APPLICANTS, {
            params,
        });

        const { data, meta } = response.data;

        if (data) {
            printerData.value = data;
            pageCount.value = data.length || 0;
            recordCount.value = meta?.total || 0;
        } else {
            console.warn('No data found in API response:', response.data);
        }
    } catch (error) {
        console.error('Error fetching printer data:', error?.response?.data || error.message);
    } finally {
        loading.value = false;
    }
};

const loadingRefresh = ref(false);

const refreshOfacNacta = async (applicantId) => {
    loadingRefresh.value = true; // Show loader
    try {
        const response = await axios.post(API.REFRESH_OFAC_NACTA, {
            applicant_id: applicantId,
        });

        // Update the selectedRowData dynamically
        selectedRowData.value.ofac_nacta = response.data.data.data;

        showMessageAlert({ message: 'OFAC NACTA refreshed successfully', type: 'success' });
    } catch (error) {
        showMessageAlert({ message: error.response?.data?.error || 'Failed to refresh OFAC NACTA', type: 'error' });
    } finally {
        loadingRefresh.value = false; // Hide loader
    }
};


const formatFactor = (factor) => {
    return factor.replace(/^p_/, '') // Remove leading 'p_'
        .replace(/_/g, ' ') // Replace underscores with spaces
        .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize first letter of each word
};


const handleAction = (action, row) => {
    if (action === 'Edit') {
        handleEdit(row);
    }
    //  else if (action === 'Delete') {
    //     console.log('Delete action on:', row);
    //     handleDelete(row);  // Delete the user
    // }
}

const handleView = async (row) => {
    selectedRowData.value = { ...row }
    open.value = true

    // router.push({
    //     name: 'ViewApplicants',
    //     params: { id: row.id },
    // });
}

const handleSyncApplicantProduct = async (row) => {
    router.push({
        name: 'SyncApplicantProducts',
        params: { id: row.id },
        state: {
            ApplicantData: JSON.stringify(row),
        },
    });
}

const handleConfigureApplicantDetails = async (row) => {
    router.push({
        name: 'ConfigureApplicantDetails',
        params: { id: row.id },
        state: {
            ApplicantData: JSON.stringify(row),
        },
    });
}

const handleAssignCreditLimit = async (row) => {
    router.push({
        name: 'AssignCreditLimit',
        params: { id: row.id },
        state: {
            ApplicantData: JSON.stringify(row),
        },
    });
}

const handleAssignFinancingPolicy = async (row) => {
    router.push({
        name: 'AssignFinancingPolicy',
        params: { id: row.id },
        state: {
            ApplicantData: JSON.stringify(row),
        },
    });
}

const handleEdit = async (row) => {
    router.push({
        name: 'EditApplicants',
        params: { id: row.id },
    });
}

const handleUpdateApplicantStatus = async (row) => {
    try {
        loading.value = true;

        const payload = {
            status: row.status === 1 ? 0 : 1,
            id: row.id
        };

        await axios.patch(API.APPLICANTS_STATUS, payload);
        showMessageAlert({ message: 'Successfully Update Status', type: 'success' });
        fetchPrinterData({ pageIndex: 0, pageSize: 20 })
    } catch (error) {
        showMessageAlert({ message: error.response?.data?.message || 'Something went wrong', type: 'error' });
        console.error('Error Update:', error);
    } finally {
        loading.value = false;
    }
}

const goToAddUser = () => {
    router.push({ name: 'AddApplicants' });
}

onMounted(() => {
    fetchPrinterData({ pageIndex: 0, pageSize: 20 })
})
</script>

<template>
    <div class="px-2 sm:px-2 lg:px-4 ">
        <div class="sm:flex sm:items-center">
            <div class="sm:flex-auto">
                <h1 class="text-base font-semibold text-slate-900">Applicants</h1>
                <p class="mt-2 text-sm text-slate-600">A list of all the applicants in your account.</p>
            </div>
            <div class="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
                <button type="button"
                    class="block rounded-md bg-slate-900 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    @click="goToAddUser">
                    Add Applicant
                </button>
            </div>
        </div>

        <!-- mt-4 rounded-2xl border border-slate-800/70 bg-slate-900/70 p-4 shadow-2xl shadow-black/40 backdrop-blur -->
        <div class="relative overflow-visible">
            <Table :columns="columns" :data="printerData" :fetchData="fetchPrinterData" :loading="loading"
                :pageCount="pageCount" :recordCount="recordCount" :action="['Edit']" :actionOnClick="handleAction"
                :onEdit="handleEdit" pageType="products">

                <template #name="{ value }">
                    <p class="cursor-pointer font-semibold text-slate-100 hover:text-emerald-300"
                        @click="handleEdit(value)">
                        {{ value.name }}
                    </p>
                </template>

                <template #status="{ value }">
                    <span :class="[value.status === 1 ? 'bg-emerald-600/80 text-emerald-50' : 'bg-rose-600/80 text-rose-50',
                        'inline-flex items-center gap-x-1.5 rounded-full px-3 py-1 text-xs font-semibold shadow-sm shadow-black/30',
                    ]">
                        {{ value.status === 1 ? 'Enabled' : 'Disabled' }}
                    </span>
                </template>

                <template #actions="{ value }">
                    <Menu as="div" class="inline-block text-left">
                        <div>
                            <MenuButton
                                class="inline-flex w-full justify-center rounded-full bg-slate-800/80 px-1 py-1 text-sm font-medium text-slate-100 shadow-sm shadow-black/30 hover:bg-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60">

                                <EllipsisVerticalIcon class="h-4 w-4 text-slate-100" aria-hidden="true" />
                            </MenuButton>
                        </div>

                        <transition enter-active-class="transition duration-100 ease-out"
                            enter-from-class="transform scale-95 opacity-0"
                            enter-to-class="transform scale-100 opacity-100"
                            leave-active-class="transition duration-75 ease-in"
                            leave-from-class="transform scale-100 opacity-100"
                            leave-to-class="transform scale-95 opacity-0">
                            <MenuItems
                                class="z-50 absolute right-0 mt-2 w-40 origin-top-right divide-y divide-slate-800 rounded-xl bg-slate-900 shadow-lg shadow-black/40 ring-1 ring-slate-800 focus:outline-none">
                                <div class="px-1 py-1">
                                    <MenuItem v-slot="{ active }">
                                    <button :class="[
                                        active ? 'bg-slate-800 text-emerald-300' : 'text-slate-100',
                                        'group flex w-full items-center rounded-lg px-2 py-2 text-sm font-semibold',
                                    ]" @click="handleView(value)">

                                        View
                                    </button>
                                    </MenuItem>
                                    <MenuItem v-slot="{ active }">
                                    <button :class="[
                                        active ? 'bg-slate-800 text-emerald-300' : 'text-slate-100',
                                        'group flex w-full items-center rounded-lg px-2 py-2 text-sm font-semibold',
                                    ]" @click="handleConfigureApplicantDetails(value)">
                                        Settings
                                    </button>
                                    </MenuItem>
                                    <!-- <MenuItem v-slot="{ active }">
                                    <button :class="[
                                        active ? 'bg-violet-500 text-white' : 'text-gray-900',
                                        'group flex w-full items-center rounded-md px-2 py-2 text-sm',
                                    ]" @click="handleAssignCreditLimit(value)">

                                        Assign Credit limit
                                    </button>
                                    </MenuItem>
                                    <MenuItem v-slot="{ active }">
                                    <button :class="[
                                        active ? 'bg-violet-500 text-white' : 'text-gray-900',
                                        'group flex w-full items-center rounded-md px-2 py-2 text-sm',
                                    ]" @click="handleAssignFinancingPolicy(value)">
                                        Assign Financing
                                    </button>
                                    </MenuItem>
                                    <MenuItem v-slot="{ active }">
                                    <button :class="[
                                        active ? 'bg-violet-500 text-white' : 'text-gray-900',
                                        'group flex w-full items-center rounded-md px-2 py-2 text-sm',
                                    ]" @click="handleSyncApplicantProduct(value)">

                                        Sync Products
                                    </button>
                                    </MenuItem> -->
                                    <MenuItem v-slot="{ active }">
                                    <button :class="[
                                        active ? 'bg-slate-800 text-emerald-300' : 'text-slate-100',
                                        'group flex w-full items-center rounded-lg px-2 py-2 text-sm font-semibold',
                                    ]" @click="handleUpdateApplicantStatus(value)">

                                        {{ value.status === 1 ? "Disable" : "Enable" }}
                                    </button>
                                    </MenuItem>
                                    <MenuItem v-slot="{ active }">
                                    <button :class="[
                                        active ? 'bg-slate-800 text-emerald-300' : 'text-slate-100',
                                        'group flex w-full items-center rounded-lg px-2 py-2 text-sm font-semibold',
                                    ]" @click="handleEdit(value)">

                                        Edit
                                    </button>
                                    </MenuItem>
                                </div>
                            </MenuItems>
                        </transition>
                    </Menu>
                </template>
            </Table>
        </div>
        <TransitionRoot as="template" :show="open">
            <Dialog class="relative z-50" @close="handleDialogClose">
                <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0"
                    enter-to="opacity-100" leave="ease-in duration-200" leave-from="opacity-100" leave-to="opacity-0">
                    <div class="fixed inset-0 bg-gray-500/75 transition-opacity" />
                </TransitionChild>

                <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
                    <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                        <TransitionChild as="template" enter="ease-out duration-300"
                            enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            enter-to="opacity-100 translate-y-0 sm:scale-100" leave="ease-in duration-200"
                            leave-from="opacity-100 translate-y-0 sm:scale-100"
                            leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
                            <DialogPanel
                                class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 w-full max-w-4xl min-h-svh sm:p-6">
                                <div class="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
                                    <button type="button"
                                        class="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                        @click="open = false">
                                        <span class="sr-only">Close</span>
                                        <XMarkIcon class="size-6" aria-hidden="true" />
                                    </button>
                                </div>

                                <div class="bg-white shadow sm:rounded-lg p-2 mt-4">
                                    <div class="grid grid-cols-1 sm:hidden">
                                        <select aria-label="Select a tab"
                                            class="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-2 pl-3 pr-8 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
                                            v-model="currentTab">
                                            <option v-for="tab in tabs" :key="tab.name" :value="tab.name">
                                                {{ tab.name }}
                                            </option>
                                        </select>
                                        <ChevronDownIcon
                                            class="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end fill-gray-500"
                                            aria-hidden="true" />
                                    </div>

                                    <div class="hidden sm:block">
                                        <nav class="flex space-x-4" aria-label="Tabs">
                                            <a v-for="tab in tabs" :key="tab.name" href="#"
                                                @click.prevent="changeTab(tab.name)"
                                                :class="[tab.name === currentTab ? 'bg-indigo-100 text-indigo-700' : 'text-gray-500 hover:text-gray-700', 'rounded-md px-3 py-2 text-sm font-medium']"
                                                :aria-current="tab.name === currentTab ? 'page' : undefined">
                                                {{ tab.name }}
                                            </a>
                                        </nav>
                                    </div>
                                </div>

                                <div class="pt-4">
                                    <div v-if="currentTab === 'Applicant'">
                                        <div class="px-4 sm:px-0">
                                            <div class="px-4 sm:px-0">
                                                <h3 class="text-base/7 font-semibold text-gray-900">Applicant
                                                    Information
                                                </h3>
                                                <p class="mt-1 max-w-2xl text-sm/6 text-gray-500">Personal details and
                                                    application.
                                                </p>
                                            </div>
                                            <div v-if="selectedRowData" class="mt-6 border-t border-gray-100">
                                                <dl class="divide-y divide-gray-100">
                                                    <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                                        <dt class="text-sm/6 font-medium text-gray-900">Full name</dt>
                                                        <dd class="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
                                                            {{ selectedRowData.first_name }}
                                                            {{ ' ' }}
                                                            {{ selectedRowData.last_name }}
                                                        </dd>
                                                    </div>
                                                    <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                                        <dt class="text-sm/6 font-medium text-gray-900">Father name</dt>
                                                        <dd class="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
                                                            {{ selectedRowData.father_name }}
                                                        </dd>
                                                    </div>
                                                    <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                                        <dt class="text-sm/6 font-medium text-gray-900">CNIC</dt>
                                                        <dd class="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
                                                            {{ selectedRowData.cnic }}
                                                        </dd>
                                                    </div>
                                                    <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                                        <dt class="text-sm/6 font-medium text-gray-900">CNIC Issuance
                                                            Date</dt>
                                                        <dd class="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
                                                            {{ selectedRowData.cnic_issuance_date }}
                                                        </dd>
                                                    </div>
                                                    <!-- CNIC Front Image Preview -->
                                                    <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                                        <dt class="text-sm font-medium text-gray-900">CNIC Front Image
                                                        </dt>
                                                        <dd class="mt-1 text-sm text-gray-700 sm:col-span-2 sm:mt-0">
                                                            <img :src="selectedRowData.cnic_front_image"
                                                                alt="CNIC Front Image"
                                                                class="w-24 h-16 cursor-pointer rounded-lg shadow"
                                                                @click="openImageModal(selectedRowData.cnic_front_image)" />
                                                        </dd>
                                                    </div>

                                                    <!-- CNIC Back Image Preview -->
                                                    <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                                        <dt class="text-sm font-medium text-gray-900">CNIC Back Image
                                                        </dt>
                                                        <dd class="mt-1 text-sm text-gray-700 sm:col-span-2 sm:mt-0">
                                                            <img :src="selectedRowData.cnic_back_image"
                                                                alt="CNIC Back Image"
                                                                class="w-24 h-16 cursor-pointer rounded-lg shadow"
                                                                @click="openImageModal(selectedRowData.cnic_back_image)" />
                                                        </dd>
                                                    </div>

                                                    <!-- Full-Screen Image Modal -->
                                                    <div v-if="showModal"
                                                        class="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
                                                        <div class="relative">
                                                            <!-- Close Button -->
                                                            <button @click="showModal = false"
                                                                class="absolute top-2 right-2 bg-white p-2 rounded-full shadow-lg">
                                                                ❌
                                                            </button>
                                                            <!-- Enlarged Image -->
                                                            <img :src="modalImage"
                                                                class="max-w-screen-md max-h-screen-md rounded-lg shadow-lg" />
                                                        </div>
                                                    </div>

                                                    <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                                        <dt class="text-sm/6 font-medium text-gray-900">Date of birth
                                                        </dt>
                                                        <dd class="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
                                                            {{ selectedRowData.dob }}
                                                        </dd>
                                                    </div>
                                                    <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                                        <dt class="text-sm/6 font-medium text-gray-900">Email address
                                                        </dt>
                                                        <dd class="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
                                                            {{ selectedRowData.email }}
                                                        </dd>
                                                    </div>
                                                </dl>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Data Check Tab -->
                                        <div v-if="currentTab === 'Data Check'">
                                          <div class="flex items-center justify-between">
                                            <SectionHeader
                                              title="Data Check"
                                              description="Generate and view DataCheck report for this applicant."
                                            />

                                            <button
                                              class="px-4 py-2 bg-[#75ba2c] text-white font-medium rounded shadow hover:bg-[#75ba2c] focus:outline-none"
                                              @click="getDataCheckReport"
                                            >
                                              Get DataCheck Report
                                            </button>
                                          </div>

                                          <div v-if="showDataCheckReport" class="mt-4">
                                            <div class="datacheck-report" style="margin: 0; background-color: #ffffff; padding: 10px;">
                                              <!-- PAGE 1 -->
                                              <div class="main-page">
                                                <div style="padding: 20px 5px 0; margin: 0 0 10px;">
                                                  <table style="width: 100%;">
                                                    <tr>
                                                      <td style="vertical-align: middle;">
                                                        <h1 style="font-size: 17px; line-height: 17px; text-transform: uppercase; margin:0 0 35px; color: #000;">
                                                          CONFIDENTIAL
                                                        </h1>
                                                        <h2 style="font-size: 13px; line-height: 20px;">
                                                          Individual Credit Report (Sample Report)
                                                          <span style="margin: 0 0 0 20px;">Strong Match</span>
                                                        </h2>
                                                      </td>

                                                      <td align="right" style="vertical-align: middle;">
                                                        <div style="display: inline-block; width: 130px; text-align: center;">
                                                          <img src="/logo-credit.jpg" alt="logo" style="max-width: 45px; margin: 0 0 15px;" />
                                                          <span style="display: block; font-size: 15px; font-weight: 700; line-height: 18px;">DataCheck</span>
                                                          <span style="display: block; font-size: 12px; font-weight: 500; line-height: 13px;">MicroFinance Bureau</span>
                                                        </div>
                                                      </td>
                                                    </tr>
                                                  </table>
                                                </div>

                                                <div style="padding: 0 5px 0;">
                                                  <table style="width: 100%;">
                                                    <tr>
                                                      <td style="border-top: #000 solid 1px; border-bottom: #000 solid 1px; padding: 5px 0;">
                                                        <table style="width: 100%">
                                                          <tr>
                                                            <td><strong>File#:</strong></td>
                                                            <td>{{ dataCheckDummy.individual_detail.FILE_NO }}</td>
                                                            <td><strong>Creation Date:</strong></td>
                                                            <td>{{ dataCheckDummy.individual_detail.CREATION_DATE }}</td>
                                                            <td><strong>Name:</strong></td>
                                                            <td>
                                                              {{ dataCheckDummy.individual_detail.FIRST_NAME }}
                                                              {{ dataCheckDummy.individual_detail.MIDDLE_NAME }}
                                                              {{ dataCheckDummy.individual_detail.LAST_NAME }}
                                                            </td>
                                                            <td><strong>CNIC#:</strong></td>
                                                            <td>{{ dataCheckDummy.individual_detail.CNIC }}</td>
                                                          </tr>

                                                          <tr>
                                                            <td><strong>Tranx#:</strong></td>
                                                            <td>{{ dataCheckDummy.individual_detail.TRANX_NO }}</td>
                                                            <td><strong>Tranx Date:</strong></td>
                                                            <td>{{ dataCheckDummy.individual_detail.TRANX_DATE }}</td>
                                                            <td><strong>NIC#:</strong></td>
                                                            <td>{{ dataCheckDummy.individual_detail.NIC }}</td>
                                                            <td><strong>Gender:</strong></td>
                                                            <td>{{ dataCheckDummy.individual_detail.GENDER }}</td>
                                                          </tr>

                                                          <tr>
                                                            <td><strong>Maker:</strong></td>
                                                            <td>{{ dataCheckDummy.individual_detail.MAKER }}</td>
                                                            <td><strong>Checker:</strong></td>
                                                            <td>{{ dataCheckDummy.individual_detail.CHECKER }}</td>
                                                            <td><strong>DOB:</strong></td>
                                                            <td>{{ dataCheckDummy.individual_detail.DOB }}</td>
                                                            <td></td>
                                                            <td></td>
                                                          </tr>
                                                        </table>
                                                      </td>
                                                    </tr>

                                                    <tr>
                                                      <td style="border-top: #000 solid 1px; border-bottom: #000 solid 1px; padding: 5px 0;">
                                                        <table style="width: 100%">
                                                          <tr>
                                                            <td style="width: 140px;"><strong>RELATIONS</strong></td>
                                                            <td><strong>NAME</strong></td>
                                                            <td></td><td></td><td></td><td></td><td></td><td></td>
                                                          </tr>
                                                          <tr>
                                                            <td style="width: 140px;"><strong>Father/Husband:</strong></td>
                                                            <td>
                                                              {{ dataCheckDummy.individual_detail.FATHER_HUSBAND_FNAME }}
                                                              {{ dataCheckDummy.individual_detail.FATHER_HUSBAND_MNAME }}
                                                              {{ dataCheckDummy.individual_detail.FATHER_HUSBAND_LNAME }}
                                                            </td>
                                                            <td></td><td></td><td></td><td></td><td></td><td></td>
                                                          </tr>
                                                        </table>
                                                      </td>
                                                    </tr>
                                                  </table>
                                                </div>

                                                <!-- Home + Employer Info (was Blade @foreach) -->
                                                <template v-for="(home, idx) in dataCheckDummy.individual_detail.homeInformation" :key="idx">
                                                  <div style="border: #000 solid 1px; margin: 0 5px 0 5px; padding: 0 5px;">
                                                    <table style="width: 100%;">
                                                      <tr>
                                                        <td>
                                                          <table style="width: 100%; margin: 5px 0 10px;">
                                                            <tr>
                                                              <td>
                                                                <strong style="font-size: 11px;">{{ String(home.SEQ_NO).toUpperCase() }} ADDRESS INFORMATION</strong>
                                                              </td>
                                                              <td align="right">
                                                                <strong style="font-size: 11px;">Reported On: {{ home.REPORTED_ON }}</strong>
                                                              </td>
                                                            </tr>
                                                          </table>
                                                        </td>
                                                      </tr>

                                                      <tr>
                                                        <td>
                                                          <table style="width: 100%">
                                                            <tr>
                                                              <td><strong>Residential Address:</strong></td>
                                                              <td>{{ home.ADDRESS }}, {{ home.CITY }}</td>
                                                              <td></td><td></td>
                                                            </tr>
                                                            <tr>
                                                              <td><strong>Village:</strong></td>
                                                              <td>---</td>
                                                              <td><strong>Chak:</strong></td>
                                                              <td>---</td>
                                                            </tr>
                                                            <tr>
                                                              <td><strong>Tehsil/Town:</strong></td>
                                                              <td>---</td>
                                                              <td><strong>U.C.:</strong></td>
                                                              <td>---</td>
                                                            </tr>
                                                            <tr>
                                                              <td><strong>Electricity Consumer #:</strong></td>
                                                              <td>---</td>
                                                              <td><strong>Phone#:</strong></td>
                                                              <td>{{ home.PHONE1 }}</td>
                                                            </tr>
                                                            <tr>
                                                              <td><strong>Gas Consumer#:</strong></td>
                                                              <td>---</td>
                                                              <td><strong>Cell#:</strong></td>
                                                              <td>{{ home.PHONE2 }}</td>
                                                            </tr>
                                                          </table>
                                                        </td>
                                                      </tr>

                                                      <tr>
                                                        <td style="border-top: #000 solid 1px;">
                                                          <table style="width: 100%; margin: 5px 0 0;">
                                                            <tr>
                                                              <td></td>
                                                              <td align="right">
                                                                <strong style="font-size: 11px;">Reported On: {{ home.employerInformationF.REPORTED_ON }}</strong>
                                                              </td>
                                                            </tr>
                                                          </table>
                                                        </td>
                                                      </tr>

                                                      <tr>
                                                        <td style="border-bottom: #000 solid 1px; padding: 5px 0;">
                                                          <table style="width: 100%">
                                                            <tr>
                                                              <td><strong>Company Name:</strong></td>
                                                              <td>{{ home.employerInformationF.EMPLOYER }}</td>
                                                              <td></td><td></td>
                                                            </tr>
                                                            <tr>
                                                              <td><strong>Ownership Status:</strong></td>
                                                              <td>---</td>
                                                              <td><strong>Business Category:</strong></td>
                                                              <td>---</td>
                                                            </tr>
                                                            <tr>
                                                              <td><strong>Address:</strong></td>
                                                              <td>{{ home.employerInformationF.ADDRESS }}, {{ home.employerInformationF.CITY }}</td>
                                                              <td></td><td></td>
                                                            </tr>
                                                            <tr>
                                                              <td><strong>Village:</strong></td>
                                                              <td>---</td>
                                                              <td><strong>Chak:</strong></td>
                                                              <td>---</td>
                                                            </tr>
                                                            <tr>
                                                              <td><strong>Tehsil/Town:</strong></td>
                                                              <td>---</td>
                                                              <td><strong>U.C.:</strong></td>
                                                              <td>---</td>
                                                            </tr>
                                                            <tr>
                                                              <td><strong>Phone#:</strong></td>
                                                              <td>{{ home.employerInformationF.PHONE1 }}</td>
                                                              <td><strong>Cell#:</strong></td>
                                                              <td>{{ home.employerInformationF.PHONE2 }}</td>
                                                            </tr>
                                                          </table>
                                                        </td>
                                                      </tr>
                                                    </table>
                                                  </div>
                                                </template>

                                                <div style="padding: 10px 5px 0;">
                                                  <h2 style="font-size: 13px; margin-bottom: 10px; line-height: 20px;">Credit Score:</h2>
                                                  <div>
                                                    <table class="inner-table">
                                                      <tr>
                                                        <td style="font-size: 13px; line-height: 20px; font-weight: 600; border: #000 solid 1px;">
                                                          Scoring Service not Availed
                                                        </td>
                                                      </tr>
                                                    </table>
                                                  </div>

                                                  <h2 style="font-size: 13px; margin-bottom: 10px; line-height: 20px;">Default History:</h2>
                                                  <div>
                                                    <table class="inner-table">
                                                      <tr>
                                                        <th>Member</th>
                                                        <th>Branch</th>
                                                        <th>Date</th>
                                                        <th>Account#</th>
                                                        <th>Amount</th>
                                                        <th>TY</th>
                                                        <th>ST</th>
                                                        <th>RR</th>
                                                        <th>AC</th>
                                                        <th>Group Id</th>
                                                      </tr>

                                                      <tr v-for="(d, i) in dataCheckDummy.individual_detail.dataCheckDefaults" :key="i">
                                                        <td>** {{ d.MEM_NAME }} <br /> * {{ d.MEM_NAME }}</td>
                                                        <td>{{ d.SUBBRN_NAME }} <br /> {{ d.SUBBRN_NAME }}</td>
                                                        <td>{{ d.UPD_STATUS_DATE }} <br /> {{ d.ORG_STATUS_DATE }}</td>
                                                        <td>{{ d.UPD_ACCT_NO }} <br /> {{ d.ORG_ACCT_NO }}</td>
                                                        <td>{{ d.UPD_AMOUNT }} <br /> {{ d.ORG_AMOUNT }}</td>
                                                        <td>{{ d.UPD_ACCT_TY }} <br /> {{ d.ORG_ACCT_TY }}</td>
                                                        <td>{{ d.UPD_STATUS }} <br /> {{ d.ORG_STATUS }}</td>
                                                        <td>{{ d.UPD_RTR }} <br /> {{ d.ORG_RTR }}</td>
                                                        <td>{{ d.ASSOC_TY }}</td>
                                                        <td>{{ d.GROUP_ID }}</td>
                                                      </tr>
                                                    </table>

                                                    <div style="text-align: center; font-size: 13px; margin-bottom: 10px; line-height: 20px; font-weight: 600;">
                                                      ** Latest Record, * Original Record
                                                    </div>
                                                  </div>

                                                  <h2 style="font-size: 13px; margin-bottom: 10px; line-height: 20px;">File Notes:</h2>
                                                  <div>
                                                    <table class="inner-table">
                                                      <tr>
                                                        <th>Ref. Date</th>
                                                        <th>Account#</th>
                                                        <th>Comments</th>
                                                      </tr>
                                                      <tr>
                                                        <td colspan="3" style="text-align:center;">(No notes in dummy data)</td>
                                                      </tr>
                                                    </table>
                                                  </div>
                                                </div>
                                              </div>

                                              <!-- PAGE 2 -->
                                              <div class="main-page">
                                                <div style="padding: 10px 5px 0;">
                                                  <h2 style="font-size: 13px; margin-bottom: 10px; line-height: 20px;">CCP:</h2>

                                                  <div v-for="(m, i) in dataCheckDummy.individual_detail.dataCheckCcpMaster" :key="i">
                                                    <table class="inner-table">
                                                      <tr>
                                                        <th>Member, Branch</th>
                                                        <th>Account#</th>
                                                        <th>Term,TY, ST</th>
                                                        <th>Amount Disbursed</th>
                                                        <th>Open Date</th>
                                                        <th>Maturity Date</th>
                                                        <th>AC</th>
                                                        <th>Status Date</th>
                                                        <th>Last Payment</th>
                                                        <th>Overdue Amount</th>
                                                        <th>Outstanding Balance</th>
                                                        <th>Payment Status</th>
                                                      </tr>

                                                      <tr>
                                                        <td>{{ m.MEM_NAME }}<span v-if="m.SUBBRN_NAME">, <br /></span>{{ m.SUBBRN_NAME }}</td>
                                                        <td>{{ m.ACCT_NO }}</td>
                                                        <td>{{ m.TERM }}, {{ m.ACCT_TY }}, {{ m.ACCT_STATUS }}</td>
                                                        <td>{{ m.MASTER_LIMIT }}</td>
                                                        <td>{{ m.OPEN_DATE }}</td>
                                                        <td>{{ m.MATURITY_DATE }}</td>
                                                        <td>PRN</td>
                                                        <td>{{ m.STATUS_DATE }}</td>
                                                        <td>{{ m.LAST_PAYMENT }}</td>
                                                        <td>{{ m.OVERDUEAMOUNT }}</td>
                                                        <td>{{ m.BALANCE }}</td>
                                                        <td>{{ m.PAYMENT_STATUS }}</td>
                                                      </tr>

                                                      <tr>
                                                        <td v-for="(d, k) in m.ccpDetails" :key="k">
                                                          {{ d.STATUS_MONTH.slice(0, -4) }}/{{ d.STATUS_MONTH.slice(-4) }}
                                                        </td>
                                                      </tr>

                                                      <tr>
                                                        <td v-for="(d, k) in m.ccpDetails" :key="k">
                                                          {{ d.PAYMENT_STATUS }}
                                                        </td>
                                                      </tr>
                                                    </table>
                                                  </div>

                                                  <h2 style="font-size: 13px; margin-bottom: 10px; line-height: 20px;">Delinquency Summary (12 Months):</h2>
                                                  <div>
                                                    <table class="inner-table">
                                                      <tr>
                                                        <th>Member, Branch</th>
                                                        <th>A/C Type</th>
                                                        <th>Amount Disbursed</th>
                                                        <th>A/C Status</th>
                                                        <th>OK</th>
                                                        <th>X</th>
                                                        <th>30+</th>
                                                        <th>60+</th>
                                                        <th>90+</th>
                                                        <th>120+</th>
                                                        <th>150+</th>
                                                        <th>180+</th>
                                                      </tr>

                                                      <tr v-for="(m, i) in dataCheckDummy.individual_detail.dataCheckCcpMaster" :key="i">
                                                        <td>{{ m.MEM_NAME }}<span v-if="m.SUBBRN_NAME">, <br /></span>{{ m.SUBBRN_NAME }}</td>
                                                        <td>{{ m.ACCT_TY }}</td>
                                                        <td>{{ m.MASTER_LIMIT }}</td>
                                                        <td>{{ m.ACCT_STATUS }}</td>
                                                        <td>{{ m.ccpSummary.OK }}</td>
                                                        <td>{{ m.ccpSummary.X }}</td>
                                                        <td>{{ m.ccpSummary.P30 }}</td>
                                                        <td>{{ m.ccpSummary.P60 }}</td>
                                                        <td>{{ m.ccpSummary.P90 }}</td>
                                                        <td>{{ m.ccpSummary.P120 }}</td>
                                                        <td>{{ m.ccpSummary.P150 }}</td>
                                                        <td>{{ m.ccpSummary.P180 }}</td>
                                                      </tr>

                                                      <tr>
                                                        <td colspan="4" align="right" style="font-size: 13px; line-height: 13px; font-weight: 600;">Total</td>
                                                        <td>{{ dataCheckDummy.individual_detail.dataCheckCcpSummaryTotal.OK }}</td>
                                                        <td>{{ dataCheckDummy.individual_detail.dataCheckCcpSummaryTotal.X }}</td>
                                                        <td>{{ dataCheckDummy.individual_detail.dataCheckCcpSummaryTotal.P30 }}</td>
                                                        <td>{{ dataCheckDummy.individual_detail.dataCheckCcpSummaryTotal.P60 }}</td>
                                                        <td>{{ dataCheckDummy.individual_detail.dataCheckCcpSummaryTotal.P90 }}</td>
                                                        <td>{{ dataCheckDummy.individual_detail.dataCheckCcpSummaryTotal.P120 }}</td>
                                                        <td>{{ dataCheckDummy.individual_detail.dataCheckCcpSummaryTotal.P150 }}</td>
                                                        <td>{{ dataCheckDummy.individual_detail.dataCheckCcpSummaryTotal.P180 }}</td>
                                                      </tr>
                                                    </table>
                                                  </div>

                                                  <h2 style="font-size: 13px; margin-bottom: 10px; line-height: 20px;">Credit Apps:</h2>
                                                  <div>
                                                    <table class="inner-table">
                                                      <tr>
                                                        <th>Member</th>
                                                        <th>Branch</th>
                                                        <th>Application Date</th>
                                                        <th>Application Id</th>
                                                        <th>Amount</th>
                                                        <th>TY</th>
                                                        <th>AC</th>
                                                        <th>Group Id</th>
                                                      </tr>
                                                      <tr v-for="(e, i) in dataCheckDummy.individual_detail.dataCheckEnquiries" :key="i">
                                                        <td>{{ e.MEM_NAME }}</td>
                                                        <td>{{ e.SUBBRN_NAME }}</td>
                                                        <td>{{ e.REFERENCE_DATE }}</td>
                                                        <td>{{ e.REFERENCE_NO }}</td>
                                                        <td>{{ e.AMOUNT }}</td>
                                                        <td>{{ e.ACCT_TY }}</td>
                                                        <td>{{ e.ASSOC_TY }}</td>
                                                        <td>-</td>
                                                      </tr>
                                                    </table>
                                                  </div>

                                                  <h2 style="font-size: 13px; margin-bottom: 10px; line-height: 20px;">Credit Review:</h2>
                                                  <div>
                                                    <table class="inner-table">
                                                      <tr>
                                                        <th>Member</th>
                                                        <th>Reviews</th>
                                                      </tr>

                                                      <tr v-for="(r, i) in dataCheckDummy.individual_detail.dataCheckReview" :key="i">
                                                        <td>{{ r.MEMBER }}</td>
                                                        <td>{{ r.REVIEWS }}</td>
                                                      </tr>

                                                      <tr>
                                                        <td>Total</td>
                                                        <td>{{ dataCheckDummy.individual_detail.dataCheckReview.reduce((sum, r) => sum + Number(r.REVIEWS || 0), 0) }}</td>
                                                      </tr>
                                                    </table>
                                                  </div>

                                                  <div style="text-align: center;">
                                                    <table>
                                                      <tr>
                                                        <td>
                                                          <p style="font-weight: 600">
                                                            TY : Account Type , ST : Account Status , RR : Reason to Report , AC : Association Code
                                                            The information provided is only for the purpose of evaluation of the customer and whatever is contained herein is data supplied by members.
                                                            <br />
                                                            *** END OF CREDIT REPORT ***
                                                          </p>
                                                        </td>
                                                      </tr>
                                                    </table>
                                                  </div>

                                                </div>
                                              </div>
                                            </div>
                                          </div>

                                          <div v-else class="mt-4 border rounded-lg p-4 bg-gray-50 shadow">
                                            <p class="text-sm text-gray-500">
                                              Click “Get DataCheck Report” to render the report layout.
                                            </p>
                                          </div>
                                        </div>


                                    <!-- Tasdeeq Tab -->
                                    <div v-if="currentTab === 'Tasdeeq'">
                                      <div class="flex items-center justify-between">
                                        <SectionHeader
                                          title="Tasdeeq"
                                          description="Generate and view Tasdeeq report for this applicant."
                                        />

                                        <div class="flex items-center gap-2">
                                          <button
                                            class="px-4 py-2 bg-[#75ba2c] text-white font-medium rounded shadow hover:bg-[#75ba2c] focus:outline-none"
                                            @click="getTasdeeqReport"
                                          >
                                            Get Tasdeeq Report
                                          </button>

                                          <!-- optional print (enable later if you want) -->
                                          <!--
                                          <button
                                            v-if="showTasdeeqReport"
                                            class="px-4 py-2 bg-slate-900 text-white font-medium rounded shadow hover:bg-slate-800 focus:outline-none"
                                            @click="window.print()"
                                          >
                                            Print
                                          </button>
                                          -->
                                        </div>
                                      </div>

                                      <!-- Report -->
                                      <div v-if="showTasdeeqReport" class="mt-4">
                                        <!-- Keep report styles scoped to this block -->

                                        <!-- IMPORTANT:
                                          We keep original layout, just remove blade variables and replace with Vue bindings.
                                          Images: use a local asset path you already have in public, e.g. /images/logo.jpg
                                        -->
                                        <div class="tasdeeq-report" style="margin: 0; background-color: #e6e6e6; padding: 10px;">

                                          <!-- PAGE 1 -->
                                          <div class="main-page">
                                            <div style="padding: 20px 5px 10px; margin: 0 0 10px; border-bottom: #dedede solid 2px;">
                                              <table style="width: 100%;">
                                                <tr>
                                                  <td style="vertical-align: middle;">
                                                    <img src="/Tasdeeq_Logo_1.png" alt="logo" style="max-width: 115px; margin: 0;" />
                                                  </td>
                                                  <td align="center" style="vertical-align: middle;">
                                                    <h1 style="font-size: 13px; line-height: 15px; text-transform: uppercase; margin:0; color: #000;">
                                                      CONSUMER CREDIT INFORMATION REPORT
                                                    </h1>
                                                  </td>
                                                  <td align="right" style="vertical-align: middle;">
                                                    <div style="display: inline-block; text-align: right;">
                                                      <span style="display: block; font-size: 13px; font-weight: 700; line-height: 15px;">CONFIDENTIAL</span>
                                                      <span style="display: block; font-size: 12px; font-weight: 500; line-height: 13px;">
                                                        Date Time: {{ tasdeeqDummy.other_details.reportDate }} {{ tasdeeqDummy.other_details.reportTime }}
                                                      </span>
                                                      <span style="display: block; font-size: 12px; font-weight: 500; line-height: 13px;">
                                                        Report Ref No: {{ tasdeeqDummy.other_details.refNo }}
                                                      </span>
                                                    </div>
                                                  </td>
                                                </tr>
                                              </table>
                                            </div>

                                            <!-- Personal Information -->
                                            <div style="padding: 0px; border: #dedede solid 2px; margin-bottom: 10px; border-radius: 2px;">
                                              <table style="width: 100%;">
                                                <tr>
                                                  <td>
                                                    <table style="width: 100%">
                                                      <thead>
                                                        <tr>
                                                          <th align="left" colspan="6" style="background-color: #2e74b7; color: #fff; text-transform: uppercase; padding: 5px 10px;">
                                                            Personel Information
                                                          </th>
                                                        </tr>
                                                      </thead>
                                                      <tbody>
                                                        <tr>
                                                          <td style="padding: 0px 5px;"><strong>Name:</strong></td>
                                                          <td colspan="3" style="padding: 0px 5px;">{{ tasdeeqDummy.personal.NAME }}</td>
                                                          <td style="padding: 0px 5px;"><strong>Father/Husband Name:</strong></td>
                                                          <td style="padding: 0px 5px;">{{ tasdeeqDummy.personal.FATHER_OR_HUSBAND_NAME }}</td>
                                                        </tr>
                                                        <tr>
                                                          <td style="padding: 0px 5px;"><strong>Gender:</strong></td>
                                                          <td style="padding: 0px 5px;">{{ tasdeeqDummy.personal.GENDER }}</td>
                                                          <td style="padding: 0px 5px;"><strong>CNIC:</strong></td>
                                                          <td style="padding: 0px 5px;">{{ tasdeeqDummy.personal.CNIC }}</td>
                                                          <td style="padding: 0px 5px;"><strong>Passport No:</strong></td>
                                                          <td style="padding: 0px 5px;">{{ tasdeeqDummy.personal.PASSPORT }}</td>
                                                        </tr>
                                                        <tr>
                                                          <td style="padding: 0px 5px;"><strong>Date Of Birth :</strong></td>
                                                          <td style="padding: 0px 5px;">{{ tasdeeqDummy.personal.DOB }}</td>
                                                          <td style="padding: 0px 5px;"><strong>NIC:</strong></td>
                                                          <td style="padding: 0px 5px;">{{ tasdeeqDummy.personal.NIC }}</td>
                                                          <td style="padding: 0px 5px;"><strong>Business/Profession:</strong></td>
                                                          <td style="padding: 0px 5px;">{{ tasdeeqDummy.personal.BUSINESS_OR_PROFESSION }}</td>
                                                        </tr>
                                                        <tr>
                                                          <td style="padding: 0px 5px;"><strong>Nationality:</strong></td>
                                                          <td style="padding: 0px 5px;">{{ tasdeeqDummy.personal.NATIONALITY }}</td>
                                                          <td style="padding: 0px 5px;"><strong>NTN:</strong></td>
                                                          <td style="padding: 0px 5px;">{{ tasdeeqDummy.personal.NTN }}</td>
                                                          <td style="padding: 0px 5px;"><strong>Borrower Type:</strong></td>
                                                          <td style="padding: 0px 5px;">{{ tasdeeqDummy.personal.BORROWER_TYPE }}</td>
                                                        </tr>
                                                        <tr>
                                                          <td style="padding: 0px 5px;"><strong>Current Residential Address:</strong></td>
                                                          <td colspan="6" style="padding: 0px 5px;">
                                                            {{ tasdeeqDummy.personal.CURRENT_RESIDENTIAL_ADDRESS }}
                                                            (As of : {{ tasdeeqDummy.personal.CURRENT_RESIDENTIAL_ADDRESS_DATE }})
                                                          </td>
                                                        </tr>
                                                        <tr>
                                                          <td style="padding: 0px 5px;"><strong>Present Address:</strong></td>
                                                          <td colspan="6" style="padding: 0px 5px;">
                                                            {{ tasdeeqDummy.personal.PERMANENT_ADDRESS }}
                                                            (As of : {{ tasdeeqDummy.personal.PERMANENT_ADDRESS_DATE }})
                                                          </td>
                                                        </tr>
                                                        <tr>
                                                          <td style="padding: 0px 5px;"><strong>Previous Residential Address:</strong></td>
                                                          <td colspan="6" style="padding: 0px 5px;">
                                                            {{ tasdeeqDummy.personal.PREVIOUS_RESIDENTIAL_ADDRESS }}
                                                            (As of : {{ tasdeeqDummy.personal.PREVIOUS_RESIDENTIAL_ADDRESS_DATE }})
                                                          </td>
                                                        </tr>
                                                        <tr>
                                                          <td style="padding: 0px 5px;"><strong>Employer/ Business:</strong></td>
                                                          <td colspan="6" style="padding: 0px 5px;">
                                                            {{ tasdeeqDummy.personal.EMPLOYER_OR_BUSINESS }}
                                                            (As of : {{ tasdeeqDummy.personal.EMPLOYER_OR_BUSINESS_DATE }})
                                                          </td>
                                                        </tr>
                                                      </tbody>
                                                    </table>
                                                  </td>
                                                </tr>
                                              </table>
                                            </div>

                                            <!-- Summary -->
                                            <div style="padding: 0px; border: #dedede solid 2px; border-radius: 2px; margin-bottom: 10px">
                                              <table style="width: 100%;">
                                                <tr>
                                                  <td>
                                                    <table style="width: 100%">
                                                      <thead>
                                                        <tr>
                                                          <th align="left" colspan="6" style="background-color: #2e74b7; color: #fff; text-transform: uppercase; padding: 5px 10px;">
                                                            SUMMARY OF INFORMATION CONTAINED IN THIS REPORT
                                                          </th>
                                                        </tr>
                                                      </thead>
                                                      <tbody>
                                                        <tr>
                                                          <td align="center" style="padding: 10px 5px;">
                                                            <div class="number-box">{{ tasdeeqDummy.other_details.noOfCreditEnquiry }}</div>
                                                            <span>No. of Credit Enquiries (Last 12 Months)</span>
                                                          </td>
                                                          <td align="center" style="padding: 10px 5px;">
                                                            <div class="number-box">{{ tasdeeqDummy.other_details.noOfActiveAccounts }}</div>
                                                            <span>No. of Active Accounts</span>
                                                          </td>
                                                          <td align="center" style="padding: 10px 5px;">
                                                            <div class="number-box">{{ tasdeeqDummy.other_details.totalOutstandingBalance }}</div>
                                                            <span>Total Outstanding Balance</span>
                                                          </td>
                                                        </tr>
                                                      </tbody>
                                                    </table>
                                                  </td>
                                                </tr>
                                              </table>
                                            </div>

                                            <!-- Overdue Summary last 24 months (static) -->
                                            <div style="padding: 0px; border: #dedede solid 2px; border-radius: 2px; margin-bottom: 10px">
                                              <table style="width: 100%;" class="content-bordered-tabler">
                                                <tr>
                                                  <td>
                                                    <table style="width: 100%">
                                                      <thead>
                                                        <tr>
                                                          <th align="left" colspan="8" style="background-color: #2e74b7; color: #fff; text-transform: uppercase; padding: 5px 10px;">
                                                            OVERDUE SUMMARY OF LOANS FOR LAST 24 MONTHS
                                                          </th>
                                                        </tr>
                                                        <tr>
                                                          <th style="background-color: #8496b0; color: #fff;"> </th>
                                                          <th style="background-color: #8496b0; color: #fff;">30+</th>
                                                          <th style="background-color: #8496b0; color: #fff;">60+</th>
                                                          <th style="background-color: #8496b0; color: #fff;">90+</th>
                                                          <th style="background-color: #8496b0; color: #fff;">120+</th>
                                                          <th style="background-color: #8496b0; color: #fff;">150+</th>
                                                          <th style="background-color: #8496b0; color: #fff;">180+</th>
                                                          <th style="background-color: #8496b0; color: #fff;">MFI Default</th>
                                                        </tr>
                                                      </thead>
                                                      <tbody>
                                                        <tr>
                                                          <td align="center" style="padding: 1px 5px;"><strong>No. of Times</strong></td>
                                                          <td align="center" style="padding: 1px 5px;">1</td>
                                                          <td align="center" style="padding: 1px 5px;">0</td>
                                                          <td align="center" style="padding: 1px 5px;">0</td>
                                                          <td align="center" style="padding: 1px 5px;">0</td>
                                                          <td align="center" style="padding: 1px 5px;">0</td>
                                                          <td align="center" style="padding: 1px 5px;">0</td>
                                                          <td align="center" style="padding: 1px 5px;">0</td>
                                                        </tr>
                                                      </tbody>
                                                    </table>
                                                  </td>
                                                </tr>
                                              </table>
                                            </div>

                                            <!-- Status of credit applications (static sample) -->
                                            <div style="padding: 0px; border: #dedede solid 2px; border-radius: 2px; margin-bottom: 10px">
                                              <table style="width: 100%;" class="content-bordered-tabler">
                                                <tr>
                                                  <td>
                                                    <table style="width: 100%">
                                                      <thead>
                                                        <tr>
                                                          <th align="left" colspan="5" style="background-color: #2e74b7; color: #fff; text-transform: uppercase; padding: 5px 10px;">
                                                            DETAILS OF STATUS OF CREDIT APPLICATIONS FOR LAST 24 MONTHS
                                                          </th>
                                                        </tr>
                                                        <tr>
                                                          <th style="background-color: #8496b0; color: #fff;">Product</th>
                                                          <th style="background-color: #8496b0; color: #fff;">Financial Institution</th>
                                                          <th style="background-color: #8496b0; color: #fff;">Date of Application</th>
                                                          <th style="background-color: #8496b0; color: #fff;">Amount of Facility</th>
                                                          <th style="background-color: #8496b0; color: #fff;">Status</th>
                                                        </tr>
                                                      </thead>
                                                      <tbody>
                                                        <tr>
                                                          <td align="center" style="padding: 1px 5px;">Personal Loan</td>
                                                          <td align="center" style="padding: 1px 5px;">Dummy Bank</td>
                                                          <td align="center" style="padding: 1px 5px;">01/08/2025</td>
                                                          <td align="center" style="padding: 1px 5px;">PKR 50,000</td>
                                                          <td align="center" style="padding: 1px 5px;">Approved</td>
                                                        </tr>
                                                      </tbody>
                                                    </table>
                                                  </td>
                                                </tr>
                                              </table>
                                            </div>

                                            <!-- Settlement of loans (static sample) -->
                                            <div style="padding: 0px; border: #dedede solid 2px; border-radius: 2px; margin-bottom: 10px">
                                              <table style="width: 100%;" class="content-bordered-tabler">
                                                <tr>
                                                  <td>
                                                    <table style="width: 100%">
                                                      <thead>
                                                        <tr>
                                                          <th align="left" colspan="6" style="background-color: #2e74b7; color: #fff; text-transform: uppercase; padding: 5px 10px;">
                                                            DETAILS OF SETTLEMENT OF LOANS FOR LAST FIVE YEARS
                                                          </th>
                                                        </tr>
                                                        <tr>
                                                          <th style="background-color: #8496b0; color: #fff;">Product</th>
                                                          <th style="background-color: #8496b0; color: #fff;">Total Limit</th>
                                                          <th style="background-color: #8496b0; color: #fff;">Approval Date</th>
                                                          <th style="background-color: #8496b0; color: #fff;">Relationship Date</th>
                                                          <th style="background-color: #8496b0; color: #fff;">Maturity Date</th>
                                                          <th style="background-color: #8496b0; color: #fff;">Date of Settlement</th>
                                                        </tr>
                                                      </thead>
                                                      <tbody>
                                                        <tr>
                                                          <td align="center" style="padding: 1px 5px;">Auto Loan</td>
                                                          <td align="center" style="padding: 1px 5px;">PKR 200,000</td>
                                                          <td align="center" style="padding: 1px 5px;">01/01/2022</td>
                                                          <td align="center" style="padding: 1px 5px;">01/02/2022</td>
                                                          <td align="center" style="padding: 1px 5px;">01/01/2024</td>
                                                          <td align="center" style="padding: 1px 5px;">01/01/2024</td>
                                                        </tr>
                                                      </tbody>
                                                    </table>
                                                  </td>
                                                </tr>
                                              </table>
                                            </div>

                                            <!-- Enquiries (static sample) -->
                                            <div style="padding: 0px; border: #dedede solid 2px; border-radius: 2px; margin-bottom: 10px">
                                              <table style="width: 100%;" class="content-bordered-tabler">
                                                <tr>
                                                  <td>
                                                    <table style="width: 100%">
                                                      <thead>
                                                        <tr>
                                                          <th align="left" colspan="5" style="background-color: #2e74b7; color: #fff; text-transform: uppercase; padding: 5px 10px;">
                                                            DETAILS OF ENQUIRIES FOR LAST 24 MONTHS
                                                          </th>
                                                        </tr>
                                                        <tr>
                                                          <th style="background-color: #8496b0; color: #fff;">Sr.</th>
                                                          <th style="background-color: #8496b0; color: #fff;">FI Type</th>
                                                          <th style="background-color: #8496b0; color: #fff;">Date of Enquiry</th>
                                                        </tr>
                                                      </thead>
                                                      <tbody>
                                                        <tr>
                                                          <td align="center" style="padding: 1px 5px;">1</td>
                                                          <td align="center" style="padding: 1px 5px;">FINCA Microfinance Bank Limited</td>
                                                          <td align="center" style="padding: 1px 5px;">20/07/2025</td>
                                                        </tr>
                                                        <tr>
                                                          <td align="center" style="padding: 1px 5px;">2</td>
                                                          <td align="center" style="padding: 1px 5px;">Dummy Bank</td>
                                                          <td align="center" style="padding: 1px 5px;">10/11/2025</td>
                                                        </tr>
                                                      </tbody>
                                                    </table>
                                                  </td>
                                                </tr>
                                              </table>
                                            </div>
                                          </div>

                                          <!-- PAGE 2 (simplified static “end” page) -->
                                          <div class="main-page">
                                            <div style="padding: 20px 5px 10px; margin: 0 0 10px; border-bottom: #dedede solid 2px;">
                                              <table style="width: 100%;">
                                                <tr>
                                                  <td style="vertical-align: middle;">
                                                    <img src="/Tasdeeq_Logo_1.png" alt="logo" style="max-width: 115px; margin: 0;" />
                                                  </td>
                                                  <td align="center" style="vertical-align: middle;">
                                                    <h1 style="font-size: 13px; line-height: 15px; text-transform: uppercase; margin:0; color: #000;">
                                                      CONSUMER CREDIT INFORMATION REPORT
                                                    </h1>
                                                  </td>
                                                  <td align="right" style="vertical-align: middle;">
                                                    <div style="display: inline-block; text-align: right;">
                                                      <span style="display: block; font-size: 13px; font-weight: 700; line-height: 15px;">CONFIDENTIAL</span>
                                                      <span style="display: block; font-size: 12px; font-weight: 500; line-height: 13px;">
                                                        Date Time: {{ tasdeeqDummy.other_details.reportDate }} {{ tasdeeqDummy.other_details.reportTime }}
                                                      </span>
                                                      <span style="display: block; font-size: 12px; font-weight: 500; line-height: 13px;">
                                                        Report Ref No: {{ tasdeeqDummy.other_details.refNo }}
                                                      </span>
                                                    </div>
                                                  </td>
                                                </tr>
                                              </table>
                                            </div>

                                            <div style="border: #dedede solid 2px; padding: 10px;">
                                              <table>
                                                <tr>
                                                  <td width="55px"><strong>Remarks:</strong></td>
                                                  <td>{{ tasdeeqDummy.other_details.Remarks }}</td>
                                                </tr>
                                              </table>
                                            </div>

                                            <div style="margin-top: 20px; color: #aba7a7;">
                                              <table width="100%;">
                                                <tr>
                                                  <td width="55px">
                                                    <strong style="width: 100%; display: block; text-align: center; border-bottom: #dedede solid 2px;">
                                                      --END OF REPORT--
                                                    </strong>
                                                    <span style="color: #000;">
                                                      Please see below the terms/abbreviations used in this report and their definitions:
                                                    </span>
                                                    <br />
                                                    <span style="color: #000;">
                                                      *Fields and values displayed as blank or with a single asterisk (*) are those for which no data has been reported by any Financial Institution
                                                    </span>
                                                    <br />
                                                    <span style="color: #000;">
                                                      **The information contained in this report is dummy for now. Later you will replace it with API response.
                                                    </span>
                                                  </td>
                                                </tr>
                                              </table>
                                            </div>
                                          </div>
                                        </div>
                                      </div>

                                      <!-- Empty State -->
                                      <div v-else class="mt-4 border rounded-lg p-4 bg-gray-50 shadow">
                                        <p class="text-sm text-gray-500">
                                          Click “Get Tasdeeq Report” to render the report layout.
                                        </p>
                                      </div>
                                    </div>



                                    <!-- OFAC NACTA Tab -->
                                    <div v-if="currentTab === 'Ofac Nacta'">
                                        <div class="flex items-center justify-between">
                                            <!-- Title -->
                                            <SectionHeader title="OFAC NACTA Information"
                                                description="Details about the OFAC NACTA matches." />

                                            <!-- Refresh Button and Loader -->
                                            <div class="flex items-center space-x-2">
                                                <button
                                                    class="px-4 py-2 bg-[#75ba2c] text-white font-medium rounded shadow hover:bg-[#75ba2c] focus:outline-none"
                                                    @click="refreshOfacNacta(selectedRowData.id)"
                                                    :disabled="loadingRefresh">
                                                    Refresh
                                                </button>
                                                <!-- Loader Placeholder -->
                                                <div class="relative w-5 h-5">
                                                    <div v-if="loadingRefresh"
                                                        class="absolute inset-0 loader spinner-border animate-spin border-2 border-gray-300 border-t-indigo-600 rounded-full">
                                                    </div>
                                                </div>
                                            </div>
                                        </div>


                                        <!-- OFAC Matches -->
                                        <div class="mt-4 border rounded-lg p-4 bg-gray-50 shadow">
                                            <h3 class="text-base font-semibold text-gray-900">OFAC Matches</h3>
                                            <template
                                                v-if="selectedRowData?.ofac_nacta?.ofac_matches?.length">
                                                <table class="min-w-full divide-y divide-gray-200 mt-4">
                                                    <thead>
                                                        <tr>
                                                            <th
                                                                class="px-4 py-2 text-left text-sm font-medium text-gray-600">
                                                                AKA</th>
                                                            <th
                                                                class="px-4 py-2 text-left text-sm font-medium text-gray-600">
                                                                Name</th>
                                                            <th
                                                                class="px-4 py-2 text-left text-sm font-medium text-gray-600">
                                                                Country</th>
                                                            <th
                                                                class="px-4 py-2 text-left text-sm font-medium text-gray-600">
                                                                Year of Birth</th>
                                                            <th
                                                                class="px-4 py-2 text-left text-sm font-medium text-gray-600">
                                                                Score</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr v-for="(match, index) in selectedRowData.ofac_nacta.ofac_matches"
                                                            :key="index" class="bg-white odd:bg-gray-50">
                                                            <td class="px-4 py-2 text-sm text-gray-900">{{ match.row.aka
                                                            }}</td>
                                                            <td class="px-4 py-2 text-sm text-gray-900">{{
                                                                match.row.name }}</td>
                                                            <td class="px-4 py-2 text-sm text-gray-900">{{
                                                                match.row.country }}</td>
                                                            <td class="px-4 py-2 text-sm text-gray-900">{{
                                                                match.row.year_of_birth }}</td>
                                                            <td class="px-4 py-2 text-sm text-gray-900">{{ match.score
                                                            }}</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </template>
                                            <p v-else class="text-sm text-gray-500 mt-2">No OFAC Matches available.</p>
                                        </div>

                                        <!-- UNSC Matches -->
                                        <div class="mt-4 border rounded-lg p-4 bg-gray-50 shadow">
                                            <h3 class="text-base font-semibold text-gray-900">UNSC Matches</h3>
                                            <template
                                                v-if="selectedRowData?.ofac_nacta?.unsc_matches?.length">
                                                <table class="min-w-full divide-y divide-gray-200 mt-4">
                                                    <thead>
                                                        <tr>
                                                            <th
                                                                class="px-4 py-2 text-left text-sm font-medium text-gray-600">
                                                                AKA</th>
                                                            <th
                                                                class="px-4 py-2 text-left text-sm font-medium text-gray-600">
                                                                Name</th>
                                                            <th
                                                                class="px-4 py-2 text-left text-sm font-medium text-gray-600">
                                                                Country</th>
                                                            <th
                                                                class="px-4 py-2 text-left text-sm font-medium text-gray-600">
                                                                Year of Birth</th>
                                                            <th
                                                                class="px-4 py-2 text-left text-sm font-medium text-gray-600">
                                                                Score</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr v-for="(match, index) in selectedRowData.ofac_nacta.unsc_matches"
                                                            :key="index" class="bg-white odd:bg-gray-50">
                                                            <td class="px-4 py-2 text-sm text-gray-900">{{ match.row.aka
                                                            }}</td>
                                                            <td class="px-4 py-2 text-sm text-gray-900">{{
                                                                match.row.name }}</td>
                                                            <td class="px-4 py-2 text-sm text-gray-900">{{
                                                                match.row.country }}</td>
                                                            <td class="px-4 py-2 text-sm text-gray-900">{{
                                                                match.row.year_of_birth }}</td>
                                                            <td class="px-4 py-2 text-sm text-gray-900">{{ match.score
                                                            }}</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </template>
                                            <p v-else class="text-sm text-gray-500 mt-2">No UNSC Matches available.</p>
                                        </div>
                                    </div>
                                </div>
                            </DialogPanel>
                        </TransitionChild>
                    </div>
                </div>
            </Dialog>
        </TransitionRoot>
    </div>
</template>


<style scoped>
/* Tasdeeq report styles only */
.tasdeeq-report * {
  box-sizing: border-box;
  -moz-box-sizing: border-box;
}

.tasdeeq-report td {
  vertical-align: top;
}

.tasdeeq-report {
  font-size: 9px;
  line-height: 16px;
  padding: 0;
  font-family: verdana;
}

.tasdeeq-report .urdu {
  font-size: 7px;
  line-height: 22px;
  font-weight: 500;
}

.tasdeeq-report .main-page {
  width: 210mm;
  margin: 0 auto;
  position: relative;
  background-color: #fff;
  margin-bottom: 10px;
  padding: 20px;
}

.tasdeeq-report .inner-table {
  width: 100%;
  text-align: center;
  border-left: #000 solid 1px;
  border-right: #000 solid 1px;
  margin: 10px 0;
}

.tasdeeq-report .inner-table th {
  color: #000;
  border-top: #000 solid 1px;
  border-left: #000 solid 1px;
  border-bottom: #000 solid 1px;
  padding: 5px;
  font-size: 9px;
  line-height: 13px;
}

.tasdeeq-report .inner-table th:first-child {
  border-left: none;
}

.tasdeeq-report .inner-table td {
  font-size: 8px;
  line-height: 13px;
  border-left: #000 solid 1px;
  border-bottom: #000 solid 1px;
  padding: 5px;
}

.tasdeeq-report .inner-table td:first-child {
  border-left: none;
}

.tasdeeq-report .number-box {
  max-width: 150px;
  margin: 0 auto;
  background-color: #d0cece;
  color: #000;
  font-weight: 700;
  font-size: 18px;
  text-align: center;
  padding: 10px 0;
  margin-bottom: 5px;
}

.tasdeeq-report .content-bordered-tabler td {
  border-right: #aaa8ab solid 1px;
  border-top: #aaa8ab solid 1px;
}

.tasdeeq-report .content-bordered-tabler td:last-child {
  border-right: none;
}

/* DataCheck report styles (scoped via wrapper class) */
.datacheck-report * {
  box-sizing: border-box;
  -moz-box-sizing: border-box;
}

.datacheck-report td {
  vertical-align: top;
}

.datacheck-report {
  font-size: 9px;
  line-height: 16px;
  padding: 0;
  font-family: verdana;
}

.datacheck-report .urdu {
  font-size: 7px;
  line-height: 22px;
  font-weight: 500;
}

.datacheck-report .main-page {
  width: 210mm;
  margin: 0 auto;
  border: #000 solid 3px;
  background: #fff;
  margin-bottom: 10px;
  padding-bottom: 10px;
}

.datacheck-report .inner-table {
  width: 100%;
  text-align: center;
  border-left: #000 solid 1px;
  border-right: #000 solid 1px;
  margin: 10px 0;
}

.datacheck-report .inner-table th {
  color: #000;
  border-top: #000 solid 1px;
  border-left: #000 solid 1px;
  border-bottom: #000 solid 1px;
  padding: 5px;
  font-size: 9px;
  line-height: 13px;
}

.datacheck-report .inner-table th:first-child {
  border-left: none;
}

.datacheck-report .inner-table td {
  font-size: 8px;
  line-height: 13px;
  border-left: #000 solid 1px;
  border-bottom: #000 solid 1px;
  padding: 5px;
}

.datacheck-report .inner-table td:first-child {
  border-left: none;
}

.datacheck-report .btn {
  background: #e0e0e0 none repeat scroll 0 0;
  border: none;
  border-radius: 3px;
  margin: 20px 0 0;
  padding: 6px 21px;
  cursor: pointer;
}

</style>

