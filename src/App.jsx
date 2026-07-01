import { useState, useEffect } from "react";
import "./App.css";
import { FaClipboardList } from "react-icons/fa";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

function App() {
  const [selectedDate, setSelectedDate] = useState(new Date());

 
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem("tasks");

    if (savedTasks) {
      return JSON.parse(savedTasks);
    }

    return [
      //  { text: " ", completed: false },
    ];
  });

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [dueDate, setDueDate] = useState("");

  const [editingIndex, setEditingIndex] = useState(null);
  const [editingText, setEditingText] = useState("");
  const [editingDueDate, setEditingDueDate] = useState("");
  const [editingPriority, setEditingPriority] = useState("สำคัญปานกลาง");
  const [filter, setFilter] = useState("all");
  const [searchText, setSearchText] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [priority, setPriority] = useState("สำคัญปานกลาง");
  const [toast, setToast] = useState("");
  const [editingDescription, setEditingDescription] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [openTasks, setOpenTasks] = useState([]);

  function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  const selectedDateText = formatDate(selectedDate);

  const tasksOnSelectedDate = tasks.filter(
    (task) => task.dueDate === selectedDateText
  );

  function toggleCollapse(index) {
    setOpenTasks((prev) =>
      prev.includes(index)
        ? prev.filter((item) => item !== index)
        : [...prev, index],
    );
  }

  function togglePin(indexToPin) {
     const selectedTask = tasks[indexToPin];

     const updatedTask = {
      ...selectedTask,
      pinned: !selectedTask.pinned,
     };

     const otherTasks = tasks.filter((_, index) => index !== indexToPin);

     if (updatedTask.pinned) {
      setTasks([updatedTask, ...otherTasks]);
     } else {
      setTasks([...otherTasks, updatedTask]);
     }

    }

  function addTask() {
    if (!newTitle.trim()) return;

    const newItem = {
      title: newTitle,
      description: newDescription,
      dueDate,
      priority,
      completed: false,
      pinned: false,
    };

    setTasks([...tasks, newItem]);

    setNewTitle("");

    setNewDescription("");
    setDueDate("");
    setPriority("สำคัญปานกลาง");

    showToast("Task added ✅");
  }

   


  function saveTask(indexToSave) {
    if (!editingText.trim()) return;

    const updatedTasks = [...tasks];

    updatedTasks[indexToSave] = {
      ...updatedTasks[indexToSave],
      title: editingText,
      description: editingDescription,
      dueDate: editingDueDate,
      priority: editingPriority,
    };

    setTasks(updatedTasks);
    setEditingIndex(null);
    setEditingText("");
    setEditingDescription("");
    setEditingDueDate("");
    setEditingPriority("สำคัญปานกลาง");
  }

  function toggleCompleted(indexToCompleted) {
    const updatedTasks = [...tasks];

    updatedTasks[indexToCompleted] = {
      ...updatedTasks[indexToCompleted],
      completed: !updatedTasks[indexToCompleted].completed,
    };

    setTasks(updatedTasks);
    showToast("Task updated ✅");
  }

  function showToast(message) {
    setToast(message);

    setTimeout(() => {
      setToast("");
    }, 2000);
  }

  const filteredTasks = tasks.filter((task) => {
    if (filter === "active" && task.completed) return false;
    if (filter === "completed" && !task.completed) return false;

    const title = task.title || task.text || "";
    const description = task.description || "";

    return (
      title.toLowerCase().includes(searchText.toLowerCase()) ||
      description.toLowerCase().includes(searchText.toLowerCase())
    );
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {

    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }

    if (!a.completed && b.completed && a.pinned !== b.pinned) {
      return b.pinned - a.pinned;
    }

    if (a.completed && b.completed && a.pinned !== b.pinned) {
      return b.pinned - a.pinned;
    }


    return 0;
  });

    const activeTasks = sortedTasks.filter(task => !task.completed);
    const completdTasksList = sortedTasks.filter(task => task.completed);

  const totalTasks = tasks.length;

  const completedTasks = tasks.filter((task) => task.completed).length;

  const activeCount = tasks.filter((task) => !task.completed).length;

  function getDayName(dateString) {
    if (!dateString) return "";

    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
    });
  }

  function confirmDelete() {
    const updatedTasks = tasks.filter((_, index) => index !== taskToDelete);

    setTasks(updatedTasks);

    setShowConfirm(false);
    setTaskToDelete(null);

    showToast("Task deleted 🚮");
  }

  /*
 <button onClick={() => setDarkMode(!darkMode)}>
        {darkMode ? "Light Mode ☀️ " : "Dark Mode 🌙 "}
      </button>
*/

  return (
    <div className={darkMode ? "dark" : "light"}>
      {toast && <div className="toast">{toast}</div>}

      <div className="controls">
        <div className="toolbar">
          <h2 className="app-title">
            <FaClipboardList className="title-icon" />
            My To Do
          </h2>
        </div>
        {/* 
   <div className="search-bar">
        <input
        type="text"
        placeholder=" Search tasks..."
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        />
     </div> 
   */}

      <div className="calendar-box">
        <h2> Calendar</h2>

        <Calendar
          onChange={setSelectedDate}
          value={selectedDate}
          tileContent={({ date}) => {
            const dateText = formatDate(date);

            const hasTask = tasks.some((task) => task.dueDate === dateText);
            
            return hasTask ? <div className="task-dot">●</div> : null;
          }}
          />

          <h3>กิจกรรมวันที่ {selectedDateText}</h3>

          {tasksOnSelectedDate.length === 0 ? (
            <p className="empty-calendar-task">No tasks on this day</p>
          ) : (
            <ul>
              {tasksOnSelectedDate.map((task, index) => (
                <li key={index} className="calendar-task">
                  ✅{task.title}
                </li>
              ))}
            </ul>
          )
          }
      </div>

        <div className="title-row">
          <input
            className="task-title-input"
            type="text"
            placeholder="ชื่อ กิจกรรม"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
          />
        </div>

        <div className="description-row">
          <textarea
            placeholder="รายละเอียด"
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            rows={7}
          />
        </div>

        <div className="date-priority-row">
          <div className="date-wrapper">
            {!dueDate && <span className="date-placeholder">เลือกวัน</span>}

            <input
              className="date-input"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>

          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option>สำคัญมาก</option>
            <option>สำคัญปานกลาง</option>
            <option>สำคัญน้อย</option>
          </select>
        </div>

        <div className="bottom-row">
          <button className="add-btn" onClick={addTask}>
            บันทึกกิจกรรม
          </button>
          <button
            className={filter === "all" ? "active-filter" : ""}
            onClick={() => setFilter("all")}
          >
            ทั้งหมด
          </button>

          <button
            className={filter === "active" ? "active-filter" : ""}
            onClick={() => setFilter("active")}
          >
            กำลังจะทำ
          </button>

          <button
            className={filter === "completed" ? "active-filter" : ""}
            onClick={() => setFilter("completed")}
          >
            เสร็จแล้ว
          </button>
        </div>

        <p>
          ทั้งหมด: {totalTasks} | กำลังจะทำ: {activeCount} | เสร็จแล้ว:{" "}
          {completedTasks}
        </p>
      </div>

      <ul>
        {sortedTasks.length === 0 && (
          <p className="empty-state">📝 ไม่มีกิจกรรม</p>
        )}

        {sortedTasks.map((task, index) => {
          const realIndex = tasks.indexOf(task);

          const today = new Date().toISOString().split("T")[0];

          const isOverdue =
            task.dueDate && task.dueDate < today && !task.completed;

          const isDueToday = task.dueDate === today && !task.completed;

        

          return (
            <li
              key={realIndex}
              className={`task-card  ${
                task.pinned ? "pinned-card" : ""
              } ${
                task.completed ? "completed-card" : ""
              /* /* ? "completed-card"
                  : index % 2 === 0
                    ? "white-card"
                    : "brown-card"  */
              }`}
            >

              
              <div className="task-header">
                <h3
                  className={
                    isOverdue ? "task-overdue" : isDueToday ? "task-today" : ""
                  }
                >
                  {task.title || task.text || "ไม่มีชื่อกิจกรรม"}
                </h3>

                 <button className="pin-btn" onClick={() => togglePin(realIndex)}>
                  {task.pinned ? " 📌" : "📍"}
                </button>

                <button
                  className="collapse-btn"
                  onClick={() => toggleCollapse(realIndex)}
                >
                  {openTasks.includes(realIndex) ? "▼" : "▶"}
                </button>

               
              </div>

              {openTasks.includes(realIndex) && (
                <>
                  {task.description && (
                    <p className="task-description">{task.description}</p>
                  )}

                  {editingIndex === realIndex ? (
                    <>
                      <div className="edit-form">
                        <label>📝หัวข้อ</label>
                        <input
                          className="edit-input"
                          value={editingText}
                          onChange={(e) => setEditingText(e.target.value)}
                          placeholder="หัวข้อกิจกรรม"
                        />

                        <label>📌 รายละเอียด</label>
                        <textarea
                          className="edit-textarea"
                          value={editingDescription}
                          onChange={(e) =>
                            setEditingDescription(e.target.value)
                          }
                          rows={7}
                          placeholder="รายละเอียดกิจกรรม"
                        />

                        <label>📅 วันที่</label>
                        <input
                          className="edit-input"
                          type="date"
                          value={editingDueDate}
                          onChange={(e) => setEditingDueDate(e.target.value)}
                        />

                        <label>🚩 ความสำคัญ</label>
                        <select
                          className="edit-select"
                          value={editingPriority}
                          onChange={(e) => setEditingPriority(e.target.value)}
                        >
                          <option>สำคัญมาก</option>
                          <option>สำคัญปานกลาง</option>
                          <option>สำคัญน้อย</option>
                        </select>

                        <div className="edit-actions">
                          <button
                            className="cancel-edit-btn"
                            onClick={() => setEditingIndex(null)}
                          >
                            ❌ ยกเลิก
                          </button>

                          <button
                            className="save-edit-btn"
                            onClick={() => saveTask(realIndex)}
                          >
                            💾 บันทึก
                          </button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <span
                        style={{
                          textDecoration: task.completed
                            ? "line-through"
                            : "none",
                        }}
                      >
                        <div>
                          {task.dueDate && (
                            <div>
                             <h4> 📅 {task.dueDate} {getDayName(task.dueDate)} </h4>
                            </div>
                          )}

                          {task.priority && (
                            <div
                              style={{
                                color:
                                  task.priority === "สำคัญมาก"
                                    ? "red"
                                    : task.priority === "สำคัญปานกลาง"
                                      ? "orange"
                                      : "green",
                                fontWeight: "bold",
                              }}
                            >
                              🚩 {task.priority}
                            </div>
                          )}

                          {isDueToday && (
                            <div className="due-today">📌 ต้องทำวันนี้</div>
                          )}

                          
                        </div>
                      </span>

                      <div className="task-actions">
                        <button
                          onClick={() => {
                            setEditingIndex(realIndex);
                            setEditingText(task.title || task.text || "");
                            setEditingDescription(task.description || "");
                            setEditingDueDate(task.dueDate || "");
                            setEditingPriority(task.priority || "สำคัญปานกลาง");
                          }}
                        >
                          แก้ไข
                        </button>

                        <button
                          onClick={() => {
                            setTaskToDelete(realIndex);
                            setShowConfirm(true);
                          }}
                        >
                          ลบ
                        </button>
                        <button onClick={() => toggleCompleted(realIndex)}>
                          ทำแล้ว{" "}
                        </button>
                      </div>
                    </>
                  )}
                </>
              )}
            </li>
          );
        })}
      </ul>

      {showConfirm && (
        <div
          className="dialog-overlay"
          onClick={() => {
            setShowConfirm(false);
            setTaskToDelete(null);
          }}
        >
          <div className="dialog-box" onClick={(e) => e.stopPropagation()}>
            <h2>🚮 Delete Task</h2>

            <p>
              ยืนยันลบกิจกรรมนี้ <br />
              <strong>"{tasks[taskToDelete]?.title}"</strong>
            </p>

            <div className="dialog-buttons">
              <button
                onClick={() => {
                  setShowConfirm(false);
                  setTaskToDelete(null);
                }}
              >
                ยกเลิก
              </button>

              <button className="delete-btn" onClick={confirmDelete}>
                ลบ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
