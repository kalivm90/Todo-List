export const storageController = (() => {
    const storage = window.localStorage

    // storage.clear()

    const addProject = (item) => {
        storage.setItem("project", 
            JSON.stringify(item) 
        )
    }

    const removeProject = (item) => {
        const project = JSON.parse(localStorage.getItem("project"))
        const newLocal = project.filter(i => i.name != item)
        addProject(newLocal)
    }

    const addNotes = (item, current) => {
        const project = JSON.parse(localStorage.getItem('project'))
        for (let i = 0; i < project.length; i++) {
            if (typeof(current) === "object" && project[i].name === current.name) {
                let note = project[i].notes 
                note.push(item)
                addProject(project)
            }
        }
    };

    const _currentObj = (current) => {
        if (typeof(current) === "object") return true
        return false;
    }

    return {addProject, addNotes, removeProject};
})();