import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import PrivateRoute from "./components/PrivateRoute";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import BookList from "./pages/BookList";
import BookForm from "./pages/BookForm";
import ReaderList from "./pages/ReaderList";
import ReaderForm from "./pages/ReaderForm";
import LoanList from "./pages/LoanList";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route element={<PrivateRoute />}>
            <Route element={<Layout />}>
              <Route path="/" element={<Navigate to="/books" replace />} />

              <Route path="/books" element={<BookList />} />
              <Route path="/books/new" element={<BookForm />} />
              <Route path="/books/:id/edit" element={<BookForm />} />

              <Route path="/readers" element={<ReaderList />} />
              <Route path="/readers/new" element={<ReaderForm />} />
              <Route path="/readers/:id/edit" element={<ReaderForm />} />

              <Route path="/loans" element={<LoanList />} />
            </Route>
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
