let count = 0;
document.addEventListener("DOMContentLoaded", contentLoaded);

async function contentLoaded(){
    const addButton = document.getElementById("add-button");
    const prioritySelector = document.getElementById("priority-selector");
    const counter = document.getElementById("counter");
    const sortButton = document.getElementById("sort-button");
    const list = document.getElementById("mission-list");
    const mission = document.getElementById("text-input");
    addButton.addEventListener("click", addToViewSection);
    sortButton.addEventListener("click", sortTheMissions);
    let data = [];
    data =  await updatePreviousData(data);
    console.log(data);
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
        localStorage.setItem(count, JSON.stringify(missionData));


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
    
        const timeFixed = getSQLFormat(itemData.date)
        toDoText.innerText = itemData.text;
        toDoCreatedAt.innerText = timeFixed;
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

    async function updatePreviousData(dataArr){
        for (const key in localStorage) {
            if (Object.hasOwnProperty.call(localStorage, key)) {
                const element = JSON.parse(localStorage[key]);
                dataArr.push(element);
                createList(element);
            }
        }
        return dataArr;
        // const response = await fetch("https://api.jsonbin.io/b/6012904388655a7f320e6cd9");
        // const text = await response.json();
        // for (const input of text) {
        //     dataArr.push(input);
        // }
        // for (const dataObj of dataArr) {
        //     createList(dataObj);
        // }
        // return dataArr;
    }
}

function getSQLFormat(time){
    let currentTime = new Date(time);
    return currentTime.toLocaleDateString() + " " + currentTime.toLocaleTimeString() ;
}

