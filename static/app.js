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
        liElement.textContent = descriptionValue;
        document.getElementById('todo-list').appendChild(liElement)
    })
    .catch(function(err) {
        console.log(err)
        document.getElementById('error').className = '';
    })
}
