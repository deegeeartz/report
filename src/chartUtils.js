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
export const getPieData = (yesCount, noCount, naCount) => ({
  labels: ['Yes', 'No', 'NA'],
  datasets: [
    {
      data: [yesCount, noCount, naCount],
      backgroundColor: ['#36A2EB', '#FF6384', '#FFCE56']
    }
  ]
});

// Function to get bar chart data
export const getBarData = (yesPercentage, noPercentage, naPercentage, averageStats) => ({
  labels: ['Yes', 'No', 'NA'],
  datasets: [
    {
      label: 'Your Performance',
      data: [yesPercentage, noPercentage, naPercentage],
      backgroundColor: '#36A2EB'
    },
    {
      label: 'Average Performance',
      data: [averageStats.yesPercentage, averageStats.noPercentage, averageStats.naPercentage],
      backgroundColor: '#FF6384'
    }
  ]
});