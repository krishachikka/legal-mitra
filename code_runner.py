import subprocess
import os


def run_command(command, cwd=None):
    """Run a command in a subprocess."""
    try:
        print(f"Running command: {command}")
        process = subprocess.Popen(command, shell=True, cwd=cwd)
        return process
    except Exception as e:
        print(f"Error running command {command}: {e}")
        return None


def run_apps():
    # Run frontend folder - npm run dev
    frontend_process = run_command(
        "npm run dev", cwd=os.path.join(os.getcwd(), "frontend")
    )

    # Run backend folder - npm run dev
    backend_process_1 = run_command(
        "npm run dev", cwd=os.path.join(os.getcwd(), "backend")
    )

    # Wait for both processes to finish
    if frontend_process:
        frontend_process.wait()
    if backend_process_1:
        backend_process_1.wait()

    print("All processes have finished.")


if __name__ == "__main__":
    run_apps()
