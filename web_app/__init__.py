from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
from .config import Config

db = SQLAlchemy()
login_manager = LoginManager()

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)
    
    # Inicializar extensões
    db.init_app(app)
    login_manager.init_app(app)
    # Configuração mínima do Flask-Login: rota de login e loader de usuário.
    # Retorna None por padrão até que um modelo `User` seja implementado.
    login_manager.login_view = 'main.login'

    @login_manager.user_loader
    def load_user(user_id):
        return None
    
    # Registrar blueprints
    from .routes import main_routes, audit_routes
    app.register_blueprint(main_routes.bp)
    app.register_blueprint(audit_routes.bp)
    
    return app