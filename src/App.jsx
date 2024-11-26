import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SideBar from '../src/Components/SideBar/SideBar'; // Adjust the import path as necessary
import UserSreen from './Screens/Merchant/UserScreen'; // Import your Users component
import Home from '../src/Screens/Home/HomeScreen'; // Assuming you have a Home component
import Products from './Screens/Products/Products';
import Categories from './Screens/Categories/Categories';
import Login from './Screens/Login/Login';
import Campaigns from './Screens/campaigns/Campaigns';
import './index.css';

function App() {
 
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/home"
          element={
            <>
              <SideBar />
              <Home />
            </>
          }
        />
        <Route
          path="/users"
          element={
            <>
              <SideBar />
              <UserSreen />
            </>
          }
        />
        <Route
          path="/products"
          element={
            <>
              <SideBar />
              <Products />
            </>
          }
        />
        <Route
          path="/campaigns"
          element={
            <>
              <SideBar />
              <Campaigns/>
            </>
          }
        />
       
         <Route
          path="/categories"
          element={
            <>
              <Categories />
              
            </>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
