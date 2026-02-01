import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'sua-chave-secreta-aqui'
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or 'sqlite:///poltergaist.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # Configurações do PolterGaist
    AI_MODEL_PATH = os.environ.get('AI_MODEL_PATH', 'models/')
    AUDIT_LOG_PATH = os.environ.get('AUDIT_LOG_PATH', 'logs/audit/')
    MAX_AUDIT_FILES = int(os.environ.get('MAX_AUDIT_FILES', 100))