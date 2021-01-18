'use strict'

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

const apiIngList = get('https://www.themealdb.com/api/json/v1/1/list.php?i=list', fillInIngredientOptions);
console.log(apiIngList);


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


function eventListener(button, input) {

    button.addEventListener('click', function(event) {
        event.preventDefault();
        const userInput = input.value;
        get(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${userInput.toLowerCase()}`, fillRecipeList)

    });

}

function fillRecipeList(apiRecipeList) {
    const tsRecipeList = document.querySelector('#tsRecipeList');
    apiRecipeList.meals.forEach(function(recipe) {
        const li = document.createElement('li');
        const button = document.createElement('button');
        button.innerHTML = recipe.strMeal;
        button.id = recipe.idMeal;
        const img = document.createElement('img');
        img.src = recipe.strMealThumb;
        button.appendChild(img);
        li.appendChild(button);
        tsRecipeList.appendChild(li);
    })
}