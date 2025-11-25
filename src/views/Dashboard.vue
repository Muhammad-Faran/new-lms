<template>
    <div>
        <TransitionRoot as="template" :show="sidebarOpen">
            <Dialog class="relative z-[100] lg:hidden" @close="sidebarOpen = false">
                <TransitionChild as="template" enter="transition-opacity ease-linear duration-300"
                    enter-from="opacity-0" enter-to="opacity-100" leave="transition-opacity ease-linear duration-300"
                    leave-from="opacity-100" leave-to="opacity-0">
                    <div class="fixed inset-0 bg-gray-900/80" />
                </TransitionChild>

                <div class="fixed inset-0 flex">
                    <TransitionChild as="template" enter="transition ease-in-out duration-300 transform"
                        enter-from="-translate-x-full" enter-to="translate-x-0"
                        leave="transition ease-in-out duration-300 transform" leave-from="translate-x-0"
                        leave-to="-translate-x-full">
                        <DialogPanel class="relative mr-16 flex w-full max-w-xs flex-1">
                            <TransitionChild as="template" enter="ease-in-out duration-300" enter-from="opacity-0"
                                enter-to="opacity-100" leave="ease-in-out duration-300" leave-from="opacity-100"
                                leave-to="opacity-0">
                                <div class="absolute left-full top-0 flex w-16 justify-center pt-5">
                                    <button type="button" class="-m-2.5 p-2.5" @click="sidebarOpen = false">
                                        <span class="sr-only">Close sidebar</span>
                                        <XMarkIcon class="size-6 text-white" aria-hidden="true" />
                                    </button>
                                </div>
                            </TransitionChild>
                            <!-- Sidebar component, swap this element with another sidebar if you like -->
                            <div
                                class="flex grow flex-col gap-y-5 overflow-y-auto bg-[#75ba2c] px-6 pb-4 ring-1 ring-white/10">
                                <div
                                    class="-mx-6 flex h-16 shrink-0 items-center bg-white border-b-2 border-b-gray-200">
                                    <img class="ml-10 h-24 w-auto" src="/finova_logo.png" alt="Your Company" />
                                </div>
                                <nav class="flex flex-1 flex-col">
                                    <ul role="list" class="flex flex-1 flex-col gap-y-7">
                                        <li>
                                            <ul role="list" class="flex flex-1 flex-col gap-y-7">
                                                <li>
                                                    <ul role="list" class="-mx-2 space-y-1">
                                                        <li v-for="item in filteredNavigation" :key="item.name">
                                                            <!-- Top-level link -->
                                                            <div @click="handleParentClick(item)"
                                                                class="group flex justify-between rounded-md p-2 text-sm/6 font-semibold cursor-pointer"
                                                                :class="[route.path === item.href ? 'bg-[#25bd50] text-white' : 'text-white hover:bg-[#25bd50] hover:text-white']">
                                                                <div class="flex gap-x-3">
                                                                    <component :is="item.icon" class="size-6 shrink-0"
                                                                        aria-hidden="true" />
                                                                    {{ item.name }}
                                                                </div>

                                                                <!-- Arrow Icons for Expandable Items -->
                                                                <div v-if="item.isExpandable" class="shrink-0">
                                                                    <ChevronDownIcon v-if="item.expanded" class="size-5"
                                                                        aria-hidden="true" />
                                                                    <ChevronRightIcon v-else class="size-5"
                                                                        aria-hidden="true" />
                                                                </div>
                                                            </div>

                                                            <!-- Child Links -->
                                                            <ul v-if="item.isExpandable && item.expanded" role="list"
                                                                class="-mx-2 space-y-1 ml-4">
                                                                <li v-for="child in item.children" :key="child.name">
                                                                    <router-link :to="child.href"
                                                                        @click="sidebarOpen = false"
                                                                        class="group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold"
                                                                        :class="[route.path === child.href ? 'bg-[#25bd50] text-white' : 'text-white hover:bg-[#25bd50] hover:text-white']">
                                                                        <component :is="child.icon"
                                                                            class="size-6 shrink-0"
                                                                            aria-hidden="true" />
                                                                        {{ child.name }}
                                                                    </router-link>
                                                                </li>
                                                            </ul>
                                                        </li>
                                                    </ul>

                                                </li>
                                                <!-- <li>
                            <div class="text-xs/6 font-semibold text-gray-400">Your teams</div>
                            <ul role="list" class="-mx-2 mt-2 space-y-1">
                                <li v-for="team in teams" :key="team.name">
                                    <a :href="team.href"
                                        :class="[team.current ? 'bg-gray-800 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white', 'group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold']">
                                        <span
                                            class="flex size-6 shrink-0 items-center justify-center rounded-lg border border-gray-700 bg-gray-800 text-[0.625rem] font-medium text-gray-400 group-hover:text-white">{{
                                                team.initial }}</span>
                                        <span class="truncate">{{ team.name }}</span>
                                    </a>
                                </li>
                            </ul>
                        </li> -->
                                            </ul>
                                        </li>
                                        <!-- <li>
                                            <div class="text-xs/6 font-semibold text-gray-400">Your teams</div>
                                            <ul role="list" class="-mx-2 mt-2 space-y-1">
                                                <li v-for="team in teams" :key="team.name">
                                                    <a :href="team.href"
                                                        :class="[team.current ? 'bg-gray-800 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white', 'group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold']">
                                                        <span
                                                            class="flex size-6 shrink-0 items-center justify-center rounded-lg border border-gray-700 bg-gray-800 text-[0.625rem] font-medium text-gray-400 group-hover:text-white">{{
                                                                team.initial }}</span>
                                                        <span class="truncate">{{ team.name }}</span>
                                                    </a>
                                                </li>
                                            </ul>
                                        </li> -->
                                        <!-- <li class="mt-auto">
                                            <a href="#"
                                                class="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold text-white hover:bg-[#25bd50] hover:text-white">
                                                <Cog6ToothIcon class="size-6 shrink-0" aria-hidden="true" />
                                                Settings
                                            </a>
                                        </li> -->
                                    </ul>
                                </nav>
                            </div>
                        </DialogPanel>
                    </TransitionChild>
                </div>
            </Dialog>
        </TransitionRoot>

        <!-- Static sidebar for desktop -->
        <div class="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
            <!-- Sidebar component, swap this element with another sidebar if you like -->
            <div class="flex grow flex-col gap-y-5 overflow-y-auto  bg-[#75ba2c] px-6 pb-4">
                <div class="-mx-6 flex h-16 shrink-0 items-center bg-white border-b-2 border-b-gray-200">
                    <img class="ml-10 h-24 w-auto" src="/finova_logo.png" alt="Your Company" />
                </div>
                <nav class="flex flex-1 flex-col">
                    <ul role="list" class="flex flex-1 flex-col gap-y-7">
                        <li>
                            <ul role="list" class="-mx-2 space-y-1">
                                <li v-for="item in filteredNavigation" :key="item.name">
                                    <!-- Top-level link -->
                                    <div @click="handleParentClick(item)"
                                        class="group flex justify-between rounded-md p-2 text-sm/6 font-semibold cursor-pointer"
                                        :class="[route.path === item.href ? 'bg-[#25bd50] text-white' : 'text-white hover:bg-[#25bd50] hover:text-white']">
                                        <div class="flex gap-x-3">
                                            <component :is="item.icon" class="size-6 shrink-0" aria-hidden="true" />
                                            {{ item.name }}
                                        </div>

                                        <!-- Arrow Icons for Expandable Items -->
                                        <div v-if="item.isExpandable" class="shrink-0">
                                            <ChevronDownIcon v-if="item.expanded" class="size-5" aria-hidden="true" />
                                            <ChevronRightIcon v-else class="size-5" aria-hidden="true" />
                                        </div>
                                    </div>

                                    <!-- Child Links -->
                                    <ul v-if="item.isExpandable && item.expanded" role="list"
                                        class="-mx-2 space-y-1 ml-4">
                                        <li v-for="child in item.children" :key="child.name">
                                            <router-link :to="child.href"
                                                class="group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold"
                                                :class="[route.path === child.href ? 'bg-[#25bd50] text-white' : 'text-white hover:bg-[#25bd50] hover:text-white']">
                                                <component :is="child.icon" class="size-6 shrink-0"
                                                    aria-hidden="true" />
                                                {{ child.name }}
                                            </router-link>
                                        </li>
                                    </ul>
                                </li>
                            </ul>

                        </li>
                        <!-- <li>
                            <div class="text-xs/6 font-semibold text-gray-400">Your teams</div>
                            <ul role="list" class="-mx-2 mt-2 space-y-1">
                                <li v-for="team in teams" :key="team.name">
                                    <a :href="team.href"
                                        :class="[team.current ? 'bg-gray-800 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white', 'group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold']">
                                        <span
                                            class="flex size-6 shrink-0 items-center justify-center rounded-lg border border-gray-700 bg-gray-800 text-[0.625rem] font-medium text-gray-400 group-hover:text-white">{{
                                                team.initial }}</span>
                                        <span class="truncate">{{ team.name }}</span>
                                    </a>
                                </li>
                            </ul>
                        </li> -->
                        <!-- <li class="mt-auto">
                            <a href="#"
                                class="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold text-white hover:bg-gray-800 hover:text-white">
                                <Cog6ToothIcon class="size-6 shrink-0" aria-hidden="true" />
                                Settings
                            </a>
                        </li> -->
                    </ul>
                </nav>
            </div>
        </div>

        <div class="lg:pl-72">
            <div
                class="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
                <button type="button" class="-m-2.5 p-2.5 text-gray-700 lg:hidden" @click="sidebarOpen = true">
                    <span class="sr-only">Open sidebar</span>
                    <Bars3Icon class="size-6" aria-hidden="true" />
                </button>

                <!-- Separator -->
                <div class="h-6 w-px bg-gray-900/10 lg:hidden" aria-hidden="true" />

                <div class="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
                    <form class="relative flex flex-1" action="#" method="GET">
                        <label for="search-field" class="sr-only">Search</label>
                        <MagnifyingGlassIcon
                            class="pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-gray-400"
                            aria-hidden="true" />
                        <input id="search-field"
                            class="block size-full border-0 py-0 pl-8 pr-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm"
                            placeholder="Search..." type="search" name="search" />
                    </form>
                    <div class="flex items-center gap-x-4 lg:gap-x-6">
                        <button type="button" class="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500">
                            <span class="sr-only">View notifications</span>
                            <BellIcon class="size-6" aria-hidden="true" />
                        </button>

                        <!-- Separator -->
                        <div class="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-900/10" aria-hidden="true" />

                        <!-- Profile dropdown -->
                        <Menu as="div" class="relative">
                            <MenuButton class="-m-1.5 flex items-center p-1.5">
                                <span class="sr-only">Open user menu</span>
                                <!-- Profile placeholder instead of image -->
                                <div
                                    class="size-8 rounded-full bg-[#75ba2c] text-white flex items-center justify-center font-semibold uppercase">
                                    <span v-if="loginUser.first_name">{{ userInitials }}</span>
                                </div>
                                <span class="hidden lg:flex lg:items-center">
                                    <span class="ml-4 text-sm/6 font-semibold text-gray-900" aria-hidden="true">
                                        {{ loginUser.first_name }} {{ loginUser.last_name }}
                                    </span>
                                    <ChevronDownIcon class="ml-2 size-5 text-gray-400" aria-hidden="true" />
                                </span>
                            </MenuButton>

                            <transition enter-active-class="transition ease-out duration-100"
                                enter-from-class="transform opacity-0 scale-95"
                                enter-to-class="transform opacity-100 scale-100"
                                leave-active-class="transition ease-in duration-75"
                                leave-from-class="transform opacity-100 scale-100"
                                leave-to-class="transform opacity-0 scale-95">
                                <MenuItems
                                    class="absolute right-0 z-10 mt-2.5 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
                                    <MenuItem v-for="item in userNavigation" :key="item.name" v-slot="{ active }">
                                    <router-link v-if="item.href && !item.action" :to="item.href"
                                        :class="[active ? 'bg-gray-50 outline-none' : '', 'block px-3 py-1 text-sm/6 text-gray-900 whitespace-nowrap']">
                                        {{ item.name }}
                                    </router-link>
                                    <a v-else href="#" @click.prevent="item.action ? item.action() : null"
                                        :class="[active ? 'bg-gray-50 outline-none' : '', 'block px-3 py-1 text-sm/6 text-gray-900 whitespace-nowrap']">
                                        {{ item.name }}
                                    </a>
                                    </MenuItem>
                                </MenuItems>

                            </transition>
                        </Menu>
                    </div>
                </div>
            </div>

            <main class="py-10">
                <div class="px-4 sm:px-6 lg:px-8">
                    <!-- Your content -->
                    <router-view></router-view>
                </div>
            </main>
        </div>
    </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router';
