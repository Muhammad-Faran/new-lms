<template>
    <div class="px-4 sm:px-0">
        <h3 class="text-base/7 font-semibold text-gray-900">{{ title }}</h3>
        <p class="mt-1 max-w-2xl text-sm/6 text-gray-500">{{ description }}</p>
    </div>
</template>

<script>
export default {
    props: {
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
    },
};
</script>