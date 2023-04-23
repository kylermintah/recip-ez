export function toTitleCase(str) {
  return str
    .toLowerCase()
    .replace(/(^|\s)([a-z])/g, (match, p1, p2) => {
      return p1 + p2.toUpperCase();
    })
    .replace(
      /\b(?:a|an|the|and|but|for|or|nor|so|yet|on|in|at|to|by|as|over)\b/gi,
      (match) => {
        return match.toLowerCase();
      }
    );
}

// Function to convert string to sentence case
function toSentenceCase(str) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

// Function that takes an array and renders it as a numbered list
export function renderNumberedList(steps) {
  const jsonString = String(steps)
    .replace(/\['/g, '["')
    .replace(/',/g, '",')
    .replace(/'\]/g, '"]')
    .replace(/ '\b/g, ' "') // new replace() call added here
    .replace(/ ,/g, ","); // new replace() call added here

  const jsonArray = JSON.parse(jsonString);

  return (
    <ol>
      {jsonArray.map((step, index) => {
        return (
          <li
            key={index}
            className="pl-40"
            style={{
              listStyleType: "decimal",
              paddingLeft: "1rem",
              marginLeft: "1rem",
            }}
          >
            {toSentenceCase(step)}
          </li>
        );
      })}
    </ol>
  );
}

// Function that takes an array and renders it as a numbered list
export function renderIngredientList({ ingredients, rawInput }) {
  const validJsonString = String(ingredients).replace(/'/g, '"');
  const jsonArray = JSON.parse(validJsonString);
  return jsonArray.map((ingredient, index) => {
    const isLastElement = index === jsonArray.length - 1;
    const ingredientWords = ingredient.toLowerCase().split(" ");

    const includesSomeIngredient = ingredientWords.some((word) => {
      return rawInput?.toLowerCase().includes(word);
    });

    const includesWholeIngredient = String(rawInput)
      .toLowerCase()
      .includes(String(ingredient).toLowerCase());

    return (
      <ul>
        {" "}
        {includesWholeIngredient || !rawInput ? (
          <li key={index} style={{ color: "", fontWeight: "400", fontSize:"0.95rem" }}>
            {toTitleCase(ingredient) + (!isLastElement ? "" : "")} &nbsp;
          </li>
        ) : includesSomeIngredient ? (
          <li key={index} style={{ color: "", fontWeight: "400", fontSize:"0.95rem" }}>
            <a
              key={index}
              style={{ color: "#FF851B", fontWeight: "500", opacity: "0.7", fontSize:"0.95rem"  }}
              target="_blank"
              href={`https://www.wholefoodsmarket.com/search?text=${ingredient}`}
            >
              {toTitleCase(ingredient)}
            </a>
            {!isLastElement ? "" : ""}&nbsp;
          </li>
        ) : (
          <li key={index} style={{ color: "", fontWeight: "400", fontSize:"0.95rem" }}>
            <a
              key={index}
              style={{ color: "", fontWeight: "500", opacity: "0.5", fontSize:"0.95rem"  }}
              target="_blank"
              href={`https://www.wholefoodsmarket.com/search?text=${ingredient}`}
            >
              {toTitleCase(ingredient)}(?)
            </a>
            {!isLastElement ? "" : ""}&nbsp;
          </li>
        )}
      </ul>
    );
  });
}

export function renderNutrition(nutritionArray) {
  const labels = [
    "Calories (kcal)",
    "Total Fat (%DV)",
    "Sugar (%DV)",
    "Sodium (%DV)",
    "Protein (%DV)",
    "Sat Fat (%DV)",
    "Carbs (%DV)",
  ];

  nutritionArray.replace(/'/g, '"');
  nutritionArray = JSON.parse(nutritionArray);

  return (
    <ul className="list-none p-0 flex flex-col md:flex-row gap-2 md:gap-10">
      {nutritionArray.map((value, index) => (
        <li className="text-xs" key={index}>
          {labels[index]}: <span style={{ opacity: 0.5 }}>{value}</span>
        </li>
      ))}
    </ul>
  );
}
