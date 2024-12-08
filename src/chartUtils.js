// src/chartUtils.js

// Function to get rating stars based on percentage
export const getRatingStars = (percentage) => {
  if (percentage >= 80) {
    return '★★★';
  } else if (percentage >= 60) {
    return '★★';
  } else {
    return '★';
  }
};

// Function to get pie chart data
export const getPieData = (yesCount, noCount) => {
  return {
    labels: ['Yes', 'No'],
    datasets: [
      {
        data: [yesCount, noCount],
        backgroundColor: ['#36A2EB', '#FF6384'],
      },
    ],
  };
};

// Function to get bar chart data
export const getBarData = (yesPercentage, noPercentage, averageStats) => {
  return {
    labels: ['Yes', 'No'],
    datasets: [
      {
        label: 'Current Survey',
        data: [yesPercentage, noPercentage],
        backgroundColor: ['#36A2EB', '#FF6384'],
      },
      {
        label: 'Average Survey',
        data: [averageStats.yesPercentage, averageStats.noPercentage],
        backgroundColor: ['#FFCE56', '#4BC0C0'],
      },
    ],
  };
};