<template>
    <div v-if="data" class="mt-6 border-t border-gray-100">
        <dl class="divide-y divide-gray-100">
            <div v-for="(value, key) in data" :key="key" class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt class="text-sm/6 font-medium text-gray-900">{{ formatKey(key) }}</dt>
                <dd class="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
                    <!-- Simple key-value -->
                    <div v-if="!isObject(value) && !Array.isArray(value)">
                        <span class="truncate" :title="value">{{ value }}</span>
                    </div>

                    <!-- Object: Display as formatted JSON block -->
                    <div v-else-if="isObject(value)">
                        <div class="bg-gray-100 p-3 rounded-md overflow-x-auto">
                            <pre class="whitespace-pre-wrap text-xs text-gray-800">
                  {{ JSON.stringify(value, null, 2) }}
                </pre>
                        </div>
                    </div>

                    <!-- Array: Display each array element -->
                    <div v-else-if="Array.isArray(value)">
                        <ul class="divide-y divide-gray-100 rounded-md border border-gray-200">
                            <li v-for="(arrayItem, index) in value" :key="index" class="py-4 pl-4 pr-5 text-sm/6">
                                <div v-if="isObject(arrayItem)">
                                    <span class="font-bold">Object {{ index + 1 }}</span>
                                    <div class="bg-gray-50 p-2 rounded-md mt-2 overflow-x-auto">
                                        <pre class="whitespace-pre-wrap text-xs text-gray-800">
                        {{ JSON.stringify(arrayItem, null, 2) }}
                      </pre>
                                    </div>
                                </div>
                                <div v-else>
                                    {{ arrayItem }}
                                </div>
                            </li>
                        </ul>
                    </div>
                </dd>
            </div>
        </dl>
    </div>
</template>

<script>
export default {
    props: {
        data: {
            type: Object,
            required: true,
        },
    },
    methods: {
        isObject(value) {
            return value !== null && typeof value === 'object' && !Array.isArray(value);
        },
        formatKey(key) {
            return key.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
        },
    },
};
</script>