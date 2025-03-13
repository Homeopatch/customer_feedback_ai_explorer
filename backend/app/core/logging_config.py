import logging
import sys
from typing import List

def setup_logging(logger, log_level: str = "INFO"):
    """
    Configure logging for the application.

    Args:
        log_level: The logging level (DEBUG, INFO, WARNING, ERROR, CRITICAL)
    """
    stream_handler = logging.StreamHandler()
    formatter = logging.Formatter(
        "%(asctime)s;%(levelname)7s;%(threadName)10s;%(filename)20s:%(lineno)3d;\"%(message)s\"")
    stream_handler.setFormatter(formatter)

    logger.addHandler(stream_handler)
    logger.setLevel(log_level)
