import React, { useState, useEffect } from "react"; // Importing React, useState, and useEffect hooks
import {
  Table,
  Dropdown,
  DropdownButton,
  Pagination,
} from "react-bootstrap"; // Importing Bootstrap components
import axios from "axios";
import { BackEndAPI } from "../../BaseURI/BackEndUrI";
import "./MainUsers.css"; // Importing CSS file

const MainUsers = () => {
  const [users, setUsers] = useState([]); // State for users
  const [merchants, setMerchants] = useState([]); // State for merchants
  const [searchTerm, setSearchTerm] = useState(""); 
  const [currentPage, setCurrentPage] = useState(1); 
  const [userTypeFilter, setUserTypeFilter] = useState("All"); 
  const usersPerPage = 10; 

  useEffect(() => {
    const getGeneralData = async () => {
      try {
        // Using Promise.all to fetch data from multiple endpoints concurrently
        const [generalResponse, userJoinedResponse] = await Promise.all([
          axios.get(`${BackEndAPI}/adminroutes/GetAllUsers?page=${currentPage}&limit=${usersPerPage}`),
          axios.get(`${BackEndAPI}/adminroutes/GetAllMerchants?page=${currentPage}&limit=${usersPerPage}`),
        ]);

        // Set the fetched data into state
        setUsers(generalResponse.data.users);
        setMerchants(userJoinedResponse.data.merchants); // Set merchants from API response

      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    getGeneralData();
  }, [currentPage]); // Added currentPage to the dependency array to refetch data on page change

  // Combine users and merchants based on the selected filter
  const combinedData = userTypeFilter === "User" 
    ? users 
    : userTypeFilter === "Merchant" 
      ? merchants 
      : [...users, ...merchants];

  // Filter combined data based on search term
  const filteredData = combinedData.filter((item) => {
    const nameToCheck = item.name.toLowerCase();
    return nameToCheck.includes(searchTerm.toLowerCase());
  });

  const indexOfLastItem = currentPage * usersPerPage; // Last item index
  const indexOfFirstItem = indexOfLastItem - usersPerPage; // First item index
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem); // Current items for display

  const totalPages = Math.ceil(filteredData.length / usersPerPage); // Total pages

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber); // Set current page
  };

  // Function to handle user type selection
  const handleUserTypeSelect = (type) => {
    setUserTypeFilter(type); // Set user type filter
    setCurrentPage(1); // Reset to first page on filter change
  };

  return (
    <div className="all-users-container">
      <h2 className="mb-4">All Users</h2>
      <div className="d-flex justify-content-between mb-3">
        <div>
          <Dropdown>
            <DropdownButton
              variant="primary"
              title={userTypeFilter}
              id="dropdown-basic"
            >
              <Dropdown.Item onClick={() => handleUserTypeSelect("All")}>
                All
              </Dropdown.Item>
              <Dropdown.Item onClick={() => handleUserTypeSelect("User")}>
                User
              </Dropdown.Item>
              <Dropdown.Item onClick={() => handleUserTypeSelect("Merchant")}>
                Merchant
              </Dropdown.Item>
            </DropdownButton>
          </Dropdown>
        </div>
        <div>
          <input
            type="text"
            placeholder="Search users or merchants"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>No</th>
            <th>Name</th>
            <th>Email</th>
            <th>Joined Date</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.length > 0 ? (
            currentItems.map((item, index) => (
              <tr key={item._id}>
                <td>{indexOfFirstItem + index + 1}</td>
                <td>{item.name}</td>
                <td>{item.email}</td>
                <td>{new Date(item.joinedDate).toLocaleString()}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center">
                No results found
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      <Pagination>
        {[...Array(totalPages)].map((_, index) => (
          <Pagination.Item
            key={index + 1}
            active={index + 1 === currentPage}
            onClick={() => handlePageChange(index + 1)}
          >
            {index + 1}
          </Pagination.Item>
        ))}
      </Pagination>
    </div>
  );
};

export default MainUsers;
