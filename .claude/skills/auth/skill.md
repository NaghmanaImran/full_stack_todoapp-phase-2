---
name: auth-skill
description: Handle secure user authentication flows including signup, signin, password hashing, JWT tokens, and Better Auth integration.
---

# Auth Skill

## Responsibilities
- Implement user signup and registration flows
- Handle secure user signin and authentication
- Manage password hashing and verification
- Generate and validate JWT tokens
- Integrate Better Auth for authentication management

## Instructions
1. Use secure password hashing with bcrypt or similar
2. Implement proper JWT token generation and validation
3. Follow Better Auth integration patterns and best practices
4. Validate user inputs and sanitize data before processing
5. Implement proper session management and token refresh

## Best Practices
- Hash passwords with salt before storing
- Use secure JWT signing keys and proper expiration
- Implement rate limiting for authentication endpoints
- Follow OWASP authentication security guidelines
- Secure token storage and transmission

## Output Expectations
- Working signup and signin functionality
- Secure password handling and storage
- Valid JWT token generation and validation
- Better Auth integration properly configured
- Proper error handling and user feedback