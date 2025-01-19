<template>
  <div
    class="app min-h-screen flex flex-col items-center justify-start bg-gray-100 p-6"
  >
    <!-- Timer and End Test Button (Side by Side) -->
    <div
      v-if="currentQuestion && !isTestCompleted"
      class="flex justify-between items-center w-full max-w-3xl mb-6"
    >
      <Timer
        :questionCount="questions.length"
        :timePerQuestion="60"
        @end-test="endTest"
      />

      <EndTestButton
        @end-test="endTest"
        class="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>

    <!-- Subject Selection Component -->
    <SubjectSelection
      v-if="!currentSubject && !isTestCompleted"
      @subject-selected="loadQuiz"
      class="w-full bg-white/80 rounded-lg p-6 shadow-xl"
    />

    <!-- Loader (Shows before loading the quiz) -->
    <div v-if="loading" class="flex justify-center items-center h-full w-full">
      <div
        class="spinner-border animate-spin border-4 border-blue-500 rounded-full w-16 h-16"
      ></div>
    </div>

    <!-- Loading State -->
    <div
      v-if="currentSubject && !currentQuestion && !isTestCompleted && !loading"
    >
      <p class="text-center text-xl text-gray-700">Loading questions...</p>
    </div>

    <!-- QuizCard Component -->
    <QuizCard
      v-if="currentQuestion && !isTestCompleted && !loading"
      :question="currentQuestion"
      @answer-selected="handleAnswer"
      :index="questionIndex"
      class="w-full p-6 bg-white/80 rounded-lg shadow-xl"
    />

    <!-- Result Display -->
    <ResultDisplay
      v-if="isTestCompleted"
      :questions="questions"
      :userAnswers="userAnswers"
      :score="score"
      class="w-full p-6 bg-white/80 rounded-lg shadow-xl text-center mt-6"
    />
  </div>
</template>

<script>
import SubjectSelection from "./components/SubjectSelection.vue";
import QuizCard from "./components/QuizCard.vue";
import Timer from "./components/Timer.vue";
import EndTestButton from "./components/EndTestButton.vue";
import ResultDisplay from "./components/ResultDisplay.vue";

export default {
  components: {
    SubjectSelection,
    QuizCard,
    Timer,
    EndTestButton,
    ResultDisplay,
  },
  data() {
    return {
      subjects: [],
      questions: [],
      currentSubject: null,
      currentQuestion: null,
      userAnswers: [],
      score: 0,
      isTestCompleted: false,
      loading: false, // Track loading state
    };
  },
  computed: {
    questionIndex() {
      return this.userAnswers.length; // The index is the length of userAnswers
    },
  },
  methods: {
    async loadQuiz(subjectId) {
      this.currentSubject = subjectId;
      this.loading = true; // Show loader

      try {
        const response = await fetch(
          `http://localhost:8000/questions?subject_id=${subjectId}`
        );
        const data = await response.json();

        // Log the API response to inspect its structure
        console.log("API Response:", data);

        if (Array.isArray(data) && data.length > 0) {
          this.questions = data;

          // Shuffle the questions
          this.shuffleQuestions();

          // Shuffle options for each question
          this.shuffleOptionsForQuestions();

          // Wait for 3 seconds before showing the questions
          setTimeout(() => {
            this.nextQuestion(0); // Start the quiz with the first question
            this.loading = false; // Hide loader after 3 seconds
          }, 3000);
        } else {
          console.error("No questions found or invalid response structure.");
          this.endTest(); // End the test if no questions are found
        }
      } catch (error) {
        console.error("Error fetching quiz data:", error);
        this.endTest(); // Handle error and end the test
      }
    },

    shuffleQuestions() {
      // Fisher-Yates shuffle algorithm to randomize the questions
      for (let i = this.questions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [this.questions[i], this.questions[j]] = [
          this.questions[j],
          this.questions[i],
        ]; // Swap elements
      }
    },

    shuffleOptionsForQuestions() {
      // Shuffle options for each question
      this.questions.forEach((question) => {
        const optionsCopy = [...question.options]; // Copy options to avoid mutating the original array
        for (let i = optionsCopy.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [optionsCopy[i], optionsCopy[j]] = [optionsCopy[j], optionsCopy[i]]; // Swap elements
        }
        question.options = optionsCopy; // Assign shuffled options back to the question
      });
    },

    nextQuestion(index) {
      if (index < this.questions.length) {
        const question = this.questions[index];

        if (
          question &&
          typeof question.question === "string" &&
          Array.isArray(question.options) &&
          question.options.length > 0 &&
          typeof question.correct_answer === "string"
        ) {
          // Assign a fallback question_id if it's missing
          question.question_id = question.question_id || `question-${index}`;
          this.currentQuestion = question;
        } else {
          console.error(
            "Invalid question data detected:",
            JSON.stringify(question)
          );
          this.endTest();
        }
      } else {
        this.endTest();
      }
    },

    handleAnswer(selectedAnswer) {
      // Store the selected answer and proceed to the next question
      this.userAnswers.push(selectedAnswer);

      // Debugging log to check answer selections
      console.log("User Answers:", this.userAnswers);

      // Move to the next question
      this.nextQuestion(this.userAnswers.length);
    },

    endTest() {
      this.isTestCompleted = true; // Mark the test as completed
      this.calculateScore(); // Calculate the score even if not all questions are answered
    },

    calculateScore() {
      this.score = this.userAnswers.filter(
        (answer, index) => answer === this.questions[index].correct_answer
      ).length; // Calculate the score based on correct answers
    },
  },
};
</script>

<style scoped>
.app {
  background: linear-gradient(to top, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.05));
}

/* Loader Styling */
.spinner-border {
  border-top-color: transparent;
  border-right-color: transparent;
}
</style>
