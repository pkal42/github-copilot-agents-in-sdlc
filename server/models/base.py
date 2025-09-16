"""Base model classes for the Tailspin Toys application."""
from . import db


class BaseModel(db.Model):
    """Abstract base model with common validation methods.
    
    This class provides shared validation functionality for all models
    in the application.
    """
    __abstract__ = True
    
    @staticmethod
    def validate_string_length(
        field_name: str, 
        value: str, 
        min_length: int = 2, 
        allow_none: bool = False
    ) -> str:
        """Validate string length and type.
        
        Args:
            field_name: Name of the field being validated.
            value: The string value to validate.
            min_length: Minimum required length for the string.
            allow_none: Whether to allow None values.
            
        Returns:
            The validated string value.
            
        Raises:
            ValueError: If validation fails.
        """
        if value is None:
            if allow_none:
                return value
            else:
                raise ValueError(f"{field_name} cannot be empty")
        
        if not isinstance(value, str):
            raise ValueError(f"{field_name} must be a string")
            
        if len(value.strip()) < min_length:
            raise ValueError(
                f"{field_name} must be at least {min_length} characters"
            )
            
        return value