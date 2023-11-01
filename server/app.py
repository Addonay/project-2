from Models.Users import User
from flask import Flask, request, make_response, jsonify
from flask_migrate import Migrate
from flask_restful import Resource, Api
from flask_jwt_extended import JWTManager, create_access_token
from flask_cors import CORS
from flask_marshmallow import Marshmallow
from marshmallow import fields
from Models.Config import db
from Models.Attempts import Attempts
from Models.Choices import Choice
from Models.Profile import Profile
from Models.Questions import Question
from Models.Response import Response
from flask_cors import CORS


app=Flask(__name__)
CORS(app)
app.config["SQLALCHEMY_DATABASE_URI"]='sqlite:///survey.db'
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"]=False
app.config["JWT_SECRET_KEY"]="rhucvjehuhevytguhccvytvuegctvwetvwvgvsc38yi32uy"
app.json.compact=False

# CORS(app)
ma = Marshmallow(app)
migrate=Migrate(app, db)
db.init_app(app)
api=Api(app)
jwt=JWTManager(app)

class Tokens(Resource):
    def post(self):
        received_email=request.json.get("email")
        received_password=request.json.get("password")
        target_user=User.query.filter(User.email==received_email).first()
        if target_user and received_password==target_user.password:
            access_token=create_access_token(identity=received_email)
            response_dict=dict(access_token=access_token)
            status_code=200
        else:
            response_dict=dict(error="Invalid credentials")
            status_code=404
        response=make_response(jsonify(response_dict), status_code)
        return response
api.add_resource(Tokens, '/tokens')

class Registrations(Resource):
    def post(self):
        received_role=request.json.get("role")
        received_email=request.json.get("email")
        received_password=request.json.get("password")
        new_user=User(role=received_role, email=received_email, password=received_password)
        if new_user:
            db.session.add(new_user)
            db.session.commit()
            response_dict=dict(message="User registration successful")
            status_code=201
        else:
            response_dict=dict(error="User registration failed")
            status_code=400
        response=make_response(jsonify(response_dict),status_code)
        return response
api.add_resource(Registrations, '/signup')


class QuestionSchema(ma.SQLAlchemyAutoSchema):
    choices = fields.Method('get_choices')
    class Meta:
        model = Question

    def get_choices(self, obj):
        questionChoices = obj.choices
        choices = [choice for choice in questionChoices]
        return choicesSchema.dump(choices)

questionSchema = QuestionSchema()
questionsSchema = QuestionSchema(many = True)

class AttemptsSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Attempts

class ChoiceSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Choice

choiceSchema = ChoiceSchema()
choicesSchema = ChoiceSchema(many = True)

class ProfileSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Profile

profileSchema = ProfileSchema()
profilesSchema = ProfileSchema(many = True)

@app.route('/questions', methods=['GET'])
def questions():
    questions = Question.query.all()
    questions_results = questionsSchema.dump(questions)
    if not questions_results:
        return jsonify({'message': 'no questions found'}), 404
    return jsonify(questions_results), 200

@app.route('/question/<int:question_id>/choices', methods=['GET'])
def question_choices(question_id):
    question = Question.query.get(question_id)
    if not question:
        return jsonify({'message': 'Question not found'}), 404

    choices = question.choices
    result = choicesSchema.dump(choices)
    return jsonify(result), 200

@app.route('/user/<int:userId>/profiles')
def get_profiles(userId):
    user = User.query.get(userId)
    if not user:
        return jsonify({'message': 'user not found'})

    profiles = Profile.query.filter_by(user_id=userId).all()
    result = profilesSchema.dump(profiles)
    return jsonify(result), 200

@app.route('/submit_ans', methods=['POST'])
def submitAnswers():
    try:
        user = User.query.get(1)
        data =  request.json.get('answers')
        choices_ids = data.keys()
        total_score = db.session.query(db.func.sum(Choice.score)).filter(Choice.id.in_(choices_ids[:6])).scalar()
        strategy = formulate_investment_strategy(total_score)
        if strategy == 'failed':
            return jsonify({'message':'Failed'}), 500
        generatedProfile = Profile(user=user, type=strategy.get('strategy'), Band=strategy.get('band'),
                                riskTolerance=strategy.get('riskTolarance'), stocksPercentage=strategy.get('stocks'),
                                bondsPercentage=strategy.get('bonds'), cashPercentage=strategy.get('cash'), body='undefined')
        attempt = Attempts(user=user)
        for qid, cid in data.items():
            response = Response(user_id = user.user_id, choice_id=cid, question_id = qid)
            attempt.responses.append(response)
        db.session.add_all([generatedProfile, attempt])
        db.session.commit()
        profile = profileSchema.dump(generatedProfile)
        return jsonify(profile), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': e})

def formulate_investment_strategy(score):
    if 6 <= score <= 15:
        return {'strategy':"conservative", 'band': 1,
                'riskTolarance': 1, 'stocks': 20, 'bonds': 55, 'cash': 25}
    elif 16 <= score <= 25:
        return {'strategy':"moderately conservative", 'band': 2,
                'riskTolarance': 2, 'stocks': 40, 'bonds': 50, 'cash': 10}
    elif 26 <= score <= 34:
        return {'strategy':"moderate", 'band': 3,
                'riskTolarance': 3, 'stocks': 60, 'bonds': 35, 'cash': 5}
    elif 35 <= score <= 44:
        return {'strategy':"moderately aggressive", 'band': 4,
                'riskTolarance': 4, 'stocks': 70, 'bonds': 25, 'cash': 5}
    elif 45 <= score <= 54:
        return {'strategy':"aggressive", 'band': 4,
                'riskTolarance': 4, 'stocks': 80, 'bonds': 15, 'cash': 5}
    else:
        return "failed"

if __name__ =='__main__':
    app.run(debug=True)