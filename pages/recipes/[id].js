import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { FaArrowLeft } from "react-icons/fa";
import {
  FaPaperclip as PaperClipIcon,
  FaInfoCircle as InfoCircleIcon,
} from "react-icons/fa";
import { useRouterData } from "../api/context/RouterDataContext";

import {
  renderNumberedList,
  renderIngredientList,
  renderNutrition,
  toTitleCase,
} from "@/utils/stringUtils";

export default function Recipe() {
  const router = useRouter();
  const { routerData } = useRouterData();
  const { rawInput } = routerData;
  const [recipeData, setRecipe] = useState(null);
  const goBack = () => {
    router.back();
  };

  useEffect(() => {
    if (router.isReady) {
      fetchRecipe(router.query.id).then((fetchedRecipe) => {
        if (fetchedRecipe) {
          setRecipe(fetchedRecipe[0]);
        }
      });
    }
  }, [router.isReady, router.query.id]);

  return (
    <div>
      {recipeData ? (
        <div className="min-h-screen bg-white flex flex-col justify-normal items-start p-8 pt-12 lg:p-24  lg:mx-72 rounded-md ">
          <div className="px-4 sm:px-0">
            <div className="flex justify-start">
              <div className="flex flex-col gap-8">
                <button onClick={goBack} href="#">
                  {" "}
                  <FaArrowLeft />
                </button>
                <div>
                  <h3 className="text-lg font-bold leading-7 text-gray-900">
                    {toTitleCase(recipeData?.name)}
                  </h3>
                  <p className="mt-1 max-w-2xl md:text-md leading-6 text-gray-500">
                    Recipe and instructions
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-6 border-t border-gray-100">
            <dl className="divide-y divide-gray-100">
              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-sm font-semibold leading-6 text-gray-900">
                  Time
                </dt>
                <dd className="mt-1 text-md leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                  {Number(recipeData?.minutes) > 120
                    ? String(
                        Math.round((Number(recipeData?.minutes) / 60) * 2) / 2
                      ) + " hours"
                    : String(Number(recipeData?.minutes)) + " minutes"}
                </dd>
              </div>
              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-sm font-semibold leading-6 text-gray-900 mb-5 sm:mb-0">
                  Ingredients{" "}
                  <span className="text-xs block text-gray-300">
                    Click on a missing ingredient to order it
                  </span>
                </dt>
                <dd className="mt-1  text-md leading-6 text-gray-700 sm:col-span-2 sm:mt-0 sm:ml-0">
                  {renderIngredientList({
                    ingredients: recipeData?.ingredients,
                    rawInput: rawInput,
                  })}
                </dd>
              </div>

              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-sm font-semibold leading-6 text-gray-900">
                  Steps
                </dt>
                <dd className="mt-1 text-md leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                  {renderNumberedList([recipeData?.steps])}
                </dd>
              </div>
              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-sm font-semibold leading-6 text-gray-900 mb-5 sm:mb-0">
                  Nutrition
                  <span className="text-xs block text-gray-300">
                    <a
                      className="underline"
                      target="_blank"
                      href="https://www.fda.gov/food/new-nutrition-facts-label/how-understand-and-use-nutrition-facts-label#:~:text=The%20Percent%20Daily%20Value%20(%25DV),-(%234%20on&text=The%20%25%20Daily%20Value%20(%25DV,not%20to%20exceed%20each%20day."
                    >
                      Percentage daily value (%DV)
                    </a>
                    <br></br> based on a 2000 calorie diet
                  </span>
                </dt>
                <dd className="mt-1 text-md leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                  {renderNutrition(recipeData?.nutrition)}
                </dd>
              </div>

              {/* <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-sm font-medium leading-6 text-gray-900">
                  Description
                </dt>
                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                  {recipeData?.description}
                </dd>
              </div> */}
              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-sm font-medium leading-6 text-gray-900">
                  Export Recipe
                </dt>
                <dd className="mt-2 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                  <ul
                    role="list"
                    className="divide-y divide-gray-100 rounded-md border border-gray-200"
                  >
                    <li className="flex items-center justify-between py-4 pl-4 pr-5 text-sm leading-6">
                      <div className="flex w-0 flex-1 items-center">
                        <PaperClipIcon
                          className="h-5 w-5 flex-shrink-0 text-gray-400"
                          aria-hidden="true"
                        />
                        <div className="ml-4 flex min-w-0 flex-1 gap-2">
                          <span className="truncate font-medium">
                            {recipeData.name}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4 flex-shrink-0">
                        <a
                          href=""
                          onClick={(e) => {
                            e.preventDefault();
                            print();
                          }}
                          className="font-medium text-indigo-600 hover:text-indigo-500"
                        >
                          Download
                        </a>
                      </div>
                    </li>
                  </ul>
                  <ul role="list" className="mt-24">
                    <li className="flex text-xs">
                      <div className="flex w-auto flex-1  items-center">
                        <InfoCircleIcon
                          className="h-3 w-3 flex-shrink-0 text-gray-300"
                          aria-hidden="true"
                        />
                        <div className="ml-4 flex flex-1 gap-2 opacity-70">
                          <span className="font-xs self-center">
                            Credit and licensing for recipe data at{" "}
                            <span className="font-xs text-indigo-600 hover:text-indigo-500">
                              <a
                                target="_blank"
                                href="https://www.kaggle.com/datasets/shuyangli94/food-com-recipes-and-user-interactions?resource=download"
                              >
                                {" "}
                                kaggle.com
                              </a>
                            </span>
                          </span>
                        </div>
                      </div>
                    </li>
                  </ul>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      ) : (
        // loading spinner here
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}
    </div>
  );
}

async function fetchRecipe(id) {
  const url = "/api/proxy";
  const headers = {
    "Content-Type": "application/json",
  };
  const data = {
    id,
  };
  try {
    const response = await axios.post(url, data, { headers });
    return response.data;
  } catch (error) {
    console.error("Error fetching recipes:", error);
    return [];
  }
}

export async function getServerSideProps(context) {
  return {
    props: {}, // will be passed to the page component as props
  };
}
