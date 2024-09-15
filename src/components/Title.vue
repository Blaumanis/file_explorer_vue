<template>
    <h1 @click="handleClick" class='text-[18px] flex items-center cursor-pointer select-none'>
        <component :is="iconComponent" />
        FILE_EXPLORER
    </h1>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { ChevronRightIcon, ChevronDownIcon } from '@/icons/icons';

// Define props type
type TitleProps = {
    func: () => void;
    isShowingFileTree: boolean;
};

// Define props
const props = defineProps<TitleProps>();

// Computed property for the icon component
const iconComponent = computed(() => (props.isShowingFileTree ? ChevronDownIcon : ChevronRightIcon));

// Handle click function
const handleClick = () => {
    props.func();
};
</script>
