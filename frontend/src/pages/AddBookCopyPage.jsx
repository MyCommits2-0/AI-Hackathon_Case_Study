// frontend/src/pages/AddBookCopyPage.jsx

import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Header from '../components/Header';
import { AuthContext } from '../context/AuthContext';

const AddBookCopyPage = () => {
    const { id } = useParams(); // This is the bookId
    const { token } = useContext(AuthContext);
    const navigate = useNavigate();
    
    const [book, setBook] = useState(null);
    const [formData, setFormData] = useState({
        rackLocation: '',
        copyQuantity: 'single',
        copyCount: 2
    });
    const [error, setError] = useState(null);

    useEffect(() => {
        // Fetch book details to display its name
        const fetchBook = async () => {
            try {
                const response = await fetch(`http://localhost:5001/api/books/${id}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (!response.ok) throw new Error('Could not fetch book details.');
                const data = await response.json();
                setBook(data);
            } catch (err) {
                setError(err.message);
            }
        };
        fetchBook();
    }, [id, token]);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            const response = await fetch(`http://localhost:5001/api/books/${id}/copies`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message);
            alert('Cop(y/ies) added successfully!');
            navigate(`/book/${id}/copies`);
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <>
            <Header />
            <main className="main-content">
                <div className="form-container">
                    <div className="form-header">
                        <h1>Add New Copy</h1>
                        <p>For the book: <strong>{book?.name || 'Loading...'}</strong></p>
                    </div>

                    {error && <div className="error-message">{error}</div>}

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="rackLocation">Rack Location</label>
                            <input type="number" id="rackLocation" name="rackLocation" value={formData.rackLocation} onChange={handleInputChange} required />
                        </div>
                        
                        <div className="copy-section">
                            <h3>How many copies would you like to add?</h3>
                            <div className="form-group">
                                <label><input type="radio" name="copyQuantity" value="single" checked={formData.copyQuantity === 'single'} onChange={handleInputChange} /> Single copy</label>
                                <label style={{marginLeft: '1rem'}}><input type="radio" name="copyQuantity" value="multiple" checked={formData.copyQuantity === 'multiple'} onChange={handleInputChange} /> Multiple copies</label>
                            </div>
                            <div className={`dynamic-copies ${formData.copyQuantity === 'multiple' ? 'show' : ''}`}>
                                <div className="form-group">
                                    <label htmlFor="copyCount">Number of Copies (2-20)</label>
                                    <input type="number" id="copyCount" name="copyCount" min="2" max="20" value={formData.copyCount} onChange={handleInputChange} />
                                </div>
                            </div>
                        </div>

                        <div className="form-actions">
                            <button type="submit" className="btn">Add to Inventory</button>
                            <Link to={`/book/${id}/copies`} className="btn btn-secondary">Cancel</Link>
                        </div>
                    </form>
                </div>
            </main>
        </>
    );
};

export default AddBookCopyPage;