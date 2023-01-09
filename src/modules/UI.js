/* needs more testing and local storage, sidebar hamburger needs to be finalized */
import "../assets/style.css";
import { createElements, toggleElement } from "../helpers";
import { Projects } from "./Projects.js";

import Magnify from "../assets/magnify.svg";
import Plus from "../assets/plus.svg";
import Box from "../assets/box.svg";

const Navbar = (() => {
    const nav = document.querySelector("nav");

    const load = () => {
        const menu = appendMenu();
        nav.appendChild(menu);
    };

    const appendMenu = () => {
        const menu = nav.querySelector(".menu");

        /* Hamburger Menu SVG */
        const i = createElements().tag("a", {"class": "nav-toggle"}, `
            <span class='bar'></span>
            <span class='bar'></span>
            <span class='bar'></span>`
        );

        /* Search Bar */
        const search = createElements().div({"class": "searchContainer"}, "<input class='form' id='search' type='text' placeholder='Search' autocomplete='off'>");

        /* Search SVG  */
        const j = createElements().image(Magnify, {"class": "svg", "id": "magnify"});
        
        search.appendChild(j);
        menu.appendChild(search);
        menu.appendChild(i);

        return menu;
    }
    return {load};
})();





const Sidebar = (() => {
    const sidebar = document.querySelector(".sidebar");
    let allProjects = Projects;
    let active = 0;

    const load = () => {
        /* DOM */ 
        const projects = _appendProjects();
        const projectForm = _addProjectForm();

        _animateHamburger();

        sidebar.appendChild(projects);
        sidebar.append(projectForm);
    };

    const _updateProjects = () => {
        document.querySelector(".project-container").remove();
        let reference = document.querySelector(".add-container");
        sidebar.insertBefore(_appendProjects(), reference);
    };
    
                    
    const _appendProjects = () => {
        const projectContainer = createElements().div({"class": "project-container"}, "");

        /* SINCE I WANTED TO USE A ICON IN THIS COMPONENT I HAD TO DO THIS ABORTION */
        for (let i = 0; i < allProjects.getProjects().length; i++) {
            const item = createElements().tag("button", {"class": "side-button", "id": "project-item"}, "");

            if (i === active) item.className += " active";

            // left container
            const left = createElements().div({"class": "left-container"}, "");
            const box = createElements().image(Box, {"class": "svg", "id" : "box"});
            const name = createElements().tag("span", {"id": "project-name"}, `${allProjects.getProjects()[i].name}`);

            left.appendChild(box);
            left.appendChild(name);
            item.appendChild(left);

            // right container 
            const right = createElements().div({"class": "right-container"}, "");
            const x = createElements().tag("p", {"id": "delete-project"}, "X");

            right.appendChild(x);
            item.appendChild(right);

            // delete project item when red X is clicked
            x.addEventListener("click", (e) => {
                const warning = createElements().tag("span", {"class": "warning", "id": "no-projects"}, "No projects, add one by clicking below");

                const projectName = e.target.parentElement.previousSibling.childNodes[1].textContent;
                
                allProjects.removeProject(projectName);
                item.remove();
                // Main.clearNotes();

                // if active project is the one thats deleted it will make sure the current project variable is changed
                const allButtons = document.querySelectorAll("#project-item");

                if (projectName === allProjects.getCurrentProject().name) {
                    if (allButtons.length >= 1) {
                        allProjects.setCurrentProject(allButtons[0].childNodes[0].childNodes[1].textContent)
                        setActive(0)
                        Main.clearNotes();
                        Main.load()
                    } else {
                        Main.clearNotes();
                    }
                }

                if (allProjects.getProjects().length === 0) {
                    Main.setTitle("No projects")
                    projectContainer.appendChild(warning);
                } else {
                    warning.remove();
                }

            })

            projectContainer.appendChild(item);
        }   

        const buttons = projectContainer.querySelectorAll("#project-item");
        _activeProject(buttons);
    
        return projectContainer;
    };

    
    const _addProjectForm = () => {
        const addContainer = createElements().div({"class": "add-container"}, "");

        /* ANOTHER EXAMPLE OF WEBPACK SUCKING ASS */
        const addButton = createElements().tag("button", {"class":"side-button", "id" : "add-project"}, "");
        const plusSVG = createElements().image(Plus, {"class": "svg", "id": "plus"});
        const addText = createElements().tag("span", {"id":"add-text"}, "Project");

        addButton.appendChild(plusSVG);
        addButton.appendChild(addText);
        addContainer.appendChild(addButton);


        const formContainer = createElements().div({"class": "form-container"}, 
        `   <input class='form' id='form-name' type='text' placeholder='Project Name'> 
            <div class='action-container'>
                <button class='form-button' id='submit'>Submit</button>
                <button class='form-button' id='cancel'>Cancel</button>
            </div>`
        );

        // add project click hides button and shows form
        addButton.addEventListener("click", () => {
            toggleElement(formContainer, "visible", "flex");
            toggleElement(addButton, "hidden", "none");
        });

        // cancel button hides form and shows button
        formContainer.querySelector("#cancel").addEventListener("click", (e) => {
            toggleElement(addButton, "visible", "flex");
            toggleElement(formContainer, "hidden", "none");
            e.target.parentElement.previousElementSibling.value = "";
        });

        // submit button creates new project and adds to list
        formContainer.querySelector("#submit").addEventListener("click", (e) => {
            const inputValue = formContainer.querySelector("#form-name");
    
            if (!inputValue.value) {
                let inputPlaceholder = e.target.parentElement.previousElementSibling;
                inputPlaceholder.placeholder = "Invalid or Duplicate";
                setInterval(() => {
                    inputPlaceholder.placeholder = "Project Name"
                }, 800);
            } else {
                allProjects.appendProject(inputValue.value);
                inputValue.value = "";
                _updateProjects();
                toggleElement(formContainer, "hidden", "none");
                toggleElement(addButton, "visible", "flex");
            }
        });

        addContainer.appendChild(formContainer);

        return addContainer;
    };

    const _animateHamburger = () => {
        let navToggle = document.querySelector('.nav-toggle');
        let bars = document.querySelectorAll('.bar');

        navToggle.addEventListener("click", () => {
            if (document.body.className === "") {
                _showSidebar();
                _toggleHamburger();
            } else {
                _hideSidebar();
                _toggleHamburger();
            }
        });

        function _toggleHamburger() {
            bars.forEach(bar => bar.classList.toggle('x'));
        };
    };

    const setActive = (value) => active = value;

    const getActive = () => {
        return sidebar.querySelectorAll("#project-item")[active];
    }

    // THIS FUNCTION CHANGES THE PROJECT IN MAIN
    // Activates selected project and updates global "active" vairable for remembering what button is active
    const _activeProject = (buttons) => {
        for (let i = 0; i < buttons.length; i++) {
            buttons[i].addEventListener("click", (e) => {

                // handles activating buttons
                if (document.getElementsByClassName("active")[0] === undefined) return;

                if (e.target.id === "delete-project") {
                    return
                } else {
                    let current = document.getElementsByClassName("active")[0];
                    current.className = current.className.replace(" active", "");
    
                    setActive(i);
    
                    buttons[i].className += " active"
    
                    // handles loading main and changing currentProject
                    const projectName = buttons[i].querySelector("#project-name").textContent
                    allProjects.setCurrentProject(projectName)
                    Main.load();
                }
            });
        };
    };

    const _showSidebar = () => {
        document.body.classList.add("show-sidebar");
        toggleElement(sidebar, "visible", "flex");
    };

    const _hideSidebar = () => {
        document.body.classList.remove("show-sidebar");
        toggleElement(sidebar, "hidden", "none");
    };

    return {load, setActive, getActive};

})();





