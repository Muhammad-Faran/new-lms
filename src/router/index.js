import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/login.vue';
import Dashboard from '../views/Dashboard.vue';
import { isTokenExpired } from '../utils/auth';
import DashboardContent from '../views/DashboardContent.vue';
import TeamForm from '../views/TeamForm.vue';
import PermissionForm from '../views/PermissionForm.vue';
import RoleForm from '../views/RoleForm.vue';
import UserPermission from '../views/UserPermission.vue';
import { showMessageAlert } from '../utils/alert';
import AddProduct from '../views/Product/AddProduct.vue';
import Books from '../views/Product/Books/Books.vue';
import overdueLoans from '../views/Reports/overdueLoans.vue';
import Charges from '../views/Product/Charges/Charges.vue';
import BookForm from '../views/Product/Books/BookForm.vue';
import ChargeForm from '../views/Product/Charges/ChargeForm.vue';
import Products from '../views/Product/Products.vue';
import ViewProducts from '../views/Product/ViewProducts.vue';
import Applicants from '../views/Applicant/Applicants.vue';
import ApplicantsForm from '../views/Applicant/ApplicantsForm.vue';
import SyncApplicantProducts from '../views/Applicant/SyncApplicantProducts.vue';
import AssignFinancingPolicy from '../views/Applicant/AssignFinancingPolicy.vue';
import ChangePassword from '../views/ChangePassword.vue';
import AssignCreditLimit from '../views/Applicant/AssignCreditLimit.vue';
import Transactions from '../views/Transaction/Transactions.vue';
import Repayments from '../views/Transaction/Repayments.vue';
import ConfigureApplicantDetails from '../views/Applicant/ConfigureApplicantDetails.vue';

