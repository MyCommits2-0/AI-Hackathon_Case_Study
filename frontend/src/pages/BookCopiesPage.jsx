// frontend/src/pages/BookCopiesPage.jsx

import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../components/Header';
import { AuthContext } from '../context/AuthContext';

const BookCopiesPage = () => {
    const { id } = useParams(); // This is the bookId
    const { token } = useContext(AuthContext);
    const [book, setBook] = useState(null);
    const [copies, setCopies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`http://localhost:5001/api/books/${id}/copies`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (!response.ok) throw new Error('Data could not be fetched.');
                const data = await response.json();
                setBook(data.book);
                setCopies(data.copies);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id, token]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div className="error-message">{error}</div>;

    const availableCopies = copies.filter(c => c.status === 'available').length;
    const issuedCopies = copies.length - availableCopies;

    return (
        <>
            <Header />
            <main className="main-content">
                <div className="container">
                    <div className="page-header">
                        <div>
                            <h1>{book?.name}</h1>
                            <p className="book-author">by {book?.author}</p>
                            <p className="book-subject">ISBN: {book?.isbn}</p>
                        </div>
                         <Link to={`/book/${id}/add-copy`} className="btn">+ Add New Copy</Link>
                    </div>

                    <div className="stats-grid">
                        <div className="stat-card"><div className="stat-number total">{copies.length}</div><div className="stat-label">Total Copies</div></div>
                        <div className="stat-card"><div className="stat-number available">{availableCopies}</div><div className="stat-label">Available</div></div>
                        <div className="stat-card"><div className="stat-number issued">{issuedCopies}</div><div className="stat-label">Issued</div></div>
                    </div>

                    <div className="books-grid">
                        {copies.map(copy => (
                            <div key={copy.id} className="book-card">
                                <div className="book-title">Copy #{copy.id}</div>
                                <p>Status: <span className={copy.status === 'available' ? 'available' : 'issued'}>{copy.status}</span></p>
                                <p>Rack Location: {copy.rack || 'N/A'}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </>
    );
};

export default BookCopiesPage;