const Main = (() => {
    const main = document.querySelector(".main");

    // container where main content is
    const mainContent = document.querySelector(".main-content");
    // add project button
    const button = document.querySelector("#add-todo");
    // popup form container
    const popupForm = document.querySelector(".notesFormContainer");
    // priority select options
    const select = document.querySelector("#priority");
    // cancel and submit buttons for add todo
    const formButtons = popupForm.querySelectorAll("button");
    // card container
    const cardContainer = document.querySelector(".card-container")

    const allProjects = Projects

    const load = () => {
        setTitle();
        _setPriorityColor(select.value, select);

        _loadNotes()


        formButtons.forEach(i => i.addEventListener("click", (e) => {
            if (e.target.id === "cancelNote") {
                _closeForm()
            } else if (e.target.id === "submitNote") {
                let title = document.querySelector("#titleField");
                let description = document.querySelector("#descriptionField");
                const selectValue = select.value;

                if (title.value === "") {
                    title.placeholder = "Please enter title";
                } else if (description.value === "") {
                    description.placeholder = "Please enter description."
                } else if (allProjects.getProjects().length === 0) {
                    console.warn("You cannnot submit a note without first having a valid project, nice try.")
                    title.value = ""
                    title.placeholder = "No project selected!"
                } else {
                    allProjects.addNote(title.value, description.value, selectValue);
                    resetFormFields();
                    _loadNotes();
                }
            }
        }));

        select.addEventListener("change", (e) => {
            _setPriorityColor(e.target.value, e.target);
        });

        button.addEventListener("click", (e) => {
            toggleElement(mainContent, "hidden", "none");
            toggleElement(popupForm, "visible", "flex");
        });
    };

    const _loadNotes = () => {
        cardContainer.innerHTML = "";

        const notes = allProjects.getNotes()

        notes.forEach(i => {
            cardContainer.appendChild(_createCards(i.title, i.description, i.priority, i.date))
        });

        const deleteButton = cardContainer.querySelectorAll("#card-delete");


        deleteButton.forEach(i => {
            i.addEventListener("click", e => {
                let container = i.parentElement
                const title = container.children[0].children[0].textContent
                const description = container.children[1].textContent
                allProjects.removeNote(title, description)
                e.target.parentNode.remove()
            })
        })
    }

    const setTitle = (value=null) => {
        const title = document.querySelector(".main-title")
        if (value) {
            title.textContent = value
        } else {
            return title.textContent = `${Sidebar.getActive().childNodes[0].childNodes[1].textContent}`;
        }
    }

    const _setPriorityColor = (value, target=null) => {
        let elementBackgroundColor;
        let inlineBC;

        if (value === "Low") {
            elementBackgroundColor = inlineBC = "#add8e6"
        } else if (value === "Urgent") {
            elementBackgroundColor = inlineBC = "#ffcd66"
        } else if (value === "Critical") {
            elementBackgroundColor = inlineBC = "#fd3939"
        }

        if (target != null) {
            target.style.backgroundColor = elementBackgroundColor
        } else {
            return inlineBC
        }
    };

    const _closeForm = () => {
        toggleElement(mainContent, "visible", "flex");
        toggleElement(popupForm, "hidden", "none");
    }

    const resetFormFields = () => {
        const textFields = document.querySelectorAll(".field");
        textFields.forEach(i => i.value = "")
        _closeForm();
    }

    const clearNotes = () => {
        cardContainer.innerHTML = ""
    }

    const _createCards = (title, description, priority, date) => {

        const container = createElements().div({"class": "card-item"}, `
            <div class="td-container">
                <h2 id="card-title">${title}</h2>
                <p id="card-date">${date}</p>
            </div>
            <p id="card-description">${description}</p>
            <p id="card-priority" style="background-color: ${_setPriorityColor(priority)}">${priority}</p>
            <button class="card-button" id="card-delete">Delete</button>
        `)


        return container
    }

    return {load, clearNotes, setTitle};
})()








const Footer = (() => {
    const foot = document.querySelector("footer");

    const load = () => {
        return foot;
    };

    return {load};
})();


export const displayController = (() => {

    const loadPage = () => {
        Navbar.load();
        Sidebar.load();
        Main.load();
    };

    return {loadPage};
})();

