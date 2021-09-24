/********** AJAX request feature to a add new To-do item to the list asynchronously  **********/

const descriptionInputElement = document.getElementById('description');
// prevent deafualt form submission action and send a fetch request
document.getElementById('todo-form').onsubmit = function(event) {
    event.preventDefault();
    // extract the input text from the element, then empty the text input
    const descriptionValue = descriptionInputElement.value;
    descriptionInputElement.value = '';

    // implement a fetch routine to send an Async POST request to the form submission path
    fetch('todos/create', {
        method: 'POST',
        body: JSON.stringify({
            'description': descriptionValue
        }),
        headers: {
            'Content-type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(jsonResoponse => {
        // log the jsonResponse for debugging purposes
        console.log("Response:", jsonResoponse);

        // create a new <li> element for the new To-do item
        const liElement = document.createElement('li');
        // create a new checkbox for the To-do item
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'check-box';
        checkbox.setAttribute('data-id', jsonResoponse.id);
        liElement.appendChild(checkbox);
        // Add description to our new to-do item
        const descriptionText = document.createTextNode(' ' + jsonResoponse.description + ' ');
        liElement.appendChild(descriptionText);
        // create a delete button for the To-do item
        const delButton = document.createElement('button');
        delButton.className = 'delete-button';
        delButton.setAttribute('data-id', jsonResoponse.id);
        delButton.innerHTML = '&cross;'
        liElement.appendChild(delButton);
        // finally, add the overall new <li> element to our To-do list
        document.getElementById('todo-list').appendChild(liElement)
    })
    .catch(function(err) {
        console.log(err)
        document.getElementById('error').className = '';
    })
}


/********** Updating the completed state of the To-do items **********/

const checkboxes = document.querySelectorAll('.check-box');
// loop through all the checkboxes to detect their state change
for (let i = 0; i < checkboxes.length; ++i) {
    const checkbox = checkboxes[i];
    checkbox.onchange = function(event) {
        console.log('Event', event);
        // get the current 'checked' state and the id of the checkbox
        const completedState = event.target.checked;
        const todo_id = event.target.dataset['id'];
        console.log(completedState, todo_id);

        // make a fetch routine to update the completed state of the To-do item in our database
        fetch('/todos/set-completed/' + todo_id, {
            method: 'POST',
            body: JSON.stringify({
                'checkboxState': completedState
            }),
            headers: {
                'content-type' : 'application/json'
            }
        })
        .then( () => console.log("completed-state change successful"))
        .catch( () => document.getElementById('error').className = '')
    }
}


/**********  Deleting a To-do item **********/

const delButtons = document.querySelectorAll('.delete-button');
// loop through all the delete buttons to detect click events on them
for (let j = 0; j < delButtons.length; ++j) {
    const delButton = delButtons[j];
    delButton.onclick = function(event) {
        console.log("Event", event);

        // get the id of the To-do item for which the delete button was clicked
        const todo_id = event.target.dataset['id'];
        // make a fetch routine to delete the To-do item
        fetch('/todos/delete/' + todo_id, {
            method: 'DELETE'
        })
        .then( () => {
            // on successful response, remove the To-do item from DOM
            const item = event.target.parentElement;
            item.remove();
        })
        .catch(() => document.getElementById('error').className = '')
    }
}