import { logout } from '../utils/auth';
import {
    Dialog,
    DialogPanel,
    Menu,
    MenuButton,
    MenuItem,
    MenuItems,
    TransitionChild,
    TransitionRoot,
} from '@headlessui/vue'
import {
    Bars3Icon,
    BellIcon,
    Cog6ToothIcon,
    HomeIcon,
    UsersIcon,
    UserCircleIcon,
    ShieldCheckIcon,
    KeyIcon,
    XMarkIcon,
    Squares2X2Icon,
    SquaresPlusIcon,
    TableCellsIcon,
    BookOpenIcon,
    CurrencyDollarIcon,
    RectangleGroupIcon,
    BanknotesIcon,
    BuildingLibraryIcon,
    ReceiptRefundIcon,
} from '@heroicons/vue/24/outline'

import { ChevronDownIcon, MagnifyingGlassIcon, ChevronRightIcon } from '@heroicons/vue/20/solid'

const userInitials = computed(() => {
    if (!loginUser.value.first_name || !loginUser.value.last_name) return "NA";
    return `${loginUser.value.first_name.charAt(0)}${loginUser.value.last_name.charAt(0)}`.toUpperCase();
});

const route = useRoute();
const router = useRouter();
const sidebarOpen = ref(false)
const loginUser = ref('')

