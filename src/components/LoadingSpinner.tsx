import Spinner from 'react-bootstrap/Spinner'

interface LoadingSpinnerProps {
  label?: string
  height?: string
  size?: 'sm' | undefined
  variant?: string
}

function LoadingSpinner({
  label = 'Cargando...',
  height = '40vh',
  size,
  variant = 'primary',
}: LoadingSpinnerProps) {
  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: height }}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <Spinner animation="border" variant={variant} size={size}>
        <span className="visually-hidden">{label}</span>
      </Spinner>
    </div>
  )
}

export default LoadingSpinner
