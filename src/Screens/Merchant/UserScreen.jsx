import React, { useEffect, useState } from "react";
import { Table, Button } from "react-bootstrap";
import "./UserScreen.css";
import axios from "axios";
import { BackEndAPI } from "../../BaseURI/BackEndUrI";
import changeDate from "../../hooks/changedate";

const UserScreen = () => {
  const [userSearchTerm, setUserSearchTerm] = useState("");
  const [merchantSearchTerm, setMerchantSearchTerm] = useState("");
  const [users, setUsers] = useState([]); // Initialize users state
  const [merchants, setMerchants] = useState([]); // Initialize merchants state
  const [currentPageUsers, setCurrentPageUsers] = useState(1);
  const [currentPageMerchants, setCurrentPageMerchants] = useState(1);
  const itemsPerPage = 5; // Adjust this value for pagination

  useEffect(() => {
    const getGeneralData = async () => {
      try {
        // Using Promise.all to fetch data from multiple endpoints concurrently
        const [generalResponse, userJoinedResponse] = await Promise.all([
          axios.get(`${BackEndAPI}/adminroutes/GetAllUsers?page=${currentPageUsers}&limit=${itemsPerPage}`),
          axios.get(`${BackEndAPI}/adminroutes/GetAllMerchants?page=${currentPageMerchants}&limit=${itemsPerPage}`),
        ]);

        // Set the fetched data into state
        console.log("Users Response:", generalResponse.data);
        console.log("Merchants Response:", userJoinedResponse.data);
        setUsers(generalResponse.data.users); // Set users from API response
        setMerchants(userJoinedResponse.data.merchants); // Set merchants from API response
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    getGeneralData();
  }, [currentPageUsers, currentPageMerchants]); // Added currentPage to the dependency array to refetch data on page change

  // Filter Users
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
      user.phoneNumber.includes(userSearchTerm) ||
      user.email.toLowerCase().includes(userSearchTerm) ||
      user.merchant.toLowerCase().includes(userSearchTerm)
  );

  // Filter Merchants
  const filteredMerchants = merchants.filter(
    (merchant) =>
      merchant.name.toLowerCase().includes(merchantSearchTerm.toLowerCase()) ||
      merchant.shopName.toLowerCase().includes(merchantSearchTerm.toLowerCase()) ||
      merchant.email.toLowerCase().includes(merchantSearchTerm) ||
      merchant.phoneNumber.includes(merchantSearchTerm)
  );

  // Calculate Pagination for Users
  const totalUsers = filteredUsers.length;
  const totalPagesUsers = Math.ceil(totalUsers / itemsPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPageUsers - 1) * itemsPerPage,
    currentPageUsers * itemsPerPage
  );

  // Calculate Pagination for Merchants
  const totalMerchants = filteredMerchants.length;
  const totalPagesMerchants = Math.ceil(totalMerchants / itemsPerPage);
  const paginatedMerchants = filteredMerchants.slice(
    (currentPageMerchants - 1) * itemsPerPage,
    currentPageMerchants * itemsPerPage
  );

  const [selectedTab, setSelectedTab] = useState("users");

  return (
    <div className="all-users-container">
      <div className="select-tab" style={{display: "flex", justifyContent: "start", gap: "10px", marginBottom: "20px"}}>
        <div 
          onClick={() => setSelectedTab("users")}
          style={{
            cursor: "pointer", 
            fontWeight: "bold",
            borderBottom: selectedTab === "users" ? "2px solid black" : "none",
            color: selectedTab === "users" ? "black" : "gray"
          }}
        >
          사용자
        </div>
        <div 
          onClick={() => setSelectedTab("merchants")}
          style={{
            cursor: "pointer", 
            fontWeight: "bold",
            borderBottom: selectedTab === "merchants" ? "2px solid black" : "none",
            color: selectedTab === "merchants" ? "black" : "gray"
          }}
        >
          사장님
        </div>
      </div>
       {selectedTab === "users" ? (
        // Users Section
        <div className="users-section">
          <h2 className="text-center">사용자</h2>
          <div>
            <Table striped bordered hover className="table">
              <thead>
                <tr>
                  <th>이름</th>
                  <th>전화번호</th>
                  <th>이메일</th>
                  <th>생년월일</th>
                  <th>가입 날짜</th>
                  <th>SNS종류</th>
                </tr>
              </thead>
              <tbody>
                {paginatedUsers.map((user, index) => (
                  <tr key={index}>
                    <td>{user.name ? user.name : "No Text available"}</td>
                    <td>{user.phoneNumber ? user.phoneNumber : "No Number available"}</td>
                    <td>{user.email ? user.email : "No Number available"}</td>
                    <td>{user.birthDate ? user.birthDate : "No Number available"}</td>
                    <td>{user.joinedDate ? changeDate(user.joinedDate) : "No Number available"}</td>
                    <td>{user.influenceType ? user.influenceType : "No Number available"}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
          <div className="pagination">
            <Button
              disabled={currentPageUsers === 1}
              onClick={() => setCurrentPageUsers((prev) => Math.max(prev - 1, 1))}
              variant="light"
            >
              Previous
            </Button>
            {Array.from({ length: totalPagesUsers }, (_, i) => (
              <Button
                key={i}
                onClick={() => setCurrentPageUsers(i + 1)}
                variant={currentPageUsers === i + 1 ? "primary" : "light"}
              >
                {i + 1}
              </Button>
            ))}
            <Button
              disabled={currentPageUsers === totalPagesUsers}
              onClick={() => setCurrentPageUsers((prev) => Math.min(prev + 1, totalPagesUsers))}
              variant="light"
            >
              Next
            </Button>
          </div>
        </div>
      ) : (
        // Merchants Section
        <div className="merchants-section">
          <h2 className="text-center">Merchants</h2>
          <div>
            <Table striped bordered hover className="table">
              <thead>
                <tr>
                  <th>이름</th>
                  <th>이메일</th>
                  <th>전화번호</th>
                  <th>사업자명</th>
                  <th>가입 날짜</th>
                  <th>가입 경로</th>
                </tr>
              </thead>
              <tbody>
                {paginatedMerchants.map((merchant, index) => (
                  <tr key={index}>
                    <td>{merchant.name ? merchant.name : "No name available"}</td>
                    <td>{merchant.email ? merchant.email : "No email available"}</td>
                    <td>{merchant.PhoneNumber ? merchant.PhoneNumber : "No number available"}</td>
                    <td>{merchant.businessName ? merchant.businessName : "No number available"}</td>
                    <td>{merchant.joinedDate ? changeDate(merchant.joinedDate) : "No number available"}</td>
                    <td>{merchant.signupPath ? merchant.signupPath : "No number available"}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
          <div className="pagination">
            <Button
              disabled={currentPageMerchants === 1}
              onClick={() => setCurrentPageMerchants((prev) => Math.max(prev - 1, 1))}
              variant="light"
            >
              Previous
            </Button>
            {Array.from({ length: totalPagesMerchants }, (_, i) => (
              <Button
                key={i}
                onClick={() => setCurrentPageMerchants(i + 1)}
                variant={currentPageMerchants === i + 1 ? "primary" : "light"}
              >
                {i + 1}
              </Button>
            ))}
            <Button
              disabled={currentPageMerchants === totalPagesMerchants}
              onClick={() => setCurrentPageMerchants((prev) => Math.min(prev + 1, totalPagesMerchants))}
              variant="light"
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
export default UserScreen;
