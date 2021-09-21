# imports
from flask import Flask, render_template
from flask_sqlalchemy import SQLAlchemy


# create an app with the name of the current module, set its configs
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = "postgresql://postgres:postgres@localhost:5432/todo_app"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# create an instance of the SQLAlchemy class and link it to the app
db = SQLAlchemy(app)


# Root route handler
@app.route('/')
def index():
    return render_template('index.html', data = [
        {'description': 'Todo 1'},
        {'description': 'Todo 2'},
        {'description': 'Todo 3'},
        {'description': 'Todo 4'}
    ])
