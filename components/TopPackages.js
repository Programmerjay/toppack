"use client";

import { useState, useEffect } from "react";

function TopPackages() {
  const [topPackages, setTopPackages] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedPackages = JSON.parse(localStorage.getItem("trackedPackages"));
        if (!storedPackages) {
          return; // Handle empty storage (e.g., show message)
        }

        const processedPackages = Object.entries(storedPackages).map(([name, count]) => ({
          name,
          count,
        }));

        const sortedPackages = processedPackages.sort((a, b) => b.count - a.count);
        setTopPackages(sortedPackages);
      } catch (error) {
        // Handle errors gracefully (e.g., display error message)
        console.error("Error fetching top packages:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className='container mx-auto px-4 pt-16 pb-8'>
      <h1 className='text-3xl font-bold text-center mb-8'>Top Packages</h1>
      <ul className='list-disc space-y-4 mt-4'>
        {topPackages.map((pkg) => (
          <li key={pkg.name}>
            <span className='font-medium'>{pkg.name}:</span>
            <span className='text-gray-500 m-4'>{pkg.count}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TopPackages;
