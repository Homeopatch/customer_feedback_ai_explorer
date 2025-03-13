import logging
import sys
from typing import List, Optional

def setup_logging(log_level: str = "INFO", log_file: Optional[str] = None):
    """
    Configure logging for the application.
    
    Args:
        log_level: The logging level (DEBUG, INFO, WARNING, ERROR, CRITICAL)
        log_file: Optional path to a log file
    """
    # Set up root logger
    root_logger = logging.getLogger()
    root_logger.setLevel(getattr(logging, log_level))
    
    # Create formatters
    verbose_formatter = logging.Formatter(
        '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )
    simple_formatter = logging.Formatter(
        '%(levelname)s: %(message)s'
    )
    
    # Console handler
    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setFormatter(simple_formatter)
    root_logger.addHandler(console_handler)
    
    # File handler (if specified)
    if log_file:
        file_handler = logging.FileHandler(log_file)
        file_handler.setFormatter(verbose_formatter)
        root_logger.addHandler(file_handler)
    
    # Set up logger for our application
    app_logger = logging.getLogger('MyProject')
    app_logger.setLevel(getattr(logging, log_level))
    
    # Suppress noisy loggers
    for logger_name in ["uvicorn.access"]:
        logging.getLogger(logger_name).setLevel(logging.WARNING)
    
    app_logger.debug("Logging configured successfully")