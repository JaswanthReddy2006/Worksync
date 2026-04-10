import React, { createContext, useContext, useState, useEffect } from 'react';

const ProjectContext = createContext();

export const useProject = () => useContext(ProjectContext);

const initialTeam = [
  { id: 'u1', name: 'ram', email: 'ram@example.com', role: 'Developer' },
  { id: 'u2', name: 'rohit', email: 'rohit@example.com', role: 'Designer' },
  { id: 'u3', name: 'max', email: 'max@example.com', role: 'Project Manager' },
];

const initialTasks = [
  { 
    id: 1, 
    name: 'Design Homepage UI', 
    priority: 'High', 
    status: 'In Progress', 
    dueDate: '2023-10-25', 
    assignee: 'ram', 
    subtasks: [
        { id: 11, name: 'Create Mockups', priority: 'Medium', status: 'Completed', dueDate: '2023-10-22', assignee: 'rohit', subtasks: [] },
        { id: 12, name: 'Review with Team', priority: 'High', status: 'In Progress', dueDate: '2023-10-24', assignee: 'max', subtasks: [] },
    ] 
  },
  { 
    id: 2, 
    name: 'Api Integration', 
    priority: 'Medium', 
    status: 'To Do', 
    dueDate: '2023-11-01', 
    assignee: 'rohit', 
    subtasks: [] 
  },
];

export const ProjectProvider = ({ children }) => {
  const [tasks, setTasks] = useState(initialTasks);
  const [teamMembers, setTeamMembers] = useState(initialTeam);

  // --- Task Management ---

  const addTask = (newTask) => {
    setTasks([...tasks, { ...newTask, id: Date.now(), subtasks: [] }]);
  };

  const addSubTask = (parentId, subTask) => {
    const addSubTaskRecursive = (taskList) => {
      return taskList.map(task => {
        if (task.id === parentId) {
          return { ...task, subtasks: [...(task.subtasks || []), { ...subTask, id: Date.now(), subtasks: [] }] };
        } else if (task.subtasks && task.subtasks.length > 0) {
          return { ...task, subtasks: addSubTaskRecursive(task.subtasks) };
        }
        return task;
      });
    };
    setTasks(addSubTaskRecursive(tasks));
  };

  const updateTask = (taskId, updates) => {
    const updateRecursive = (taskList) => {
      return taskList.map(task => {
        if (task.id === taskId) {
          return { ...task, ...updates };
        } else if (task.subtasks && task.subtasks.length > 0) {
          return { ...task, subtasks: updateRecursive(task.subtasks) };
        }
        return task;
      });
    };
    setTasks(updateRecursive(tasks));
  };

  const deleteTask = (taskId) => {
      const deleteRecursive = (taskList) => {
          return taskList.filter(task => task.id !== taskId).map(task => {
              if (task.subtasks) {
                  return { ...task, subtasks: deleteRecursive(task.subtasks) };
              }
              return task;
          });
      };
      setTasks(deleteRecursive(tasks));
  };

  // --- Team Management ---

  const addTeamMember = (member) => {
    setTeamMembers([...teamMembers, { ...member, id: `u${Date.now()}` }]);
  };

  const removeTeamMember = (memberId, reassignToName) => {
    // 1. Find the member to remove
    const memberToRemove = teamMembers.find(m => m.id === memberId);
    if (!memberToRemove) return;

    // 2. Reassign tasks
    // We need to traverse all tasks and subtasks and change assignee if it matches memberToRemove.name (or ID if we used IDs)
    // The current task structure uses Names for assignee, so we'll match by name.
    
    const reassignRecursive = (taskList) => {
      return taskList.map(task => {
        let updatedTask = { ...task };
        if (updatedTask.assignee === memberToRemove.name) {
          updatedTask.assignee = reassignToName; // New assignee name
        }
        if (updatedTask.subtasks && updatedTask.subtasks.length > 0) {
          updatedTask.subtasks = reassignRecursive(updatedTask.subtasks);
        }
        return updatedTask;
      });
    };

    if (reassignToName) {
        setTasks(reassignRecursive(tasks));
    }

    // 3. Remove team member
    setTeamMembers(teamMembers.filter(m => m.id !== memberId));
  };

  return (
    <ProjectContext.Provider value={{ 
      tasks, 
      teamMembers, 
      addTask, 
      addSubTask, 
      updateTask, 
      deleteTask,
      addTeamMember, 
      removeTeamMember 
    }}>
      {children}
    </ProjectContext.Provider>
  );
};
