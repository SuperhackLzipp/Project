import os
import glob

def process_env_file(env_file_path):
    with open(env_file_path, 'r') as source_file:
        template_file_path = env_file_path + '.template'
        with open(template_file_path, 'w') as dest_file:
            for line in source_file:
                if '=' in line:
                    key = line.split('=')[0]
                    dest_file.write(key + '=\n')
                else:
                    dest_file.write(line)

if __name__ == "__main__":
    for root, dirs, files in os.walk('.'):
        for file in files:
            if file == '.env':
                env_file_path = os.path.join(root, file)
                process_env_file(env_file_path)
                print('Created template file for', env_file_path)