const navigation = ref(
    [
        {
            name: 'Dashboard',
            href: '/dashboard',
            icon: HomeIcon,
            isExpandable: false,
            expanded: false,
            current: true,
            permissions: [],
            children: [],
        },
        {
            name: 'Borrower',
            href: '#',
            icon: RectangleGroupIcon,
            isExpandable: true,
            expanded: false,
            current: false,
            permissions: [],
            children: [
                {
                    name: 'Borrowers',
                    href: '/dashboard/borrowers',
                    icon: BanknotesIcon,
                    current: false,
                    permissions: ['view-borrowers']
                },
            ]
        },
        {
            name: 'Transaction',
            href: '#',
            icon: BuildingLibraryIcon,
            isExpandable: true,
            expanded: false,
            current: false,
            permissions: [],
            children: [
                {
                    name: 'Transactions',
                    href: '/dashboard/transactions',
                    icon: CurrencyDollarIcon,
                    current: false,
                    permissions: ['view-transactions']
                },
                {
                    name: 'Repayments',
                    href: '/dashboard/repayments',
                    icon: ReceiptRefundIcon,
                    current: false,
                    permissions: ['view-repayments']
                },
            ]
        },
        {
            name: 'Product',
            href: '#',
            icon: Squares2X2Icon,
            isExpandable: true,
            expanded: false,
            current: false,
            permissions: [],
            children: [
                {
                    name: 'Books',
                    href: '/dashboard/books',
                    icon: BookOpenIcon,
                    current: false,
                    permissions: ['view-books']
                },
                {
                    name: 'Charges',
                    href: '/dashboard/charges',
                    icon: CurrencyDollarIcon,
                    current: false,
                    permissions: ['view-charges']
                },
                {
                    name: 'Add Product',
                    href: '/dashboard/product/add',
                    icon: SquaresPlusIcon,
                    current: false,
                    permissions: ["add-product"]
                },
                {
                    name: 'Products',
                    href: '/dashboard/products',
                    icon: TableCellsIcon,
                    current: false,
                    permissions: ['view-products']
                },
            ]
        },
         {
            name: 'Reports',
            href: '#',
            icon: Squares2X2Icon,
            isExpandable: true,
            expanded: false,
            current: false,
            permissions: [],
            children: [
                {
                    name: 'Delinquent Transactions',
                    href: '/dashboard/delinquentTransactions',
                    icon: BookOpenIcon,
                    current: false,
                    permissions: ['view-reports']
                }
            ]
        },
        {
            name: 'Team',
            href: '#',
            icon: UsersIcon,
            isExpandable: true,
            expanded: false,
            current: false,
            permissions: [],
            children: [
                {
                    name: 'Users',
                    href: '/dashboard/team',
                    icon: UserCircleIcon,
                    current: false,
                    permissions: ['view-users']
                },
                {
                    name: 'Roles',
                    href: '/dashboard/roles',
                    icon: ShieldCheckIcon,
                    current: false,
                    permissions: ['view-roles']
                },
                {
                    name: 'Permissions',
                    href: '/dashboard/permissions',
                    icon: KeyIcon,
                    current: false,
                    permissions: ['view-permissions']
                }
            ]
        },
    ]
);

