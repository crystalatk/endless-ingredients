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
    const tsRecipeList = document.querySelector('#tsRecipeList');
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
    eventListener(searchButton, ingInput);
};


function eventListener(element, input) {
    element.addEventListener('click', function(event) {
        event.preventDefault();
        emptyRecipeList();
        const userInput = input.value;
        get(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${userInput.toLowerCase()}`, fillRecipeList)

    });

}

function fillRecipeList(apiRecipeList) {
    const tsRecipeList = document.querySelector('#tsRecipeList');
    console.log(apiRecipeList);
    apiRecipeList.meals.forEach(function(recipe) {
        const li = document.createElement('li');
        li.innerHTML = recipe.strMeal;
        li.id = recipe.idMeal;
        const img = document.createElement('img');
        img.src = recipe.strMealThumb;
        li.appendChild(img);
        tsRecipeList.appendChild(li);
    })
}

function emptyRecipeList() {
    const tsRecipeList = document.querySelector('#tsRecipeList');
    tsRecipeList.innerHTML = '';
}