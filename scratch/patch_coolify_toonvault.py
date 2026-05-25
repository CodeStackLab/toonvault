import subprocess
import os

generated_path = "/data/coolify/services/jnapjz5a1sc73wbn0wukv8ps/docker-compose.yml"
raw_path = "/tmp/raw_compose.yml"

# 1. Modify the generated compose file
with open(generated_path, "r") as f:
    gen_content = f.read()

# Replacements for generated compose
old_gen_backend = "- 'traefik.http.routers.toonvault-backend.rule=(Host(`toonvault.com`) || Host(`www.toonvault.com`)) && (PathPrefix(`/api`) || PathPrefix(`/socket.io`))'"
new_gen_backend = "- 'traefik.http.routers.toonvault-backend.rule=Host(`toonvault.com`) && (PathPrefix(`/api`) || PathPrefix(`/socket.io`))'\n      - traefik.docker.network=coolify"

old_gen_frontend = "- 'traefik.http.routers.toonvault-frontend.rule=Host(`toonvault.com`) || Host(`www.toonvault.com`)'"
new_gen_frontend = "- 'traefik.http.routers.toonvault-frontend.rule=Host(`toonvault.com`)'\n      - traefik.docker.network=coolify"

if old_gen_backend in gen_content:
    gen_content = gen_content.replace(old_gen_backend, new_gen_backend)
    print("Updated backend labels in generated compose")
else:
    print("Backend labels already updated or not found in generated compose")

if old_gen_frontend in gen_content:
    gen_content = gen_content.replace(old_gen_frontend, new_gen_frontend)
    print("Updated frontend labels in generated compose")
else:
    print("Frontend labels already updated or not found in generated compose")

with open(generated_path, "w") as f:
    f.write(gen_content)


# 2. Modify the raw compose file
with open(raw_path, "r") as f:
    raw_content = f.read()

# Replacements for raw compose (same strings)
if old_gen_backend in raw_content:
    raw_content = raw_content.replace(old_gen_backend, new_gen_backend)
    print("Updated backend labels in raw compose")
else:
    print("Backend labels already updated or not found in raw compose")

if old_gen_frontend in raw_content:
    raw_content = raw_content.replace(old_gen_frontend, new_gen_frontend)
    print("Updated frontend labels in raw compose")
else:
    print("Frontend labels already updated or not found in raw compose")

with open(raw_path, "w") as f:
    f.write(raw_content)


# 3. Update the database
sql_query = f"""
UPDATE services 
SET docker_compose_raw = $${raw_content}$$, 
    docker_compose = $${gen_content}$$
WHERE id = 1;
"""

sql_file_path = "/tmp/update_coolify.sql"
with open(sql_file_path, "w") as f:
    f.write(sql_query)

# Copy SQL file to coolify-db
subprocess.run(["docker", "cp", sql_file_path, "coolify-db:/tmp/update_coolify.sql"], check=True)

# Run SQL query in container
result = subprocess.run([
    "docker", "exec", "coolify-db", 
    "psql", "-U", "coolify", "-d", "coolify", "-f", "/tmp/update_coolify.sql"
], capture_output=True, text=True)

print("SQL Output:", result.stdout)
print("SQL Error:", result.stderr)

# 4. Restart services with docker compose to apply changes
print("Restarting containers with new labels...")
compose_dir = os.path.dirname(generated_path)
restart_result = subprocess.run([
    "docker", "compose", "up", "-d"
], cwd=compose_dir, capture_output=True, text=True)

print("Docker Compose Output:", restart_result.stdout)
print("Docker Compose Error:", restart_result.stderr)
