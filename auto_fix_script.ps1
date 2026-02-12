# ==============================================
# ⚡ Auto-Fix Script for Next.js + Tailwind + Auth
# ==============================================

# 1️⃣ Kill all running Node.js processes (to avoid locks)
Write-Output "🔹 Killing any running Node.js processes..."
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force
Write-Output "✅ Node processes stopped."

# 2️⃣ Rename PostCSS config to fix ES module error
if (Test-Path "frontend\postcss.config.js") {
    Write-Output "🔹 Renaming postcss.config.js → postcss.config.cjs"
    Rename-Item "frontend\postcss.config.js" "frontend\postcss.config.cjs"
    Write-Output "✅ PostCSS config renamed."
} else {
    Write-Output "ℹ postcss.config.js not found, skipping rename."
}

# 3️⃣ Delete Next.js .next cache folder
if (Test-Path "frontend\.next") {
    Write-Output "🔹 Deleting .next folder..."
    Remove-Item "frontend\.next" -Recurse -Force
    Write-Output "✅ .next folder deleted."
} else {
    Write-Output "ℹ .next folder not found, skipping deletion."
}

# 4️⃣ Verify .next deletion
if (-not (Test-Path "frontend\.next")) {
    Write-Output "✅ .next folder successfully removed."
} else {
    Write-Output "⚠ Warning: .next folder still exists."
}

# 5️⃣ Ensure AuthProvider path is correct
$authPath = "frontend\app\components\UI\AuthProvider.tsx"
if (Test-Path $authPath) {
    Write-Output "✅ AuthProvider.tsx found at correct path."
} else {
    Write-Output "⚠ AuthProvider.tsx NOT found! Make sure it's at frontend\app\components\UI/AuthProvider.tsx"
}

# 6️⃣ Check better-auth imports
Write-Output "🔹 Make sure you import 'SessionProvider' from 'better-auth/react' in AuthProvider.tsx"
Write-Output "Example:"
Write-Output @"
'use client';
import { SessionProvider } from 'better-auth/react';
import { ReactNode } from 'react';

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => (
  <SessionProvider>{children}</SessionProvider>
);
" @

# 7️⃣ Start Next.js dev server
Write-Output "🔹 Starting Next.js dev server..."
cd frontend
npm install
npm run dev
Write-Output "🚀 Dev server running. Open http://localhost:3000"