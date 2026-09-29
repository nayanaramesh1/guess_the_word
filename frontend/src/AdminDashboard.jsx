import { useState } from "react";

function AdminDashboard({ user }) {
  const [dailyReport, setDailyReport] = useState([]);
  const [userReport, setUserReport] = useState([]);
  const [message, setMessage] = useState("");

  const fetchDailyReport = async () => {
    try {
      const response = await fetch(
        `http://127.0.0.1:5000/api/admin/daily-report?user_id=${user.user_id}`
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message);
        return;
      }

      setDailyReport(data);
      setUserReport([]);
      setMessage("");
    } catch (error) {
      setMessage("Unable to load daily report");
    }
  };

  const fetchUserReport = async () => {
    try {
      const response = await fetch(
        `http://127.0.0.1:5000/api/admin/user-report?user_id=${user.user_id}`
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message);
        return;
      }

      setUserReport(data);
      setDailyReport([]);
      setMessage("");
    } catch (error) {
      setMessage("Unable to load user report");
    }
  };

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <div>
          <h1>Admin Dashboard</h1>
          <p>Welcome, {user.username}</p>
        </div>
      </div>

      <div className="admin-actions">
        <button onClick={fetchDailyReport}>
          Daily Report
        </button>

        <button onClick={fetchUserReport}>
          User Report
        </button>
      </div>

      {message && <p className="admin-message">{message}</p>}

      {dailyReport.length > 0 && (
        <div className="report-section">
          <h2>Daily Game Report</h2>

          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Players</th>
                <th>Total Games</th>
                <th>Games Won</th>
                <th>Games Lost</th>
              </tr>
            </thead>

            <tbody>
              {dailyReport.map((report, index) => (
                <tr key={index}>
                  <td>{new Date(report.game_date).toLocaleDateString()}</td>
                  <td>{report.unique_players}</td>
                  <td>{report.total_games}</td>
                  <td>{report.games_won}</td>
                  <td>{report.games_lost}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {userReport.length > 0 && (
        <div className="report-section">
          <h2>User Report</h2>

          <table>
            <thead>
              <tr>
                <th>Username</th>
                <th>Registered</th>
                <th>Total Games</th>
                <th>Games Won</th>
                <th>Games Lost</th>
              </tr>
            </thead>

            <tbody>
              {userReport.map((report) => (
                <tr key={report.user_id}>
                  <td>{report.username}</td>
                  <td>
                    {new Date(report.created_at).toLocaleDateString()}
                  </td>
                  <td>{report.total_games}</td>
                  <td>{report.games_won}</td>
                  <td>{report.games_lost}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;