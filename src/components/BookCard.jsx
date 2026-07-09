import { Link } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3333";

function BookCard({ book, onDelete }) {
  const coverUrl = book.coverImage ? `${API_URL}/${book.coverImage}` : null;

  return (
    <div className="col-sm-6 col-md-4 col-lg-3 mb-4">
      <div className="card h-100 shadow-sm">
        {coverUrl ? (
          <img src={coverUrl} className="book-cover" alt={`Capa de ${book.title}`} />
        ) : (
          <div className="book-cover d-flex align-items-center justify-content-center text-secondary">
            <i className="bi bi-book fs-1"></i>
          </div>
        )}

        <div className="card-body d-flex flex-column">
          <h5 className="card-title">{book.title}</h5>
          <p className="card-text text-secondary mb-1">{book.author}</p>
          <p className="card-text">
            <span
              className={`badge ${book.available ? "bg-success" : "bg-secondary"}`}
            >
              {book.available ? "Disponível" : "Emprestado"}
            </span>
          </p>

          <div className="mt-auto d-flex gap-2">
            <Link to={`/books/${book.id}/edit`} className="btn btn-sm btn-outline-primary flex-fill">
              Editar
            </Link>
            <button
              className="btn btn-sm btn-outline-danger"
              onClick={() => onDelete(book.id)}
              title="Excluir livro"
            >
              <i className="bi bi-trash"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookCard;
