import React, { useState, useMemo } from 'react';
import { useProject } from '../../context/ProjectContext';
import './TaskTable.css';
import { createPortal } from 'react-dom';

const priorityColors = {
  High: '#ff4d4f',
  Medium: '#faad14',
  Low: '#52c41a',
};

const statusColors = {
  'In Progress': '#1890ff',
  'To Do': '#8c8c8c',
  'Completed': '#52c41a',
  'Delayed': '#f5222d',
};

// --- Task Modal Component (Reused for Add Task, Add Subtask, and Edit Task) ---
const TaskModal = ({ isOpen, onClose, onSave, title, initialData = {}, teamMembers }) => {
    if (!isOpen) return null;

    const [formData, setFormData] = useState({
        name: '',
        priority: 'Medium',
        status: 'To Do',
        dueDate: new Date().toISOString().split('T')[0],
        assignee: 'Unassigned',
        ...initialData
    });

    // Reset when modal opens with new initialData
    React.useEffect(() => {
        setFormData({
            name: '',
            priority: 'Medium',
            status: 'To Do',
            dueDate: new Date().toISOString().split('T')[0],
            assignee: 'Unassigned',
            ...initialData
        });
    }, [initialData, isOpen]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
        onClose();
    };

    return createPortal(
        <div className="modal-overlay">
            <div className="modal-content">
                <h3>{title}</h3>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Task Name</label>
                        <input 
                            required 
                            autoFocus
                            value={formData.name}
                            onChange={e => setFormData({...formData, name: e.target.value})}
                            placeholder="Enter task name..."
                        />
                    </div>
                    
                    <div className="form-row">
                        <div className="form-group">
                            <label>Priority</label>
                            <select 
                                value={formData.priority}
                                onChange={e => setFormData({...formData, priority: e.target.value})}
                            >
                                {['High', 'Medium', 'Low'].map(p => <option key={p} value={p}>{p}</option>)}
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Status</label>
                            <select 
                                value={formData.status}
                                onChange={e => setFormData({...formData, status: e.target.value})}
                            >
                                {Object.keys(statusColors).map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Due Date</label>
                            <input 
                                type="date"
                                value={formData.dueDate}
                                onChange={e => setFormData({...formData, dueDate: e.target.value})}
                            />
                        </div>
                        <div className="form-group">
                            <label>Assignee</label>
                            <select 
                                value={formData.assignee}
                                onChange={e => setFormData({...formData, assignee: e.target.value})}
                            >
                                <option value="Unassigned">Unassigned</option>
                                {teamMembers.map(m => (
                                    <option key={m.id} value={m.name}>{m.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="modal-actions">
                        <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
                        <button type="submit" className="btn-primary">Save Task</button>
                    </div>
                </form>
            </div>
        </div>,
        document.body
    );
};

// Recursive Task Row (Read-Only)
const TaskRow = ({ task, level = 0, onAddSubTask, onToggleSelect, isSelected }) => {
  const [expanded, setExpanded] = useState(false);
  const hasSubtasks = task.subtasks && task.subtasks.length > 0;

  return (
    <>
      <tr className={`task-row level-${level} ${isSelected ? 'selected-row' : ''}`}>
        <td className="checkbox-col">
          <input 
            type="checkbox" 
            checked={!!isSelected}
            onChange={() => onToggleSelect(task.id)}
          />
        </td>
        <td className="name-col" style={{ paddingLeft: `${16 + level * 24}px` }}>
            <div className="task-name-wrapper">
                {hasSubtasks ? (
                    <button 
                        className={`expand-btn ${expanded ? 'expanded' : ''}`}
                        onClick={() => setExpanded(!expanded)}
                    >
                        ▶
                    </button>
                ) : <span className="spacer" style={{width: '24px', display:'inline-block'}}></span>}
                
                {level > 0 && <span className="subtask-connector">└</span>}
                
                <span className="task-name-text">{task.name}</span>
                
                <button 
                    className="add-subtask-btn" 
                    title="Add Subtask" 
                    onClick={(e) => {
                        e.stopPropagation(); // Prevent row select if implemented
                        onAddSubTask(task.id);
                    }}
                >
                    +
                </button>
            </div>
        </td>
        
        {/* Read-Only Status */}
        <td>
           <span 
                className="status-badge"
                style={{
                    backgroundColor: statusColors[task.status] || '#ccc', 
                    color: '#fff',
                    padding: '4px 12px',
                    borderRadius: '12px',
                    fontSize: '0.75rem',
                    fontWeight: 600
                }}
            >
                {task.status}
           </span>
        </td>

        {/* Read-Only Priority */}
        <td>
            <span style={{color: priorityColors[task.priority], fontWeight: 'bold'}}>
                {task.priority || '-'}
            </span>
        </td>

        <td>{task.dueDate || '-'}</td>
        
        {/* Read-Only Assignee */}
        <td>
            {task.assignee}
        </td>
      </tr>
      
      {expanded && hasSubtasks && task.subtasks.map(sub => (
        <TaskRow 
            key={sub.id} 
            task={sub} 
            level={level + 1} 
            onAddSubTask={onAddSubTask}
            onToggleSelect={onToggleSelect}
            isSelected={isSelected} 
        />
      ))}
    </>
  );
};

export default function TaskTable() {
  const { tasks, teamMembers, addTask, addSubTask, updateTask, deleteTask } = useProject();
  const [selectedTasks, setSelectedTasks] = useState([]); 
  
  // Modal State
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' | 'subtask' | 'edit'
  const [activeTaskId, setActiveTaskId] = useState(null); // Parent ID for subtask, or Task ID for edit
  const [editTaskData, setEditTaskData] = useState({}); // Data for editing

  // Filters State
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterPriority, setFilterPriority] = useState('All');

  const toggleSelectTask = (id) => {
    if (selectedTasks.includes(id)) {
      setSelectedTasks(selectedTasks.filter(tid => tid !== id));
    } else {
      setSelectedTasks([...selectedTasks, id]);
    }
  };

  // --- Modal Helpers ---

  const openAddTaskModal = () => {
      setModalMode('add');
      setEditTaskData({});
      setIsTaskModalOpen(true);
  };

  const openAddSubTaskModal = (parentId) => {
      setModalMode('subtask');
      setActiveTaskId(parentId);
      setEditTaskData({});
      setIsTaskModalOpen(true);
  };

  const openEditTaskModal = () => {
    if (selectedTasks.length !== 1) return;
    
    // Find the task recursively
    const findTask = (list, id) => {
        for (const t of list) {
            if (t.id === id) return t;
            if (t.subtasks) {
                const found = findTask(t.subtasks, id);
                if (found) return found;
            }
        }
        return null;
    };

    const taskToEdit = findTask(tasks, selectedTasks[0]);
    if (taskToEdit) {
        setModalMode('edit');
        setActiveTaskId(selectedTasks[0]);
        setEditTaskData(taskToEdit);
        setIsTaskModalOpen(true);
    }
  };

  const handleSaveTask = (taskData) => {
      if (modalMode === 'add') {
          addTask(taskData);
      } else if (modalMode === 'subtask') {
          addSubTask(activeTaskId, taskData);
      } else if (modalMode === 'edit') {
          updateTask(activeTaskId, taskData);
      }
  };

  const filterTasks = (taskList) => {
    return taskList.reduce((acc, task) => {
      const matchesStatus = filterStatus === 'All' || task.status === filterStatus;
      const matchesPriority = filterPriority === 'All' || task.priority === filterPriority;
      const isMatch = matchesStatus && matchesPriority;
      const filteredSubtasks = task.subtasks ? filterTasks(task.subtasks) : [];
      const hasMatchingChildren = filteredSubtasks.length > 0;

      if (isMatch || hasMatchingChildren) {
        acc.push({ ...task, subtasks: filteredSubtasks });
      }
      return acc;
    }, []);
  };

  const filteredTasks = useMemo(() => filterTasks(tasks), [tasks, filterStatus, filterPriority]);

  return (
    <div className="task-table-container">
      
      {/* Floating Bulk Action Toolbar */}
      {selectedTasks.length > 0 && (
        <div className="multitask-toolbar">
          <span className="selected-count">{selectedTasks.length} Selected</span>
          <div className="toolbar-actions">
            
            <button className="toolbar-btn" onClick={() => {
                selectedTasks.forEach(id => updateTask(id, { status: 'In Progress' }));
                setSelectedTasks([]);
            }}>Mark In Progress</button>
            
            <button className="toolbar-btn" onClick={() => {
                selectedTasks.forEach(id => updateTask(id, { status: 'Completed' }));
                setSelectedTasks([]);
            }}>✓ Mark Done</button>
            
            <div className="divider" style={{width:1, background:'#555', margin:'0 8px'}}></div>

            <button 
                className="toolbar-btn" 
                disabled={selectedTasks.length > 1}
                style={{ opacity: selectedTasks.length > 1 ? 0.5 : 1, cursor: selectedTasks.length > 1 ? 'not-allowed' : 'pointer'}}
                onClick={openEditTaskModal}
            >
                Edit Task
            </button>

            <div className="divider" style={{width:1, background:'#555', margin:'0 8px'}}></div>

            <button className="toolbar-btn delete-btn" onClick={() => {
                if(window.confirm(`Delete ${selectedTasks.length} tasks?`)) {
                    selectedTasks.forEach(id => deleteTask(id));
                    setSelectedTasks([]);
                }
            }}>🗑 Delete</button>
          </div>
          <button className="close-toolbar" onClick={() => setSelectedTasks([])}>×</button>
        </div>
      )}

      <div className="table-header-controls">
        <div style={{display:'flex', gap:'12px', alignItems:'center'}}>
            <h2>Tasks</h2>
            <button className="btn-primary" onClick={openAddTaskModal} style={{borderRadius: '20px', padding:'6px 16px', fontSize:'0.9rem'}}>
                + Add Task
            </button>
        </div>

        <div style={{display:'flex', gap:'12px'}}>
            <select 
                value={filterStatus} 
                onChange={(e) => setFilterStatus(e.target.value)}
                className="filter-select"
            >
                <option value="All">All Status</option>
                {Object.keys(statusColors).map(s => <option key={s} value={s}>{s}</option>)}
            </select>

            <select 
                value={filterPriority} 
                onChange={(e) => setFilterPriority(e.target.value)}
                className="filter-select"
            >
                <option value="All">All Priority</option>
                {['High', 'Medium', 'Low'].map(p => <option key={p} value={p}>{p}</option>)}
            </select>
        </div>
      </div>

      <table className="task-table">
        <thead>
          <tr>
            <th className="checkbox-col">Select</th>
            <th className="name-col">Task Name</th>
            <th>Status</th>
            <th>Priority</th>
            <th>Due Date</th>
            <th>Assignee</th>
          </tr>
        </thead>
        <tbody>
          {filteredTasks.length > 0 ? (
              filteredTasks.map(task => (
                <TaskRow 
                    key={task.id} 
                    task={task} 
                    teamMembers={teamMembers}
                    // onUpdate removed to enforce read-only
                    onAddSubTask={openAddSubTaskModal} 
                    onDelete={deleteTask}
                    onToggleSelect={toggleSelectTask}
                    isSelected={selectedTasks.includes(task.id)}
                />
              ))
          ) : (
              <tr>
                  <td colSpan="6" style={{textAlign:'center', padding:'2rem', color:'#999'}}>
                      No tasks found.
                  </td>
              </tr>
          )}
        </tbody>
      </table>

      {/* Shared Modal for Add/Edit */}
      <TaskModal 
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onSave={handleSaveTask}
        title={
            modalMode === 'add' ? "Add New Task" : 
            modalMode === 'subtask' ? "Add Subtask" : 
            "Edit Task"
        }
        initialData={editTaskData}
        teamMembers={teamMembers}
      />
    </div>
  );
}
