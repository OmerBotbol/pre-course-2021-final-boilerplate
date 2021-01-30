let count = 0;
document.addEventListener("DOMContentLoaded", contentLoaded);

async function contentLoaded(){
    const addButton = document.getElementById("add-button");
    const prioritySelector = document.getElementById("priority-selector");
    const counter = document.getElementById("counter");
    const sortButton = document.getElementById("sort-button");
    const deleteAllButton = document.getElementById("delete-all-button");
    const list = document.getElementById("mission-list");
    const mission = document.getElementById("text-input");
    const viewSection = document.getElementById("view-section");
    const openSearch = document.getElementById("closed");
    const closeSearch = document.getElementById("opened");
    addButton.addEventListener("click", addToViewSection);
    sortButton.addEventListener("click", sortTheMissions);
    deleteAllButton.addEventListener("click", deleteAllTasks);
    viewSection.addEventListener("click", deleteTask);
    openSearch.addEventListener("click", openSearchTab);
    closeSearch.addEventListener("click", closeSearchTab);
    let data = [];
    data =  await updatePreviousData(data);
    count = data.length
    changeCounter(count);
    
    
    function addToViewSection(){
        if(data.length >= 17){
            alert("you reached the limit of missions. please delete other mission to add a new one");
            return;
        }

        const currentTime = new Date().getTime();
        const missionData = {
            text: mission.value,
            date: currentTime,
            priority: prioritySelector.value
        };
        
        data.push(missionData);
        createList(missionData);
        postToServer(data);

        //change the counter
        count++;
        changeCounter(count);

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
            createList(orderedData);
        }
    }
    
    function createList(itemData){
        const container = document.createElement("div");
        const listItem = document.createElement("li");
        const toDoText = document.createElement("div");
        const toDoCreatedAt = document.createElement("div");
        const priority = document.createElement("div");
        const deleteButton = document.createElement("button");
    
        const timeFixed = getSQLFormat(itemData.date)
        toDoText.innerText = itemData.text;
        toDoCreatedAt.innerText = timeFixed;
        priority.innerText = itemData.priority;
        deleteButton.innerText = "delete"    
    
        container.setAttribute("class", "todo-container");
        priority.setAttribute("class", "todo-priority");
        toDoText.setAttribute("class", "todo-text");
        listItem.setAttribute("class", colorChanger(itemData.priority));
        toDoCreatedAt.setAttribute("class", "todo-created-at");
        deleteButton.setAttribute("class", "delete-button");
        container.append(priority);
        container.append(toDoCreatedAt);
        container.append(toDoText);
        container.append(deleteButton);
        listItem.append(container);
        list.append(listItem);
    }

    async function updatePreviousData(dataArr){
        let response = await fetch("https://api.jsonbin.io/v3/b/6012c1bc6bdb326ce4bc687f/latest");
        const textObj = await response.json();
        const text = textObj.record;
        for (const input of text["my-todo"]) {
            if(input !== "empty"){
                dataArr.push(input);
            }
        }
        for (const dataObj of dataArr) {
            createList(dataObj);
        }
        return dataArr;
    }

    async function postToServer(dataArr){
        const objForServer = {
            "my-todo": dataArr
        }
        let response = await fetch("https://api.jsonbin.io/v3/b/6012c1bc6bdb326ce4bc687f", {
            method: 'PUT',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify(objForServer)
          });
    }

    function deleteTask(event){
        const target = event.target.closest("button");
        let updatedData = [];
        if(target !== null){
            const deletedMission = event.target.closest("div");
            const deletedName = deletedMission.getElementsByClassName("todo-text")[0].innerText;
            for (const mission of data) {
                if(mission.text !== deletedName){
                    updatedData.push(mission);
                }
            }
            deletedMission.remove();
            count--;
            changeCounter(count);
            data = updatedData;
            postToServer(data);
        }
    }

    function deleteAllTasks(){
        data = [];
        postToServer(data);
        list.innerText = "";
        count = 0;
        changeCounter(count);
    }

    function changeCounter(counting){
        counter.textContent = counting;
    }

    function openSearchTab(){
        const searchBox = document.getElementById("search-box");
        const searchInput = document.createElement("input");
        const searchButton = document.createElement("button");
        searchInput.setAttribute("id", "search-input");
        searchInput.setAttribute("type", "text");
        searchButton.setAttribute("id", "search-button");
        searchButton.innerText = "Search";
        openSearch.style.display = "none"
        closeSearch.removeAttribute("style")
        searchBox.append(searchInput);
        searchBox.append(searchButton);
    }

    function closeSearchTab(){
        const searchBox = document.getElementById("search-box");
        const searchInput = document.getElementById("search-input");
        const searchButton = document.getElementById("search-button");
        searchInput.remove();
        searchButton.remove();
        closeSearch.style.display = "none"
        openSearch.removeAttribute("style")
    }

}

function getSQLFormat(time){
    let currentTime = new Date(time);
    return currentTime.toLocaleDateString() + " " + currentTime.toLocaleTimeString() ;
}

function colorChanger(priorityLevel){
    if(priorityLevel <= 2){
        return "good";
    } else if(priorityLevel === "3"){
        return "mid";
    } else {
        return "bad";
    }

}