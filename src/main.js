document.addEventListener("DOMContentLoaded", contentLoaded);
let count = 0;

function contentLoaded(){
    const addButton = document.getElementById("add-button");
    const prioritySelector = document.getElementById("priority-selector");
    addButton.addEventListener("click", addToViewSection);
    const counter = document.getElementById("counter");
    counter.textContent = count;

    function addToViewSection(){
        const mission = document.getElementById("text-input");
        const list = document.getElementById("mission-list");
        const container = document.createElement("div");
        const listItem = document.createElement("li");
        const toDoText = document.createElement("div");
        const toDoCreatedAt = document.createElement("div");
        const priority = document.createElement("div");
        toDoText.textContent = mission.value;
        toDoCreatedAt.textContent = getSQLFormat();
        priority.textContent = prioritySelector.value;
        container.setAttribute("class", "todo-container")
        priority.setAttribute("class", "todo-priority")
        toDoText.setAttribute("class", "todo-text")
        toDoCreatedAt.setAttribute("class", "todo-created-at")
        container.append(priority);
        container.append(toDoCreatedAt);
        container.append(toDoText);
        listItem.append(container);
        list.append(listItem);
        count++;
        counter.textContent = count;
        mission.value = "";
        mission.focus();
    }


    function getSQLFormat(){
        return new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString() ;
    }
}