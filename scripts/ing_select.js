'use strict';

// // Global Scope
// const apiIngList = get('https://www.themealdb.com/api/json/v1/1/list.php?i=list', fillInIngredientOptions);

// // Global Scope
// const tsRecipeList = document.querySelector('#tsRecipeList');


function get(url, functionToDo) {
    return fetch(url)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            functionToDo(data);
            return data;

        })
        .catch(function(error) {
            console.error("ERROR:", error);
            return error;
        });
}

(function () {
    const apiIngList = get('https://www.themealdb.com/api/json/v1/1/list.php?i=list', fillInIngredientOptions);
    const drinkButton = document.querySelector('#drinkButton');
    drinkButton.addEventListener('click', function(event) {
        event.preventDefault();
        emptyDrink();
        get('https://www.thecocktaildb.com/api/json/v1/1/random.php', fillInDrinkOptions)
    });
}) ();

function emptyDrink() {
    const tsDrinkList = document.querySelector('#tsDrinkList');
    tsDrinkList.innerHTML = '';
}

function fillInDrinkOptions(apiDrink) {
    console.log(apiDrink)
    const tsDrinkList = document.querySelector("#tsDrinkList");
    const pCreate = document.createElement('p');
    pCreate.innerHTML = apiDrink.drinks[0].strDrink;
    const imgDrink = document.createElement('img');
    imgDrink.src = apiDrink.drinks[0].strDrinkThumb;
    pCreate.appendChild(imgDrink);
    tsDrinkList.appendChild(pCreate);
    const drinkButton = document.querySelector("#drinkButton");

};


function fillInIngredientOptions(apiIngredients) {
    const apiListDatalist = document.querySelector("#apiListDatalist");
    apiIngredients.meals.forEach(function(ingredient) {
        const option = document.createElement('option');
        option.value = ingredient.strIngredient;
        apiListDatalist.appendChild(option);
    });
    const ingInput = document.querySelector('#ingInput');
    const searchButton = document.querySelector("#searchButton");
    eventListenerInput(searchButton, ingInput);
};


function eventListenerInput(element, input) {
    element.addEventListener('click', function(event) {
        event.preventDefault();
        emptyRecipeList();
        const userInput = input.value;
        get(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${userInput.toLowerCase()}`, fillRecipeList)
    });

}

function eventListenerCard(array) {
    array.forEach(function(item) {
        item.addEventListener('click', function(event) {
            event.preventDefault();
            emptyBottomSection();
            const recipeId = item.id;
            get(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${recipeId}`, fillBottomSection);
        })
    })
}

function fillRecipeList(apiRecipeList) {
    const tsRecipeList = document.querySelector('#tsRecipeList');
    console.log(apiRecipeList);
    apiRecipeList.meals.forEach(function(recipe) {
        const li = document.createElement('li');
        const img = document.createElement('img');
        img.src = recipe.strMealThumb;
        img.classList.add("tsRecipeList--image");
        li.appendChild(img);
        const div = document.createElement('div');
        div.innerHTML = recipe.strMeal;
        div.classList.add('tsRecipeList--name')
        li.appendChild(div)
        li.id = recipe.idMeal;
        li.classList.add('tsRecipeList--card');
        tsRecipeList.appendChild(li);
    })
    const recipeCards = document.querySelectorAll('.tsRecipeList--card');
    eventListenerCard(recipeCards)
}

function emptyRecipeList() {
    const tsRecipeList = document.querySelector('#tsRecipeList');
    tsRecipeList.innerHTML = '';
}

function fillBottomSection(recipe) {
    const bsHeader = document.querySelector('#bsHeader');
    bsHeader.innerHTML = recipe.meals[0].strMeal;
    const videoLink = document.createElement('a')
    videoLink.href = recipe.meals[0].strYoutube;
    videoLink.target = "_blank";
    videoLink.innerHTML = 'Watch it!'
    bsHeader.appendChild(videoLink);
    const bsImage = document.querySelector('#bsImage');
    const img = document.createElement('img');
    img.src = recipe.meals[0].strMealThumb;
    bsImage.appendChild(img);
    const bsRightIng = document.querySelector('#bsRightIng');
    const ul = document.createElement('ul');
    bsRightIng.appendChild(ul);
    const ingredients = [];
    const measures = [];
    console.log(recipe.meals[0])
    for (let key in recipe.meals[0]) {
        if (key.includes('strIngredient') && recipe.meals[0][key]) {
            ingredients.push(recipe.meals[0][key]);
        }
        if (key.includes('strMeasure') && recipe.meals[0][key]) {
            measures.push(`${recipe.meals[0][key]} `);
        }
    };

    console.log(ingredients);
    const ingList = [];
    ingredients.forEach(function(ingredient, idx) {
        const li = document.createElement('li');
        li.innerHTML = measures[idx].concat(ingredient)
        ul.appendChild(li);
        ingList.push(measures[idx].concat(ingredient))
    });
    const ingList2 = {};
    ingredients.forEach((ingredient, i) => ingList2[ingredient] = measures[i]);
    console.log(ingList);
    const recipePara = document.createElement('p');
    recipePara.innerHTML = recipe.meals[0].strInstructions;
    const bsRightRecipe = document.querySelector('#bsRightRecipe');
    bsRightRecipe.appendChild(recipePara);
    const bottomSection = document.querySelector('#bottomSection');
    bottomSection.classList.add('visible');
    eventListenerCloseModal(bottomSection);
}

function eventListenerCloseModal(section) {
    const closeModal = document.querySelector('#closeModal');
    closeModal.addEventListener('click', function(event) {
        event.preventDefault();
        section.classList.remove('visible');
    });
}

function emptyBottomSection() {
    const bsHeader = document.querySelector('#bsHeader');
    bsHeader.innerHTML = '';
    const bsImage = document.querySelector('#bsImage');
    bsImage.innerHTML = '';
    const bsRightIng = document.querySelector('#bsRightIng');
    bsRightIng.innerHTML = '';
    const bsRightRecipe = document.querySelector('#bsRightRecipe');
    bsRightRecipe.innerHTML = '';
    const bottomSection = document.querySelector('#bottomSection');
    bottomSection.classList.remove('visible');
}