import logging
import logging.config
from typing import Any, Dict

LOGGING_CONFIG: Dict[str, Any] = {
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {
        "standard": {
            "format": "%(asctime)s | %(levelname)s | %(name)s | %(message)s",
        }
    },
    "handlers": {
        "default": {
            "level": "INFO",
            "class": "logging.StreamHandler",
            "formatter": "standard",
        }
    },
    "loggers": {
        "aquapump": {
            "handlers": ["default"],
            "level": "INFO",
        },
    },
}


def configure_logging() -> None:
    logging.config.dictConfig(LOGGING_CONFIG)


def get_logger(name: str) -> logging.Logger:
    return logging.getLogger(f"aquapump.{name}")
