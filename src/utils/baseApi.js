export const BASE_URL = import.meta.env.VITE_API_URL;

const API = {
    BASE_URL: BASE_URL,
    LOGIN: BASE_URL + '/api/login',
    CHANGE_PASSWORD: BASE_URL + '/api/v1/password/change',
    PERMISSIONS: BASE_URL + '/api/v1/permissions/',
    SYNC_USERS_PERMISSIONS: BASE_URL + '/api/v1/syncUserPermissions/',
    ROLES: BASE_URL + '/api/v1/roles/',
    USERS: BASE_URL + '/api/v1/users/',
    BOOKS: BASE_URL + '/api/v1/books/',
    CHARGES: BASE_URL + '/api/v1/charges/',
    PRODUCTS: BASE_URL + '/api/v1/products/',
    ADD_PRODUCTS: BASE_URL + '/api/v1/addProduct/',
    PRODUCTS_STATUS: BASE_URL + '/api/v1/products/{product}/updateStatus',
    APPLICANTS: BASE_URL + '/api/v1/applicants/',
    APPLICANTS_STATUS: BASE_URL + '/api/v1/applicants/updateStatus',
    APPLICANTS_PRODUCTS_SYNC: BASE_URL + '/api/v1/applicants/{applicant}/products/sync',
    APPLICANTS_ASSIGN_CREDIT_LIMIT: BASE_URL + '/api/v1/applicants/{applicant}/assignCreditLimit',
    APPLICANTS_ASSIGN_FINANCING_POLICY: BASE_URL + '/api/v1/applicants/{applicant}/assignFinancingPolicy',
    APPLICANTS_SHIPPER_NAME: BASE_URL + '/api/v1/applicant/shipper-names',
    TRANSACTIONS: BASE_URL + '/api/v1/transactions',
    REPAYMENTS: BASE_URL + '/api/v1/repayments',
    REFRESH_OFAC_NACTA: BASE_URL + '/api/v1/refreshOfacNacta',
    REFRESH_SHIPPER_CREDIT_SCORE: BASE_URL + '/api/v1/refreshCreditEngineShipperCreditScore',
    REFRESH_SHIPPER_INFO: BASE_URL + '/api/v1/refreshCreditEngineShipperInfo',
    REFRESH_SHIPPER_KYC: BASE_URL + '/api/v1/refreshCreditEngineShipperKyc',
    REFRESH_SHIPPER_PRICING: BASE_URL + '/api/v1/refreshCreditEngineShipperPricing',
    EXPORT_TRANSACTIONS: BASE_URL + '/api/v1/transaction/export',
    EXPORT_REPAYMENTS: BASE_URL + '/api/v1/repayment/export',
    DASHBOARD_STATS: BASE_URL + '/api/v1/dashboard/stats',
    OVERDUE_LOANS: BASE_URL + '/api/v1/reports/overdue-loans',
    EXPORT_DELINQUENT_TRANSACTIONS: BASE_URL + '/api/v1/reports/export-overdue-loans',

}

export default API;