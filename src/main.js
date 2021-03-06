document.addEventListener("DOMContentLoaded", contentLoaded);

function contentLoaded(){
    //getting all the elements from the HTML
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
    const searchInput = document.createElement("input"); //for searchForTask function
    const searchButton = document.createElement("button"); //for searchForTask function

    // EVENTS
    addButton.addEventListener("click", addToViewSection);
    sortButton.addEventListener("click", sortTheMissions);
    deleteAllButton.addEventListener("click", deleteAllTasks);
    viewSection.addEventListener("click", deleteTask);
    openSearch.addEventListener("click", openSearchTab);
    closeSearch.addEventListener("click", closeSearchTab);
    searchButton.addEventListener("click", searchForTask);
    list.addEventListener("dblclick", editOriginInput);
    list.addEventListener("click", switchImage);

    //setting start condition 
    let data = [];
    data = updatePreviousData(data);
    changeCounter();
    
    
    function addToViewSection(){ //adds new task to the to-do list
        if(data.length >= 17){
            alert("you reached the limit of missions. please delete other mission to add a new one");
            return;
        }
        if(mission.value === ""){
            alert("Please enter a word")
            return;
        }
        const missionData = {
            text: mission.value,
            date: new Date().getTime(),
            priority: prioritySelector.value,
            success: "x"
        };
        
        data.push(missionData);
        if(postToServer(data)){
            createList(missionData);
        } 

        //empty the input section and focus on it
        mission.value = "";
        mission.focus();
    }

    function sortTheMissions(){ //sorts the tasks in the to-do list by priority
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
    
    function createList(itemData){ //creates the element that goes in the view section and insert them
        const container = document.createElement("div");
        const listItem = document.createElement("li");
        const toDoText = document.createElement("div");
        const toDoCreatedAt = document.createElement("div");
        const priority = document.createElement("div");
        const deleteButton = document.createElement("button");
        const statusImage = document.createElement("img");
    
        const timeFixed = getSQLFormat(itemData.date);
        toDoText.innerText = itemData.text;
        toDoCreatedAt.innerText = timeFixed;
        priority.innerText = itemData.priority;
        deleteButton.innerText = "delete";
    
        container.setAttribute("class", "todo-container");
        priority.setAttribute("class", "todo-priority");
        toDoText.setAttribute("class", "todo-text");
        listItem.setAttribute("class", colorChanger(itemData.priority));
        toDoCreatedAt.setAttribute("class", "todo-created-at");
        deleteButton.setAttribute("class", "delete-button");
        statusImage.setAttribute("class", "status-image");
        if(itemData.success === "x"){
            statusImage.setAttribute("src", "../pics/x-image.png");
        }
        else{
            statusImage.setAttribute("src", "../pics/v-image.png");
        }
        container.append(statusImage);
        container.append(priority);
        container.append(toDoCreatedAt);
        container.append(toDoText);
        listItem.append(container);
        listItem.append(deleteButton);
        list.append(listItem);
        changeCounter();
    }

     function updatePreviousData(dataArr){ //gets the data that stack in JSONbin
        fetch("https://api.jsonbin.io/v3/b/6012c1bc6bdb326ce4bc687f/latest").then((response) => {
            response.json().then((json)=> {
                const text = json.record;
                for (const input of text["my-todo"]) {
                    dataArr.push(input);
                }
                const loader = document.getElementById("loader");
                loader.setAttribute("hidden", true);
                for (const dataObj of dataArr) {
                    createList(dataObj);
                }
            });
        })
        return dataArr;
    }

    function postToServer(dataArr){ //updates the data in the JSONbin
        const loader = document.getElementById("loader");
        list.setAttribute("hidden", true);
        loader.removeAttribute("hidden");
        const objForServer = {
            "my-todo": dataArr
        };
        return fetch("https://api.jsonbin.io/v3/b/6012c1bc6bdb326ce4bc687f", {
            method: 'PUT',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify(objForServer)
          }).then(()=>{
            loader.setAttribute("hidden", true);
            list.removeAttribute("hidden");
            return true;
          }).catch(()=>{
            alert("there is something wrong. please try again later");
          });
    }

    function deleteTask(event){  //deletes one task 
        const target = event.target.closest(".delete-button");
        let updatedData = [];
        if(target !== null){
            const deletedMission = event.target.closest("li");
            const deletedName = deletedMission.getElementsByClassName("todo-text")[0].innerText;
            for (const mission of data) {
                if(mission.text !== deletedName){
                    updatedData.push(mission);
                }
            }
            data = updatedData;
            if(postToServer(data)){
                deletedMission.remove();
                changeCounter();
            }
        }
    }

    function deleteAllTasks(){ //delete all the tasks
        if(postToServer([])){
            data = [];
            list.innerText = "";
            changeCounter();
        }
    }

    function changeCounter(){ //counter
        let count = data.length;
        counter.textContent = count;
    }

    function openSearchTab(){
        const searchBox = document.getElementById("search-box");
        searchInput.setAttribute("id", "search-input");
        searchInput.setAttribute("type", "text");
        searchButton.setAttribute("id", "search-button");
        searchButton.innerText = "Search";
        openSearch.style.display = "none";
        closeSearch.removeAttribute("style");
        searchBox.append(searchInput);
        searchBox.append(searchButton);
    }

    function closeSearchTab(){
        const searchInput = document.getElementById("search-input");
        const searchButton = document.getElementById("search-button");
        searchInput.remove();
        searchButton.remove();
        closeSearch.style.display = "none";
        openSearch.removeAttribute("style");
        const allText = document.getElementsByClassName("highlight");
        for (const classes of allText) {
            if(classes.className.includes("highlight")){
                classes.className = "todo-text";
            }
        }
    }

    function searchForTask(){
        const allText = document.getElementsByClassName("todo-text");
        for (const mission of allText) {
            if(mission.className.includes("highlight")){
                mission.classList.remove("highlight")
            }
            if(mission.innerText.includes(searchInput.value)){
                mission.className += " highlight";
            }
        }
    }

    function editOriginInput(event){
        const target = event.target;
        const targetText = target.closest(".todo-text");
        const targetPriority = target.closest(".todo-priority");
        const editDiv = document.createElement("div");
        const editButton = document.createElement("button");
        const header = document.createElement("h3");
        editDiv.append(header);
        const createType = target.className;
        if(createType === "todo-text"){
            const editText = document.createElement("input");
            editText.setAttribute("type", "text");
            editText.setAttribute("id", "edit-input");
            editText.setAttribute("placeholder", "Enter the mission here");
            editDiv.append(editText);
        } else if(createType === "todo-priority"){
            const editSelect = document.createElement("select");
            for (let i = 1; i <= 5; i++) {
                const option = document.createElement("option");
                option.setAttribute("value", i);
                option.innerText = i;
                editSelect.append(option);
            }
            editSelect.setAttribute("id", "edit-input");
            editDiv.append(editSelect);
        } else {
            return;
        }

        editDiv.setAttribute("id", "edit-div");
        editButton.setAttribute("id", "edit-button");
        editButton.innerText = "Edit";
        header.innerText = "Edit"
        editDiv.append(editButton);
        viewSection.append(editDiv);
        editButton.addEventListener("click", () => {
            let editInput = document.getElementById("edit-input");
            if(targetText){
                let timeOfChanged = targetText.previousSibling.innerText;
                changeDataByTime(timeOfChanged, editInput.value, "text")
                targetText.innerText = editInput.value;
            }
            else{
                let timeOfChanged = targetPriority.nextSibling.innerText;
                changeDataByTime(timeOfChanged, editInput.value, "priority")
                targetPriority.innerText = editInput.value;
                target.closest("li").setAttribute("class", colorChanger(editInput.value))
            }
            editDiv.remove();
        });
    }


    function switchImage(event){
        const target = event.target.closest(".status-image");
        if (target){
            const currentStatus = target.getAttribute("src");
            let timeOfChanged = target.nextSibling.nextSibling.innerText;
            if(currentStatus === "../pics/x-image.png"){
                target.setAttribute("src", "../pics/v-image.png");
                changeDataByTime(timeOfChanged, "v", "success");
            }
            else{
                target.setAttribute("src", "../pics/x-image.png");
                changeDataByTime(timeOfChanged, "x", "success");
            }
        }
    }

    function changeDataByTime(setTime, newInput, prop){
        if(postToServer(data)){
            for (const mission of data) {
                if(getSQLFormat(mission.date) === setTime){
                    mission[prop] = newInput;
                }
            }
            postToServer(data);
        }
    }

}

function getSQLFormat(time){ //sets the date in SQL format
    let currentTime = new Date(time);
    return currentTime.toLocaleDateString() + " " + currentTime.toLocaleTimeString();
}

function colorChanger(priorityLevel){ //change the class of element by his priority
    if(priorityLevel <= 2){
        return "good";
    } else if(priorityLevel === "3"){
        return "mid";
    } else {
        return "bad";
    }

}