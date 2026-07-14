import { Container, Row, Col } from 'react-bootstrap'
import type { Product } from '../types/store'
import TarjetaProducto from './TarjetaProducto'

interface ProductGridProps {
  products: Product[]
  fluid?: boolean
}

function ProductGrid({ products, fluid = true }: ProductGridProps) {
  return (
    <Container fluid={fluid} className="px-0">
      <Row className="g-4" role="list">
        {products.map((product) => (
          <Col
            key={product.id}
            xs={12}
            md={6}
            lg={4}
            className="mb-1"
            role="listitem"
          >
            <TarjetaProducto product={product} />
          </Col>
        ))}
      </Row>
    </Container>
  )
}

export default ProductGrid
