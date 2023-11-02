FROM python:3.10-alpine

COPY . ./app
WORKDIR /app

RUN pip install -r requirements.txt

ENV HOST="0.0.0.0"
ENV PORT=80

EXPOSE 80

CMD [ "python3", "app/app.py" ] 