#!/bin/sh

# install requirements
pip install -r requirements.txt

# init db
python3 -m flask --app app/app.py init-db

# run
if [ "$1" = "prod" ]]; then
	python3 -m flask --app app/app.py run --debug --host=0.0.0.0 --port=80
else
	python3 -m flask --app app/app.py run --debug
fi


