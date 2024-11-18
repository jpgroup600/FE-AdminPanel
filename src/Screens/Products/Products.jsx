import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Dropdown, Toast } from "react-bootstrap";
import "./Products.css";
import axios from "axios";
import { BackEndAPI } from "../../BaseURI/BackEndUrI";

const Products = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("success");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  
  const getGeneralData = async () => {
    try {
      // Fetching product data from the API
      const response = await axios.get(`${BackEndAPI}/adminroutes/GetAllProducts`);
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching data: ", error);
    } finally {
      setLoading(false); // Set loading to false after data fetch
    }
  };

  useEffect(() => {
    
    getGeneralData();
  }, []);

  const handleShow = (users) => {
    setSelectedUsers(users);
    setShowModal(true);
  };

  const handleClose = () => setShowModal(false);

  const handleApprove = async (id) => {
    console.log("AprroveId",id)
    try {
      await axios.post(`${BackEndAPI}/admin/approve`, {productId:id}); 
      setAlertMessage("Product approved successfully");
      setShowAlert(true);
      setAlertType("success");
      getGeneralData();
    } catch (error) {
      console.error("Error approving product: ", error);
      setAlertMessage("Failed to approve product");
      setAlertType("danger");
      setShowAlert(true);
    }
  };

 

const handleDelete = async (id) => {
  console.log("DeletedId", id);
  try {
    await axios.delete(`${BackEndAPI}/admin/delete`, { data: { productId: id } });
    setAlertMessage("Product deleted successfully");
    setShowAlert(true);
    setAlertType("success");
    getGeneralData();
  } catch (error) {
    console.error("Error deleting product: ", error);
    setAlertMessage("Failed to delete product");
    setAlertType("danger");
    setShowAlert(true);
  }
};
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleFilter = (status) => {
    setFilterStatus(status);
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.campaignName
      ? product.campaignName.toLowerCase().includes(searchQuery.toLowerCase())
      : true; // Check if productName exists
    const matchesFilter =
      filterStatus === "All" || product.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  useEffect(() => {
    if (showAlert) {
      const timer = setTimeout(() => setShowAlert(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showAlert]);

  if (loading) {
    return <div>Loading...</div>; // Loading state UI
  }

  return (
    <div className="products-section">
      <h2 className="products-heading">Products Management</h2>
      <input
        type="text"
        className="Product-search-bar"
        placeholder="Search products..."
        value={searchQuery}
        onChange={handleSearch}
      />
      <Dropdown className="filter-dropdown">
        <Dropdown.Toggle variant="success" id="dropdown-basic">
          Filter by Status: {filterStatus}
        </Dropdown.Toggle>

        <Dropdown.Menu>
          <Dropdown.Item onClick={() => handleFilter("All")}>All</Dropdown.Item>
          <Dropdown.Item onClick={() => handleFilter("approved")}>Approved</Dropdown.Item>
          <Dropdown.Item onClick={() => handleFilter("pending")}>Pending</Dropdown.Item>
          <Dropdown.Item onClick={() => handleFilter("expired")}>Expired</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>

      <Table className="table" striped bordered hover>
        <thead>
          <tr>
            <th>Product Name</th>
            <th>Merchant</th>
            <th>User Registered</th>
            <th>Status</th>
            <th>Active Date</th>
            <th>Expiry Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.map((product) => (
            <tr key={product._id}>
              <td>{product.campaignName}</td>
              <td>{product.businessName}</td>
              <td>
                <Button
                  variant="link"
                  onClick={() => handleShow(product.usersRegistered)}
                  className="user-link"
                >
                  {product.numberOfPeople} Users
                </Button>
              </td>
              <td>{product.status}</td>
              <td>{new Date(product.joinedDate).toLocaleDateString()}</td>
              <td>{new Date(new Date(product.joinedDate).getTime() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}</td>
              <td className="action-buttons">
                {product.status === "pending" && (
                  <Button
                    variant="success"
                    onClick={() => handleApprove(product._id)}
                    className="action-button"
                  >
                    Approve
                  </Button>
                )}
                <Button
                  variant="danger"
                  onClick={() => handleDelete(product._id,product.numberOfPeople)}
                  className="action-button"
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Registered Users</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedUsers.length === 0 ? (
            <p>No users registered.</p>
          ) : (
            <div className="user-names">
              {selectedUsers.map((user, index) => (
                <div key={index}>
                  {index + 1}. {user}
                </div>
              ))}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      <Toast
        show={showAlert}
        onClose={() => setShowAlert(false)}
        className={`alert-toast ${alertType}`}
      >
        <Toast.Body>{alertMessage}</Toast.Body>
      </Toast>
    </div>
  );
};

export default Products;
