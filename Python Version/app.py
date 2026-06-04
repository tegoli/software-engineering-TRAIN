from flask import Flask, render_template
from train_app.controllers import (
    account_controller,
    auth_controller,
    language_controller,
    notification_controller,
    schedule_controller,
    statistics_controller,
    ticket_management_controller,
    ticket_purchase_controller,
    train_search_controller,
    validation_controller
)

app = Flask(__name__)

# Registrazione delle rotte dei controller
app.register_blueprint(account_controller.bp)
app.register_blueprint(auth_controller.bp)
app.register_blueprint(language_controller.bp)
app.register_blueprint(notification_controller.bp)
app.register_blueprint(schedule_controller.bp)
app.register_blueprint(statistics_controller.bp)
app.register_blueprint(ticket_management_controller.bp)
app.register_blueprint(ticket_purchase_controller.bp)
app.register_blueprint(train_search_controller.bp)
app.register_blueprint(validation_controller.bp)

@app.route('/')
def index():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)