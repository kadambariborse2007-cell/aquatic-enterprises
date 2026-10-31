# Aquatic Enterprises

Aquatic Enterprises is a full-stack web application built using React, FastAPI, and PostgreSQL.

## Technologies Used

- **Frontend:** React, Vite, JavaScript, CSS
- **Backend:** Python, FastAPI
- **Database:** PostgreSQL

## Project Structure

```text
aquatic-enterprises/
├── backend/
│   ├── main.py
│   ├── auth.py
│   ├── database.py
│   └── requirements.txt
├── frontend/
│   ├── public/
│   ├── src/
│   ├── package.json
│   └── package-lock.json
├── .gitignore
└── README.md
```

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/kadambariborse2007-cell/aquatic-enterprises.git
cd aquatic-enterprises
```

### 2. Set Up the Backend

Create and activate a Python virtual environment, then install the backend dependencies.

```bash
cd backend
python -m venv .venv
```

On Windows PowerShell, activate it with:

```powershell
.\.venv\Scripts\Activate.ps1
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Configure the required environment variables in a local `.env` file before starting the backend.

### 3. Set Up the Frontend

Open another terminal and run:

```bash
cd frontend
npm install
npm run dev
```

Use the local URL displayed by Vite to open the website.

## Security

- Do not commit `.env` files.
- Never publish database passwords, JWT secrets, or API keys.
- Use environment variables for sensitive configuration.

## License

No license has been specified yet.