# Coder Buddy - AI App Builder

An AI-powered application builder that generates complete web application code from natural language prompts using LangGraph agents and Groq LLaMA.

## What It Does

Describe what you want to build in plain English, and Coder Buddy generates the project structure and code for you — completely locally, no expensive API calls.

## Tech Stack

- **Python 3.11+** — Core runtime
- **LangGraph** — Agent orchestration and planning pipeline
- **LangChain + Groq** — LLM integration (LLaMA via Groq API)
- **Pydantic** — Structured data validation

## Getting Started

```bash
# Clone the repo
git clone https://github.com/Kartikeysharma1972/app-builder.git
cd app-builder

# Install dependencies
pip install -e .

# Set up environment
cp .env.example .env
# Add your GROQ_API_KEY to .env

# Run
python main.py
```

## How It Works

1. You enter a project description in natural language
2. The LangGraph agent plans the project structure
3. Code is generated for each component
4. Output is saved to `generated_project/`

## Project Structure

```
app-builder/
├── agent/          # LangGraph agent logic
├── generated_project/  # Output directory
├── main.py         # Entry point
└── pyproject.toml  # Dependencies
```

## License

MIT
