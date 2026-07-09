import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { bookService } from "../services/bookService";

const initialState = {
  title: "",
  author: "",
  publisher: "",
  year: "",
  isbn: ""
};

function BookForm() {
  const { id } = useParams();
  const isEditing = !!id;
  const navigate = useNavigate();

  const [form, setForm] = useState(initialState);
  const [coverFile, setCoverFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isEditing) {
      loadBook();
    }
  }, [id]);

  async function loadBook() {
    try {
      const book = await bookService.get(id);
      setForm({
        title: book.title || "",
        author: book.author || "",
        publisher: book.publisher || "",
        year: book.year || "",
        isbn: book.isbn || ""
      });
    } catch (err) {
      setApiError("Não foi possível carregar os dados do livro.");
    } finally {
      setLoading(false);
    }
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function validate() {
    const newErrors = {};

    if (!form.title.trim()) newErrors.title = "O título é obrigatório.";
    if (!form.author.trim()) newErrors.author = "O autor é obrigatório.";
    if (!form.isbn.trim()) newErrors.isbn = "O ISBN é obrigatório.";
    if (form.year && Number.isNaN(Number(form.year))) {
      newErrors.year = "O ano deve ser um número.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setApiError("");

    if (!validate()) return;

    setSaving(true);

    const payload = {
      title: form.title,
      author: form.author,
      publisher: form.publisher || undefined,
      year: form.year ? Number(form.year) : undefined,
      isbn: form.isbn
    };

    try {
      let book;

      if (isEditing) {
        book = await bookService.update(id, payload);
      } else {
        book = await bookService.create(payload);
      }

      if (coverFile) {
        await bookService.uploadCover(book.id, coverFile);
      }

      navigate("/books");
    } catch (err) {
      setApiError(err.response?.data?.message || "Não foi possível salvar o livro.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p>Carregando...</p>;

  return (
    <div className="row justify-content-center">
      <div className="col-md-8 col-lg-6">
        <h2 className="mb-4">{isEditing ? "Editar livro" : "Novo livro"}</h2>

        {apiError && <div className="alert alert-danger">{apiError}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-3">
            <label className="form-label">Título *</label>
            <input
              type="text"
              name="title"
              className={`form-control ${errors.title ? "is-invalid" : ""}`}
              value={form.title}
              onChange={handleChange}
            />
            {errors.title && <div className="invalid-feedback">{errors.title}</div>}
          </div>

          <div className="mb-3">
            <label className="form-label">Autor *</label>
            <input
              type="text"
              name="author"
              className={`form-control ${errors.author ? "is-invalid" : ""}`}
              value={form.author}
              onChange={handleChange}
            />
            {errors.author && <div className="invalid-feedback">{errors.author}</div>}
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">Editora</label>
              <input
                type="text"
                name="publisher"
                className="form-control"
                value={form.publisher}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label">Ano</label>
              <input
                type="number"
                name="year"
                className={`form-control ${errors.year ? "is-invalid" : ""}`}
                value={form.year}
                onChange={handleChange}
              />
              {errors.year && <div className="invalid-feedback">{errors.year}</div>}
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">ISBN *</label>
            <input
              type="text"
              name="isbn"
              className={`form-control ${errors.isbn ? "is-invalid" : ""}`}
              value={form.isbn}
              onChange={handleChange}
            />
            {errors.isbn && <div className="invalid-feedback">{errors.isbn}</div>}
          </div>

          <div className="mb-4">
            <label className="form-label">Capa do livro</label>
            <input
              type="file"
              accept="image/*"
              className="form-control"
              onChange={(e) => setCoverFile(e.target.files[0])}
            />
            <div className="form-text">Opcional. Formatos aceitos: JPG, PNG.</div>
          </div>

          <div className="d-flex gap-2">
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? "Salvando..." : "Salvar"}
            </button>
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={() => navigate("/books")}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default BookForm;
