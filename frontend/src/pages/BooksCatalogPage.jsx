import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import { AuthContext } from '../context/AuthContext';

const BooksCatalogPage = () => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { token } = useContext(AuthContext);

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const response = await fetch('http://localhost:5001/api/books', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch books');
                }
                const data = await response.json();
                setBooks(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (token) {
            fetchBooks();
        }
    }, [token]);

    return (
        <>
            <Header />
            <main className="main-content">
                <div className="container">
                    <div className="page-header">
                        <div className="page-title-section">
                            <h1>Books Catalog</h1>
                            <p>Complete library inventory with copy management</p>
                        </div>
                        <div className="header-actions">
                            <Link to="/add-book" className="btn">+ Add New Book</Link>
                        </div>
                    </div>
                    
                    {loading && <p>Loading books...</p>}
                    {error && <p className="error-message">{error}</p>}

                    {!loading && !error && (
                        <div className="books-grid">
                            {books.map((book) => (
                                <div key={book.id} className="book-card">
                                    <div className="book-header">
                                        <div className="book-title">{book.name}</div>
                                        <div className="book-author">by {book.author}</div>
                                        <div className="book-subject">{book.subject}</div>
                                    </div>

                                    <div className="copies-info">
                                        <div className="copies-summary">
                                            <div className="copy-stat">
                                                <div className="copy-number total">{book.totalCopies}</div>
                                                <div className="copy-label">Total</div>
                                            </div>
                                            <div className="copy-stat">
                                                <div className="copy-number available">{book.availableCopies}</div>
                                                <div className="copy-label">Available</div>
                                            </div>
                                            <div className="copy-stat">
                                                <div className="copy-number issued">{book.totalCopies - book.availableCopies}</div>
                                                <div className="copy-label">Issued</div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="book-actions">
                                         <button className="btn btn-secondary btn-small">View</button>
                                            <Link to={`/edit-book/${book.id}`} className="btn btn-secondary btn-small">Edit</Link>
                                            {/* <Link className="btn btn-secondary btn-small">Copies</Link> */}
                                            <Link to={`/book/${book.id}/copies`} className="btn btn-secondary btn-small">Copies</Link>
                                    </div>

                                    
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </>
    );
};

export default BooksCatalogPage;
