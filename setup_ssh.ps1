# Start SSH agent and add the key
$agent = Start-Process -FilePath "ssh-agent" -ArgumentList "-s" -PassThru
Start-Sleep -s 2

# Add the SSH key
ssh-add "$env:USERPROFILE\.ssh\id_ed25519"

# Test the connection to GitHub
ssh -T git@github.com