import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { readerService } from "../services/readerService";

const initialState = { name: "", email: "", phone: "" };

function ReaderForm() {
  const { id } = useParams();
  const isEditing = !!id;
  const navigate = useNavigate();

  const [form, setForm] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isEditing) {
      loadReader();
    }
  }, [id]);

  async function loadReader() {
    try {
      const reader = await readerService.get(id);
      setForm({
        name: reader.name || "",
        email: reader.email || "",
        phone: reader.phone || ""
      });
    } catch (err) {
      setApiError("Não foi possível carregar os dados do leitor.");
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
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!form.name.trim()) {
      newErrors.name = "O nome é obrigatório.";
    } else if (form.name.trim().length < 3) {
      newErrors.name = "O nome deve ter no mínimo 3 caracteres.";
    }
    if (!form.email.trim()) {
      newErrors.email = "O e-mail é obrigatório.";
    } else if (!emailRegex.test(form.email)) {
      newErrors.email = "Informe um e-mail válido.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setApiError("");

    if (!validate()) return;

    setSaving(true);

    try {
      if (isEditing) {
        await readerService.update(id, form);
      } else {
        await readerService.create(form);
      }

      navigate("/readers");
    } catch (err) {
      setApiError(err.response?.data?.message || "Não foi possível salvar o leitor.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p>Carregando...</p>;

  return (
    <div className="row justify-content-center">
      <div className="col-md-8 col-lg-6">
        <h2 className="mb-4">{isEditing ? "Editar leitor" : "Novo leitor"}</h2>

        {apiError && <div className="alert alert-danger">{apiError}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-3">
            <label className="form-label">Nome *</label>
            <input
              type="text"
              name="name"
              className={`form-control ${errors.name ? "is-invalid" : ""}`}
              value={form.name}
              onChange={handleChange}
            />
            {errors.name && <div className="invalid-feedback">{errors.name}</div>}
          </div>

          <div className="mb-3">
            <label className="form-label">E-mail *</label>
            <input
              type="email"
              name="email"
              className={`form-control ${errors.email ? "is-invalid" : ""}`}
              value={form.email}
              onChange={handleChange}
            />
            {errors.email && <div className="invalid-feedback">{errors.email}</div>}
          </div>

          <div className="mb-4">
            <label className="form-label">Telefone</label>
            <input
              type="text"
              name="phone"
              className="form-control"
              value={form.phone}
              onChange={handleChange}
            />
          </div>

          <div className="d-flex gap-2">
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? "Salvando..." : "Salvar"}
            </button>
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={() => navigate("/readers")}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ReaderForm;