from flask import Blueprint, render_template, request, jsonify
from web_app.services.ai_audit_service import AuditService

bp = Blueprint('audit', __name__, url_prefix='/audit')
audit_service = AuditService()

@bp.route('/')
def audit_home():
    return render_template('audit/index.html', title='Auditoria de IA')

@bp.route('/run-audit', methods=['POST'])
def run_audit():
    data = request.json
    result = audit_service.audit_model(data.get('model_id'))
    return jsonify(result)

@bp.route('/reports')
def audit_reports():
    reports = audit_service.get_reports()
    return render_template('audit/reports.html', reports=reports)