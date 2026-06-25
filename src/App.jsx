import { useState, useEffect } from "react";
import "./App.css";


function App() {
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem("tasks");

    if (savedTasks) {
      return JSON.parse(savedTasks);
    }

    return [
      { text: "Learn React", completed: false },
      { text: "Build To-Do App", completed: false },
      { text: "Deploy to Vercel", completed: false },
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
  const [editingPriority, setEditingPriority] = useState("Medium");
  const [filter, setFilter] = useState("all");
  const [searchText, setSearchText] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [priority, setPriority] = useState("Medium");
  const [toast, setToast] = useState("")


  function addTask() {
    if (!newTitle.trim()) return;
    
    setTasks([
      ...tasks,
      {
        title: newTitle,
        description: newDescription,
        dueDate: dueDate,
        priority: priority,
        completed: false,
      },
    ]);

    setNewTitle("");
    setNewDescription("");
    setDueDate("");
    setPriority("Medium")
    showToast("Task added  ✅ ");
  }

   

  function deleteTask(indexToDelete) {
    const updatedTasks = tasks.filter(
      (_, index) => index !== indexToDelete
    );

    setTasks(updatedTasks);
    showToast("Task deleted  🗑️");
  }

  

  function saveTask(indexToSave)  {
    if (!editingText.trim()) return;

    const updatedTasks = [...tasks];

    updatedTasks[indexToSave] = {
      ...updatedTasks[indexToSave],
      title: editingText,
      dueDate: editingDueDate,
      priority: editingPriority,
    };


    setTasks(updatedTasks);
    setEditingIndex(null);
    setEditingText("");
    setEditingDueDate("");
    setEditingPriority("Medium");
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
    if (!a.dueDate) return 1;
    if (!b.dueDate) return -1;

    return new Date(a.dueDate) - new Date(b.dueDate);
  });

   const totalTasks = tasks.length;

          const completedTasks = tasks.filter((task) => task.completed).length;

          const activeTasks = tasks.filter((task) => !task.completed).length;


  
  return (
    <div className={darkMode ? "dark" : "light"} >
      <h1>My To-Do List</h1>

  {toast && <div className="toast">{toast}</div>}

  <div className="controls">
 <div className="toolbar">
        <button onClick={() => setDarkMode(!darkMode)}>
        {darkMode ? "Light Mode ☀️ " : "Dark Mode 🌙 "}
      </button>
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

     <div className="input-row">

       <input
         type="text" 
         placeholder="Task Title"
         value={newTitle}
         onChange={(e) => setNewTitle(e.target.value)}
         className="title-input"
        />

      <textarea 
        placeholder="Task Description"
        value={newDescription}
        onChange={(e) => setNewDescription(e.target.value)}
        rows={1}
        className="description-input"
        
      />
     </div>

     <div className="action-row">
      <div className="date-wrapper">
        {!dueDate && (
          <span className="date-placeholder">
             📅 Please add date
          </span>
        )}

        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="date-input"
          />
    </div>
        
      <select 
        value={priority}
        onChange={(e) => setPriority(e.target.value)}
        >
         <option>High</option>
         <option>Medium</option>
         <option>Low</option>
      </select>
</div>
  
    

     <div className="bottom-row">

       <button className="add-btn" onClick={addTask}>Add</button>
      <button 
        className={filter === "all" ? "active-filter" : ""}
      onClick={() => setFilter("all")}>
          All
      </button>  

      <button 
          className={filter === "active" ? "active-filter" : ""}
      onClick={() => setFilter("active")}>
          Active
      </button>

      <button 
          className={filter === "completed" ? "active-filter" : ""}
         onClick={() => setFilter("completed")}>
          Completed
      </button>  
         
     </div>

     

     


      <p>
                Total: {totalTasks} |
                Active: {activeTasks} |
                Completed: {completedTasks}
            </p>


  </div>
    
   
           
      <ul>
       {sortedTasks.length === 0 && (
        <p className="empty-state">
            📝 No tasks found.
        </p>
       )}
        
        {sortedTasks.map((task) => {
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

            

          <li key={realIndex} className={`task-card ${task.completed ? "completed-card" : ""}`}
          >

            <h3 className={task.completed ? "completed" : "" }>
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

                  <button onClick={() => saveTask(realIndex)}>
                    Save
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
                  {/*
                   <strong style={{ color: isOverdue ? "red" : "inherit" }}>
                    {task.title}
                    </strong>
                   */}
                  
 
                  {task.dueDate && <div> 📅  {task.dueDate}</div>}
                   {task.priority && (
                   <div
                     style={{
                      color:
                        task.priority === "High"
                        ? "red"
                        : task.priority === "Medium"
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
                         📌  Due Today
                      </div>
                      )}
                     
                </div>
             </span>

     <div className="task-actions">
          <button
                  onClick={() => {
                    setEditingIndex(realIndex);
                    setEditingText(task.title || task.text || "");
                    setEditingDueDate(task.dueDate || "");
                    setEditingPriority(task.priority || "Medium");
                  }}
             >
              Edit

             </button>
           

                   <button onClick={() =>  deleteTask(realIndex)}>Delete</button>
                   <button onClick={() => toggleCompleted(realIndex)}>Done </button>
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