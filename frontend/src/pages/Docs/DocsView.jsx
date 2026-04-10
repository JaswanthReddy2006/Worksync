import React, { useState } from 'react';
import './Docs.css';

const DocsView = () => {
    const [searchTerm, setSearchTerm] = useState('');
    
    // fake data
    const initialDocs = [
        { id: 1, name: 'Project Requirements.pdf', type: 'pdf', size: '2.4 MB', updated: '2 days ago', uploader: 'ram' },
        { id: 2, name: 'Q3 Budget Proposal.xlsx', type: 'sheet', size: '1.1 MB', updated: '1 week ago', uploader: 'raju' },
        { id: 3, name: 'Marketing Assets.zip', type: 'zip', size: '45 MB', updated: '3 days ago', uploader: 'kumar' },
        { id: 4, name: 'API Documentation.docx', type: 'doc', size: '500 KB', updated: 'Yesterday', uploader: 'sam' },
        { id: 5, name: 'Team Onboarding Guide.pdf', type: 'pdf', size: '3.2 MB', updated: 'Last month', uploader: 'HR' },
        { id: 6, name: 'Meeting Notes - Feb 15.txt', type: 'txt', size: '12 KB', updated: 'Yesterday', uploader: 'You' },
    ];

    const [docs, setDocs] = useState(initialDocs);

    const getIcon = (type) => {
        switch(type) {
            case 'pdf': return '📄';
            case 'sheet': return '📊';
            case 'doc': return '📝';
            case 'zip': return '📦';
            case 'txt': return '📃';
            default: return '📁';
        }
    };

    const getIconColor = (type) => {
         switch(type) {
            case 'pdf': return '#e53e3e';
            case 'sheet': return '#38a169';
            case 'doc': return '#3182ce';
            case 'zip': return '#d69e2e';
            default: return '#718096';
        }
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleUpload = () => {
        alert("Upload functionality to be implemented");
    };

    const filteredDocs = docs.filter(doc => 
        doc.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="docs-container">
            <div className="docs-header">
                <div>
                     <h1>Documents</h1>
                     <p style={{color: '#718096', margin: '5px 0 0'}}>Central repository for all project resources.</p>
                </div>
                <div style={{display:'flex'}}>
                    <input 
                        type="text" 
                        placeholder="Search docs..." 
                        className="search-bar"
                        value={searchTerm}
                        onChange={handleSearch}
                    />
                    <button className="upload-btn" onClick={handleUpload}>
                        <span>☁️</span> Upload New
                    </button>
                </div>
            </div>

            <div className="docs-grid">
                {filteredDocs.map(doc => (
                    <div key={doc.id} className="doc-card">
                        <div className="doc-icon" style={{color: getIconColor(doc.type)}}>
                            {getIcon(doc.type)}
                        </div>
                        <div className="doc-info">
                            <div className="doc-title" title={doc.name}>{doc.name}</div>
                            <div className="doc-meta">
                                <span>{doc.size}</span>
                                <span>Updated {doc.updated}</span>
                            </div>
                            <div style={{fontSize: '0.75rem', color: '#a0aec0', marginTop: '8px'}}>
                                By: {doc.uploader}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DocsView;
