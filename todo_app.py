# imports
from flask import Flask, render_template, request, redirect, url_for
from flask_sqlalchemy import SQLAlchemy


# create an app with the name of the current module, set its configs
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = "postgresql://postgres:postgres@localhost:5432/todo_app"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# create an instance of the SQLAlchemy class and link it to the app
db = SQLAlchemy(app)

# data model for the app
class Todo(db.Model):
    __tablename__ = 'todos'
    id = db.Column(db.Integer, primary_key = True)
    description = db.Column(db.String(), nullable= False)

    def __repr__(self) -> str:
        return f"<id {self.id}: {self.description}>"

# sync all the newly created data model to the databse
db.create_all()


# Root route handler
@app.route('/')
def index():
    return render_template('index.html', data = Todo.query.all())


# Todo item create root handler
@app.route('/todos/create', methods=['POST'])
def createItem():
    # extract the form input for the new Todo item
    todoItemData = request.form.get('description')

    # create new record in the database
    newTodoItem = Todo(description = todoItemData)
    db.session.add(newTodoItem)
    db.session.commit()

    # return the updated view to the user
    return redirect(url_for('index'))
