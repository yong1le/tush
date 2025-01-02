#!/bin/sh

echo "Installing requirements"
python -m venv /functions/lambda-venv
. /functions/lambda-venv/bin/activate && pip install -r requirements.txt
touch /functions/lambda-venv/.last_install

echo "watching for changes"

while true; do
  if [ requirements.txt -nt /functions/lambda-venv/.last_install ]; then
    echo "Requirements changed, reinstalling..."
    . /functions/lambda-venv/bin/activate && pip install -r requirements.txt
    touch /functions/lambda-venv/.last_install
    echo "watching for changes"
  fi
  sleep 5
done
