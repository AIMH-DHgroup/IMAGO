import os
import subprocess

def DoBackup():
    # print("Hello world!")
    # os.system("echo Hello from the other side!")
    subprocess.check_output('/var/www/imago/postgres_backup.sh', shell=True)