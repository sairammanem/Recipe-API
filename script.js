const container = createBootstrap("div", "container box");

const titleRow = createBootstrap("div", "row");
const titleCol = createBootstrap("div", "col-md-12 text-center mt-5");
const titleHead = createBootstrap("h1", "h1 siteHead");
titleHead.innerText = "Hello, Stranger!";
const subTitleHead = createBootstrap("h2", "h5");
subTitleHead.innerText = "Want to eat healthy food?";

titleCol.append(titleHead, subTitleHead);
titleRow.append(titleCol);

const searchRow = createBootstrap("div", "row");
const searchCol = createBootstrap("div", "col-md-12 mt-3");
const searchForm = createBootstrap(
    "form",
    "form-inline d-flex justify-content-center"
);
const inputSearchForm = createBootstrap("input", "form-control mr-sm-2");
inputSearchForm.setAttribute("type", "search");
inputSearchForm.placeholder = "Search now to end your cravings...";
inputSearchForm.style.width = "70%";
const buttonSearchForm = createBootstrap(
    "button",
    "btn btn-outline-success my-2 my-sm-0"
);
buttonSearchForm.setAttribute("type", "submit");
buttonSearchForm.innerText = "Submit";

searchForm.append(inputSearchForm, buttonSearchForm);
searchCol.append(searchForm);
searchRow.append(searchCol);

const cardRow = createBootstrap("div", "row");
const cardCol = createBootstrap("div", "col-md-12 mt-3");
const cardDeck = createBootstrap("div", "card-deck");
const cardDeckTitleRow = createBootstrap("div", "row");
const cardDeckTitle = createBootstrap("div", "col-md-12 ml-3 my-3");
const cardDeckRow = createBootstrap("div", "row");

cardDeckTitleRow.append(cardDeckTitle);
cardDeck.append(cardDeckTitleRow, cardDeckRow);
cardCol.append(cardDeck);
cardRow.append(cardCol);
container.append(titleRow, searchRow, cardRow);

document.body.append(container);


function createBootstrap(ele, className = "") {
    let element = document.createElement(ele);
    element.setAttribute("class", className);
    return element;
}


const apiId = "&app_id=35db3cfb";
const apiKey = "&app_key=a601b0c9290c4f4573b8a56bcae9fc97";
const api_base_url = "https://api.edamam.com/search?q=";


searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    container.classList.remove("box");
    titleHead.innerHTML = `Welcome, Stranger`;
    subTitleHead.innerHTML = "Hope, you find things you are looking for  &#128515;";
    cardDeckRow.innerHTML = "";
    const value = inputSearchForm.value;

    fetchRecipeApiData(api_base_url, value);
});


async function fetchRecipeApiData(url, foodItem) {
    try {
        const api = await fetch(url + foodItem + apiId + apiKey);
        const api_obj = await api.json();

        searchByLabel(api_obj);
    } catch {
        console.log("Api error occured");
        cardDeckTitle.innerHTML = "Oops! something went wrong! Please try again &#128557";
    }
}


function searchByLabel(label) {
    const health_label = label.hits;
    const dietType = [];
    for (let i = 0; i < health_label.length; i++) {
        dietType.push(health_label[i].recipe.healthLabels);
    }
    const cardArr = randomLabel(health_label.length, dietType);
    cardArr.forEach((card) => {
        const cardContainerCol = createBootstrap(
            "div",
            "col-md-4 col-lg-3 d-flex justify-content-center"
        );
        const cardContainer = createBootstrap("div", "card rounded-lg my-2");
        cardContainer.innerHTML = `<div class="card-body card_body">
    <p class="card-text card-extra-text">${card}</p>    
  </div>`;
        randomBgColor(cardContainer);
        cardContainerCol.append(cardContainer);
        cardDeckRow.append(cardContainerCol);
        cardDeckTitle.innerHTML = `<h3 class="h6">Choose your type:</h3>`;
    });
    foodCards(cardArr, health_label);
}


