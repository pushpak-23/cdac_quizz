<template>
  <div
    class="subject-selection w-[80vw] min-h-[50vh] p-8 bg-white/80 backdrop-blur-xl rounded-xl shadow-xl flex flex-col justify-center space-y-6"
  >
    <h2 class="text-3xl font-semibold text-center text-red-800">
      Welcome Fuckers!!!
    </h2>
    <h2 class="text-3xl font-semibold text-center text-gray-800">
      Select a Subject
    </h2>
    <div class="flex justify-center">
      <select
        v-model="selectedSubject"
        @change="loadQuestions"
        class="w-[60%] p-4 bg-white/60 backdrop-blur-lg border-2 border-gray-300 rounded-lg text-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option
          v-for="subject in subjects"
          :key="subject.id"
          :value="subject.id"
        >
          {{ subject.name }}
        </option>
      </select>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      subjects: [],
      selectedSubject: null,
    };
  },
  methods: {
    async loadQuestions() {
      this.$emit("subject-selected", this.selectedSubject);
    },
  },
  mounted() {
    // Fetch subjects from the API
    fetch("http://192.168.82.10:8000/subjects")
      .then((response) => response.json())
      .then((data) => {
        this.subjects = data;
      })
      .catch((error) => {
        console.error("Error fetching subjects:", error);
      });
  },
};
</script>

<style scoped>
.subject-selection {
  font-family: "Poppins", sans-serif;
  transition: all 0.3s ease;
}
</style>
