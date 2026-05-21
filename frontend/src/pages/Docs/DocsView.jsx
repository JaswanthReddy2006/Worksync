import React, { useState, useEffect, useRef } from 'react';
import './Docs.css';

const DocsView = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [docs, setDocs] = useState([]);
    const fileInputRef = useRef(null);

    useEffect(() => {
        const storedDocs = JSON.parse(localStorage.getItem('docs') || '[]');
        setDocs(storedDocs);
    }, []);

    const getIcon = (type) => {
        if (type.startsWith('image/')) return '🖼️';
        switch(type) {
            case 'application/pdf': return '📄';
            case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
            case 'application/vnd.ms-excel': return '📊';
            case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
            case 'application/msword': return '📝';
            case 'application/zip': return '📦';
            case 'text/plain': return '📃';
            default: return '📁';
        }
    };

    const getIconColor = (type) => {
        if (type.startsWith('image/')) return '#4a5568';
         switch(type) {
            case 'application/pdf': return '#e53e3e';
            case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
            case 'application/vnd.ms-excel': return '#38a169';
            case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
            case 'application/msword': return '#3182ce';
            case 'application/zip': return '#d69e2e';
            default: return '#718096';
        }
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleUploadClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const newDoc = {
                id: Date.now(),
                name: file.name,
                type: file.type,
                size: `${(file.size / 1024).toFixed(2)} KB`,
                updated: new Date().toLocaleDateString(),
                uploader: 'You',
                content: event.target.result 
            };

            const updatedDocs = [...docs, newDoc];
            setDocs(updatedDocs);
            localStorage.setItem('docs', JSON.stringify(updatedDocs));
        };
        reader.readAsDataURL(file);
    };

    const handleDownload = (doc) => {
        const link = document.createElement('a');
        link.href = doc.content;
        link.download = doc.name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
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
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        style={{ display: 'none' }} 
                        onChange={handleFileChange} 
                    />
                    <button className="upload-btn" onClick={handleUploadClick}>
                        <span>☁️</span> Upload New
                    </button>
                </div>
            </div>

            <div className="docs-grid">
                {filteredDocs.map(doc => (
                    <div key={doc.id} className="doc-card" onClick={() => handleDownload(doc)}>
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
