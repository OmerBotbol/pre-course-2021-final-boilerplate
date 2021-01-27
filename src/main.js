document.addEventListener("DOMContentLoaded", contentLoaded);
let count = 0;

function contentLoaded(){
    const addButton = document.getElementById("add-button");
    const prioritySelector = document.getElementById("priority-selector");
    const counter = document.getElementById("counter");
    const sortButton = document.getElementById("sort-button");
    const list = document.getElementById("mission-list");
    addButton.addEventListener("click", addToViewSection);
    sortButton.addEventListener("click", sortTheMissions);
    counter.textContent = count + " TODOS";
    let data = [];

    function addToViewSection(){
        //setting all the variables
        const mission = document.getElementById("text-input");
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
        const missionData = {
            text: mission.value,
            time: getSQLFormat(),
            priority: prioritySelector.value
        };
        data.unshift(missionData);

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

    function sortTheMissions(){
        list.textContent = "";
        data.sort(function(a, b){
            if(a.priority > b.priority){
                return -1;
            }
            if(a.priority < b.priority){
                return 1;
            }
            return 0;
        });
        for (const orderedData of data) {
            createNewList(orderedData);
        }
    }
    
    function createNewList(itemData){
        const container = document.createElement("div");
        const listItem = document.createElement("li");
        const toDoText = document.createElement("div");
        const toDoCreatedAt = document.createElement("div");
        const priority = document.createElement("div");
    
        toDoText.innerText = itemData.text;
        toDoCreatedAt.innerText = itemData.time;
        priority.innerText = itemData.priority;
        container.setAttribute("class", "todo-container");
        priority.setAttribute("class", "todo-priority");
        toDoText.setAttribute("class", "todo-text");
        toDoCreatedAt.setAttribute("class", "todo-created-at");
        container.append(priority);
        container.append(toDoCreatedAt);
        container.append(toDoText);
        listItem.append(container);
        list.append(listItem);
    }
}

function getSQLFormat(){
    return new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString() ;
}