function foodCards(cardArr, health_label) {
    const card_body = document.querySelectorAll(".card-body");
    card_body.forEach((card) => {
        card.addEventListener("click", () => {
            let cuisineArr = [];
            for (let i = 0; i < health_label.length; i++) {
                if (health_label[i].recipe.healthLabels.includes(card.innerText)) {
                    const cuisine = health_label[i].recipe;
                    createCuisineCards(cuisine, cuisineArr);
                }
            }
            cardDeckRow.innerHTML = "";
            cardDeckTitle.innerHTML = `<h3 class="h5 text-success">Mouth watering, huh? &#128523;</h3>`;
            cardDeckRow.append(...cuisineArr);
        });
    });
}


function createCuisineCards(cuisine, cuisineArr) {
    const cuisineContainerCol = createBootstrap("div", "col-md-6 col-lg-4");
    const cuisineContainer = createBootstrap("div", "card rounded-lg my-2");
    cuisineContainer.style.width = "18rem;";

    const cuisineImg = createBootstrap("img", "card-img-top");
    cuisineImg.setAttribute("src", cuisine.image);
    cuisineImg.alt = cuisine.label;

    const cuisineTitle = createBootstrap("div", "card-body");
    cuisineTitle.innerHTML = `<h5 class="card-title">${cuisine.label}</h5>`;
    const cuisineList = createBootstrap("ul", "list-group list-group-flush");

    cuisineList.innerHTML = `  
    <li class="list-group-item">Cuisine Type: ${
      cuisine.cuisineType !== undefined ? cuisine.cuisineType : "Not Available"
    }</li>
    <li class="list-group-item">Meal Type: ${
      cuisine.mealType !== undefined ? cuisine.mealType : "Not Available"
    }</li>
    <li class="list-group-item">Calories: ${
      cuisine.calories !== undefined
        ? Math.floor(cuisine.calories)
        : "Not Available"
    } Kcals</li>
    <li class="list-group-item">Diet Type: ${
      cuisine.dietLabels !== undefined || cuisine.dietLabels !== ""
        ? cuisine.dietLabels
        : "Not Available"
    }</li>
    <li class="list-group-item font-weight-bold">Ingredients: </li>
  `;

    const ingredientsList = cuisine.ingredients;
    const ingredientsItem = ingredientsList.map((ing) => {
        const ingre_dients = createBootstrap("li", "list-group-item ml-2");
        ingre_dients.innerHTML = ing.text;
        return ingre_dients;
    });

    const nutrientsList = cuisine.totalNutrients;
    let nutrientsItem = [];
    let nutrientsItemTitle = createBootstrap(
        "li",
        "list-group-item font-weight-bold"
    );
    nutrientsItemTitle.innerHTML = "Vitamins: ";
    for (listItem in nutrientsList) {
        const item = createBootstrap("li", "list-group-item ml-2");
        if (nutrientsList[listItem].label.includes("Vitamin")) {
            item.innerHTML = `${nutrientsList[listItem].label}: ${nutrientsList[
        listItem
      ].quantity.toFixed(2)}`;
            nutrientsItem.push(item);
        }
    }
    nutrientsItem.unshift(nutrientsItemTitle);

    cuisineList.append(...ingredientsItem, ...nutrientsItem);
    cuisineContainer.append(cuisineImg, cuisineTitle, cuisineList);
    cuisineContainerCol.append(cuisineContainer);
    cuisineArr.push(cuisineContainerCol);
}


function randomLabel(num, label) {
    const randomNum = Math.floor(Math.random() * num);
    return label[randomNum];
}


function randomBgColor(card) {
    const r = Math.floor(Math.random() * 255);
    const g = Math.floor(Math.random() * 255);
    const b = Math.floor(Math.random() * 255);
    card.style.backgroundColor = `rgba(${r},${g},${b},0.5)`;
}