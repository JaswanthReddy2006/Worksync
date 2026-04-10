import React, { useState } from 'react';
import { useProject } from '../../context/ProjectContext';
import './TeamView.css';
const TeamView = () => {
    const { teamMembers, addTeamMember, removeTeamMember, tasks } = useProject();
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
    const [newMember, setNewMember] = useState({ name: '', email: '', role: '' });
    const [reassignTo, setReassignTo] = useState('Unassigned');

    // -- Helper to count tasks --
    const countTasksForUser = (userName, taskList) => {
        let count = 0;
        taskList.forEach(task => {
            if (task.assignee === userName) count++;
            if (task.subtasks) count += countTasksForUser(userName, task.subtasks);
        });
        return count;
    };

    const handleAddSubmit = (e) => {
        e.preventDefault();
        addTeamMember(newMember);
        setNewMember({ name: '', email: '', role: '' });
        setIsAddModalOpen(false);
    };

    const initiateRemove = (user) => {
        setUserToDelete(user);
        setIsRemoveModalOpen(true);
        setReassignTo('Unassigned'); // Reset default
    };

    const confirmRemove = () => {
        if (userToDelete) {
            removeTeamMember(userToDelete.id, reassignTo);
            setIsRemoveModalOpen(false);
            setUserToDelete(null);
        }
    };

    return (
        <div className="team-view-container">
            <header className="team-header">
                <h2>Team Management</h2>
                <button className="btn-primary" onClick={() => setIsAddModalOpen(true)}>
                    + Add Member
                </button>
            </header>

            <div className="team-grid">
                {teamMembers.map(member => (
                    <div className="team-card" key={member.id}>
                        <div className="team-avatar">{member.name.charAt(0)}</div>
                        <div className="team-info">
                            <h3>{member.name}</h3>
                            <p>{member.role}</p>
                            <p>{member.email}</p>
                            <span className="task-count-badge">
                                {countTasksForUser(member.name, tasks)} Tasks Assigned
                            </span>
                        </div>
                        <button className="remove-btn" onClick={() => initiateRemove(member)}>
                            Remove
                        </button>
                    </div>
                ))}
            </div>

            {/* Add Member Modal */}
            {isAddModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Add New Team Member</h3>
                        <form onSubmit={handleAddSubmit}>
                            <div className="form-group">
                                <label>Name</label>
                                <input 
                                    required 
                                    value={newMember.name}
                                    onChange={e => setNewMember({...newMember, name: e.target.value})}
                                />
                            </div>
                            <div className="form-group">
                                <label>Email</label>
                                <input 
                                    type="email" 
                                    required
                                    value={newMember.email}
                                    onChange={e => setNewMember({...newMember, email: e.target.value})}
                                />
                            </div>
                            <div className="form-group">
                                <label>Role / Designation</label>
                                <input 
                                    required
                                    value={newMember.role}
                                    onChange={e => setNewMember({...newMember, role: e.target.value})}
                                />
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="btn-cancel" onClick={() => setIsAddModalOpen(false)}>Cancel</button>
                                <button type="submit" className="btn-primary">Add Member</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Remove Member Modal */}
            {isRemoveModalOpen && userToDelete && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Remove {userToDelete.name}?</h3>
                        <p>
                            They currently have <strong>{countTasksForUser(userToDelete.name, tasks)}</strong> tasks assigned.
                            Select whom to reassign these tasks to:
                        </p>
                        
                        <div className="form-group">
                            <label>Reassign Tasks To:</label>
                            <select value={reassignTo} onChange={(e) => setReassignTo(e.target.value)}>
                                <option value="Unassigned">Unassigned</option>
                                {teamMembers
                                    .filter(m => m.id !== userToDelete.id)
                                    .map(m => (
                                        <option key={m.id} value={m.name}>{m.name}</option>
                                    ))
                                }
                            </select>
                        </div>

                        <div className="modal-actions">
                            <button className="btn-cancel" onClick={() => setIsRemoveModalOpen(false)}>Cancel</button>
                            <button className="btn-danger" onClick={confirmRemove}>Remove & Reassign</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TeamView;
