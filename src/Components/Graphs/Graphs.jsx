import React from 'react';
import Chart from 'react-apexcharts';
import './Graphs.css'; // Import CSS for styling

const Graphs = ({ userJoinedData, productAddedDates }) => {
  // Initialize arrays to count users joined and products added per month
  const userJoinCounts = Array(12).fill(0); // 12 months from Jan to Dec
  const productAddedCounts = Array(12).fill(0); // 12 months from Jan to Dec

  // Process the userJoinedData to count joins per month
  userJoinedData.forEach(({ UserJoinedDate }) => {
    const date = new Date(UserJoinedDate);
    const month = date.getMonth(); // Get month (0 - 11)
    userJoinCounts[month] += 1; // Increment the count for the corresponding month
  });

  // Process the productAddedDates to count products added per month
  productAddedDates.forEach(({ ProductAddedDate }) => {
    const date = new Date(ProductAddedDate);
    const month = date.getMonth(); // Get month (0 - 11)
    productAddedCounts[month] += 1; 
    
  });

  // Options for the Line Chart (Products Added)
  const lineOptions = {
    chart: {
      type: 'line',
      height: 300,
      toolbar: {
        show: true,
      },
    },
    colors: ['#00E396'],
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: 'smooth',
    },
    title: {
      text: 'Products Added',
      align: 'left',
      style: {
        fontSize: '20px',
        color: '#333',
      },
    },
    grid: {
      borderColor: '#e0e0e0',
    },
    xaxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      title: {
        text: 'Months',
      },
    },
    yaxis: {
      title: {
        text: 'Products',
      },
    },
  };

  const lineSeries = [
    {
      name: 'Products Added',
      data: productAddedCounts, // Use the processed data for the line chart
    },
  ];

  // Options for the Bar Chart (Users Joined)
  const barOptions = {
    chart: {
      type: 'bar',
      height: 300,
      toolbar: {
        show: true,
      },
    },
    colors: ['#008FFB'],
    dataLabels: {
      enabled: true,
    },
    title: {
      text: 'Users Joined',
      align: 'left',
      style: {
        fontSize: '20px',
        color: '#333',
      },
    },
    xaxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      title: {
        text: 'Months',
      },
    },
    yaxis: {
      title: {
        text: 'People',
      },
    },
  };

  const barSeries = [
    {
      name: 'Users',
      data: userJoinCounts, // Use the processed data for the bar chart
    },
  ];

  return (
    <div className="graph-container">
      <div className="graph">
        <Chart options={lineOptions} series={lineSeries} type="line" height={300} />
      </div>
      <div className="graph">
        <Chart options={barOptions} series={barSeries} type="bar" height={300} />
      </div>
    </div>
  );
};

export default Graphs;
