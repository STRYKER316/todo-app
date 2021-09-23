/********** Add AJAX request feature to update the list items asynchronously  **********/

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

        // create a new <li> element for the new item and append it to the Todo list
        const liElement = document.createElement('li');
        liElement.innerHTML = "<input type='checkbox'/>" + ' ' +  descriptionValue;
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
        fetch('/todos/' + todo_id + '/set-completed', {
            method: 'POST',
            body: JSON.stringify({
                'checkboxState': completedState
            }),
            headers: {
                'content-type' : 'application/json'
            }
        })
        .then(() => console.log("Complted-state change successful"))
        .catch(() => document.getElementById('error').className = '')
    }
}