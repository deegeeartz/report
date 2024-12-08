// src/utils.js

// Function to calculate statistics from the responses
export function calculateStatistics(responses) {
  const categoryStats = {};
  let totalQuestions = 0;
  let yesCount = 0;
  let noCount = 0;

  Object.entries(responses).forEach(([category, questions]) => {
    let categoryYesCount = 0;
    let categoryNoCount = 0;
    let categoryTotalQuestions = 0;

    Object.entries(questions).forEach(([question, details]) => {
      if (details.answer === 'yes') {
        yesCount++;
        categoryYesCount++;
        categoryTotalQuestions++;
      } else if (details.answer === 'no') {
        noCount++;
        categoryNoCount++;
        categoryTotalQuestions++;
      }
    });

    categoryStats[category] = {
      yesCount: categoryYesCount,
      noCount: categoryNoCount,
      totalQuestions: categoryTotalQuestions,
      yesPercentage: ((categoryYesCount / categoryTotalQuestions) * 100).toFixed(2),
      noPercentage: ((categoryNoCount / categoryTotalQuestions) * 100).toFixed(2),
    };

    totalQuestions += categoryTotalQuestions;
  });

  return { totalQuestions, yesCount, noCount, categoryStats };
}

// Function to fetch survey data
export const fetchSurveyData = async () => {
  const response = await fetch('/dummyData.json');
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

// Function to calculate average statistics across all clients
export const calculateAverageStatistics = (surveyReports) => {
  const totalStats = surveyReports.reduce((acc, report) => {
    const stats = calculateStatistics(report.responses);
    acc.totalQuestions += stats.totalQuestions;
    acc.yesCount += stats.yesCount;
    acc.noCount += stats.noCount;
    return acc;
  }, { totalQuestions: 0, yesCount: 0, noCount: 0 });

  const yesPercentage = ((totalStats.yesCount / totalStats.totalQuestions) * 100).toFixed(2);
  const noPercentage = ((totalStats.noCount / totalStats.totalQuestions) * 100).toFixed(2);

  return { yesPercentage, noPercentage };
};