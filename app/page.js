import SearchRepositories from "@/components/SearchRepositories";
import Link from "next/link";
import React from "react";

export default function Index() {
  return (
    <div className='container mx-auto px-4 py-8'>
      <h1 className='text-3xl font-bold mb-4'>Home</h1>

      <ul>
        <li>
          <Link className='underline' href={"/top-packages"}>
            Top Packages
          </Link>
        </li>
        <li>
          <Link className='underline' href={"/search"}>
            Search Repositories
          </Link>
        </li>
      </ul>
    </div>
  );
}
