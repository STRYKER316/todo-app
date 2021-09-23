# imports
from flask import Flask, render_template, request, redirect, url_for, jsonify, abort
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
import sys


# create an app with the name of the current module, set its configs
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = "postgresql://postgres:postgres@localhost:5432/todo_app"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# create an instance of the SQLAlchemy class and link it to the app
db = SQLAlchemy(app)

# create an instance of the Migrate class to manage database schema migrations for our flask app
migrate = Migrate(app, db)

# data model for the app
class Todo(db.Model):
    __tablename__ = 'todos'
    id = db.Column(db.Integer, primary_key = True)
    description = db.Column(db.String(), nullable = False)
    completed = db.Column(db.Boolean, nullable = False, default = False)

    def __repr__(self) -> str:
        return f"<id {self.id}: {self.description}>"


# Root route handler
@app.route('/')
def index():
    return render_template('index.html', todos = Todo.query.order_by('id').all())


# Route handler for creating a new Todo item
@app.route('/todos/create', methods=['POST'])
def createItem():
    # inititate a response body, an error flag
    body = {}
    error = False

    try:
        # get the input data for our new Todo item, which comes as JSON and fill out the responses body {}
        todoItemData = request.get_json()['description']
        body['description'] = todoItemData
        # create new record in the database
        newTodoItem = Todo(description = todoItemData)
        db.session.add(newTodoItem)
        db.session.commit()
    except:
        # if the transaction fails; update the error flag,rollback the db session and print out the error message
        error = True
        db.session.rollback()
        print(sys.exc_info)
    finally:
        db.session.close()
    
    # handle the error, if there is any or else send response body {} back to the client view
    if error:
        abort(400)
    else:
        return jsonify(body)


# Route handler to set the completed state of a Todo item
@app.route('/todos/<todo_id>/set-completed', methods = ['POST'])
def setCompletedState(todo_id):
    try:
        # get the 'completedState' value for the checkbox
        completedState = request.get_json()['checkboxState']
        # get the To-do item by the id and update its state
        todoItem = Todo.query.get(todo_id)
        todoItem.completed = completedState
        db.session.commit()
    except:
        print(sys.exc_info)
        db.session.rollback()
    finally:
        db.session.close()

    return redirect(url_for('index'))