const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login,
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    children: [
      {
        path: '',
        name: 'DashboardContent',
        component: DashboardContent,
      },
      {
        path: 'team',
        name: 'Team',
        component: () => import('../views/Team.vue'),
        meta: { requiresAuth: true, permissions: ['view-users'] },
      },
      {
        path: 'team/add',
        name: 'AddTeam',
        component: TeamForm,
        meta: { requiresAuth: true, permissions: ['create-users'] },
      },
      {
        path: 'ChangePassword',
        name: 'ChangePassword',
        component: ChangePassword,
        props: true,
        meta: { requiresAuth: true, permissions: ['change-password'] },
      },
      {
        path: 'team/edit/:id',
        name: 'EditTeam',
        component: TeamForm,
        props: true,
        meta: { requiresAuth: true, permissions: ['update-users'] },
      },
      {
        path: '/team/:userId/permissions',
        name: 'UserPermission',
        component: UserPermission,
        props: true,
        meta: { requiresAuth: true, permissions: ['user-permissions'] },
      },
      {
        path: 'permissions',
        name: 'Permissons',
        component: () => import('../views/Permissions.vue'),
        meta: { requiresAuth: true, permissions: ['view-permissions'] },
      },
      {
        path: 'permissions/add',
        name: 'AddPermission',
        component: PermissionForm,
        meta: { requiresAuth: true, permissions: ['create-permissions'] },
      },
      {
        path: 'permissions/edit/:id',
        name: 'EditPermission',
        component: PermissionForm,
        props: true,
        meta: { requiresAuth: true, permissions: ['update-permissions'] },
      },
      {
        path: 'roles',
        name: 'Roles',
        component: () => import('../views/Roles.vue'),
        meta: { requiresAuth: true, permissions: ['view-roles'] },
      },
      {
        path: 'roles/add',
        name: 'AddRole',
        component: RoleForm,
        meta: { requiresAuth: true, permissions: ['create-roles'] },
      },
      {
        path: 'roles/edit/:id',
        name: 'EditRole',
        component: RoleForm,
        props: true,
        meta: { requiresAuth: true, permissions: ['update-roles'] },
      },
      {
        path: 'books',
        name: 'Books',
        component: Books,
        props: true,
        meta: { requiresAuth: true, permissions: ['view-books'] },
      },
      {
        path: 'delinquentTransactions',
        name: 'delinquentTransactions',
        component: overdueLoans,
        props: true,
        meta: { requiresAuth: true, permissions: ['view-reports'] },
      },
      {
        path: 'books/add',
        name: 'AddBook',
        component: BookForm,
        props: true,
        meta: { requiresAuth: true, permissions: ['create-books'] },
      },
      {
        path: 'books/edit/:id',
        name: 'EditBook',
        component: BookForm,
        props: true,
        meta: { requiresAuth: true, permissions: ['update-books'] },
      },
      {
        path: 'charges',
        name: 'Charges',
        component: Charges,
        props: true,
        meta: { requiresAuth: true, permissions: ['view-charges'] },
      },
      {
        path: 'charges/add',
        name: 'AddCharge',
        component: ChargeForm,
        props: true,
        meta: { requiresAuth: true, permissions: ['create-charges'] },
      },
      {
        path: 'charges/edit/:id',
        name: 'EditCharge',
        component: ChargeForm,
        props: true,
        meta: { requiresAuth: true, permissions: ['update-charges'] },
      },
      {
        path: 'product/add',
        name: 'AddProduct',
        component: AddProduct,
        props: true,
        meta: { requiresAuth: true, permissions: [] },
      },
      {
        path: 'products',
        name: 'Products',
        component: Products,
        props: true,
        meta: { requiresAuth: true, permissions: ['view-products'] },
      },
      {
        path: 'products/view/:id',
        name: 'ViewProducts',
        component: ViewProducts,
        props: true,
        meta: { requiresAuth: true, permissions: ['view-products'] },
      },
      {
        path: 'applicants',
        name: 'Applicants',
        component: Applicants,
        props: true,
        meta: { requiresAuth: true, permissions: ['view-applicants'] },
      },
      {
        path: 'applicants/view/:id',
        name: 'ViewApplicants',
        component: ApplicantsForm,
        props: true,
        meta: { requiresAuth: true, permissions: ['view-applicants'] },
      },
      {
        path: 'applicants/:id/configure-applicant-details',
        name: 'ConfigureApplicantDetails',
        component: ConfigureApplicantDetails,
        props: true,
        meta: { requiresAuth: true, permissions: ['sync-applicant-products', 'assign-credit-limit'] },
      },
      {
        path: 'applicants/:id/sync-products',
        name: 'SyncApplicantProducts',
        component: SyncApplicantProducts,
        props: true,
        meta: { requiresAuth: true, permissions: ['sync-applicant-products'] },
      },
      {
        path: 'applicants/:id/assign-creditLimit',
        name: 'AssignCreditLimit',
        component: AssignCreditLimit,
        props: true,
        meta: { requiresAuth: true, permissions: ['assign-credit-limit'] },
      },
      {
        path: 'applicants/:id/assign-financingPolicy',
        name: 'AssignFinancingPolicy',
        component: AssignFinancingPolicy,
        props: true,
        meta: { requiresAuth: true, permissions: ['assign-credit-limit'] },
      },
      {
        path: 'applicants/edit/:id',
        name: 'EditApplicants',
        component: ApplicantsForm,
        props: true,
        meta: { requiresAuth: true, permissions: ['update-applicants'] },
      },
      {
        path: 'transactions',
        name: 'Transactions',
        component: Transactions,
        props: true,
        meta: { requiresAuth: true, permissions: ['view-transactions'] },
      },
      {
        path: 'repayments',
        name: 'Repayments',
        component: Repayments,
        props: true,
        meta: { requiresAuth: true, permissions: ['view-repayments'] },
      },
    ],
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

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

// Navigation guard to check authentication before accessing protected routes
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('auth_token');
  const userPermissions = getUserPermissions();

  // Check for authentication
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!token || isTokenExpired()) {
      showMessageAlert({ message: 'Please login again. Session has expired.', type: 'error' });
      return next({ name: 'Login' });
    }

    // Check for permissions if specified in meta
    const requiredPermissions = to.meta.permissions || [];
    const hasPermission = requiredPermissions.every(permission =>
      userPermissions.includes(permission)
    );

    if (!hasPermission) {
      showMessageAlert({ message: 'You do not have permission to access this page.', type: 'error' });
      return next(false); // Prevent navigation
    }
  }

  // Allow navigation if no restrictions
  next();
});

export default router;
