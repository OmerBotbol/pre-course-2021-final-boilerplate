document.addEventListener("DOMContentLoaded", contentLoaded);
let count = 0;

function contentLoaded(){
    const addButton = document.getElementById("add-button");
    const prioritySelector = document.getElementById("priority-selector");
    const counter = document.getElementById("counter");
    const sortButton = document.getElementById("sort-button");
    addButton.addEventListener("click", addToViewSection);
    sortButton.addEventListener("click", sortTheMissions);
    counter.textContent = count + " TODOS";

    function addToViewSection(){
        //setting all the variables
        const mission = document.getElementById("text-input");
        const list = document.getElementById("mission-list");
        const container = document.createElement("div");
        const listItem = document.createElement("li");
        const toDoText = document.createElement("div");
        const toDoCreatedAt = document.createElement("div");
        const priority = document.createElement("div");

        //adding the variable's values and class
        toDoText.textContent = mission.value;
        toDoCreatedAt.textContent = getSQLFormat();
        priority.textContent = prioritySelector.value;
        container.setAttribute("class", "todo-container")
        priority.setAttribute("class", "todo-priority")
        toDoText.setAttribute("class", "todo-text")
        toDoCreatedAt.setAttribute("class", "todo-created-at")

        //appending the new variables to their spot
        container.append(priority);
        container.append(toDoCreatedAt);
        container.append(toDoText);
        listItem.append(container);
        list.append(listItem);

        //change the counter
        count++;
        counter.textContent = count + " TODOS";

        //empty the input section and focus on it
        mission.value = "";
        mission.focus();
    }


    function getSQLFormat(){
        return new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString() ;
    }

    function sortTheMissions(){
        
    }
}