import React, { useState } from 'react';
import './Dashboard.css';
import { useProject } from '../../context/ProjectContext';

const Dashboard = () => {
  const { tasks, teamMembers, addTask, updateTask } = useProject();
  const [newTaskName, setNewTaskName] = useState('');

  // Helper to flatten tasks and subtasks
  const getAllTasks = (taskList) => {
      let flat = [];
      taskList.forEach(task => {
          flat.push(task);
          if (task.subtasks && task.subtasks.length > 0) {
              flat = flat.concat(getAllTasks(task.subtasks));
          }
      });
      return flat;
  };

  const allTasks = getAllTasks(tasks);

  const handleAddTask = (e) => {
      if (e.key === 'Enter' && newTaskName.trim()) {
          addTask({
              name: newTaskName,
              status: 'To Do',
              priority: 'Medium',
              dueDate: new Date().toISOString().split('T')[0],
              assignee: 'You', // Default assignee
              subtasks: []
          });
          setNewTaskName('');
      }
  };

  const handleToggleTask = (taskId) => {
      updateTask(taskId, { status: 'Completed' });
  };

  // Workload Calculation
  const workload = teamMembers.map(member => {
    const count = allTasks.filter(t => t.assignee === member.name && t.status !== 'Completed').length;
    return { name: member.name, count };
  }).sort((a,b) => b.count - a.count);

  // Overdue / Upcoming
  const today = new Date().toISOString().split('T')[0];
  const urgentTasks = allTasks
    .filter(t => t.status !== 'Completed')
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

  return (
    <div className="home-view-container">
       <div className="creative-header">
         <span className="date-badge">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
         <h1>Good Afternoon, User!</h1>
         <p>You have <strong>{allTasks.filter(t => t.status !== 'Completed').length} active tasks</strong> across your projects.</p>
       </div>
      
      <div className="home-sections">
        <section className="home-section">
          <h2>⚠️ Attention Needed</h2>
          <div className="task-list-preview">
            {urgentTasks.slice(0, 3).map(task => (
              <div key={task.id} className="task-preview-item">
                 <div style={{flexGrow: 1}}>
                    <div className="task-name">{task.name}</div>
                    <div style={{fontSize: '0.75rem', color: '#e53e3e'}}>Due: {task.dueDate}</div>
                 </div>
                 <span className={`priority-indicator ${task.priority.toLowerCase()}`}></span>
                 <span className="task-status">{task.status}</span>
              </div>
            ))}
            {urgentTasks.length === 0 && <p style={{color:'#718096'}}>No urgent tasks.</p>}
          </div>
        </section>

        <section className="home-section">
           <h2>My Priorities</h2>
           <div className="my-work-list">
              <h3>High Priority</h3>
              {allTasks.filter(t => t.status !== 'Completed' && t.priority === 'High').slice(0, 3).map(task => (
                <div key={task.id} className="work-item">
                    <span className="priority-indicator high"></span>
                    <span>{task.name}</span>
                </div>
              ))}
              {allTasks.filter(t => t.status !== 'Completed' && t.priority === 'High').length === 0 && <p style={{color:'#a0aec0', fontSize:'0.9rem'}}>No high priority tasks.</p>}
           </div>
        </section>
        
        <section className="home-section">
            <h2>To-Do List</h2>
            <div className="my-work-list">
                <div style={{marginBottom:'10px', display:'flex'}}>
                     <input 
                        type="text" 
                        placeholder="+ Add a task (Press Enter)" 
                        value={newTaskName}
                        onChange={(e) => setNewTaskName(e.target.value)}
                        onKeyDown={handleAddTask}
                        style={{border:'none', borderBottom:'1px solid #e2e8f0', width:'100%', padding:'5px', outline:'none'}} 
                    />
                </div>
                {allTasks.filter(t => t.status === 'To Do').slice(0, 5).map(task => (
                    <div key={task.id} className="work-item" style={{cursor: 'pointer'}} onClick={() => handleToggleTask(task.id)}>
                         <div className={`status-dot ${task.status === 'Completed' ? 'completed' : ''}`}></div>
                         <input 
                            type="checkbox" 
                            checked={task.status === 'Completed'} 
                            onChange={() => handleToggleTask(task.id)}
                            style={{marginRight: '8px', cursor: 'pointer'}}
                         />
                        <span style={{
                            marginLeft:'8px', 
                            textDecoration: task.status === 'Completed' ? 'line-through' : 'none',
                            color: task.status === 'Completed' ? '#a0aec0' : 'inherit'
                        }}>
                            {task.name}
                        </span>
                    </div>
                ))}
                {allTasks.filter(t => t.status === 'To Do').length === 0 && <p style={{color:'#a0aec0', fontSize:'0.9rem', marginTop:'10px'}}>No tasks to do! 🎉</p>}
            </div>
        </section>

        <section className="home-section">
            <h2>Team Workload</h2>
            <div className="workload-list">
                {workload.slice(0, 4).map(member => (
                    <div key={member.name} className="work-item" style={{justifyContent: 'space-between'}}>
                        <div style={{display:'flex', alignItems:'center'}}>
                            <div style={{
                                width: '30px', height: '30px', borderRadius: '50%', 
                                backgroundColor: '#cbd5e0', marginRight: '10px',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '0.8rem', fontWeight: 'bold'
                            }}>
                                {member.name.charAt(0).toUpperCase()}
                            </div>
                            <span>{member.name}</span>
                        </div>
                        <span style={{
                            backgroundColor: member.count > 3 ? '#fed7d7' : '#e2e8f0', 
                            color: member.count > 3 ? '#c53030' : '#2d3748',
                            padding: '2px 8px', borderRadius: '12px', fontSize: '0.8rem'
                        }}>
                            {member.count} tasks
                        </span>
                    </div>
                ))}
            </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
