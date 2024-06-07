#!/bin/sh

python3 -m venv venv
source venv/bin/activate
# install requirements
pip install -r requirements.txt

python3 app_django/manage.py runserver 127.0.0.1:2179
