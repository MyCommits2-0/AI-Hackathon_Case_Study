// frontend/src/App.jsx

import React from 'react';
import { Routes, Route } from 'react-router-dom';
// ... other imports
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import LibrarianDashboardPage from './pages/LibrarianDashboardPage';
import BooksCatalogPage from './pages/BooksCatalogPage';
import AddBookPage from './pages/AddBookPage';
import EditBookPage from './pages/EditBookPage';
import BookCopiesPage from './pages/BookCopiesPage';
import AddBookCopyPage from './pages/AddBookCopyPage';
import ManageMembersPage from './pages/ManageMembersPage';
import AddMemberPage from './pages/AddMemberPage';
import IssueBookPage from './pages/IssueBookPage';
// import AddMemberPage from './pages/AddMemberPage';

// Define simple placeholder components for now
// const IssueBookPage = () => <h1>Issue Book Page</h1>;
const ReturnBookPage = () => <h1>Return Book Page</h1>;
const CollectPaymentPage = () => <h1>Collect Payment Page</h1>;
//const BooksCatalogPage = () => <h1>Books Catalog Page</h1>;
//const AddBookPage = () => <h1>Add New Book Page</h1>;
// const ManageMembersPage = () => <h1>Manage Members Page</h1>;

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/login" element={<LoginPage />} />

      {/* Protected Librarian Routes */}
      <Route 
        path="/librarian-dashboard" 
        element={<ProtectedRoute allowedRoles={['librarian', 'owner']}><LibrarianDashboardPage /></ProtectedRoute>} 
      />
      <Route 
        path="/issue-book" 
        element={<ProtectedRoute allowedRoles={['librarian', 'owner']}><IssueBookPage /></ProtectedRoute>} 
      />
       <Route 
        path="/return-book" 
        element={<ProtectedRoute allowedRoles={['librarian', 'owner']}><ReturnBookPage /></ProtectedRoute>} 
      />
       <Route 
        path="/collect-payment" 
        element={<ProtectedRoute allowedRoles={['librarian', 'owner']}><CollectPaymentPage /></ProtectedRoute>} 
      />
       <Route 
        path="/books-catalog" 
        element={<ProtectedRoute allowedRoles={['librarian', 'owner']}><BooksCatalogPage /></ProtectedRoute>} 
      />
       <Route 
        path="/add-book" 
        element={<ProtectedRoute allowedRoles={['librarian', 'owner']}><AddBookPage /></ProtectedRoute>} 
      />
       <Route 
        path="/manage-members" 
        element={<ProtectedRoute allowedRoles={['librarian', 'owner']}><ManageMembersPage /></ProtectedRoute>} 
      />
       <Route 
        path="/add-member" 
        element={<ProtectedRoute allowedRoles={['librarian', 'owner']}><AddMemberPage /></ProtectedRoute>} 
      />

      <Route 
        path="/edit-book/:id" 
        element={<ProtectedRoute allowedRoles={['librarian', 'owner']}><EditBookPage /></ProtectedRoute>} 
      />
      <Route 
        path="/book/:id/copies" 
        element={<ProtectedRoute allowedRoles={['librarian', 'owner']}><BookCopiesPage /></ProtectedRoute>} 
      />
      <Route 
        path="/book/:id/add-copy" 
        element={<ProtectedRoute allowedRoles={['librarian', 'owner']}><AddBookCopyPage /></ProtectedRoute>} 
      />



    </Routes>
  );
}

export default App;
