'use strict';


// Our api fetch function
function get(url, functionToDo) {
    return fetch(url)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            const returnFromFunction = functionToDo(data);
            return returnFromFunction;

        })
        .catch(function(error) {
            console.error("ERROR:", error);
            return error;
        });
}

// Global Scope: Iify!
(async function() {
    const apiIngList = get('https://www.themealdb.com/api/json/v1/1/list.php?i=list', topSection);
    const arrowRt = document.querySelector('#arrowRt');
    eventlistener(arrowRt);
    eventListenerCloseModalDS();
})();


// Drink Recipe Functions
function eventlistener(button) {
    button.addEventListener('click', function(event) {
        event.preventDefault();
        emptyDrink();
        get('https://www.thecocktaildb.com/api/json/v1/1/random.php', fillInDrinkOptions)
    });
}

function emptyDrink() {
    const tsDrinkList = document.querySelector('#tsDrinkList');
    tsDrinkList.innerHTML = '';
}

function fillInDrinkOptions(apiDrink) {
    const tsDrinkList = document.querySelector("#tsDrinkList");
    const pCreate = document.createElement('p');
    pCreate.innerHTML = apiDrink.drinks[0].strDrink;
    const imgDrink = document.createElement('img');
    imgDrink.src = apiDrink.drinks[0].strDrinkThumb;
    pCreate.appendChild(imgDrink);
    tsDrinkList.appendChild(pCreate);
    eventListenerCardDS(apiDrink);
}

function eventListenerCloseModalDS() {
    const dsCloseModalButton = document.querySelector('#dscloseModal');
    dsCloseModalButton.addEventListener('click', function (event) {
        event.preventDefault();
        const modal = document.querySelector('#dsModal');
        modal.classList.remove('visibleds');
    });
}

function eventListenerCardDS(drink) {
    const tsDrinkList = document.querySelector('#tsDrinkList');
    tsDrinkList.addEventListener('click', function(event) {
        event.preventDefault();
        console.log("This is here: Clicked!", drink);
        createDrinkRecipeModal(drink);
    });
}

function clearModal() {
    clearHTML('dsHeaderModal');
    clearHTML('dsImage');
    clearHTML('dsIng');
    clearHTML('dsRecipe');
}

function clearHTML (id) {
    const idSelected = document.querySelector(`#${id}`);
    idSelected.innerHTML = '';
}

function emptyDrinkList() {
    const dsDrinkList = document.querySelector('#tsDrinkList');
    dsDrinkList.innerHTML = '';
}

function createDrinkRecipeModal(recipe) {
    clearModal();
    createNewElement('dsHeaderModal', 'h1', 'innerHTML', recipe, 'strDrink');
    createNewElement('dsImage', 'img', 'src', recipe, 'strDrinkThumb');
    createNewElement('dsRecipe', 'p', 'innerHTML', recipe, 'strInstructions');
    createModalIng(recipe);
    const dsModal = document.querySelector('#dsModal');
    dsModal.classList.add('visibleds');
}

function createNewElement (currElement, newElement, property, recipe, key) {
    const currElementSelected = document.querySelector(`#${currElement}`);
    const newElementSelected = document.createElement(`${newElement}`);
    newElementSelected[property] = recipe.drinks[0][key];
    currElementSelected.appendChild(newElementSelected);
    console.log(currElementSelected);
}

function createModalIng(recipe) {
    const dsIng = document.querySelector('#dsIng');
    const ul = document.createElement('ul');
    dsIng.appendChild(ul);
    const ingredients = [];
    const measures = [];
    for (let key in recipe.drinks[0]) {
        if (key.includes('strIngredient') && recipe.drinks[0][key]) {
            ingredients.push(recipe.drinks[0][key]);
        }
        if (key.includes('strMeasure') && recipe.drinks[0][key]) {
            measures.push(`${recipe.drinks[0][key]} `);
        }
    };
    const ingList = [];
    ingredients.forEach(function(ingredient, idx) {
        const li = document.createElement('li');
        li.innerHTML = measures[idx].concat(ingredient)
        ul.appendChild(li);
        ingList.push(measures[idx].concat(ingredient))
    });
}

// Top Section Functions:

// TS Ing Side:
function topSection(apiIngredients) {
    const apiListDatalist = document.querySelector("#apiListDatalist");
    fillInIngredientOptions(apiIngredients, apiListDatalist);
    const addAnotherIng = document.querySelector('#addAnotherIng');
    eventListenerAddIng(addAnotherIng, apiIngredients);
    const searchButton = document.querySelector("#searchButton");
    eventListenerInput(searchButton);
}

function fillInIngredientOptions(apiIngredients, datalist) {
    apiIngredients.meals.forEach(function(ingredient) {
        const option = document.createElement('option');
        option.value = ingredient.strIngredient;
        datalist.appendChild(option);
    });

};

function eventListenerAddIng(element, apiIngredients) {
    element.addEventListener('click', function(event) {
        event.preventDefault();
        const inputBox = document.querySelectorAll('.input');
        const inputBoxLength = inputBox.length;
        if (inputBoxLength === 2) {
            element.classList = 'hidden';
            createNewIngInput(inputBoxLength, apiIngredients);
        } else if (inputBoxLength < 3) {
            createNewIngInput(inputBoxLength, apiIngredients)
        } 
    })
}

