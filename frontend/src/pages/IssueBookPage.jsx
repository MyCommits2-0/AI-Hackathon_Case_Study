// frontend/src/pages/IssueBookPage.jsx
import React, { useState, useContext } from 'react';
import Header from '../components/Header';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const IssueBookPage = () => {
    const { token } = useContext(AuthContext);
    const navigate = useNavigate();
    
    // State for searches
    const [memberQuery, setMemberQuery] = useState('');
    const [memberResults, setMemberResults] = useState([]);
    const [bookQuery, setBookQuery] = useState('');
    const [bookResults, setBookResults] = useState([]);
    
    // State for selected items
    const [selectedMember, setSelectedMember] = useState(null);
    const [selectedBook, setSelectedBook] = useState(null);
    const [availableCopies, setAvailableCopies] = useState([]);
    const [selectedCopyId, setSelectedCopyId] = useState('');
    
    const [error, setError] = useState('');

    const handleSearch = async (type, query) => {
        if (query.length < 2) {
            type === 'member' ? setMemberResults([]) : setBookResults([]);
            return;
        }
        try {
            const response = await fetch(`http://localhost:5001/api/${type}s/search?q=${query}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            type === 'member' ? setMemberResults(data) : setBookResults(data);
        } catch (err) { console.error(`Error searching ${type}s`, err); }
    };

    const selectMember = (member) => {
        setSelectedMember(member);
        setMemberQuery(`${member.name} (${member.email})`);
        setMemberResults([]);
    };

    const selectBook = async (book) => {
        setSelectedBook(book);
        setBookQuery(`${book.name} by ${book.author}`);
        setBookResults([]);
        // Fetch available copies for this book
        try {
            const response = await fetch(`http://localhost:5001/api/books/${book.id}/available-copies`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            setAvailableCopies(data);
        } catch (err) { console.error('Error fetching copies', err); }
    };

    const handleIssueBook = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const response = await fetch('http://localhost:5001/api/issue', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ memberId: selectedMember.id, copyId: selectedCopyId })
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message);
            alert('Book issued successfully!');
            navigate('/librarian-dashboard');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <>
            <Header />
            <main className="main-content">
                <div className="form-container">
                    <div className="form-header"><h1>Issue Book</h1></div>
                    {error && <div className="error-message">{error}</div>}
                    <form onSubmit={handleIssueBook}>
                        <div className="form-group">
                            <label>Search Member</label>
                            <input type="text" value={memberQuery} onChange={(e) => { setMemberQuery(e.target.value); handleSearch('member', e.target.value); }} placeholder="Start typing name or email..." />
                            {memberResults.length > 0 && (
                                <div className="search-results">
                                    {memberResults.map(m => <div key={m.id} onClick={() => selectMember(m)}>{m.name} ({m.email})</div>)}
                                </div>
                            )}
                        </div>
                         <div className="form-group">
                            <label>Search Book</label>
                            <input type="text" value={bookQuery} onChange={(e) => { setBookQuery(e.target.value); handleSearch('book', e.target.value); }} placeholder="Start typing title or author..." />
                            {bookResults.length > 0 && (
                                <div className="search-results">
                                    {bookResults.map(b => <div key={b.id} onClick={() => selectBook(b)}>{b.name} by {b.author}</div>)}
                                </div>
                            )}
                        </div>
                        <div className="form-group">
                            <label>Select Available Copy</label>
                            <select value={selectedCopyId} onChange={(e) => setSelectedCopyId(e.target.value)} required disabled={!selectedBook || availableCopies.length === 0}>
                                <option value="">-- Select a Copy --</option>
                                {availableCopies.map(c => <option key={c.id} value={c.id}>Copy #{c.id} (Rack {c.rack})</option>)}
                            </select>
                            {selectedBook && availableCopies.length === 0 && <p style={{color: 'red'}}>No copies available.</p>}
                        </div>
                        <div className="form-actions">
                            <button type="submit" className="btn" disabled={!selectedMember || !selectedCopyId}>Issue Book</button>
                        </div>
                    </form>
                </div>
            </main>
        </>
    );
};

export default IssueBookPage;
