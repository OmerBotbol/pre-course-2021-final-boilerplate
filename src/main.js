let count = 0;
document.addEventListener("DOMContentLoaded", contentLoaded);

async function contentLoaded(){
    const addButton = document.getElementById("add-button");
    const prioritySelector = document.getElementById("priority-selector");
    const counter = document.getElementById("counter");
    const sortButton = document.getElementById("sort-button");
    const list = document.getElementById("mission-list");
    const mission = document.getElementById("text-input");
    const viewSection = document.getElementById("view-section");
    addButton.addEventListener("click", addToViewSection);
    sortButton.addEventListener("click", sortTheMissions);
    viewSection.addEventListener("click", deleteTask);
    let data = [];
    data =  await updatePreviousData(data);
    count = data.length
    counter.textContent = count;
    
    
    function addToViewSection(){
        const currentTime = new Date().getTime();
        const missionData = {
            text: mission.value,
            date: currentTime,
            priority: prioritySelector.value
        };
        
        data.push(missionData);
        createList(missionData);
        let objForServer = {
            "my-todo": data
        }
        postToServer(JSON.stringify(objForServer));

        //change the counter
        count++;
        counter.textContent = count;

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
        let response = await fetch("https://api.jsonbin.io/v3/b/6012c1bc6bdb326ce4bc687f", {
            method: 'PUT',
            headers: {
            'Content-Type': 'application/json',
            },
            body: dataArr
          });
    }

    function deleteTask(event){
        const target = event.target.closest("button");
        let updatedData = [];
        if(target !== null){
            const deletedMission = event.target.closest("div");
            const deletedName = deletedMission.getElementsByClassName("todo-text")[0].innerText;
            for (const mission of data) {
                console.log(mission.text !== deletedName);
                if(mission.text !== deletedName){
                    updatedData.push(mission);
                }
            }
            deletedMission.remove();
            data = updatedData;
            let objForServer = {
                "my-todo": data
            }
            postToServer(JSON.stringify(objForServer));
        }
    }
}

function getSQLFormat(time){
    let currentTime = new Date(time);
    return currentTime.toLocaleDateString() + " " + currentTime.toLocaleTimeString() ;
}
