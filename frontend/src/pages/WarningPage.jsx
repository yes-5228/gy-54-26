import { AlertTriangle, ChevronDown, ChevronUp } from "lucide-react";
import { useEffect, useState } from "react";
import { api } from "../api/client";
import Notice from "../components/Notice";

export default function WarningPage() {
  const [warningList, setWarningList] = useState([]);
  const [notice, setNotice] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadWarningStudents = async () => {
    setLoading(true);
    try {
      const data = await api.listWarningStudents();
      setWarningList(data);
    } catch (error) {
      setNotice({ type: "error", message: error.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWarningStudents();
  }, []);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <section className="page">
      <header className="page-header">
        <div>
          <h1>学业预警名单</h1>
          <p>挂科较多或绩点偏低的学生自动进入待关注列表。</p>
        </div>
        <div className="warning-stats">
          <div className="metric warn-metric">
            <span>待关注学生</span>
            <strong>{warningList.length}</strong>
          </div>
        </div>
      </header>

      <Notice notice={notice} />

      <div className="panel">
        <div className="panel-head">
          <h2>待关注列表</h2>
          <span className="muted">共 {warningList.length} 名学生</span>
        </div>

        {loading ? (
          <div className="empty">加载中...</div>
        ) : warningList.length === 0 ? (
          <div className="empty">暂无学业预警学生</div>
        ) : (
          <div className="warning-list">
            {warningList.map((item) => (
              <div key={item.student.id} className="warning-card">
                <div className="warning-card-header" onClick={() => toggleExpand(item.student.id)}>
                  <div className="warning-student-info">
                    <div className="warning-avatar">
                      <AlertTriangle size={20} />
                    </div>
                    <div>
                      <strong>{item.student.name}</strong>
                      <span>{item.student.studentNo}</span>
                    </div>
                  </div>
                  <div className="warning-summary">
                    <div className="summary-item">
                      <span>挂科</span>
                      <strong className="fail-count">{item.failCount} 门</strong>
                    </div>
                    <div className="summary-item">
                      <span>GPA</span>
                      <strong className={item.summary.gpa < 2.0 ? "low-gpa" : ""}>{item.summary.gpa}</strong>
                    </div>
                    <div className="summary-item">
                      <span>平均分</span>
                      <strong>{item.summary.averageScore}</strong>
                    </div>
                    <button className="expand-btn" type="button">
                      {expandedId === item.student.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </button>
                  </div>
                </div>

                {expandedId === item.student.id && (
                  <div className="warning-card-detail">
                    <div className="warning-reasons">
                      <span className="reason-label">预警原因：</span>
                      {item.reasons.map((reason, index) => (
                        <span key={index} className="reason-tag">{reason}</span>
                      ))}
                    </div>
                    <div className="fail-courses">
                      <h4>挂科课程</h4>
                      <div className="table-wrap">
                        <table>
                          <thead>
                            <tr>
                              <th>课程名称</th>
                              <th>课程代码</th>
                              <th>学期</th>
                              <th>学分</th>
                              <th>成绩</th>
                            </tr>
                          </thead>
                          <tbody>
                            {item.failCourses.map((course, index) => (
                              <tr key={index}>
                                <td>
                                  <strong>{course.courseName}</strong>
                                  <span>{course.courseCode}</span>
                                </td>
                                <td>{course.courseCode}</td>
                                <td>{course.semester}</td>
                                <td>{course.credit}</td>
                                <td className="fail-score">{course.score}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                    <div className="student-info-extra">
                      <p><span>专业：</span>{item.student.major || "未填写"}</p>
                      <p><span>班级：</span>{item.student.className || "未填写"}</p>
                      <p><span>已获学分：</span>{item.summary.passedCredit} / {item.summary.totalCredit}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
