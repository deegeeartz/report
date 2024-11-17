// src/utils.js

// Function to calculate statistics from the responses
export const calculateStatistics = (responses) => {
  let totalQuestions = 0;
  let yesCount = 0;
  let noCount = 0;
  let naCount = 0;
  let noResponses = [];

  // Iterate through each category and question to count responses
  for (const category in responses) {
    for (const question in responses[category]) {
      totalQuestions++;
      const answer = responses[category][question].answer;
      if (answer === 'yes') yesCount++;
      if (answer === 'no') {
        noCount++;
        noResponses.push({ category, question });
      }
      if (answer === 'NA') naCount++;
    }
  }

  // Return the calculated statistics
  return { totalQuestions, yesCount, noCount, naCount, noResponses };
};

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
    acc.naCount += stats.naCount;
    return acc;
  }, { totalQuestions: 0, yesCount: 0, noCount: 0, naCount: 0 });

  return {
    yesPercentage: ((totalStats.yesCount / totalStats.totalQuestions) * 100).toFixed(2),
    noPercentage: ((totalStats.noCount / totalStats.totalQuestions) * 100).toFixed(2),
    naPercentage: ((totalStats.naCount / totalStats.totalQuestions) * 100).toFixed(2)
  };
};