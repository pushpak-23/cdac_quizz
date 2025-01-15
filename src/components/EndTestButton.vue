<template>
  <button
    @click="handleClick"
    class="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
  >
    End Test
  </button>
</template>

<script>
export default {
  methods: {
    handleClick() {
      this.$emit("end-test");
    },
  },
};
</script>
