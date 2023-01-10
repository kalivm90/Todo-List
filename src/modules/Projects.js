import { compareAsc, format } from "date-fns";
import { storageController } from "./Storage";

class FormatDate {
    formatDate(vairable) {
        vairable = format(new Date(), "MM-dd-yy")
        return vairable
    }
}

class Project extends FormatDate {
    constructor(name, date=null) {
        super();
        this.name = this._toTitleCase(name);
        this.date = this.formatDate(date);
        this.notes = [];
    };

    _toTitleCase(name) {
        name = name.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();})
        return name
    }
};



class Note extends FormatDate {
    constructor(
        title = "None", 
        description = "None", 
        priority = "Mild",
        date = null, 
    ) {
        super();
        this.title = title;
        this.description = description;
        this.priority = priority;
        this.date = this.formatDate(date)
    }
}



/* Handles all projects and notes */
export const Projects = (() => {
    let projectList = [];
    let currentProject;


    /* PROJECTS */
    const appendProject = (name, date) => {
        const item = new Project(name, date)

        const index = projectList.findIndex(object => object.name === item.name);
        if (index === -1) {
            projectList.push(item);
            storageController.addProject(projectList)
        } else {
            return false
        };

        return item
    }

    const removeProject = (item) => {
        let index = projectList.findIndex(obj => obj.name === item);
        projectList[index].notes.splice(0, projectList[index].notes.length)
        projectList.splice(index, 1)
        storageController.removeProject(item)
    };

    const getProjects = () => {
        return projectList
    }

    const getCurrentProject = () => {
        return currentProject
    }

    const setCurrentProject = (value) => {
        let projects = getProjects();

        if (typeof(value) === "string") {
            for (let i in projects) {
                if (projects[i].name === value) {
                    currentProject = projects[i];
                }
            }
        } else {
            currentProject = value
        }
    }


    /* NOTES */

    const addNote = (title, description, priority, date=null) => {
        const note = new Note(title, description, priority)
        storageController.addNotes(note, getCurrentProject());
        getNotes().push(note)
        return note
    }
    
    const removeNote = (title, description) => {
        let projectNotes = getNotes()

        const index = getNotes().findIndex(i => i.title === title && i.description === description)
        projectNotes.splice(index, 1)
    }

    const getNotes = () => {
        const project = getProjects()
        if (typeof(getCurrentProject()) === "string") {
            for (let i in project) {
                if (project[i].name === getCurrentProject()) {
                    return project[i].notes
                }
            }
        }
        return getCurrentProject().notes
    }


    /* DEFINING DEAFULT PROJECTS+NOTES */

        // projects
    const defaultProject = appendProject("default", "date")
    setCurrentProject(defaultProject)
    const rand = appendProject("rand", "today")

        // notes
    const deafultNote = addNote("Test Note", "This is the default note. Please click the 'Add Todo' button to add your own!", "Low");
    const random = addNote("random", "nice", "Urgent");
    // window.localStorage.clear()


    return {
        appendProject, removeProject, getProjects, getCurrentProject, setCurrentProject,
        addNote, getNotes, removeNote
    };

})();