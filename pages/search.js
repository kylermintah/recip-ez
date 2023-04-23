import { useState } from "react";
import axios from "axios";
import Image from "next/image";
import ClipLoader from "react-spinners/ClipLoader";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import { useRouterData } from "./context/RouterDataContext";

import CycleText from "./components/cycletext";
import { toTitleCase } from "@/utils/stringUtils";

async function fetchRecipes(sentence, top_k = 5) {
  const url = "/api/proxy";

  const headers = {
    "Content-Type": "application/json",
  };

  const data = {
    sentence,
    top_k,
  };

  try {
    const response = await axios.post(url, data, { headers });
    return response.data;
  } catch (error) {
    console.error("Error fetching recipes:", error);
    return [];
  }
}

export default function Search() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const handleChange = (event) => {
    setInput(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      // Call the Cloud Function instead of the previous API
      const fetchedRecipes = await fetchRecipes(input);
      setResults(fetchedRecipes);
      console.log(fetchedRecipes); // Log the fetched recipes
      setShowModal(true);
      setLoading(false);
    } catch (error) {
      console.error("Error:", error);
      setLoading(false);
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  return (
    <div className="mt-12 mb-5 md:w-6/12">
      <div className="items-center flex flex-col gap-0 md:gap-5 justify-center align-middle">
        <Image
          className="scale-75 md:scale-75 rounded-full shadow-xl shadow-slate-300 transition-all duration-300 ease-in-out transform :hover:scale-90"
          src="/images/logo.png"
          alt="Recipe Search Logo"
          width={100}
          height={100}
        />
        <h1 className="self-center">recip-ez</h1>
      </div>
      <CycleText />
      <div className="min-h-full flex flex-col pt-8 gap-10 px-6 md:px-23 ">
        <form onSubmit={handleSubmit}>
          <div>
            <textarea
              spellCheck="true"
              style={{
                width: "100%",
                height: "25rem",
                maxWidth: "120rem",
                minHeight: "15rem",
                maxHeight: "25rem",
              }}
              type="text"
              id="ingredients"
              className="self-center mb-10 text-xl bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="What are we working with? (enter some ingredients...)"
              required
              onChange={handleChange}
              value={input}
            />
          </div>
          <button
            onSubmit={handleSubmit}
            type="submit"
            className="text-lg text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            {loading ? (
              <ClipLoader size={25} color={"#ffffff"} loading={loading} />
            ) : (
              "Submit"
            )}
          </button>
        </form>
        {showModal && (
          <ResultModal
            input={input}
            results={results}
            handleClose={handleModalClose}
          />
        )}
      </div>
    </div>
  );
}

const ResultModal = ({ input, results, handleClose }) => {
  const router = useRouter(); // Add this line to get the router instance
  const { setRouterData } = useRouterData(); // Add this line to get the router data setter

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-gray-900 opacity-75"></div>
      <motion.div
        className="w-full max-w-lg max-h-3xl p-6 bg-white rounded-lg shadow-2xl overflow-y-auto"
        initial={{ opacity: 0, y: "-100%" }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: "100%" }}
        transition={{ duration: 0.5 }}
      >
        <button
          className="absolute top-0 right-0 m-5 focus:outline-none"
          onClick={handleClose}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-gray-600 hover:text-gray-800"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <h2 className="font-bold text-2xl mb-5">Cook something up:</h2>
        <ul className="divide-y divide-gray-300">
          {results.map((result, index) => (
            <motion.li
              key={index}
              className="py-3 flex justify-between items-center"
              initial={{ opacity: 0, x: "-100%" }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.2 }}
            >
              <span>{toTitleCase(result.name)}</span>
              <button
                className="text-blue-700 hover:text-blue-800 font-medium"
                onClick={() => {
                  setRouterData({
                    recipe: result,
                    rawInput: input,
                  });
                  // Navigate to the corresponding recipe page
                  router.push({
                    pathname: `/recipes/${result.id}`,
                  });
                }}
              >
                View
              </button>
            </motion.li>
          ))}
        </ul>
      </motion.div>
    </div>
  );
};
