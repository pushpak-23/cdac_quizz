<template>
  <div class="timer">
    <p class="text-lg font-semibold text-gray-700">
      {{ formattedTime }} remaining
    </p>
  </div>
</template>

<script>
export default {
  props: {
    questionCount: {
      type: Number,
      required: true, // Total number of questions, passed from the parent
    },
    timePerQuestion: {
      type: Number,
      default: 60, // Default time per question in seconds (1 minute)
    },
  },
  data() {
    return {
      timeRemaining: 0, // Total time in seconds
      timer: null, // Reference for the timer interval
    };
  },
  computed: {
    formattedTime() {
      // Convert seconds into MM:SS format
      const minutes = Math.floor(this.timeRemaining / 60);
      const seconds = this.timeRemaining % 60;
      return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
        2,
        "0"
      )}`;
    },
  },
  methods: {
    startTimer() {
      this.timer = setInterval(() => {
        if (this.timeRemaining > 0) {
          this.timeRemaining--;
        } else {
          this.stopTimer();
          this.onEndTest();
        }
      }, 1000);
    },
    stopTimer() {
      clearInterval(this.timer);
    },
    onEndTest() {
      this.$emit("end-test");
    },
  },
  mounted() {
    // Calculate total time based on the number of questions and time per question
    this.timeRemaining = this.questionCount * this.timePerQuestion;
    this.startTimer();
  },
  beforeDestroy() {
    if (this.timer) {
      this.stopTimer();
    }
  },
};
</script>

<style scoped>
.timer {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.25rem;
  font-weight: bold;
  color: #333;
}
</style>
