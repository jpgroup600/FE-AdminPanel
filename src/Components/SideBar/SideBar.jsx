import React, { useState } from "react";
import { Navbar, Nav, Button, Offcanvas } from "react-bootstrap";
import { Link } from "react-router-dom"; // Import Link for navigation
import "./SideBar.css"; // Import the custom CSS

function SideBar() {
  const [show, setShow] = useState(false);

  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);

  return (
    <>
      {/* Navbar */}
      <Navbar bg="dark" variant="dark" fixed="top" expand={false}>
        <div className="container-fluid">
          <Button
            variant="dark"
            onClick={handleShow}
            className="navbar-toggler"
          >
            <span className="navbar-toggler-icon"></span>
          </Button>
          <Navbar.Brand href="#">Admin Panel</Navbar.Brand>
        </div>
      </Navbar>

      {/* Offcanvas Sidebar on the left side */}
      <Offcanvas
        show={show}
        onHide={handleClose}
        placement="start"
        className="bg-dark text-white"
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>More Options</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Nav className="flex-column pe-3">
            <Nav.Link as={Link} to="/home" className="text-white nav-hover">
              Home
            </Nav.Link>
            <Nav.Link as={Link} to="/users" className="text-white nav-hover">
              Users
            </Nav.Link>
            <Nav.Link as={Link} to="/products" className="text-white nav-hover">
              Products
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/Categories"
              className="text-white nav-hover"
            >
              Categories
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/"
              className="nav-hover"
              style={{
                backgroundColor: "#28a745",
                color: "#ffffff",
                padding: "10px 20px",
                borderRadius: "5px",
                display: "inline-block",
                textAlign: "center",
                textDecoration: "none",
                transition: "background-color 0.3s ease",
                maxWidth: "100%",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#218838")
              } // Darker green on hover
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "#28a745")
              } // Original green on leave
            >
              Log Out
            </Nav.Link>
          </Nav>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}

export default SideBar;
