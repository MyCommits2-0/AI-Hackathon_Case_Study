import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Header from '../components/Header';
import { AuthContext } from '../context/AuthContext';

const AddBookPage = () => {
    const [formData, setFormData] = useState({
        name: '', author: '', subject: '', price: '', isbn: '',
        copyOption: 'later', copyCount: 1, defaultRack: ''
    });
    const [error, setError] = useState(null);
    const { token } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            const response = await fetch('http://localhost:5001/api/books', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Failed to add book');
            }

            alert('Book added successfully!');
            navigate('/books-catalog');

        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <>
            <Header />
            <main className="main-content">
                <div className="container">
                    <div className="form-container">
                        <div className="form-header">
                            <h1>Add New Book</h1>
                            <p>Register a new book title in the library system</p>
                        </div>

                        {error && <div className="error-message">{error}</div>}

                        <form onSubmit={handleSubmit}>
                            <div className="form-section">
                                <h2>Book Information</h2>
                                <div className="form-group">
                                    <label htmlFor="name">Book Title</label>
                                    <input type="text" id="name" name="name" value={formData.name} onChange={handleInputChange} required />
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label htmlFor="author">Author</label>
                                        <input type="text" id="author" name="author" value={formData.author} onChange={handleInputChange} required />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="subject">Subject</label>
                                        <input type="text" id="subject" name="subject" value={formData.subject} onChange={handleInputChange} />
                                    </div>
                                </div>
                                 <div className="form-row">
                                    <div className="form-group">
                                        <label htmlFor="isbn">ISBN</label>
                                        <input type="text" id="isbn" name="isbn" value={formData.isbn} onChange={handleInputChange} required />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="price">Price (₹)</label>
                                        <input type="number" id="price" name="price" value={formData.price} onChange={handleInputChange} />
                                    </div>
                                </div>
                            </div>

                            <div className="form-section">
                                <h2>Initial Copies</h2>
                                <div className="copy-section">
                                    <div className="form-group">
                                        <label>
                                            <input type="radio" name="copyOption" value="later" checked={formData.copyOption === 'later'} onChange={handleInputChange} /> Add copies later
                                        </label>
                                        <label style={{marginLeft: '1rem'}}>
                                            <input type="radio" name="copyOption" value="now" checked={formData.copyOption === 'now'} onChange={handleInputChange} /> Add copies now
                                        </label>
                                    </div>
                                    <div className={`dynamic-copies ${formData.copyOption === 'now' ? 'show' : ''}`}>
                                        <div className="form-row">
                                            <div className="form-group">
                                                <label htmlFor="copyCount">Number of Copies</label>
                                                <input type="number" id="copyCount" name="copyCount" min="1" value={formData.copyCount} onChange={handleInputChange} />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="defaultRack">Default Rack Location</label>
                                                <input type="number" id="defaultRack" name="defaultRack" min="1" value={formData.defaultRack} onChange={handleInputChange} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="form-actions">
                                <button type="submit" className="btn">Add Book to Library</button>
                                <Link to="/books-catalog" className="btn btn-secondary">Cancel</Link>
                            </div>
                        </form>
                    </div>
                </div>
            </main>
        </>
    );
};

export default AddBookPage;
