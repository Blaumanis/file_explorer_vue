<!-- <template>
    <div class='fixed inset-0 flex items-center justify-center'>
        <component :is="component" />
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

type ModalProps = {
    loading: boolean;
    error: string | null;
}
const props = defineProps<ModalProps>();

const component = computed(() => (loading ? <div class= 'loader' /> : <p>Error: { error } </p>))

</script>

<style scoped>
.loader {
    width: 50px;
    height: 50px;
    border: 4px solid #f3f3f3;
    border-top: 4px solid #0080a7;
    border-radius: 50%;
    animation: spin 2s linear infinite;
    margin: 1rem auto;
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}
</style> -->
<template>
    <div class='fixed inset-0 flex items-center justify-center'>
        <div v-if="loading" class='loader'></div>
        <p v-else-if="error">Error: {{ error }}</p>
        <div v-else> <!-- Default case if neither loading nor error is true --></div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

// Define props type
type ModalProps = {
    loading: boolean;
    error: string | null;
};

// Define props
const props = defineProps<ModalProps>();

// Computed property for the component
const loading = computed(() => props.loading);
const error = computed(() => props.error);
</script>

<style scoped>
.loader {
    width: 50px;
    height: 50px;
    border: 4px solid #f3f3f3;
    border-top: 4px solid #0080a7;
    border-radius: 50%;
    animation: spin 2s linear infinite;
    margin: 1rem auto;
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}
</style>
