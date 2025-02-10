# Create venv (already yash has done it)

cd backend
python -m venv venv

# Activate venv for running python

.\venv\Scripts\activate

# Installing the libraries from requirements.txt in the backend/venv (just have to do once for the first time)

pip install -r requirements.txt

Note: for deactivating just type deactivate

# Command to run the fastapi application

redirect to backend, activate venv and run this command
uvicorn main:app --reload
