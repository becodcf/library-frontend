import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { readerService } from "../services/readerService";

function ReaderList() {
  const [readers, setReaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadReaders();
  }, []);

  async function loadReaders() {
    setLoading(true);
    setError("");

    try {
      const data = await readerService.list();
      setReaders(data);
    } catch (err) {
      setError("Não foi possível carregar os leitores.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Tem certeza que deseja excluir este leitor?")) return;

    try {
      await readerService.remove(id);
      setReaders((prev) => prev.filter((reader) => reader.id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Não foi possível excluir o leitor.");
    }
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Leitores</h2>
        <Link to="/readers/new" className="btn btn-primary">
          <i className="bi bi-plus-lg me-1"></i>
          Novo leitor
        </Link>
      </div>

      {loading && <p>Carregando...</p>}
      {error && <div className="alert alert-danger">{error}</div>}

      {!loading && !error && (
        <div className="table-responsive">
          <table className="table table-hover bg-white shadow-sm">
            <thead>
              <tr>
                <th>Nome</th>
                <th>E-mail</th>
                <th>Telefone</th>
                <th className="text-end">Ações</th>
              </tr>
            </thead>
            <tbody>
              {readers.map((reader) => (
                <tr key={reader.id}>
                  <td>{reader.name}</td>
                  <td>{reader.email}</td>
                  <td>{reader.phone || "-"}</td>
                  <td className="text-end">
                    <Link
                      to={`/readers/${reader.id}/edit`}
                      className="btn btn-sm btn-outline-primary me-2"
                    >
                      Editar
                    </Link>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDelete(reader.id)}
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}

              {readers.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center text-secondary py-3">
                    Nenhum leitor cadastrado.
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

export default ReaderList;
