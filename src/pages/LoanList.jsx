import { useEffect, useState } from "react";
import { loanService } from "../services/loanService";
import { bookService } from "../services/bookService";
import { readerService } from "../services/readerService";

const statusLabels = {
  ACTIVE: { text: "Ativo", className: "bg-primary" },
  RETURNED: { text: "Devolvido", className: "bg-success" },
  LATE: { text: "Atrasado", className: "bg-danger" }
};

// A API exige que a data de devolução seja estritamente futura (não aceita hoje)
function getTomorrowISODate() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.toISOString().split("T")[0];
}

function LoanList() {
  const [loans, setLoans] = useState([]);
  const [books, setBooks] = useState([]);
  const [readers, setReaders] = useState([]);

  const [bookId, setBookId] = useState("");
  const [readerId, setReaderId] = useState("");
  const [dueDate, setDueDate] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formError, setFormError] = useState("");
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    setError("");

    try {
      const [loansData, booksData, readersData] = await Promise.all([
        loanService.list(),
        bookService.list(),
        readerService.list()
      ]);

      setLoans(loansData);
      setBooks(booksData);
      setReaders(readersData);
    } catch (err) {
      setError("Não foi possível carregar os empréstimos.");
    } finally {
      setLoading(false);
    }
  }

  const availableBooks = books.filter((book) => book.available);

  async function handleCreateLoan(event) {
    event.preventDefault();
    setFormError("");

    if (!bookId || !readerId || !dueDate) {
      setFormError("Selecione o livro, o leitor e a data de devolução.");
      return;
    }

    const today = new Date().toISOString().split("T")[0];
    if (dueDate <= today) {
      setFormError("A data de devolução prevista deve ser futura.");
      return;
    }

    setCreating(true);

    try {
      await loanService.create({
        bookId: Number(bookId),
        readerId: Number(readerId),
        dueDate
      });

      setBookId("");
      setReaderId("");
      setDueDate("");
      await loadData();
    } catch (err) {
      setFormError(err.response?.data?.message || "Não foi possível registrar o empréstimo.");
    } finally {
      setCreating(false);
    }
  }

  async function handleReturn(id) {
    if (!confirm("Confirmar a devolução deste livro?")) return;

    try {
      await loanService.returnBook(id);
      await loadData();
    } catch (err) {
      alert(err.response?.data?.message || "Não foi possível registrar a devolução.");
    }
  }

  return (
    <div>
      <h2 className="mb-4">Empréstimos</h2>

      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <h5 className="card-title mb-3">Novo empréstimo</h5>

          {formError && <div className="alert alert-danger py-2">{formError}</div>}

          <form onSubmit={handleCreateLoan} className="row g-3 align-items-end">
            <div className="col-md-4">
              <label className="form-label">Livro</label>
              <select
                className="form-select"
                value={bookId}
                onChange={(e) => setBookId(e.target.value)}
              >
                <option value="">Selecione um livro disponível</option>
                {availableBooks.map((book) => (
                  <option key={book.id} value={book.id}>
                    {book.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-4">
              <label className="form-label">Leitor</label>
              <select
                className="form-select"
                value={readerId}
                onChange={(e) => setReaderId(e.target.value)}
              >
                <option value="">Selecione um leitor</option>
                {readers.map((reader) => (
                  <option key={reader.id} value={reader.id}>
                    {reader.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-3">
              <label className="form-label">Devolução prevista</label>
              <input
                type="date"
                className="form-control"
                value={dueDate}
                min={getTomorrowISODate()}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>

            <div className="col-md-1">
              <button type="submit" className="btn btn-primary w-100" disabled={creating}>
                {creating ? "..." : "OK"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {loading && <p>Carregando...</p>}
      {error && <div className="alert alert-danger">{error}</div>}

      {!loading && !error && (
        <div className="table-responsive">
          <table className="table table-hover bg-white shadow-sm">
            <thead>
              <tr>
                <th>Livro</th>
                <th>Leitor</th>
                <th>Empréstimo</th>
                <th>Devolução prevista</th>
                <th>Status</th>
                <th className="text-end">Ações</th>
              </tr>
            </thead>
            <tbody>
              {loans.map((loan) => (
                <tr key={loan.id}>
                  <td>{loan.book?.title}</td>
                  <td>{loan.reader?.name}</td>
                  <td>{new Date(loan.loanDate).toLocaleDateString("pt-BR")}</td>
                  <td>{new Date(loan.dueDate).toLocaleDateString("pt-BR")}</td>
                  <td>
                    <span className={`badge ${statusLabels[loan.status]?.className}`}>
                      {statusLabels[loan.status]?.text || loan.status}
                    </span>
                  </td>
                  <td className="text-end">
                    {loan.status !== "RETURNED" && (
                      <button
                        className="btn btn-sm btn-outline-success"
                        onClick={() => handleReturn(loan.id)}
                      >
                        Registrar devolução
                      </button>
                    )}
                  </td>
                </tr>
              ))}

              {loans.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center text-secondary py-3">
                    Nenhum empréstimo registrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default LoanList;