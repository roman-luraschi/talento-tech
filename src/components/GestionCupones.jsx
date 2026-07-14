import { useEffect, useState } from 'react'
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
} from 'firebase/firestore'
import { getDb } from '../firestore/config'
import '../css/Cupones.css'

const CUPONES_COLLECTION = 'cupones'

function GestionCupones() {
  const [cupones, setCupones] = useState([])
  const [loading, setLoading] = useState(true)
  const [listError, setListError] = useState(null)

  const [codigo, setCodigo] = useState('')
  const [descuento, setDescuento] = useState('')
  const [formError, setFormError] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [deletingId, setDeletingId] = useState(null)
  const [deleteError, setDeleteError] = useState(null)

  async function cargarCupones() {
    setLoading(true)
    setListError(null)
    try {
      const snapshot = await getDocs(collection(getDb(), CUPONES_COLLECTION))
      const data = snapshot.docs.map((document) => ({
        id: document.id,
        codigo: String(document.data().codigo ?? ''),
        descuento: Number(document.data().descuento ?? 0),
      }))
      setCupones(data)
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : 'No se pudieron cargar los cupones.'
      setListError(message)
    }
    setLoading(false)
  }

  useEffect(() => {
    let cancelled = false

    async function loadInitial() {
      try {
        const snapshot = await getDocs(collection(getDb(), CUPONES_COLLECTION))
        if (cancelled) return
        const data = snapshot.docs.map((document) => ({
          id: document.id,
          codigo: String(document.data().codigo ?? ''),
          descuento: Number(document.data().descuento ?? 0),
        }))
        setCupones(data)
        setListError(null)
      } catch (err) {
        if (cancelled) return
        const message =
          err instanceof Error
            ? err.message
            : 'No se pudieron cargar los cupones.'
        setListError(message)
      }
      if (!cancelled) {
        setLoading(false)
      }
    }

    void loadInitial()
    return () => {
      cancelled = true
    }
  }, [])

  async function handleCreate(event) {
    event.preventDefault()
    setFormError(null)

    const codigoTrimmed = codigo.trim()
    const descuentoNumber = Number(descuento)

    if (!codigoTrimmed) {
      setFormError('Ingresá el código del cupón.')
      return
    }

    if (
      !Number.isFinite(descuentoNumber) ||
      descuentoNumber < 1 ||
      descuentoNumber > 100
    ) {
      setFormError('El descuento debe ser un número entre 1 y 100.')
      return
    }

    setIsSubmitting(true)
    try {
      await addDoc(collection(getDb(), CUPONES_COLLECTION), {
        codigo: codigoTrimmed,
        descuento: descuentoNumber,
      })
      setCodigo('')
      setDescuento('')
      await cargarCupones()
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'No se pudo crear el cupón.'
      setFormError(message)
    }
    setIsSubmitting(false)
  }

  async function handleDelete(cuponId, codigoCupon) {
    const idToDelete = cuponId
    setDeleteError(null)
    setDeletingId(idToDelete)
    try {
      await deleteDoc(doc(getDb(), CUPONES_COLLECTION, idToDelete))
      await cargarCupones()
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : `No se pudo eliminar el cupón ${codigoCupon}.`
      setDeleteError(message)
    }
    setDeletingId(null)
  }

  return (
    <div className="cupones-page">
      <div className="cupones-page__container">
        <header className="cupones-page__head">
          <h1 className="cupones-page__title">Gestión de cupones</h1>
          <p className="cupones-page__subtitle">
            Creá, visualizá y eliminá cupones en la colección Firestore{' '}
            <code>cupones</code>.
          </p>
        </header>

        <div className="cupones-page__stack">
          <form className="cupon-form" onSubmit={handleCreate} noValidate>
            <h2 className="cupon-form__title">Crear cupón</h2>

            <div className="cupon-form__fields">
              <label className="cupon-form__field">
                <span className="cupon-form__label">Código</span>
                <input
                  className="cupon-form__input"
                  type="text"
                  name="codigo"
                  value={codigo}
                  onChange={(e) => setCodigo(e.target.value)}
                  placeholder="Ej: VERANO20"
                  autoComplete="off"
                  disabled={isSubmitting}
                  required
                />
              </label>

              <label className="cupon-form__field">
                <span className="cupon-form__label">Descuento (%)</span>
                <input
                  className="cupon-form__input"
                  type="number"
                  name="descuento"
                  value={descuento}
                  onChange={(e) => setDescuento(e.target.value)}
                  placeholder="Ej: 15"
                  min={1}
                  max={100}
                  step={1}
                  disabled={isSubmitting}
                  required
                />
              </label>
            </div>

            {formError ? (
              <p className="cupon-form__error" role="alert">
                {formError}
              </p>
            ) : null}

            <button
              type="submit"
              className="cupon-form__submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Guardando…' : 'Crear cupón'}
            </button>
          </form>

          {loading ? (
            <p className="cupon-list__status">Cargando cupones…</p>
          ) : listError ? (
            <p
              className="cupon-list__status cupon-list__status--error"
              role="alert"
            >
              {listError}
            </p>
          ) : cupones.length === 0 ? (
            <p className="cupon-list__status">
              Todavía no hay cupones. Creá el primero con el formulario.
            </p>
          ) : (
            <div className="cupon-list">
              <h2 className="cupon-list__title">Cupones guardados</h2>

              {deleteError ? (
                <p
                  className="cupon-list__status cupon-list__status--error"
                  role="alert"
                >
                  {deleteError}
                </p>
              ) : null}

              <ul className="cupon-list__items" aria-label="Lista de cupones">
                {cupones.map((cupon) => (
                  <li key={cupon.id} className="cupon-item">
                    <div className="cupon-item__info">
                      <span className="cupon-item__codigo">{cupon.codigo}</span>
                      <span className="cupon-item__descuento">
                        {cupon.descuento}% de descuento
                      </span>
                    </div>
                    <button
                      type="button"
                      className="cupon-item__delete"
                      onClick={() => handleDelete(cupon.id, cupon.codigo)}
                      disabled={deletingId === cupon.id}
                      aria-label={`Eliminar cupón ${cupon.codigo}`}
                    >
                      {deletingId === cupon.id ? 'Eliminando…' : 'Eliminar'}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default GestionCupones
