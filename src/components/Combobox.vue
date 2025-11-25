<template>
    <div class="w-full">
        <Combobox v-model="selectedItem">
            <div class="relative">
                <div
                    class="relative w-auto cursor-default overflow-hidden rounded-lg  bg-white text-left border border-gray-300 shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
                    <ComboboxInput
                        class="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0 placeholder-gray-400"
                        :displayValue="(item) => item?.name || ''" :placeholder="placeholder"
                        @change="handleChange($event)" />
                    <ComboboxButton class="absolute inset-y-0 right-0 flex items-center pr-2">
                        <ChevronUpDownIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </ComboboxButton>
                </div>
                <TransitionRoot leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0"
                    @after-leave="query = ''">
                    <ComboboxOptions
                        class="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
                        <div v-if="filteredOptions.length === 0 && query !== ''"
                            class="relative cursor-default select-none px-4 py-2 text-gray-700">
                            Nothing found.
                        </div>

                        <ComboboxOption v-for="item in filteredOptions" as="template" :key="item.id" :value="item"
                            v-slot="{ selected, active }">
                            <li class="z-50 relative cursor-default select-none py-2 pl-10 pr-4 w-auto min-w-60 overflow-x-auto"
                                :class="{ 'bg-teal-600 text-white': active, 'text-gray-900': !active }">
                                <span class="block" :class="{ 'font-medium': selected, 'font-normal': !selected }">
                                    {{ item.name }}
                                </span>
                                <span v-if="selected" class="absolute inset-y-0 left-0 flex items-center pl-3"
                                    :class="{ 'text-white': active, 'text-teal-600': !active }">
                                    <CheckIcon class="h-5 w-5" aria-hidden="true" />
                                </span>
                            </li>
                        </ComboboxOption>
                    </ComboboxOptions>
                </TransitionRoot>
            </div>
        </Combobox>
    </div>
</template>

<script setup>
import { ref, computed, defineProps, defineEmits } from 'vue';
import {
    Combobox,
    ComboboxInput,
    ComboboxButton,
    ComboboxOptions,
    ComboboxOption,
    TransitionRoot
} from '@headlessui/vue';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/vue/20/solid';

const props = defineProps({
    modelValue: Object, // Selected value
    options: Array, // List of options
    placeholder: String, // Placeholder text
});

const emit = defineEmits(['update:modelValue']);
const query = ref('');

const filteredOptions = computed(() => {
    return query.value === ''
        ? props.options
        : props.options.filter((item) =>
            item.name.toLowerCase().includes(query.value.toLowerCase())
        );
});

// Watch for selection changes and emit the updated value
const selectedItem = computed({
    get: () => props.modelValue,
    set: (newValue) => emit('update:modelValue', newValue),
});

// Handle when input text is manually changed
const handleChange = (event) => {
    query.value = event.target.value;
    if (!query.value) {
        emit('update:modelValue', null);
    }
};
</script>
