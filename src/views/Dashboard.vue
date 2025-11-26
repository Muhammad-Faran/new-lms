<template>
    <div class="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black text-slate-100">
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
                                class="flex grow flex-col gap-y-5 overflow-y-auto bg-gradient-to-b from-slate-950 via-slate-900 to-black px-6 pb-6 ring-1 ring-white/10">
                                <!-- <div
                                    class="-mx-6 flex h-16 shrink-0 items-center bg-slate-900 border-b border-slate-800/80">
                                    <img class="ml-10 h-24 w-auto" src="/finova_logo.png" alt="Your Company" />
                                </div> -->
                                <nav class="flex flex-1 flex-col mt-5">
                                    <div
                                        class="px-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-500/80">
                                        Menu</div>
                                    <ul role="list" class="mt-1.5 flex flex-col gap-y-2.5">
                                        <li v-for="item in filteredNavigation" :key="item.name">
                                            <div @click="handleParentClick(item)"
                                                class="group relative overflow-hidden rounded-xl border border-slate-800/70 bg-slate-900/60 p-2 text-[13px] font-semibold cursor-pointer shadow-sm shadow-black/30 transition-all duration-200"
                                                :class="[route.path === item.href ? 'border-emerald-500/60 bg-emerald-600/10 shadow-emerald-500/20 ring-1 ring-emerald-500/30' : 'hover:border-emerald-500/40 hover:shadow-emerald-500/10 hover:bg-slate-800/60']">
                                                <span
                                                    class="absolute inset-y-1 left-0 w-[2.5px] rounded-full transition-colors duration-200"
                                                    :class="[route.path === item.href ? 'bg-emerald-400' : 'bg-slate-800 group-hover:bg-emerald-400/80']"></span>
                                                <div class="flex items-center justify-between gap-3">
                                                    <div class="flex items-center gap-2.5">
                                                        <div
                                                            class="flex size-8 items-center justify-center rounded-lg bg-slate-800/80 text-emerald-300 ring-1 ring-slate-700 transition-colors duration-200 group-hover:ring-emerald-500/50">
                                                            <component :is="item.icon" class="size-4 shrink-0"
                                                                aria-hidden="true" />
                                                        </div>
                                                        <div class="leading-tight text-white">
                                                            <p class="text-[13px] font-semibold">{{ item.name }}</p>
                                                            <p class="text-[10px] text-slate-500">Quick access</p>
                                                        </div>
                                                    </div>

                                                    <!-- Arrow Icons for Expandable Items -->
                                                    <div v-if="item.isExpandable"
                                                        class="shrink-0 text-slate-500 group-hover:text-emerald-300 transition-colors duration-150">
                                                        <ChevronDownIcon v-if="item.expanded" class="size-4"
                                                            aria-hidden="true" />
                                                        <ChevronRightIcon v-else class="size-4" aria-hidden="true" />
                                                    </div>
                                                    <div v-else
                                                        class="size-2 rounded-full bg-emerald-400/60 shadow shadow-emerald-500/30">
                                                    </div>
                                                </div>
                                            </div>

                                            <!-- Child Links -->
                                            <ul v-if="item.isExpandable && item.expanded" role="list"
                                                class="ml-3 mt-1.5 space-y-1.5 border-l border-slate-800/70 pl-2.5">
                                                <li v-for="child in item.children" :key="child.name">
                                                    <router-link :to="child.href" @click="sidebarOpen = false"
                                                        class="group flex items-center gap-x-3 rounded-lg border border-slate-800/70 bg-slate-900/40 p-1.5 text-[13px] font-semibold transition-all duration-150"
                                                        :class="[route.path === child.href ? 'border-emerald-500/50 bg-emerald-600/15 text-white shadow-sm shadow-emerald-500/20' : 'text-slate-300 hover:border-emerald-500/40 hover:text-white hover:bg-slate-800/60']">
                                                        <component :is="child.icon"
                                                            class="size-4 shrink-0 text-emerald-300"
                                                            aria-hidden="true" />
                                                        <span class="flex-1">{{ child.name }}</span>
                                                        <span v-if="route.path === child.href"
                                                            class="size-1.5 rounded-full bg-emerald-400 shadow shadow-emerald-500/40"></span>
                                                    </router-link>
                                                </li>
                                            </ul>
                                        </li>
                                    </ul>
                                    <Menu as="div" class="relative mt-auto pt-5">
                                        <MenuButton
                                            class="group flex w-full items-center gap-3 rounded-xl border border-slate-800/70 bg-slate-900/50 p-2.5 text-left shadow-sm shadow-black/30 transition-colors duration-150 hover:border-emerald-500/50 hover:bg-slate-800/60">
                                            <div
                                                class="flex size-9 items-center justify-center rounded-full bg-emerald-600 text-white font-semibold uppercase shadow-sm shadow-emerald-500/30">
                                                <span v-if="loginUser.first_name">{{ userInitials }}</span>
                                                <span v-else>NA</span>
                                            </div>
                                            <div class="flex-1 leading-tight">
                                                <p class="text-[13px] font-semibold text-white truncate">{{
                                                    loginUser.first_name }} {{ loginUser.last_name }}</p>
                                                <p class="text-[11px] text-slate-500">Open user menu</p>
                                            </div>
                                            <ChevronDownIcon class="size-4 text-slate-500 group-hover:text-emerald-300"
                                                aria-hidden="true" />
                                        </MenuButton>
                                        <transition enter-active-class="transition ease-out duration-100"
                                            enter-from-class="transform opacity-0 scale-95"
                                            enter-to-class="transform opacity-100 scale-100"
                                            leave-active-class="transition ease-in duration-75"
                                            leave-from-class="transform opacity-100 scale-100"
                                            leave-to-class="transform opacity-0 scale-95">
                                            <MenuItems
                                                class="absolute inset-x-0 bottom-20 z-20 mx-4 rounded-xl bg-slate-900 py-2 shadow-xl shadow-black/40 ring-1 ring-slate-800 focus:outline-none">
                                                <MenuItem v-for="item in userNavigation" :key="item.name"
                                                    v-slot="{ active }">
                                                <router-link v-if="item.href && !item.action" :to="item.href"
                                                    :class="[active ? 'bg-slate-800 text-white outline-none' : 'text-slate-200', 'block px-3 py-2 text-sm/6 whitespace-nowrap rounded-lg transition-colors duration-150']">
                                                    {{ item.name }}
                                                </router-link>
                                                <a v-else href="#" @click.prevent="item.action ? item.action() : null"
                                                    :class="[active ? 'bg-slate-800 text-white outline-none' : 'text-slate-200', 'block px-3 py-2 text-sm/6 whitespace-nowrap rounded-lg transition-colors duration-150']">
                                                    {{ item.name }}
                                                </a>
                                                </MenuItem>
                                            </MenuItems>
                                        </transition>
                                    </Menu>
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
            <div
                class="flex grow flex-col gap-y-5 overflow-y-auto bg-gradient-to-b from-slate-950 via-slate-900 to-black px-6 pb-6">
                <!-- <div class="-mx-6 flex h-16 shrink-0 items-center bg-slate-900 border-b border-slate-800/80">
                    <img class="ml-10 h-24 w-auto" src="/finova_logo.png" alt="Your Company" />
                </div> -->
                <nav class="flex flex-1 flex-col mt-5">
                    <div class="px-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-500/80">Menu</div>
                    <ul role="list" class="mt-1.5 flex flex-1 flex-col gap-y-2.5">
                        <li v-for="item in filteredNavigation" :key="item.name">
                            <div @click="handleParentClick(item)"
                                class="group relative overflow-hidden rounded-xl border border-slate-800/70 bg-slate-900/60 p-2 text-[13px] font-semibold cursor-pointer shadow-sm shadow-black/30 transition-all duration-200"
                                :class="[route.path === item.href ? 'border-emerald-500/60 bg-emerald-600/10 shadow-emerald-500/20 ring-1 ring-emerald-500/30' : 'hover:border-emerald-500/40 hover:shadow-emerald-500/10 hover:bg-slate-800/60']">
                                <span
                                    class="absolute inset-y-1 left-0 w-[2.5px] rounded-full transition-colors duration-200"
                                    :class="[route.path === item.href ? 'bg-emerald-400' : 'bg-slate-800 group-hover:bg-emerald-400/80']"></span>
                                <div class="flex items-center justify-between gap-3">
                                    <div class="flex items-center gap-2.5">
                                        <div
                                            class="flex size-8 items-center justify-center rounded-lg bg-slate-800/80 text-emerald-300 ring-1 ring-slate-700 transition-colors duration-200 group-hover:ring-emerald-500/50">
                                            <component :is="item.icon" class="size-4 shrink-0" aria-hidden="true" />
                                        </div>
                                        <div class="leading-tight">
                                            <p class="text-[13px] font-semibold">{{ item.name }}</p>
                                            <p class="text-[10px] text-slate-500">Quick access</p>
                                        </div>
                                    </div>

                                    <!-- Arrow Icons for Expandable Items -->
                                    <div v-if="item.isExpandable"
                                        class="shrink-0 text-slate-500 group-hover:text-emerald-300 transition-colors duration-150">
                                        <ChevronDownIcon v-if="item.expanded" class="size-4" aria-hidden="true" />
                                        <ChevronRightIcon v-else class="size-4" aria-hidden="true" />
                                    </div>
                                    <div v-else
                                        class="size-2 rounded-full bg-emerald-400/60 shadow shadow-emerald-500/30">
                                    </div>
                                </div>
                            </div>

                            <!-- Child Links -->
                            <ul v-if="item.isExpandable && item.expanded" role="list"
                                class="ml-3 mt-1.5 space-y-1.5 border-l border-slate-800/70 pl-2.5">
                                <li v-for="child in item.children" :key="child.name">
                                    <router-link :to="child.href"
                                        class="group flex items-center gap-x-3 rounded-lg border border-slate-800/70 bg-slate-900/40 p-1.5 text-[13px] font-semibold transition-all duration-150"
                                        :class="[route.path === child.href ? 'border-emerald-500/50 bg-emerald-600/15 text-white shadow-sm shadow-emerald-500/20' : 'text-slate-300 hover:border-emerald-500/40 hover:text-white hover:bg-slate-800/60']">
                                        <component :is="child.icon" class="size-4 shrink-0 text-emerald-300"
                                            aria-hidden="true" />
                                        <span class="flex-1">{{ child.name }}</span>
                                        <span v-if="route.path === child.href"
                                            class="size-1.5 rounded-full bg-emerald-400 shadow shadow-emerald-500/40"></span>
                                    </router-link>
                                </li>
                            </ul>
                        </li>
                    </ul>
                    <Menu as="div" class="relative mt-auto pt-5">
                        <MenuButton
                            class="group flex w-full items-center gap-3 rounded-xl border border-slate-800/70 bg-slate-900/50 p-2.5 text-left shadow-sm shadow-black/30 transition-colors duration-150 hover:border-emerald-500/50 hover:bg-slate-800/60">
                            <div
                                class="flex size-9 items-center justify-center rounded-full bg-emerald-600 text-white font-semibold uppercase shadow-sm shadow-emerald-500/30">
                                <span v-if="loginUser.first_name">{{ userInitials }}</span>
                                <span v-else>NA</span>
                            </div>
                            <div class="flex-1 leading-tight">
                                <p class="text-[13px] font-semibold text-white truncate">{{ loginUser.first_name }} {{
                                    loginUser.last_name }}</p>
                                <p class="text-[11px] text-slate-500">Open user menu</p>
                            </div>
                            <ChevronDownIcon class="size-4 text-slate-500 group-hover:text-emerald-300"
                                aria-hidden="true" />
                        </MenuButton>
                        <transition enter-active-class="transition ease-out duration-100"
                            enter-from-class="transform opacity-0 scale-95"
                            enter-to-class="transform opacity-100 scale-100"
                            leave-active-class="transition ease-in duration-75"
                            leave-from-class="transform opacity-100 scale-100"
                            leave-to-class="transform opacity-0 scale-95">
                            <MenuItems
                                class="absolute inset-x-0 bottom-20 z-20 mx-4 rounded-xl bg-slate-900 py-2 shadow-xl shadow-black/40 ring-1 ring-slate-800 focus:outline-none">
                                <MenuItem v-for="item in userNavigation" :key="item.name" v-slot="{ active }">
                                <router-link v-if="item.href && !item.action" :to="item.href"
                                    :class="[active ? 'bg-slate-800 text-white outline-none' : 'text-slate-200', 'block px-3 py-2 text-sm/6 whitespace-nowrap rounded-lg transition-colors duration-150']">
                                    {{ item.name }}
                                </router-link>
                                <a v-else href="#" @click.prevent="item.action ? item.action() : null"
                                    :class="[active ? 'bg-slate-800 text-white outline-none' : 'text-slate-200', 'block px-3 py-2 text-sm/6 whitespace-nowrap rounded-lg transition-colors duration-150']">
                                    {{ item.name }}
                                </a>
                                </MenuItem>
                            </MenuItems>
                        </transition>
                    </Menu>
                </nav>
            </div>
        </div>

        <div class="lg:pl-72">
            <div
                class="sticky top-0 z-40 flex h-12 shrink-0 items-center gap-x-4 border-b border-slate-800/80 bg-slate-900/80 backdrop-blur px-4 shadow-md shadow-black/40 sm:gap-x-6 sm:px-6 lg:px-8">
                <button type="button" class="-m-2.5 p-2 text-slate-300 hover:text-white lg:hidden"
                    @click="sidebarOpen = true">
                    <span class="sr-only">Open sidebar</span>
                    <Bars3Icon class="size-5" aria-hidden="true" />
                </button>

                <!-- Separator -->
                <div class="h-6 w-px bg-slate-700 lg:hidden" aria-hidden="true" />

                <div class="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
                    <div class="flex flex-1 items-center justify-end gap-x-4 lg:gap-x-6">
                        <button type="button"
                            class="-m-2.5 p-2 text-slate-400 hover:text-white transition-colors duration-150">
                            <span class="sr-only">View notifications</span>
                            <BellIcon class="size-5" aria-hidden="true" />
                        </button>
                    </div>
                </div>
            </div>

            <main class="py-10">
                <div class="px-4 sm:px-6 lg:px-8">
                    <div
                        class="rounded-2xl border border-slate-800/70 bg-white p-6 shadow-2xl shadow-black/40 backdrop-blur">
                        <!-- class="rounded-2xl border border-slate-800/70 bg-slate-900/60 p-6 shadow-2xl shadow-black/40 backdrop-blur"> -->
                        <!-- Your content -->
                        <router-view></router-view>
                    </div>
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
    ChartBarIcon,
    IdentificationIcon,
    UserGroupIcon,
    UserIcon,
    AdjustmentsHorizontalIcon,
    LockClosedIcon,
    ArrowsRightLeftIcon,
    ReceiptPercentIcon,
    ArrowPathRoundedSquareIcon,
    CubeTransparentIcon,
    DocumentTextIcon,
    BoltIcon,
    PlusCircleIcon,
    Square3Stack3DIcon,
    ChartPieIcon,
    ExclamationTriangleIcon,
    XMarkIcon,
} from '@heroicons/vue/24/outline'

