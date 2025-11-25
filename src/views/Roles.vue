<script setup>
import { ref, onMounted } from 'vue'
import Table from '../components/Table.vue' // Correct path to Table component
import axios from 'axios'
import { useRouter } from 'vue-router' // Import useRouter
import { showMessageAlert } from '../utils/alert'
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue'
import { EllipsisVerticalIcon, PencilIcon, TrashIcon } from '@heroicons/vue/20/solid'
import API from '../utils/baseApi'

const router = useRouter()

const columns = [
    { Header: 'ID', accessor: 'id' },
    { Header: 'Name', accessor: 'slug' },
    { Header: 'Action', accessor: 'actions', slotName: "actions" },
]

const roleData = ref([]) // Initialize data as an empty array
const loading = ref(false)
const pageCount = ref(0)
const recordCount = ref(0)

const fetchRoleData = async ({ pageIndex = 0, pageSize = 10, search = '' }) => {
    loading.value = true

    try {
        const params = {
            pagination: true,
            page: pageIndex + 1, // Convert 0-based index to 1-based
            per_page: pageSize,
            search: search.trim(), // Trim whitespace from the search query
        }

        const response = await axios.get(API.ROLES, {
            params,
        })

        const { data, meta } = response.data

        if (data) {
            roleData.value = data
            pageCount.value = data.length || 0
            recordCount.value = meta?.total || 0
        } else {
            console.warn('No data found in API response:', response.data)
        }
    } catch (error) {
        console.error('Error fetching role data:', error?.response?.data || error.message)
    } finally {
        loading.value = false
    }
}

const handleAction = (action, row) => {
    if (action === 'Edit') {
        console.log('Edit action on:', row)
    } else if (action === 'Delete') {
        console.log('Delete action on:', row)
    }
}

const goToAddRole = () => {
    router.push({ name: 'AddRole' })
}

const handleEdit = (row) => {
    router.push({ name: 'EditRole', params: { id: row.id } })
}

const handleDelete = async (row) => {
    const isConfirmed = window.confirm('Are you sure you want to delete this role?')

    if (isConfirmed) {
        try {
            const response = await axios.delete(API.ROLES + `${row.id}`)

            showMessageAlert({ message: 'Role deleted successfully!', type: 'success' })
            await fetchRoleData({})
        } catch (error) {
            showMessageAlert({ message: 'Role deletion failed!', type: 'error' })
            console.error('Error deleting role:', error)
        }
    }
}

onMounted(() => {
    fetchRoleData({ pageIndex: 0, pageSize: 10 })
})
</script>

<template>
    <div class="px-2 sm:px-2 lg:px-4">
        <div class="sm:flex sm:items-center">
            <div class="sm:flex-auto">
                <h1 class="text-base font-semibold text-gray-900">Roles</h1>
                <p class="mt-2 text-sm text-gray-700">A list of all roles including their ID and slug.</p>
            </div>
            <div class="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
                <button type="button"
                    class="block rounded-md bg-[#75ba2c] px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-[#78aa43] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    @click="goToAddRole">
                    Add Role
                </button>
            </div>
        </div>

        <div>
            <Table :columns="columns" :data="roleData" :fetchData="fetchRoleData" :loading="loading"
                :pageCount="pageCount" :recordCount="recordCount" :action="['Edit', 'Delete']"
                :actionOnClick="handleAction" :onEdit="handleEdit" :onDelete="handleDelete">

                <template #actions="{ value }">
                    <Menu as="div" class="relative inline-block text-left">
                        <div>
                            <MenuButton
                                class="inline-flex w-full justify-center bg-gray-100 px-1 py-1 rounded-full text-sm font-medium text-white hover:bg-black/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75">

                                <EllipsisVerticalIcon class="h-4 w-4 text-black" aria-hidden="true" />
                            </MenuButton>
                        </div>

                        <transition enter-active-class="transition duration-100 ease-out"
                            enter-from-class="transform scale-95 opacity-0"
                            enter-to-class="transform scale-100 opacity-100"
                            leave-active-class="transition duration-75 ease-in"
                            leave-from-class="transform scale-100 opacity-100"
                            leave-to-class="transform scale-95 opacity-0">
                            <MenuItems
                                class="z-10 absolute right-0 mt-2 w-36 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none">
                                <div class="px-1 py-1">
                                    <MenuItem v-slot="{ active }">
                                    <button :class="[
                                        active ? 'bg-violet-500 text-white' : 'text-gray-900',
                                        'group flex w-full items-center rounded-md px-2 py-2 text-sm',
                                    ]" @click="handleEdit(value)">
                                        <PencilIcon class="size-4 text-black mr-2" aria-hidden="true" />

                                        Edit
                                    </button>
                                    </MenuItem>
                                    <MenuItem v-slot="{ active }">
                                    <button :class="[
                                        active ? 'bg-violet-500 text-white' : 'text-gray-900',
                                        'group flex w-full items-center rounded-md px-2 py-2 text-sm',
                                    ]" @click="handleDelete(value)">
                                        <TrashIcon class="size-4 text-black mr-2" aria-hidden="true" />

                                        Delete
                                    </button>
                                    </MenuItem>
                                </div>
                            </MenuItems>
                        </transition>
                    </Menu>
                </template>
            </Table>
        </div>
    </div>
</template>
