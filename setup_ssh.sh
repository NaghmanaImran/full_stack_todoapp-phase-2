#!/bin/bash

# Start the ssh-agent in the background
eval "$(ssh-agent -s)"

# Add your SSH private key to ssh-agent
ssh-add ~/.ssh/id_ed25519

# Test the connection to GitHub
ssh -T git@github.com