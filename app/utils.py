from functools import wraps

from flask import make_response, request, current_app

def auth_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth = request.authorization
        if not auth or not auth.username == current_app.config.get('AUTH_USERNAME') or not current_app.config.get('AUTH_PASSWORD') == auth.password:
            return make_response('Could not verify', 401, {'WWW-Authenticate': 'Basic realm="Login required"'})
        return f(*args, **kwargs)

    return decorated