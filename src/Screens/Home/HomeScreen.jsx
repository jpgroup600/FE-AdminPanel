import React, { useEffect, useState } from "react";
import SideBar from "../../Components/SideBar/SideBar";
import "./HomeScreen.css";
import Cards from "../../Components/Cards/Cards";
import Graphs from "../../Components/Graphs/Graphs";
import MainUsers from "../../Components/AllUsers/MainUsers";
import axios from "axios";
import { BackEndAPI } from "../../BaseURI/BackEndUrI";

function HomeScreen() {
  const [generalData, setGeneralData] = useState(null);
  const [userJoinedData, setUserJoinedData] = useState(null);
  const [productAddedDates, setProductAddedDates] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const getGeneralData = async () => {
      try {
        // Using Promise.all to fetch data from multiple endpoints concurrently
        const [generalResponse, userJoinedResponse, productAddedResponse] = await Promise.all([
          axios.get(`${BackEndAPI}/adminroutes/GetAllList`),
          axios.get(`${BackEndAPI}/adminroutes/UserJoinedList`),
          axios.get(`${BackEndAPI}/adminroutes/GetAllProductsDate`), // Added new API call
        ]);

        // Save responses to state
        setGeneralData(generalResponse.data);
        setUserJoinedData(userJoinedResponse.data);
        setProductAddedDates(productAddedResponse.data); // Set product added dates

        // Debugging output
        console.log("User Joined Data:", userJoinedResponse.data);
        console.log("Product Added Dates:", productAddedResponse.data);
      } catch (error) {
        console.error("Error fetching data: ", error);
      } finally {
        setLoading(false); // Set loading to false after data fetch
      }
    };

    getGeneralData();
  }, []);

  // If loading, return a loading indicator
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div>
        <SideBar />
      </div>
      <div>
        {/* Pass the fetched data as props */}
        <Cards generalData={generalData} />
      </div>
      <div>
        <Graphs userJoinedData={userJoinedData} productAddedDates={productAddedDates}  />
      </div>
      <div>
        <MainUsers />
      </div>
    </>
  );
}

export default HomeScreen;
