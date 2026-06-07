# Hugging Face Spaces (Docker SDK) — listens on 7860
FROM python:3.11-slim

WORKDIR /app

# Persistent, writable data dir (mount a free HF persistent disk here for durability)
ENV DB_PATH=/data/dashboard.db
RUN mkdir -p /data && chmod 777 /data

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 7860
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "7860"]
