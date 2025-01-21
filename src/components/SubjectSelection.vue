<template>
  <div
    class="subject-selection w-[80vw] sm:w-[90vw] md:w-[70vw] lg:w-[60vw] min-h-[50vh] p-8 bg-white/80 backdrop-blur-xl rounded-xl shadow-xl flex flex-col justify-center items-center space-y-6"
  >
    <h2 class="text-3xl sm:text-2xl font-semibold text-center text-red-800">
      Welcome Fuckers!!!
    </h2>
    <h2 class="text-3xl sm:text-2xl font-semibold text-center text-gray-800">
      Select a Subject
    </h2>
    <div class="flex justify-center w-full">
      <select
        v-model="selectedSubject"
        @change="loadQuestions"
        class="w-full sm:w-[60%] p-4 bg-white/60 backdrop-blur-lg border-2 border-gray-300 rounded-lg text-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
      subjects: [], // Temporary array to store data from db.json
      selectedSubject: null,
    };
  },
  methods: {
    async loadQuestions() {
      this.$emit("subject-selected", this.selectedSubject);
    },
  },
  mounted() {
    // Fetch subjects from the db.json file located in the public folder
    fetch("/db.json") // This assumes db.json is in the public folder
      .then((response) => response.json())
      .then((data) => {
        // Assuming your db.json has a structure like { "subjects": [...] }
        this.subjects = data.subjects; // Store the data in the temporary array
        console.log("Data loaded:", this.subjects); // Optional: log the loaded data
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
