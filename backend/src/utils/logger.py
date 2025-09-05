import logging
import sys
from .config import Config

def setup_logger(name=__name__):
    logger = logging.getLogger(name)
    logger.setLevel(getattr(logging, Config.LOG_LEVEL))
    
    # Create handlers
    c_handler = logging.StreamHandler(sys.stdout)
    f_handler = logging.FileHandler(Config.BASE_DIR / "app.log")
    
    # Create formatters and add it to handlers
    format_str = "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
    formatter = logging.Formatter(format_str)
    c_handler.setFormatter(formatter)
    f_handler.setFormatter(formatter)
    
    # Add handlers to the logger
    logger.addHandler(c_handler)
    logger.addHandler(f_handler)
    
    return logger