'''Configuration module.

Loads environment variables using python-dotenv and provides a simple
`Config` class that can be imported throughout the project.

The module exports a single instance `config` which can be used like:

    from backend.config import config
    print(config.SECRET_KEY)

It also provides a `load_config()` helper that returns a fresh `Config`
instance. This is useful for cases where a component wants to avoid the
module‑level singleton (e.g., testing).
''' 

import os
import json
from typing import Dict, List, Optional
from dotenv import load_dotenv

# Load variables from a .env file located in the project root (or any parent directory).
# `load_dotenv` will silently ignore missing files, which is fine for production.
load_dotenv()


class Config:
    """Container for application configuration.

    Attributes are populated from environment variables. If a variable is not
    present, a sensible default (empty string, ``False`` for ``DEBUG`` or ``0``
    for numeric values) is used.
    """

    def __init__(self) -> None:
        # Core secrets
        self.SECRET_KEY: str = os.getenv("SECRET_KEY", "")
        self.JWT_SECRET: str = os.getenv("JWT_SECRET", "")

        # Database connection string
        self.SQLALCHEMY_DATABASE_URI: str = os.getenv(
            "SQLALCHEMY_DATABASE_URI", ""
        )

        # Third‑party API keys
        self.STRIPE_API_KEY: str = os.getenv("STRIPE_API_KEY", "")
        self.OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")

        # Debug flag – interpret common truthy strings
        debug_val = os.getenv("DEBUG", "false").lower()
        self.DEBUG: bool = debug_val in {"1", "true", "yes", "on"}

        # Review modes – expected as a JSON string mapping mode name to prompt template
        # Example: '{"default": "You are a reviewer...", "code": "Review the following code..."}'
        review_modes_raw = os.getenv("REVIEW_MODES", "{}")
        try:
            self.REVIEW_MODES: Dict[str, str] = json.loads(review_modes_raw)
        except json.JSONDecodeError:
            # Fallback to empty dict if malformed
            self.REVIEW_MODES = {}

        # Rate limit – integer requests per minute
        self.RATE_LIMIT: int = int(os.getenv("RATE_LIMIT", "0"))

        # Allowed file MIME types – JSON list, e.g., '["application/pdf", "text/plain"]'
        allowed_types_raw = os.getenv("ALLOWED_FILE_TYPES", "[]")
        try:
            self.ALLOWED_FILE_TYPES: List[str] = json.loads(allowed_types_raw)
        except json.JSONDecodeError:
            self.ALLOWED_FILE_TYPES = []

        # Maximum file size in bytes
        self.MAX_FILE_SIZE: int = int(os.getenv("MAX_FILE_SIZE", "0"))

        # Optional Redis URL for async queueing
        self.REDIS_URL: Optional[str] = os.getenv("REDIS_URL") or None

    def __repr__(self) -> str:
        # Helpful representation for debugging – do not expose secrets.
        return (
            f"Config(DEBUG={self.DEBUG}, "
            f"SQLALCHEMY_DATABASE_URI='{self.SQLALCHEMY_DATABASE_URI}', "
            f"RATE_LIMIT={self.RATE_LIMIT}, "
            f"MAX_FILE_SIZE={self.MAX_FILE_SIZE})"
        )


def load_config() -> Config:
    """Factory function that returns a fresh :class:`Config` instance.

    The module also provides a ready‑to‑use singleton ``config`` for convenience.
    """
    return Config()


# Export a ready‑to‑use instance for convenience.
config = Config()