import { ChevronDownIcon, ChevronRightIcon } from '@heroicons/vue/20/solid'

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
            icon: ChartBarIcon,
            isExpandable: false,
            expanded: false,
            current: true,
            permissions: [],
            children: [],
        },
        {
            name: 'Borrower',
            href: '#',
            icon: IdentificationIcon,
            isExpandable: true,
            expanded: false,
            current: false,
            permissions: [],
            children: [
                {
                    name: 'Borrowers',
                    href: '/dashboard/borrowers',
                    icon: UserIcon,
                    current: false,
                    permissions: ['view-borrowers']
                },
            ]
        },
        {
            name: 'Transaction',
            href: '#',
            icon: ArrowsRightLeftIcon,
            isExpandable: true,
            expanded: false,
            current: false,
            permissions: [],
            children: [
                {
                    name: 'Transactions',
                    href: '/dashboard/transactions',
                    icon: ReceiptPercentIcon,
                    current: false,
                    permissions: ['view-transactions']
                },
                {
                    name: 'Repayments',
                    href: '/dashboard/repayments',
                    icon: ArrowPathRoundedSquareIcon,
                    current: false,
                    permissions: ['view-repayments']
                },
            ]
        },
        {
            name: 'Product',
            href: '#',
            icon: CubeTransparentIcon,
            isExpandable: true,
            expanded: false,
            current: false,
            permissions: [],
            children: [
                {
                    name: 'Books',
                    href: '/dashboard/books',
                    icon: DocumentTextIcon,
                    current: false,
                    permissions: ['view-books']
                },
                {
                    name: 'Charges',
                    href: '/dashboard/charges',
                    icon: BoltIcon,
                    current: false,
                    permissions: ['view-charges']
                },
                {
                    name: 'Add Product',
                    href: '/dashboard/product/add',
                    icon: PlusCircleIcon,
                    current: false,
                    permissions: ["add-product"]
                },
                {
                    name: 'Products',
                    href: '/dashboard/products',
                    icon: Square3Stack3DIcon,
                    current: false,
                    permissions: ['view-products']
                },
            ]
        },
        {
            name: 'Reports',
            href: '#',
            icon: ChartPieIcon,
            isExpandable: true,
            expanded: false,
            current: false,
            permissions: [],
            children: [
                {
                    name: 'Delinquent Transactions',
                    href: '/dashboard/delinquentTransactions',
                    icon: ExclamationTriangleIcon,
                    current: false,
                    permissions: ['view-reports']
                }
            ]
        },
        {
            name: 'Team',
            href: '#',
            icon: UserGroupIcon,
            isExpandable: true,
            expanded: false,
            current: false,
            permissions: [],
            children: [
                {
                    name: 'Users',
                    href: '/dashboard/team',
                    icon: UserIcon,
                    current: false,
                    permissions: ['view-users']
                },
                {
                    name: 'Roles',
                    href: '/dashboard/roles',
                    icon: AdjustmentsHorizontalIcon,
                    current: false,
                    permissions: ['view-roles']
                },
                {
                    name: 'Permissions',
                    href: '/dashboard/permissions',
                    icon: LockClosedIcon,
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