const filteredNavigation = computed(() => {
    return navigation.value.map(link => {
        // Clone the link to avoid mutating the original data
        const clonedLink = { ...link };

        // Check if the top-level link is accessible
        const hasTopLevelAccess =
            !clonedLink.permissions ||
            clonedLink.permissions.length === 0 ||
            clonedLink.permissions.some(permission => userPermissions.includes(permission));

        // Filter children for permissions if expandable
        if (clonedLink.isExpandable && clonedLink.children) {
            clonedLink.children = clonedLink.children.filter(child =>
                !child.permissions || child.permissions.length === 0 || child.permissions.some(permission => userPermissions.includes(permission))
            );
        }

        // Return the cloned link if it has access or visible children
        if (hasTopLevelAccess || (clonedLink.isExpandable && clonedLink.children.length > 0)) {
            return clonedLink;
        }
        return null; // Exclude inaccessible links
    }).filter(link => link !== null);
});


const toggleExpand = (item) => {
    const navItem = navigation.value.find(nav => nav.name === item.name);
    if (navItem) {
        navItem.expanded = !navItem.expanded;
    }
};

const handleParentClick = (item) => {
    if (item.href && !item.isExpandable) {
        // Navigate to the defined route if it's a link
        router.push(item.href);
    } else if (item.isExpandable) {
        // Toggle expansion state for expandable items
        toggleExpand(item);
    }
};

// Function to get user permissions (from localStorage or Vuex/Pinia)
const getUserPermissions = () => {
    const userData = localStorage.getItem('user');
    if (userData) {
        try {
            return JSON.parse(userData).permissions || [];
        } catch (error) {
            console.error('Error parsing user data:', error);
        }
    }
    return [];
};

const userPermissions = getUserPermissions();


const handleLogout = () => {
    logout();
};

const userNavigation = [
    { name: 'Change Password', href: '/dashboard/changePassword' },
    { name: 'Sign out', href: '#', action: handleLogout },
]

onMounted(() => {
    const userData = JSON.parse(localStorage.getItem('user')) || { first_name: 'Guest', last_name: '' };
    loginUser.value = userData;
});

</script>