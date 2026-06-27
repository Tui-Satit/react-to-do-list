import { useState, useEffect } from "react";
import "./App.css";


function App() {
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

  


  function addTask() {
    if (!newTitle.trim()) return;
   
    const newItem = {
      title: newTitle,
      description: newDescription,
      dueDate,
      priority,
      completed: false,
    };
    
    setTasks([...tasks, newItem]);

    setNewTitle("");

    setNewDescription("");
    setDueDate("");
    setPriority("สำคัญปานกลาง");

    showToast("Task added ✅");

  }

   

  function deleteTask(indexToDelete) {
    const confirmDelete = window.confirm(
      "🚮 ยืนยัน ลบ"
    );

    if (!confirmDelete) return;

    const updatedTasks = tasks.filter(
      (_, index) => index !== indexToDelete
    );

    setTasks(updatedTasks);
    showToast("ลบกิจกรรมเรียบร้อย 🗑️");
  }

  

  function saveTask(indexToSave)  {
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

   function toggleCompleted(indexToCompleted)  {
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
    if (filter === "active" && task.completed ) return false;
    if (filter === "completed" && !task.completed) return false;
    
    const title = task.title || task.text || "";
    const description = task.description || "";

    return (
       title.toLowerCase().includes(searchText.toLowerCase()) ||
      description.toLowerCase().includes(searchText.toLowerCase())
    );
      
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
     if (a.completed !== b.completed ) {
      return a.completed ? 1 : -1;
     }

     if (!a.dueDate) return 1;
     if (!b.dueDate) return -1;

    return new Date(a.dueDate) - new Date(b.dueDate);
  });

   const totalTasks = tasks.length;

          const completedTasks = tasks.filter((task) => task.completed).length;

          const activeTasks = tasks.filter((task) => !task.completed).length;

  function getDayName(dateString) {
    if (!dateString) return "";

    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long"
    });
  }

/*
 <button onClick={() => setDarkMode(!darkMode)}>
        {darkMode ? "Light Mode ☀️ " : "Dark Mode 🌙 "}
      </button>
*/
  
  return (
    <div className={darkMode ? "dark" : "light"} >
   
   
  {toast && <div className="toast">{toast}</div>}

  <div className="controls">
 <div className="toolbar">
          <h2>My To Do List</h2>
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
        rows={3}
       
        
      />
     </div>

     <div className="date-priority-row">  
        <div className="date-wrapper">
          {!dueDate && <span className="date-placeholder">เลือกวัน</span>}
        
    
        <input
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

       <button className="add-btn" onClick={addTask}>ส่งกิจกรรม</button>
      <button 
        className={filter === "all" ? "active-filter" : ""}
      onClick={() => setFilter("all")}>
          ทั้งหมด
      </button>  

      <button 
          className={filter === "active" ? "active-filter" : ""}
      onClick={() => setFilter("active")}>
          กำลังจะทำ
      </button>

      <button 
          className={filter === "completed" ? "active-filter" : ""}
         onClick={() => setFilter("completed")}>
          เสร็จแล้ว
      </button>  
         
     </div>

     

     


      <p>
                ทั้งหมด: {totalTasks} |
                กำลังจะทำ: {activeTasks} |
                เสร็จแล้ว: {completedTasks}
            </p>


  </div>
    
   
           
      <ul>
       {sortedTasks.length === 0 && (
        <p className="empty-state">
            📝 ไม่มีกิจกรรม
        </p>
       )}
        
        {sortedTasks.map((task, index) => {
          const realIndex = tasks.indexOf(task);
          
          const today = new Date().toISOString().split("T")[0];

          const isOverdue = 
             task.dueDate &&
             task.dueDate < today &&
             !task.completed;

          const isDueToday = 
             task.dueDate === today &&
             !task.completed;

         

          return (

            

          <li key={realIndex} className={`task-card ${
            task.completed ? "completed-card" 
            : index % 2 === 0
            ? "white-card"
            : "brown-card" 
             }`}
          >

            <h3 className={
              isOverdue
               ? "task-overdue"
               : isDueToday
               ? "task-today"
               : ""
            }
                   >
                    {task.title}
             </h3>

            {task.description && (
              <p className="task-description">
                {task.description}
              </p>
            )}
            {editingIndex === realIndex ? (
              <>
                <input
                  value={editingText}
                  onChange={(e) => setEditingText(e.target.value)}
                  />

                  <textarea 
                     value={editingDescription}
                     onChange={(e) => setEditingDescription(e.target.value)}
                     rows={2}
                  />

                  <input 
                    type="date"
                    value={editingDueDate}
                    onChange={(e) => setEditingDueDate(e.target.value)}
                    />

                  <select
                    value={editingPriority}
                    onChange={(e) => setEditingPriority(e.target.value)}
                    >
                      <option>สำคัญมาก</option>
                      <option>สำคัญปานกลาง</option>
                      <option>สำคัญน้อย</option>
                    </select>

                  <button onClick={() => saveTask(realIndex)}>
                    บันทึก
                  </button>
              </>
            ):(
              <>
              <span
                 style={{
                  textDecoration: task.completed ? "line-through" : "none",
                 }}
              >
                <div>
                
 
                  {task.dueDate && (
                    <div> 
                      📅  {task.dueDate} {getDayName(task.dueDate)} 
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
                      <div className="due-today">
                         📌  ต้องทำวันนี้
                      </div>
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
           

                   <button onClick={() =>  deleteTask(realIndex)}>ลบ</button>
                   <button onClick={() => toggleCompleted(realIndex)}>ทำแล้ว </button>
         </div>
           </> 
            )}
          </li>
        );
      })}
      </ul>
    </div>
  );
}

export default App;