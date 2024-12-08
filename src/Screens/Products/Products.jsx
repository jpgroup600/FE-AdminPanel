import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Dropdown, Toast } from "react-bootstrap";
import "./Products.css";
import axios from "axios";
import { BackEndAPI } from "../../BaseURI/BackEndUrI";
import { Link } from "react-router-dom";
import statusKr from "../../hooks/userStatusKr";

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
  const [clickMerchant, setClickMerchant] = useState(false);
  const [clickUser, setClickUser] = useState(false);
  const [refresh, setRefresh] = useState(false);

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
    setRefresh(false)
  }, []);

  const handleShow = (users) => {
    setSelectedUsers(users);
    setShowModal(true);
  };

  const handleClose = () => setShowModal(false);

  const handleUserApprove = async (email, productData) => {
    console.log("AprroveId", email)
    if (window.confirm("정말 사용자를 승인하시겠습니까?")) {
      try {
        await axios.post(`${BackEndAPI}/admin/user-approve`, { email: email, productId: productData._id });
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
    }
  };

  const handleUserPending = async (email, productData) => {
    console.log("AprroveId", email)
    if (window.confirm("정말 사용자를 대기로 변경하시겠습니까?")) {
      try {
        await axios.post(`${BackEndAPI}/admin/user-pending`, { email: email, productId: productData._id });
        setAlertMessage("Product pending successfully");
        setShowAlert(true);
        setAlertType("success");
        getGeneralData();
      } catch (error) {
        console.error("Error approving product: ", error);
        setAlertMessage("Failed to pending product");
        setAlertType("danger");
        setShowAlert(true);
      }
    }
  };

  const handleUserReject = async (email, productData) => {
    console.log("AprroveId", email)
    if (window.confirm("정말 사용자를 거절하시겠습니까?")) {
      try {
        await axios.post(`${BackEndAPI}/admin/user-reject`, { email: email, productId: productData._id });
        setAlertMessage("Product rejected successfully");
        setShowAlert(true);
        setAlertType("success");
        getGeneralData();
      } catch (error) {
        console.error("Error rejecting product: ", error);
        setAlertMessage("Failed to reject product");
        setAlertType("danger");
        setShowAlert(true);
      }
    }
  };





  const handleApprove = async (id) => {
    console.log("AprroveId", id)
    if (window.confirm("정말 상품을 승인하시겠습니까?")) {
      try {
        await axios.post(`${BackEndAPI}/admin/approve`, { productId: id });
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
    }
  };

  const handlePending = async (id) => {
    console.log("AprroveId", id)
    if (window.confirm("정말 상품을 대기로 변경하시겠습니까?")) {
      try {
        await axios.post(`${BackEndAPI}/admin/pending`, { productId: id });
        setAlertMessage("Product pending successfully");
        setShowAlert(true);
        setAlertType("success");
        getGeneralData();
      } catch (error) {
        console.error("Error approving product: ", error);
        setAlertMessage("Failed to pending product");
        setAlertType("danger");
        setShowAlert(true);
      }
    }
  };

  const handleReject = async (id) => {
    console.log("AprroveId", id)
    if (window.confirm("정말 상품을 거절하시겠습니까?")) {
      try {
        await axios.post(`${BackEndAPI}/admin/reject`, { productId: id });
        setAlertMessage("Product rejected successfully");
        setShowAlert(true);
        setAlertType("success");
        getGeneralData();
      } catch (error) {
        console.error("Error rejecting product: ", error);
        setAlertMessage("Failed to reject product");
        setAlertType("danger");
        setShowAlert(true);
      }
    }
  };



  const handleDelete = async (id) => {
    console.log("DeletedId", id);
    if (window.confirm("정말 상품을 삭제하시겠습니까?")) {
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
    }
  };

  const handleSetCampaign = async (id) => {
    try {
      await axios.post(`${BackEndAPI}/admin/setcampaign`, { data: { productId: id } });
      setAlertMessage("Product set to campaign successfully");
      setShowAlert(true);
      setAlertType("success");
      getGeneralData();
    } catch (error) {
      console.error("Error deleting product: ", error);
      setAlertMessage("Failed to set campaign product");
      setAlertType("danger");
      setShowAlert(true);
    }
  };

  const handleRemoveCampaign = async (id) => {
    if (window.confirm("정말 상품을 캠페인에서 제외하시겠습니까?")) {
      try {
        await axios.post(`${BackEndAPI}/admin/remove-campaign`, { data: { productId: id } });
        setAlertMessage("Product removed from campaign successfully");
        setShowAlert(true);
        setAlertType("success");
        getGeneralData();
      } catch (error) {
        console.error("Error deleting product: ", error);
        setAlertMessage("Failed to remove campaign product");
        setAlertType("danger");
        setShowAlert(true);
      }
    }
  };


  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleFilter = (status) => {
    setFilterStatus(status);
  };

  const MerchantDetail = () => {

    console.log("clickMerchant", clickMerchant)
    return (
      <>
        <div style={{ cursor: 'pointer', backgroundColor: 'red', textAlign: 'center', color: 'white', width: '100px', padding: '5px', borderRadius: '5px' }} onClick={() => setClickMerchant(false)}>닫기</div>
        <h3>사장님 정보</h3>
        <Table className="table" striped bordered hover>
          <thead>
            <tr>
              <th>전화번호</th>
              <th>사업자명</th>
              <th>사장님 이메일</th>

              <th>회사 URL</th>
              <th>가입경로</th>
              <th>가입날짜</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{clickMerchant.PhoneNumber}</td>
              <td>{clickMerchant.businessName}</td>
              <td>{clickMerchant.email}</td>
              <td><Link to={`https://${clickMerchant.urladdress}`}>{clickMerchant.urladdress}</Link></td>
              <td>{clickMerchant.signupPath}</td>
              <td>{new Date(clickMerchant?.registerDate).toLocaleDateString()}</td>
            </tr>
          </tbody>
        </Table>
      </>
    )
  }

  const UserDetail = () => {
    console.log("clickMerchant", clickMerchant)
    return (
      <>
        <div style={{ cursor: 'pointer', backgroundColor: 'red', textAlign: 'center', color: 'white', width: '100px', padding: '5px', borderRadius: '5px' }} onClick={() => setClickUser(false)}>닫기</div>
        <h3>사용자 정보</h3>
        <Table className="table" striped bordered hover>
          <thead>
            <tr>
              <th>사용자 이메일</th>
              <th>이름</th>
              <th>전화번호</th>

              <th>채널</th>
              <th>흥보 URL</th>
              <th>등록 날짜</th>
              <th>상태</th>
            </tr>
          </thead>
          <tbody>

            {clickUser?.registeredUsers?.map((user) => (
              <tr>
                <td>{user.email}</td>
                <td>{user.name}</td>
                <td>{user.phoneNumber}</td>
                <td>{user.channel}</td>
                <td><Link to={`https://${user.url}`}>{user.url}</Link></td>
                <td>{new Date(user?.registerDate).toLocaleDateString()}</td>
                <td>

                  <select
                    value={user.status}
                    onChange={async (e) => {
                      const newStatus = e.target.value;
                      if (newStatus === "approved") handleUserApprove(user.email, clickUser);
                      else if (newStatus === "pending") handleUserPending(user.email, clickUser);
                      else if (newStatus === "rejected") handleUserReject(user.email, clickUser);
                      
                      await getGeneralData()

                    }}
                    className="form-select action-button"
                    style={{
                      width: '100px',
                      backgroundColor:
                        user.status === "approved" ? "#198754" :  // green for approved
                          user.status === "pending" ? "#ffc107" :   // yellow for pending
                            user.status === "rejected" ? "#dc3545" :  // red for rejected
                              "#ffffff",                                   // default white
                      color: user.status === "approved" ? "white" : "black", // text color
                      border: 'none',  // optional: removes default border
                      cursor: 'pointer' // optional: shows pointer on hover
                    }}
                  >
                    <option value="pending">대기</option>
                    <option value="approved">승인</option>
                    <option value="rejected">거절</option>
                  </select>


                </td>
              </tr>
            ))}

          </tbody>
        </Table>
      </>
    )
  }

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.campaignName
      ? product.campaignName?.toLowerCase().includes(searchQuery?.toLowerCase())
      : true; // Check if productName exists
    const matchesFilter =
      filterStatus === "All" || product.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  console.log("Products", products);

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


      {clickMerchant && (
        <MerchantDetail />
      )}
      {clickUser && (
        <UserDetail />
      )}

      <Table className="table" striped bordered hover>
        <thead>
          <tr>
            <th>상품명</th>
            <th>사업자명</th>
            <th>사장님 이메일</th>
            <th>등록된 유저</th>
            <th>상태</th>
            <th>활동 시작일</th>
            <th>만료일</th>
            <th>설정</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.map((product) => {
            
            return (
            <tr key={product._id}>
              <td className="product-name text-teal-300"><Link to={`/view-product/${product._id}`}>{product.campaignName}</Link></td>
              <td style={{ cursor: "pointer" }}
                onClick={() => {
                  setClickMerchant(product?.merchant)
                }}>{product?.merchant?.businessName}</td>
              <td>{product?.merchant?.email}</td>
              <td>
                <Button
                  variant="link"
                  onClick={() => setClickUser(product)}
                  className="user-link"
                >
                  {product.registeredUsers.length} / {product.numberOfPeople}
                </Button>
              </td>
              <td>{statusKr[product.status]}</td>
              <td>{new Date(product.createdAt).toLocaleDateString()}</td>
              <td>{new Date(new Date(product.joinedDate).getTime() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}</td>
              <td className="action-buttons">


                <select
                  value={product.status}
                  onChange={(e) => {
                    const newStatus = e.target.value;
                    if (newStatus === "approved") handleApprove(product._id);
                    else if (newStatus === "pending") handlePending(product._id);
                    else if (newStatus === "rejected") handleReject(product._id);
                  }}

                  className="form-select action-button"
                  style={{
                    width: '100px',
                    backgroundColor:
                      product.status === "approved" ? "#198754" :  // green for approved
                        product.status === "pending" ? "#ffc107" :   // yellow for pending
                          product.status === "rejected" ? "#dc3545" :  // red for rejected
                            "#ffffff",                                   // default white
                    color: product.status === "approved" ? "white" : "black", // text color
                    border: 'none',  // optional: removes default border
                    cursor: 'pointer' // optional: shows pointer on hover
                  }}
                >
                  <option value="pending">대기</option>
                  <option value="approved">승인</option>
                  <option value="rejected">거절</option>
                </select>

                <Button
                  variant="danger"
                  onClick={() => handleDelete(product._id, product.numberOfPeople)}
                  className="action-button"
                >
                  삭제
                </Button>

                {product.setToCompaign === false && (
                  <Button
                    variant="warning"
                    onClick={() => handleSetCampaign(product._id)}
                    className="action-button"
                  >
                    캠페인 설정
                  </Button>
                ) || (
                    <Button
                      variant="success"
                      onClick={() => handleRemoveCampaign(product._id)}
                      className="action-button"
                    >
                      캠페인 해제
                    </Button>
                  )}

              </td>
            </tr>
            )
          })}
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
