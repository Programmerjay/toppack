"use client";

import { useState, useEffect } from "react";
import { checkRepo, importPkg, searchRepo } from "./utils/utils";

const TRACKED_PACKAGES_KEY = "trackedPackages"; // Storage key for tracked packages
const CLICKED_REPOSITORIES = "clickedRepos"; // Storage key for tracked packages

export default function SearchRepositories() {
  const [keyword, setKeyword] = useState("");
  const [repositories, setRepositories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [trackedPackages, setTrackedPackages] = useState({});
  const [clickedRepos, setClickedRepos] = useState([]);
  const [state, setState] = useState(0);
  const handlePkgImport = async (repoUrl, name) => {
    try {
      if (checkRepo(name)) {
        throw new Error("This project is already imported");
      } else {
        setClickedRepos((prev) => [...prev, name]);
      } // Display success message or update UI

      const newtrackedPackages = await importPkg(repoUrl, trackedPackages);
      setTrackedPackages((prev) => ({ ...prev, ...newtrackedPackages }));
    } catch (error) {
      // Handle errors gracefully (e.g., display error messages)
      console.error(error);
      setError(error);
    }
  };

  useEffect(() => {
    localStorage.setItem(TRACKED_PACKAGES_KEY, JSON.stringify(trackedPackages));
  }, [trackedPackages]);

  useEffect(() => {
    localStorage.setItem(CLICKED_REPOSITORIES, JSON.stringify(clickedRepos));
  }, [clickedRepos]);

  useEffect(() => {
    const storedPackages = JSON.parse(localStorage.getItem(TRACKED_PACKAGES_KEY));
    if (storedPackages) {
      setTrackedPackages(storedPackages);
    }

    const StoredClickedRepo = JSON.parse(localStorage.getItem(CLICKED_REPOSITORIES));
    if (StoredClickedRepo) {
      setTrackedPackages(StoredClickedRepo);
    }
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      if (!keyword) return;

      setIsLoading(true);
      setError(null);

      let searchResults = await searchRepo(keyword);

      setRepositories(searchResults);
    } catch (error) {
      setError(error);
    } finally {
      setIsLoading(false);
      setState((prev) => prev + 1);
    }
  };

  return (
    <div className='container mx-auto px-4 py-8'>
      <h1 className='text-3xl font-bold mb-4'>Search Repositories</h1>

      <form onSubmit={handleSearch}>
        <input
          type='text'
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder='Search repositories...'
          className='w-full px-3 py-2 rounded-md border border-gray-300 focus:border-primary focus:outline-none text-gray-700 mb-4'
        />
        <button
          type='submit'
          className='bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark focus:outline-none'
          onClick={handleSearch}
        >
          Search
        </button>
      </form>

      {isLoading ? (
        <p className='text-gray-500 text-center mt-4'>Loading repositories...</p>
      ) : error ? (
        <p className='text-red-500 text-center mt-4'>Error: {error.message}</p>
      ) : repositories.length > 0 ? (
        <ul className='list-disc space-y-4 mt-4'>
          {repositories.map((repo) => (
            <li key={repo.id}>
              <a
                href={repo.html_url}
                className={`${
                  checkRepo(clickedRepos, repo.name) ? "text-purple-500" : "text-blue-500"
                } hover:underline`}
              >
                {repo.name}
              </a>
              <p className='text-gray-600 mt-1'>Stars: {repo.stargazers_count}</p>
              <p className='text-gray-600 mt-1'>Forks: {repo.forks_count}</p>
              <button
                className={`bg-blue-500 ${
                  checkRepo(clickedRepos, repo.name) ? "" : "hover:bg-blue-700"
                } text-white text-sm font-bold py-1 px-2 rounded m-1`}
                style={{ cursor: checkRepo(clickedRepos, repo.name) && "not-allowed" }}
                onClick={() => handlePkgImport(repo.url, repo.name)}
                disabled={checkRepo(clickedRepos, repo.name)}
              >
                Import
              </button>
            </li>
          ))}
        </ul>
      ) : (
        state > 0 && keyword && <p className='text-gray-500 text-center mt-4'>No repositories found for "{keyword}".</p>
      )}
    </div>
  );
}
