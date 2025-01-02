FROM python:3.12-slim

WORKDIR /functions

COPY requirements.txt requirements.txt

COPY main.py main.py
COPY watch-deps.sh watch-deps.sh

CMD ["./watch-deps.sh"]
