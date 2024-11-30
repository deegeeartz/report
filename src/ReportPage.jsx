// src/ReportPage.jsx
import React, { useEffect, useState } from 'react';
import { Pie, Bar } from 'react-chartjs-2';
import Modal from 'react-modal';
import Fullscreen from 'react-fullscreen-crossbrowser';
import './ReportPage.css';
import { calculateStatistics, fetchSurveyData, calculateAverageStatistics } from './utils';
import { getRatingStars, getPieData, getBarData } from './chartUtils';
import { downloadReport } from './downloadReport';

const ReportPage = ({ clientId }) => {
  const [report, setReport] = useState(null);
  const [averageStats, setAverageStats] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    fetchSurveyData()
      .then(data => {
        const clientReport = data.surveyReports.find(report => report.id === clientId);
        setReport(clientReport);

        const averageStats = calculateAverageStatistics(data.surveyReports);
        setAverageStats(averageStats);
      });
  }, [clientId]);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  if (!report || !averageStats) {
    return <div>Loading...</div>;
  }

  const { totalQuestions, yesCount, noCount, naCount } = calculateStatistics(report.responses);
  const yesPercentage = ((yesCount / totalQuestions) * 100).toFixed(2);
  const noPercentage = ((noCount / totalQuestions) * 100).toFixed(2);
  const naPercentage = ((naCount / totalQuestions) * 100).toFixed(2);

  const pieData = getPieData(yesCount, noCount, naCount);
  const barData = getBarData(yesPercentage, noPercentage, naPercentage, averageStats);

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
            <p>NA: {naPercentage}%</p>
            <p>Rating: <span className="stars">{getRatingStars(yesPercentage)}</span></p>
            <div className="rating-explanation">
              <p><span className="stars">★★★</span> - 80% and above</p>
              <p><span className="stars">★★</span> - 60% to 79%</p>
              <p><span className="stars">★</span> - Below 60%</p>
            </div>
          </div>
        </div>
      </div>
      <div className="comparison">
        <h3>Anonymous Comparison</h3>
        <p>This is how you are performing compared to other hospitality ventures:</p>
        <div className="bar-chart-container">
          <Bar data={barData} />
        </div>
      </div>
      <div className="no-responses">
        <h3>Questions with "No" Responses</h3>
        {Object.entries(report.responses).map(([category, questions]) => (
          <div key={category}>
            <h4>{category}</h4>
            <table>
              <thead>
                <tr>
                  <th>Question</th>
                  <th>Answer</th>
                  <th>Image</th>
                  <th>Video</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(questions).map(([question, details]) => (
                  details.answer === 'no' && (
                    <tr key={question}>
                      <td>{question}</td>
                      <td>{details.answer}</td>
                      <td>
                        {details.image ? (
                          <img
                            src={details.image}
                            alt="thumbnail"
                            className="thumbnail"
                            onClick={() => openModal(<img src={details.image} alt="full" />)}
                          />
                        ) : (
                          <span>No Image</span>
                        )}
                      </td>
                      <td>
                        {details.video ? (
                          <video
                            src={details.video}
                            className="thumbnail"
                            onClick={() => openModal(
                              <video controls>
                                <source src={details.video} type="video/mp4" />
                                Your browser does not support the video tag.
                              </video>
                            )}
                          />
                        ) : (
                          <span>No Video</span>
                        )}
                      </td>
                    </tr>
                  )
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
      <div id="report-content">
        <h3>Responses</h3>
        {report && Object.entries(report.responses).map(([category, questions]) => (
          <div key={category}>
            <h4>{category}</h4>
            <table>
              <thead>
                <tr>
                  <th>Question</th>
                  <th>Answer</th>
                  <th>Image</th>
                  <th>Video</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(questions).map(([question, details]) => (
                  <tr key={question}>
                    <td>{question}</td>
                    <td>{details.answer}</td>
                    <td>
                      {details.image ? (
                        <img
                          src={details.image}
                          alt="thumbnail"
                          className="thumbnail"
                          onClick={() => openModal(<img src={details.image} alt="full" />)}
                        />
                      ) : (
                        <span>No Image</span>
                      )}
                    </td>
                    <td>
                      {details.video ? (
                        <video
                          src={details.video}
                          className="thumbnail"
                          onClick={() => openModal(
                            <video controls>
                              <source src={details.video} type="video/mp4" />
                              Your browser does not support the video tag.
                            </video>
                          )}
                        />
                      ) : (
                        <span>No Video</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Media Modal"
        className="modal"
        overlayClassName="overlay"
      >
        <Fullscreen enabled={isFullscreen} onChange={setIsFullscreen}>
          <div className={`modal-content ${isFullscreen ? 'fullscreen' : ''}`}>
            {modalContent}
            <button onClick={toggleFullscreen}>
              {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            </button>
            <button onClick={closeModal}>Close</button>
          </div>
        </Fullscreen>
      </Modal>
    </div>
  );
};

export default ReportPage;