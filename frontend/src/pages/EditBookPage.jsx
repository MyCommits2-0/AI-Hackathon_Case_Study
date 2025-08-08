// frontend/src/pages/EditBookPage.jsx

import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Header from '../components/Header';
import { AuthContext } from '../context/AuthContext';

const EditBookPage = () => {
    const { id } = useParams(); // Get the book ID from the URL
    const [formData, setFormData] = useState({ name: '', author: '', subject: '', price: '', isbn: '' });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { token } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBook = async () => {
            try {
                const response = await fetch(`http://localhost:5001/api/books/${id}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (!response.ok) throw new Error('Could not fetch book details.');
                const data = await response.json();
                setFormData(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchBook();
    }, [id, token]);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:5001/api/books/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });
            if (!response.ok) throw new Error('Failed to update book.');
            alert('Book updated successfully!');
            navigate('/books-catalog');
        } catch (err) {
            setError(err.message);
        }
    };

    if (loading) return <p>Loading book...</p>;
    
    return (
        <>
            <Header />
            <main className="main-content">
                <div className="form-container">
                    <div className="form-header">
                        <h1>Edit Book</h1>
                        <p>Modify existing book information for "{formData.name}"</p>
                    </div>
                    {error && <div className="error-message">{error}</div>}
                    <form onSubmit={handleUpdate}>
                         <div className="form-group">
                            <label htmlFor="name">Book Title</label>
                            <input type="text" id="name" name="name" value={formData.name || ''} onChange={handleInputChange} required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="author">Author</label>
                            <input type="text" id="author" name="author" value={formData.author || ''} onChange={handleInputChange} required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="subject">Subject</label>
                            <input type="text" id="subject" name="subject" value={formData.subject || ''} onChange={handleInputChange} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="isbn">ISBN</label>
                            <input type="text" id="isbn" name="isbn" value={formData.isbn || ''} onChange={handleInputChange} required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="price">Price (₹)</label>
                            <input type="number" id="price" name="price" value={formData.price || ''} onChange={handleInputChange} />
                        </div>
                        <div className="form-actions">
                            <button type="submit" className="btn">Update Book Information</button>
                            <Link to="/books-catalog" className="btn btn-secondary">Cancel</Link>
                        </div>
                    </form>
                </div>
            </main>
        </>
    );
};

export default EditBookPage;
