import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { bookService } from "../services/bookService";
import BookCard from "../components/BookCard";

function BookList() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadBooks();
  }, []);

  async function loadBooks() {
    setLoading(true);
    setError("");

    try {
      const data = await bookService.list();
      setBooks(data);
    } catch (err) {
      setError("Não foi possível carregar os livros.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Tem certeza que deseja excluir este livro?")) return;

    try {
      await bookService.remove(id);
      setBooks((prev) => prev.filter((book) => book.id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Não foi possível excluir o livro.");
    }
  }

  const filteredBooks = books.filter((book) =>
    `${book.title} ${book.author}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <h2 className="mb-0">Livros</h2>
        <Link to="/books/new" className="btn btn-primary">
          <i className="bi bi-plus-lg me-1"></i>
          Novo livro
        </Link>
      </div>

      <input
        type="text"
        className="form-control mb-4"
        placeholder="Buscar por título ou autor..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {loading && <p>Carregando...</p>}
      {error && <div className="alert alert-danger">{error}</div>}

      {!loading && !error && filteredBooks.length === 0 && (
        <p className="text-secondary">Nenhum livro encontrado.</p>
      )}

      <div className="row">
        {filteredBooks.map((book) => (
          <BookCard key={book.id} book={book} onDelete={handleDelete} />
        ))}
      </div>
    </div>
  );
}

export default BookList;
