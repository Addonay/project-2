from datetime import datetime
from sqlalchemy import DateTime
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Attempts(db.Model):
    __tablename__ = 'attempts'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.user_id'))
    created_at = db.Column(DateTime, default=datetime.utcnow)

    responses = db.relationship('Response', backref='attempt', lazy='dynamic')

class Choice(db.Model):
    __tablename__ = 'choice'
    id = db.Column(db.Integer, primary_key=True)
    score = db.Column(db.Integer)
    body = db.Column(db.Text)
    question_id = db.Column(db.Integer, db.ForeignKey('question.id'))

class Profile(db.Model):
    __tablename__ = 'profile'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.user_id'))
    type = db.Column(db.String(255))
    Band = db.Column(db.Integer)
    riskTolerance = db.Column(db.Integer)
    stocksPercentage = db.Column(db.Float)
    bondsPercentage = db.Column(db.Float)
    cashPercentage = db.Column(db.Float)
    body = db.Column(db.Text)
    created_at = db.Column(DateTime, default=datetime.utcnow)

class Question(db.Model):
    __tablename__ = 'question'
    id = db.Column(db.Integer, primary_key=True)
    question = db.Column(db.Text)
    created_at = db.Column(DateTime, default=datetime.utcnow)
    choices = db.relationship('Choice', backref='question')

    response = db.relationship('Response', backref='questionResponse')

class Response(db.Model):
    __tablename__ = 'response'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.user_id', name='fk_response_user_id'))
    choice_id = db.Column(db.Integer, db.ForeignKey('choice.id'))
    question_id = db.Column(db.Integer, db.ForeignKey('question.id', name='fk_response_question_id'))
    attempt_id = db.Column(db.Integer, db.ForeignKey('attempts.id', name='fk_response_attempt_id'))

class User(db.Model):
    __tablename__ = 'user'
    user_id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(255), unique=True)
    password = db.Column(db.String(255))
    role = db.Column(db.String(255))
    created_at = db.Column(DateTime, default=datetime.utcnow)
    profiles = db.relationship('Profile', backref='user')
    responses = db.relationship('Response', backref='user_user')
    attempts = db.relationship('Attempts', backref='user')