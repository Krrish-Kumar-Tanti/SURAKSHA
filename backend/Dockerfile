FROM python:3.12-slim

WORKDIR /app

# Install system deps including postgresql client
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first for layer caching
COPY pyproject.toml poetry.lock ./

# Install deps
RUN pip install --no-cache-dir -e ".[dev]"

# Copy source
COPY app ./app
COPY scripts ./scripts
COPY migrations ./migrations

# Seed on startup (demo dataset)
RUN python scripts/seed.py --dataset demo_v1

# Expose FastAPI port
EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]