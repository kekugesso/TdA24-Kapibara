#!/bin/sh

pip install -r requirements.txt
python3 -m flask --app app/app.py init-db
python3 -m flask --app app/app.py run --host=0.0.0.0 --port=80 --debug

