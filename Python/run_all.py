import subprocess
import os

# Print current working directory for debugging
print("Current Working Directory:", os.getcwd())

# List of Python files in the 'Python' folder to be executed (excluding 'translate_to_english_query.py')
python_files = [
    "keyword_extraction_and_api.py",
    "news.py",
    "pdf_chat_rag.py",  # Special case: we need to run this using uvicorn
]


# Run each Python file using subprocess
def run_python_files():
    processes = []  # List to store the subprocesses

    # Loop over each file in the list
    for python_file in python_files:
        # Construct the path to the Python file (we are already in the Python folder)
        file_path = python_file
        print(f"Looking for file: {file_path}")  # Debugging line

        if os.path.exists(file_path):
            print(f"Running {python_file}...")

            if python_file == "pdf_chat_rag.py":
                # Special case: Run pdf_chat_rag.py using uvicorn (for FastAPI or ASGI apps)
                print(f"Running {python_file} with uvicorn...")
                process = subprocess.Popen(
                    ["uvicorn", "pdf_chat_rag:app", "--reload"],
                    stdout=subprocess.PIPE,
                    stderr=subprocess.PIPE,
                )
            else:
                # Run other Python files normally
                process = subprocess.Popen(
                    ["python", file_path],
                    stdout=subprocess.PIPE,
                    stderr=subprocess.PIPE,
                )

            processes.append(process)  # Store the process in the list

        else:
            print(f"File {python_file} does not exist at the expected location!")

    # Wait for all processes to complete
    for process in processes:
        stdout, stderr = (
            process.communicate()
        )  # Wait for the process to finish and get its output/error

        # Print the output of the subprocess
        print(f"Output of process (stdout):")
        print(stdout.decode())  # Decode bytes to string for readable output

        # Print any errors (stderr) if they exist
        if stderr:
            print(f"Error in process (stderr):")
            print(stderr.decode())


if __name__ == "__main__":
    run_python_files()
