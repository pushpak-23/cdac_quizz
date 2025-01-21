<template>
  <div
    v-if="question"
    class="quiz-card w-[90vw] sm:w-[70vw] md:w-[50vw] min-h-[40vh] p-6 sm:p-8 bg-white/80 backdrop-blur-xl rounded-xl shadow-xl flex flex-col justify-between space-y-6"
  >
    <!-- Question Text with Index -->
    <p class="text-2xl sm:text-3xl font-semibold text-gray-800">
      {{ index + 1 }}. {{ question.question }}
    </p>

    <!-- Options List -->
    <div class="space-y-4">
      <div
        v-for="(option, optionIndex) in shuffledOptions"
        :key="optionIndex"
        class="flex items-center space-x-4"
      >
        <!-- Use a unique id for each radio button -->
        <input
          type="radio"
          :id="'option-' + optionIndex"
          :name="sanitizedQuestionId"
          :value="option"
          v-model="selectedAnswer"
          class="hidden"
        />

        <!-- Make the entire label clickable by associating it with the radio button -->
        <label
          :for="'option-' + optionIndex"
          class="flex items-center space-x-4 cursor-pointer text-lg sm:text-xl text-gray-700"
        >
          <span
            class="w-6 h-6 flex justify-center items-center border border-gray-300 rounded-full"
          >
            <span
              v-if="selectedAnswer === option"
              class="w-4 h-4 bg-blue-600 rounded-full"
            ></span>
          </span>
          <span>{{ option }}</span>
        </label>
      </div>
    </div>

    <!-- Next Button -->
    <div class="mt-4">
      <button
        :disabled="!selectedAnswer"
        @click="onNext"
        class="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Next
      </button>
    </div>
  </div>
  <div v-else class="text-center text-xl text-gray-700">
    <p>Loading question...</p>
  </div>
</template>

<script>
export default {
  props: ["question", "index"], // Accept the index prop
  data() {
    return {
      selectedAnswer: null, // Initially, no answer is selected
      shuffledOptions: [], // Will hold the shuffled options
    };
  },
  computed: {
    sanitizedQuestionId() {
      // Ensure `question_id` exists and is a string, else use a fallback
      const questionId = this.question?.question_id;

      if (typeof questionId === "string") {
        return questionId.replace(/[^a-zA-Z0-9-_]/g, "");
      }

      console.error(
        "Invalid or missing `question_id` in question:",
        JSON.stringify(this.question, null, 2)
      );

      // Generate a fallback ID if `question_id` is invalid
      return `fallback-id-${Math.random().toString(36).substring(2, 15)}`;
    },
  },

  methods: {
    onNext() {
      // Emit the selected answer to the parent component
      this.$emit("answer-selected", this.selectedAnswer);

      // Reset selected answer for the next question
      this.selectedAnswer = null;
    },

    shuffleOptions() {
      // Fisher-Yates shuffle algorithm to randomize the options
      const optionsCopy = [...this.question.options]; // Copy the options to avoid modifying the original array
      for (let i = optionsCopy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [optionsCopy[i], optionsCopy[j]] = [optionsCopy[j], optionsCopy[i]]; // Swap elements
      }
      this.shuffledOptions = optionsCopy; // Set shuffled options
    },
  },
  watch: {
    question: "shuffleOptions", // Re-shuffle whenever the question changes
  },
  mounted() {
    this.shuffleOptions(); // Shuffle when the component is first mounted
  },
};
</script>

<style scoped>
.quiz-card {
  font-family: "Poppins", sans-serif;
  transition: all 0.3s ease;
}
</style>
