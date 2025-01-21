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

    <!-- Loader -->
    <div v-if="loading" class="flex justify-center items-center h-full w-full">
      <div
        class="spinner-border animate-spin border-4 border-blue-500 rounded-full w-16 h-16"
      ></div>
    </div>

    <!-- Loading State -->
    <div v-if="loadingState && !isTestCompleted">
      <p class="text-center text-xl text-gray-700">Loading questions...</p>
    </div>

    <!-- QuizCard Component -->
    <QuizCard
      v-if="currentQuestion && !isTestCompleted && !loading"
      :question="currentQuestion"
      @answer-selected="handleAnswer"
      :index="userAnswers.length"
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
      loading: false,
    };
  },

  computed: {
    loadingState() {
      return this.currentSubject && !this.currentQuestion && !this.loading;
    },
  },

  methods: {
    async loadQuiz(subjectId) {
      this.currentSubject = subjectId;
      this.loading = true;
      const selectedQuestions = this.questions.filter(
        (q) => q.subject_id === subjectId
      );

      if (selectedQuestions.length > 0) {
        this.questions = selectedQuestions;
        this.shuffleQuestions();
        this.shuffleOptionsForQuestions();

        setTimeout(() => {
          this.nextQuestion(0);
          this.loading = false;
        }, 3000);
      } else {
        console.error("No questions found for this subject.");
        this.endTest();
      }
    },

    shuffleQuestions() {
      for (let i = this.questions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [this.questions[i], this.questions[j]] = [
          this.questions[j],
          this.questions[i],
        ];
      }
    },

    shuffleOptionsForQuestions() {
      this.questions.forEach((q) => {
        for (let i = q.options.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [q.options[i], q.options[j]] = [q.options[j], q.options[i]];
        }
      });
    },

    nextQuestion(index) {
      if (index < this.questions.length) {
        const question = this.questions[index];
        if (
          question?.question &&
          Array.isArray(question.options) &&
          question.options.length > 0 &&
          question.correct_answer
        ) {
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
      this.userAnswers.push(selectedAnswer);
      this.nextQuestion(this.userAnswers.length);
    },

    endTest() {
      this.isTestCompleted = true;
      this.calculateScore();
    },

    calculateScore() {
      this.score = this.userAnswers.filter(
        (answer, index) => answer === this.questions[index].correct_answer
      ).length;
    },
  },

  mounted() {
    fetch("/db.json")
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data.subjects) && Array.isArray(data.questions)) {
          this.subjects = data.subjects;
          this.questions = data.questions;
        } else {
          console.error("Invalid data structure in db.json");
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  },
};
</script>

<style scoped>
.app {
  background: linear-gradient(to top, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.05));
}

.spinner-border {
  border-top-color: transparent;
  border-right-color: transparent;
}
</style>
