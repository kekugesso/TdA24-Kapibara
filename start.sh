#!/bin/sh


if [[ "$1" == "pipx" ]]; then
pipx install -r requirements.txt
else
pip install -r requirements.txt
fi

python3 -m flask --app app/app.py init-db
python3 -m flask --app app/app.py run --debug #--host=0.0.0.0 --port=80 

