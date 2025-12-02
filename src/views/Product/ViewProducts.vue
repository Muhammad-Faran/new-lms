<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import PreviewProduct from './PreviewProduct.vue';

const router = useRouter();

const loadingFetch = ref(false);
const isProductData = ref(false);
const form = ref({
    name: '',
    code: '',
    limit: null,
    max_requested_amount: null,
    min_requested_amount: null,
    default_status: 'review',
    eligibility_criteria: '',
    status: '1',
    tnc: '',
    avatar: null,
    description: '',
    product_books: [],
    product_tier_charges: [],
    product_tiers: [],
    product_plans: [],
});

const productData = window.history.state?.productData;

if (productData) {
    console.log('Received productData:', productData);
    isProductData.value = true

    const data = JSON.parse(productData)

    form.value = { ...data }
} else {
    console.log('No productData found');
}

const handleCancel = () => {
    router.push('/dashboard/products');
};
</script>

<template>
    <form>
        <div class="space-y-2 sm:space-y-8" v-loading="loadingFetch">
            <div>
                <h2 class="text-base/7 font-semibold text-gray-900">Product Information</h2>
                <p class="mt-1 max-w-2xl text-sm/6 text-gray-600">
                    Detail Information of product, charges, tier and plans.
                </p>
            </div>

            <div v-if="isProductData">
                <PreviewProduct :form="form" />

                <div class="p-2 mt-4 flex justify-end">
                    <button type="button" @click="handleCancel"
                        class="rounded-md bg-slate-900 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900">
                        Cancel
                    </button>
                </div>
            </div>

        </div>

    </form>
</template>

<style>
.example-showcase .el-loading-mask {
    z-index: 9;
}

svg.circular {
    width: 30px !important;
}
</style>