import React, { useEffect, useState } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import './ReportPage.css';
import { calculateStatistics, fetchSurveyData, calculateAverageStatistics } from './utils';
import { getRatingStars, getPieData, getBarData } from './chartUtils';
import { downloadReport } from './downloadReport';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, ArcElement);

const ReportPage = ({ clientId }) => {
  const [report, setReport] = useState(null);
  const [averageStats, setAverageStats] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);

  useEffect(() => {
    fetchSurveyData()
      .then(data => {
        const clientReport = data.surveyReports.find(report => report.id === clientId);
        setReport(clientReport);

        const averageStats = calculateAverageStatistics(data.surveyReports);
        setAverageStats(averageStats);
      });
  }, [clientId]);

  if (!report || !averageStats) {
    return <div>Loading...</div>;
  }

  const { totalQuestions, yesCount, noCount, categoryStats } = calculateStatistics(report.responses);
  const yesPercentage = ((yesCount / totalQuestions) * 100).toFixed(2);
  const noPercentage = ((noCount / totalQuestions) * 100).toFixed(2);

  const pieData = getPieData(yesCount, noCount);
  const barData = getBarData(yesPercentage, noPercentage, averageStats);

  const bestCategory = Object.entries(categoryStats).reduce((best, [category, stats]) => {
    return stats.yesPercentage > best.yesPercentage ? { category, ...stats } : best;
  }, { yesPercentage: 0 });

  const worstCategory = Object.entries(categoryStats).reduce((worst, [category, stats]) => {
    return stats.yesPercentage < worst.yesPercentage ? { category, ...stats } : worst;
  }, { yesPercentage: 100 });

  const openModal = (content) => {
    setModalContent(content);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setModalContent(null);
  };

  return (
    <div className="report-container" id="report-container">
      <button onClick={downloadReport}>Download Report as PDF</button>
      <h1>Survey Report</h1>
      <h2>{report.client}</h2>
      <div className="statistics">
        <h3>Statistics</h3>
        <div className="statistics-content">
          <div className="pie-chart-container">
            <Pie data={pieData} options={{ maintainAspectRatio: false }} />
          </div>
          <div className="ratings">
            <p>Yes: {yesPercentage}%</p>
            <p>No: {noPercentage}%</p>
            <p>Rating: <span className="stars">{getRatingStars(yesPercentage)}</span></p>
            <div className="rating-explanation">
              <p><span className="stars">★★★</span> - 80% and above</p>
              <p><span className="stars">★★</span> - 60% to 79%</p>
              <p><span className="stars">★</span> - Below 60%</p>
            </div>
          </div>
        </div>
        <div className="bar-chart-container">
          <Bar data={barData} options={{ maintainAspectRatio: false }} />
        </div>
      </div>
      <div className="no-responses">
        <h3>No Responses</h3>
        <table className="no-responses-table">
          <thead>
            <tr>
              <th>Category</th>
              <th>Question</th>
              <th>Answer</th>
              <th>Image</th>
              <th>Video</th>
              <th>Comment</th>
            </tr>
          </thead>
          <tbody>
            {report && Object.entries(report.responses).flatMap(([category, questions]) =>
              Object.entries(questions).filter(([question, details]) => details.answer === 'no').map(([question, details]) => (
                <tr key={`${category}-${question}`}>
                  <td>{category}</td>
                  <td>{question}</td>
                  <td>{details.answer}</td>
                  <td>
                    {details.image ? (
                      <img src={details.image} alt="response" onClick={() => openModal(<img src={details.image} alt="response" className="modal-content" />)} />
                    ) : null}
                  </td>
                  <td>
                    {details.video ? (
                      <video src={details.video} controls onClick={() => openModal(<video src={details.video} controls className="modal-content" />)} />
                    ) : <span>No Video</span>}
                  </td>
                  <td>{details.comment}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div id="report-content">
        <h3>Responses</h3>
        {report && Object.entries(report.responses).map(([category, questions]) => (
          <div key={category}>
            <h4>{category}</h4>
            <div id="report-container">
              <table>
                <thead>
                  <tr>
                    <th>Answer</th>
                    <th>Image</th>
                    <th>Video</th>
                    <th>Comment</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(questions).map(([question, details]) => (
                    <tr key={question}>
                      <td>{question}</td>
                      <td>{details.answer}</td>
                      <td>
                        {details.image ? (
                          <a href={details.image} target="_blank" rel="noopener noreferrer">
                            <img src={details.image} alt="response" onClick={() => openModal(<img src={details.image} alt="response" className="modal-content" />)} />
                          </a>
                        ) : null}
                      </td>
                      <td>
                        {details.video ? (
                          <a href={details.video} target="_blank" rel="noopener noreferrer">
                            <video src={details.video} controls onClick={() => openModal(<video src={details.video} controls className="modal-content" />)} />
                          </a>
                        ) : <span>No Video</span>}
                      </td>
                      <td>{details.comment}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
      <div className="category-performance">
        <h3>Category Performance</h3>
        <table>
          <thead>
            <tr>
              <th>Category</th>
              <th>Yes Percentage</th>
              <th>No Percentage</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(categoryStats).map(([category, stats]) => (
              <tr key={category}>
                <td>{category}</td>
                <td>{stats.yesPercentage}%</td>
                <td>{stats.noPercentage}%</td>
              </tr>
            ))}
          </tbody>
        </table>
        <h3>Best Performing Category</h3>
        <p>{bestCategory.category}: {bestCategory.yesPercentage}% Yes</p>
        <h3>Underperforming Category</h3>
        <p>{worstCategory.category}: {worstCategory.yesPercentage}% Yes</p>
      </div>
      {modalIsOpen && (
        <div className="modal" onClick={closeModal}>
          <span className="close" onClick={closeModal}>&times;</span>
          {modalContent}
        </div>
      )}
    </div>
  );
};

export default ReportPage;
