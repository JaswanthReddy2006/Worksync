import React from 'react';
import './AnalyticsView.css';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { useProject } from '../../context/ProjectContext';

const AnalyticsView = () => {
    const { tasks, teamMembers } = useProject();

    if (!tasks || !teamMembers) {
        return <div>Loading analytics data...</div>;
    }

    // Helper to flatten tasks and subtasks for counting
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

    // Counts
    const totalTasks = allTasks.length;
    const totalTeamMembers = teamMembers.length;
    
    const highPriority = allTasks.filter(t => t.priority === 'High').length;
    const mediumPriority = allTasks.filter(t => t.priority === 'Medium').length; // Kept for logic, though not displayed in cards below based on previous code
    const lowPriority = allTasks.filter(t => t.priority === 'Low').length; // Kept for logic
    
    const inProgress = allTasks.filter(t => t.status === 'In Progress').length;
    const completed = allTasks.filter(t => t.status === 'Completed').length;
    const toDo = allTasks.filter(t => t.status === 'To Do').length;

    const data = [
        { name: 'Jan', tasks: 40, completed: 24, amt: 2400 },
        { name: 'Feb', tasks: 30, completed: 13, amt: 2210 },
        { name: 'Mar', tasks: 20, completed: 98, amt: 2290 },
        { name: 'Apr', tasks: 27, completed: 39, amt: 2000 },
        { name: 'May', tasks: 18, completed: 48, amt: 2181 },
        { name: 'Jun', tasks: 23, completed: 38, amt: 2500 },
        { name: 'Jul', tasks: 34, completed: 43, amt: 2100 },
    ];

    const pieData = [
        { name: 'To Do', value: toDo },
        { name: 'In Progress', value: inProgress },
        { name: 'Completed', value: completed },
    ];

    const COLORS = ['#9b59b6', '#3498db', '#2ecc71'];

    return (
        <div className="analytics-dashboard">
            <h1 className="analytics-header">Analytics Dashboard</h1>
            
            <div className="graph-row">
                <div className="graph-card" style={{flex: 2}}>
                    <h3>Task Completion Trend</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <XAxis dataKey="name" />
                            <YAxis />
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <Tooltip />
                            <Area type="monotone" dataKey="completed" stroke="#8884d8" fillOpacity={1} fill="url(#colorPv)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
                
                <div className="graph-card" style={{flex: 1}}>
                    <h3>Status Distribution</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={pieData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                fill="#8884d8"
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {pieData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="dashboard-cards">
                <div className="card card-tasks">
                    <h3>Total Tasks</h3>
                    <p className="kpi-value">{totalTasks}</p>
                </div>
                <div className="card card-team">
                    <h3>Team Members</h3>
                    <p className="kpi-value">{totalTeamMembers}</p>
                </div>
                <div className="card card-high">
                    <h3>High Priority</h3>
                    <p className="kpi-value">{highPriority}</p>
                </div>
                <div className="card card-progress">
                    <h3>In Progress</h3>
                    <p className="kpi-value">{inProgress}</p>
                </div>
            </div>
        </div>
    );
};

export default AnalyticsView;
