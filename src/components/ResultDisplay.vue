<template>
  <div
    class="result-display w-full sm:w-[80vw] min-h-[70vh] p-8 bg-white/90 backdrop-blur-xl rounded-xl shadow-xl space-y-6 flex flex-col"
  >
    <h2 class="text-3xl sm:text-4xl font-semibold text-center">
      <span class="text-teal-600">Your Score:</span>
      <span class="text-blue-500"> {{ score }} </span>
      <span class="text-blue-500">/ {{ attemptedQuestions.length }}</span>
    </h2>
    <ul class="space-y-4">
      <li
        v-for="(question, index) in attemptedQuestions"
        :key="index"
        class="p-6 bg-white/70 backdrop-blur-lg rounded-lg shadow-lg transition-all hover:scale-105"
      >
        <!-- Display the index of the question -->
        <p class="text-xl sm:text-2xl font-medium text-gray-800">
          Question {{ index + 1 }}: {{ question.question }}
        </p>

        <p class="text-lg sm:text-xl text-gray-700">
          Correct answer:
          <span class="font-semibold text-green-500">
            {{ question.correct_answer }}
          </span>
        </p>
        <p class="text-lg sm:text-xl text-gray-700">
          Your answer:
          <span
            :class="{
              'font-semibold text-green-500':
                userAnswers[index] === question.correct_answer,
              'font-semibold text-red-500':
                userAnswers[index] !== question.correct_answer,
            }"
          >
            {{ userAnswers[index] }}
          </span>
        </p>
      </li>
    </ul>

    <!-- Loading spinner -->
    <div v-if="isLoading" class="flex justify-center items-center">
      <div class="spinner"></div>
    </div>

    <!-- Go Back Home Button -->
    <div class="text-center" v-else>
      <button
        @click="goBackHome"
        class="mt-6 px-6 py-3 bg-teal-600 text-white rounded-lg text-xl transition-transform transform hover:scale-105"
      >
        Go Back Home
      </button>
    </div>
  </div>
</template>

<script>
export default {
  props: ["questions", "userAnswers", "score"],
  data() {
    return {
      isLoading: false, // state to track if the loader is shown
    };
  },
  computed: {
    // Filter the questions where the user has provided an answer
    attemptedQuestions() {
      return this.questions.filter(
        (_, index) => this.userAnswers[index] !== undefined
      );
    },
  },
  methods: {
    goBackHome() {
      this.isLoading = true; // show the loader
      setTimeout(() => {
        window.location.reload(); // reload the page after 3 seconds
      }, 3000);
    },
  },
};
</script>

<style scoped>
.result-display {
  font-family: "Poppins", sans-serif;
  transition: all 0.3s ease;
  background-color: rgba(255, 255, 255, 0.9);
}

.result-display h2 {
  font-family: "Roboto", sans-serif;
  color: #1d4ed8;
}

.result-display ul {
  list-style-type: none;
}

.result-display li {
  background-color: rgba(255, 255, 255, 0.7);
  border-radius: 0.5rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease-in-out;
}

.result-display li:hover {
  transform: scale(1.05);
}

.result-display p {
  font-size: 1rem;
}

.result-display .text-indigo-600 {
  color: #4f46e5;
}

.result-display .text-green-500 {
  color: #10b981;
}

.result-display .text-red-500 {
  color: #ef4444;
}

.result-display .text-teal-600 {
  color: #14b8a6;
}

.spinner {
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top: 4px solid #14b8a6;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
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
