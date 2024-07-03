FROM python:3.9-slim

WORKDIR /app

COPY . /app

RUN pip install --no-cache-dir -r requirements.txt
RUN chmod +x stockfish/16_x64_binary

EXPOSE 8000

CMD ["python", "app.py"]
