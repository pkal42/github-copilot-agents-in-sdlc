# Tailspin Toys Crowd Funding Development Guidelines

This is a crowdfunding platform for games with a developer theme. The application uses a Flask backend API with SQLAlchemy ORM for database interactions, and an Astro/Svelte frontend with Tailwind CSS for styling. Please follow these guidelines when contributing:

## Code standards

### Required Before Each Commit

- Run Python tests to ensure backend functionality
- For frontend changes, run builds in the client directory to verify build success and the end-to-end tests, to ensure everything works correctly
- When making API changes, update and run the corresponding tests to ensure everything works correctly
- When updating models, ensure database migrations are included if needed
- When adding new functionality, make sure you update the README
- Make sure all guidance in the Copilot Instructions file is updated with any relevant changes, including to project structure and scripts, and programming guidance

### Global language guidance

- Use type hints for function parameters and return values for all languages which support them
- Add docstrings to all functions, classes, and modules using appropriate format for the language
- Include file headers with brief descriptions for new files when appropriate

### Python formatting and style standards

- Follow PEP 8 style guide for Python code
- Use 4 spaces for indentation (no tabs)
- Maximum line length of 88 characters (Black formatter standard)
- Use meaningful variable and function names in snake_case
- Use CamelCase for class names
- Use UPPER_CASE for constants
- Import organization: standard library, third-party packages, local imports (separated by blank lines)
- Use trailing commas in multi-line data structures

### Python docstring standards

- Use Google-style docstrings for all functions, classes, and modules
- Include brief description, Args, Returns, and Raises sections as appropriate
- Example format:
  ```python
  def function_name(param1: str, param2: int) -> bool:
      """Brief description of what the function does.
      
      Args:
          param1: Description of the first parameter.
          param2: Description of the second parameter.
          
      Returns:
          Description of the return value.
          
      Raises:
          ValueError: Description of when this exception is raised.
      """
  ```
- For classes, include a class-level docstring describing the purpose
- For modules, include a module-level docstring at the top of the file

### Python and Flask Patterns

- Use SQLAlchemy models for database interactions
- Use Flask blueprints for organizing routes
- Follow RESTful API design principles

### Svelte and Astro Patterns

- Use Svelte for interactive components
- Follow Svelte's reactive programming model
- Create reusable components when functionality is used in multiple places
- Use Astro for page routing and static content

### Styling

- Use Tailwind CSS classes for styling
- Maintain dark mode theme throughout the application
- Use rounded corners for UI elements
- Follow modern UI/UX principles with clean, accessible interfaces

### GitHub Actions workflows

- Follow good security practices
- Make sure to explicitly set the workflow permissions
- Add comments to document what tasks are being performed

## Scripts

- Several scripts exist in the `scripts` folder
- Use existing scripts to perform tasks rather than performing them manually
- Existing scripts:
    - `scripts/setup-env.sh`: Performs installation of all Python and Node dependencies
    - `scripts/run-server-tests.sh`: Calls setup-env, then runs all Python tests
    - `scripts/start-app.sh`: Calls setup-env, then starts both backend and frontend servers

## Repository Structure

- `server/`: Flask backend code
  - `models/`: SQLAlchemy ORM models
  - `routes/`: API endpoints organized by resource
  - `tests/`: Unit tests for the API
  - `utils/`: Utility functions and helpers
- `client/`: Astro/Svelte frontend code
  - `src/components/`: Reusable Svelte components
  - `src/layouts/`: Astro layout templates
  - `src/pages/`: Astro page routes
  - `src/styles/`: CSS and Tailwind configuration
- `scripts/`: Development and deployment scripts
- `data/`: Database files
- `docs/`: Project documentation
- `README.md`: Project documentation
