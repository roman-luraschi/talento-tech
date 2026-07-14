import styled from 'styled-components'

export const BotonCompra = styled.button`
  flex: 1;
  min-width: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  min-height: 2.75rem;
  padding: 0.65rem 0.875rem;
  font-size: 0.9375rem;
  font-weight: 600;
  color: #fff;
  background-color: #128cb8;
  border: 1px solid #0e6f92;
  border-radius: 0.5rem;
  cursor: pointer;
  transition:
    background-color 0.15s ease,
    border-color 0.15s ease,
    box-shadow 0.15s ease;

  &:hover {
    background-color: #0f7ead;
    border-color: #0b5f7a;
  }

  &:focus-visible {
    outline: 2px solid #128cb8;
    outline-offset: 2px;
  }

  &:disabled {
    opacity: 0.65;
    cursor: not-allowed;
  }
`

export const BotonFavorito = styled.button<{ $activo?: boolean }>`
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.75rem;
  height: 2.75rem;
  min-width: 2.75rem;
  padding: 0;
  color: ${(props) => (props.$activo ? '#c9a227' : '#6e8085')};
  background: ${(props) =>
    props.$activo ? 'rgba(201, 162, 39, 0.12)' : 'transparent'};
  border: 1px solid ${(props) => (props.$activo ? '#e6c84d' : '#cbd4d6')};
  border-radius: 0.5rem;
  cursor: pointer;
  transition:
    color 0.15s ease,
    border-color 0.15s ease,
    background 0.15s ease;

  &:hover {
    color: #c9a227;
    border-color: #d4bc6a;
    background: rgba(201, 162, 39, 0.08);
  }

  &:focus-visible {
    outline: 2px solid #128cb8;
    outline-offset: 2px;
  }
`

export const SearchField = styled.div`
  position: relative;
  width: 100%;
  max-width: 28rem;

  .search-field__icon {
    position: absolute;
    top: 50%;
    left: 0.75rem;
    transform: translateY(-50%);
    color: #6e8085;
    pointer-events: none;
  }

  .search-field__input {
    padding-left: 2.35rem;
    min-height: 2.75rem;
  }
`

export const ProductoItem = styled.li`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: 0.75rem;
  padding: 12px 16px;
  border: 1px solid #e2e8ea;
  border-radius: 0.5rem;
  background-color: #fff;
  transition: background-color 0.2s ease, border-color 0.2s ease;

  &:hover {
    background-color: #f8f9fa;
  }

  &.producto-item--editing {
    border-color: #128cb8;
    box-shadow: 0 0 0 2px rgba(18, 140, 184, 0.12);
  }
`

export const ProductoInfo = styled.span`
  flex-grow: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  font-size: 16px;
`

export const BotonEditar = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.35rem;
  min-height: 2.75rem;
  padding: 0.5rem 0.85rem;
  font: inherit;
  font-size: 0.875rem;
  font-weight: 700;
  color: #128cb8;
  background: #eef7fb;
  border: 1px solid #b7d8e6;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background 0.15s ease;

  &:hover:not(:disabled) {
    background: #dceef6;
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`

export const BotonEliminar = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.35rem;
  min-height: 2.75rem;
  padding: 0.5rem 0.85rem;
  font: inherit;
  font-size: 0.875rem;
  font-weight: 700;
  color: #fff;
  background: #c0392b;
  border: 1px solid #a93226;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background 0.15s ease;

  &:hover:not(:disabled) {
    background: #a93226;
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`
