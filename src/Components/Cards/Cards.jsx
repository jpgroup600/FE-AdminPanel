import React, { useEffect } from "react"; // Import React
import SideBar from "../../Components/SideBar/SideBar"; // Import the SideBar component
import { Container, Row, Col, Card } from "react-bootstrap"; // Import necessary components from Bootstrap
import "./Cards.css"; // Import CSS for styling

function Cards({generalData}) {
  
  return (
    <>
      <div>
        <SideBar /> {/* Render the SideBar component */}
        <Container className="mt-4"> {/* Bootstrap container for layout */}
          <Row> {/* Bootstrap row for grid layout */}
            {/* Card 1 */}
            <Col xs={6} sm={6} md={3} className="mb-2"> {/* Bootstrap column for responsiveness */}
              <Card className="custom-card card-1 text-white"> {/* Primary card */}
                <Card.Body className="text-center"> {/* Card body with centered text */}
                  <Card.Title>Users</Card.Title> {/* Card title */}
                  <Card.Text>
                    {generalData.users} {/* Card text */}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>

            {/* Card 2 */}
            <Col xs={6} sm={6} md={3} className="mb-2"> {/* Bootstrap column for responsiveness */}
              <Card className="custom-card card-2 text-white"> {/* Success card */}
                <Card.Body className="text-center"> {/* Card body with centered text */}
                  <Card.Title>Merchants</Card.Title> {/* Card title */}
                  <Card.Text>
                  {generalData.merchants} {/* Card text */}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>

            {/* Card 3 */}
            <Col xs={6} sm={6} md={3} className="mb-2"> {/* Bootstrap column for responsiveness */}
              <Card className="custom-card card-3 text-white"> {/* Danger card */}
                <Card.Body className="text-center"> {/* Card body with centered text */}
                  <Card.Title>Products</Card.Title> {/* Card title */}
                  <Card.Text>
                  {generalData.products} {/* Card text */}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>

            {/* Card 4 */}
            <Col xs={6} sm={6} md={3} className="mb-2"> {/* Bootstrap column for responsiveness */}
              <Card className="custom-card card-4 text-white"> {/* Warning card */}
                <Card.Body className="text-center"> {/* Card body with centered text */}
                  <Card.Title>Approved</Card.Title> {/* Card title */}
                  <Card.Text>
                  {generalData.approvedProducts} {/* Card text */}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
}

export default Cards;
