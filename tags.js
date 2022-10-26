class Tags {
    constructor(name, missions = [])
    {
        //https://hallam.sci-toolset.com/api/#_tagcontroller

        this.name = name;
        this.missions = missions;
    }

    AddMission(mission){
        this.missions.push(mission);
    }

    RemoveMission(mission){
        this.missions.pop(mission);
    }


    EditTag (name, missons)
    {
        // 2.33.7. updateTag
        // PATCH /discover/api/v1/products/tags/{id}

        //getName and missions from onclick 
        //get new Name/Missons from textbox map clicks other functionality
        //write to array of tags

    }

    static deleteTag(tag){
        const name = tag.name;
        // console.log(name);

        for(let i = 0; i < tags.length; i++){
            if(tags[i].name == name){
                // console.log(name);
                tags.splice(i, 1);
            }
        }

        console.log(`Deleted tag ${name}`);
        Tags.SaveTags();
    }

    static populateTagsList(){
        const dropdown = document.getElementsByClassName("dropdown-content")[0];
        // dropdown-tag
        dropdown.innerHTML = "";

        if(tags.length > 0){
            document.getElementById("SelectTag").style.display = "flex";
        }

        for(let t of tags){
            let tagElem = document.createElement("a");
            tagElem.innerText = t.name;
            tagElem.onclick = (e) => {
                document.getElementById("EditTags").style.display = "flex";
                document.getElementById("DeleteButton").style.display = "flex";

                currentTag = Tags.getTagByName(e.target.innerText);
                console.log(currentTag);
                getFlightsByTagName(e.target.innerText);

                setHintText("Filtering by tag: " + e.target.innerText);
            }

            dropdown.appendChild(tagElem);
        }
    }

    static getTagByName(name){
        for(let t of tags){
            if(t.name == name){
                return t;
            }
        }
    }
    
    static SaveTags(){
        const tagsObj = { tags };
        console.log("saving tags");
        localStorage.setItem("savedTags", JSON.stringify(tagsObj));
        Tags.populateTagsList();
    }

    static LoadTags(){
        const tagsObj = JSON.parse(localStorage.getItem("savedTags"));
        // console.log("loading tags");

        let tagsArr = [];

        if(tagsObj){
            for(let t of tagsObj.tags){
                tagsArr.push(new Tags(t.name, t.missions));
            }
        }

        return tagsArr;
    }

    // SaveTag (tag)
    // {
    //     let tagName = tag.name;
    //     let selectedShapes = tag.missions;

    //     //localStorage.setItem("TagName", tagName);
    //     localStorage.setItem(tagName, selectedShapes);

    // }

    // RetrieveData(tagName){
    //     if(localStorage.tagName){
    //         localStorage.tagData = Array(localStorage.tagName);
    //         return tagData;
    //     }

    //     else{
    //         alert("That tag does not exist")
    //     }
    // }
}