function createNewIngInput(inputBoxLength, apiIngredients) {
    const newDLID = `apiListDatalist${inputBoxLength +1}`;
    const newDiv = document.createElement('div');
    const newInput = document.createElement('input');
    newInput.classList.add('input');
    newInput.placeholder = 'Your ingredient...';
    newInput.setAttribute('list', newDLID);
    newInput.setAttribute('id', `ingInput${inputBoxLength+1}`);
    const removeButton = document.createElement('button');
    removeButton.classList.add('removeInput');
    removeButton.setAttribute('type', 'submit');
    removeButton.innerHTML = 'x';
    const newDatalist = document.createElement('datalist');
    newDatalist.id = newDLID;
    fillInIngredientOptions(apiIngredients, newDatalist);
    const ingInputSection = document.querySelector('#ingInputSection');
    newDiv.appendChild(newInput);
    newDiv.appendChild(removeButton);
    newDiv.appendChild(newDatalist);
    ingInputSection.appendChild(newDiv);
    eventListenerRemoveInput(newDiv, removeButton);
}

async function eventListenerInput(element) {
    element.addEventListener('click', async function(event) {
        event.preventDefault();
        emptyRecipeList();
        const tsRecipeNoResults = document.querySelector('#tsRecipeNoResults');
        tsRecipeNoResults.classList.add('hidden');
        const recipeIDs = await compareRecipes();
        await getRecipeFromIds(recipeIDs)
        const tsRecipeSection = document.querySelector('#tsRecipeSection');
        tsRecipeSection.classList.remove('hidden');
        const recipeCards = document.querySelectorAll('.tsRecipeList--card');
        const topSection = document.querySelector('#topSection');
        topSection.classList.add('grid');
        eventListenerCard(recipeCards);
    });
}

function eventListenerRemoveInput(element, button) {
    button.addEventListener('click', function(event) {
        event.preventDefault();
        element.remove();
        const addAnotherIng = document.querySelector('#addAnotherIng');
        addAnotherIng.classList.remove('hidden');
    })
}

async function compareRecipes() {
    const inputList = document.querySelectorAll('.input');
    let allInputIds = [];
    const inputListLength = inputList.length;
    for (let i = 0; i < inputListLength; i++) {
        const input = inputList[i];
        const userInput = input.value;
        const recipesIDList = await get(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${userInput.toLowerCase()}`, getRecipeIds);
        allInputIds.push(recipesIDList);
    };
    allInputIds = allInputIds.flat();
    const allInputIdsLength = allInputIds.length;
    const allIDsObj = {};
    let recipeIDsThatMatch = [];
    if (inputListLength === 1 ){
        recipeIDsThatMatch = allInputIds;
    } else {
        for (let i=0; i < allInputIdsLength; i++) {
            const mealID = allInputIds[i];
            if (allIDsObj[mealID]) {
                if (allIDsObj[mealID] === inputListLength -1) {
                    recipeIDsThatMatch.push(mealID);
                } else {
                    allIDsObj[mealID]++;
                } 
            } else {
                allIDsObj[mealID] = 1;
            }
        }
    }
    return recipeIDsThatMatch;
}

function getRecipeIds(recipes) {
    const recipesIDList = [];
    recipes.meals.forEach(function(recipe) {
        recipesIDList.push(recipe.idMeal);
    });
    return recipesIDList;
}

async function getRecipeFromIds (recipesIDList) {
    const recipeIdListLength = recipesIDList.length;
    if (recipeIdListLength === 0) {
        const tsRecipeNoResults = document.querySelector('#tsRecipeNoResults');
        tsRecipeNoResults.classList.remove('hidden');
    } else {
        for (let i = 0; i < recipeIdListLength; i++) {
            const id = recipesIDList[i];
            await get(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`, fillRecipeList);
        };
        get(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${recipesIDList[0]}`, fillBottomSection)
        const modalClass = document.querySelector('.modal');
        modalClass.classList.add('bsRecipeFill');
        const bottomSection = document.querySelector('#bottomSection');
        bottomSection.classList.add('bsRecipeFill');
    }
    return;
}

function fillRecipeList (apiRecipe) {
    const recipe = apiRecipe.meals[0];
    const tsRecipeList = document.querySelector('#tsRecipeList');
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
}



// TS Recipe Side:
function emptyRecipeList() {
    const tsRecipeList = document.querySelector('#tsRecipeList');
    tsRecipeList.innerHTML = '';
}

function eventListenerCard(array) {
    array.forEach(function(item) {
        item.addEventListener('click', function(event) {
            event.preventDefault();
            emptyBottomSection();
            const recipeId = item.id;
            get(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${recipeId}`, fillBottomSection);
            makeBottomSectionVisible();
        })
    })
}


// Bottom Section(modal):
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
    for (let key in recipe.meals[0]) {
        if (key.includes('strIngredient') && recipe.meals[0][key]) {
            ingredients.push(recipe.meals[0][key]);
        }
        if (key.includes('strMeasure') && recipe.meals[0][key]) {
            measures.push(`${recipe.meals[0][key]} `);
        }
    };
    const ingList = [];
    ingredients.forEach(function(ingredient, idx) {
        const li = document.createElement('li');
        li.innerHTML = measures[idx].concat(ingredient)
        ul.appendChild(li);
        ingList.push(measures[idx].concat(ingredient))
    });
    const ingList2 = {};
    ingredients.forEach((ingredient, i) => ingList2[ingredient] = measures[i]);
    const recipePara = document.createElement('p');
    recipePara.innerHTML = recipe.meals[0].strInstructions;
    const bsRightRecipe = document.querySelector('#bsRightRecipe');
    bsRightRecipe.appendChild(recipePara);
    eventListenerCloseModal(bottomSection);
}

function makeBottomSectionVisible(){
    const bottomSection = document.querySelector('#bottomSection');
    bottomSection.classList.add('visible');
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
}