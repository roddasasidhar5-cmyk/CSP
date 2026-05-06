# Login Authentication Security Fix - TODO

## Issue: Dummy emails accepted without DB validation
**Root Cause**: server.js /api/auth/login creates default users on startup AND has legacy plain-text password fallback

## Current Flow (login.html + login-script.js):
```
Frontend → POST /api/auth/login → server.js User.findOne()
↓
If no user → bcrypt.compare() fails → plain text check → auto-creates/migrates
```

## Steps to Fix (4 steps):

### [x] Step 1: Remove legacy plain-text password fallback in server.js ✓
**Changes**: Removed `user.password === password` check + bcrypt-only validation

### [x] Step 2: Default users now use bcrypt hashing ✓
**Changes**: `initializeDefaultUsers()` now hashes passwords with bcrypt

### [x] Step 3: Added frontend role selector ✓
**login.html**: Role dropdown in login form
**login-script.js**: Sends selected role to backend

### [x] Step 4: Added frontend input validation ✓
**login-script.js**: Email regex + password length + role validation

### [ ] Step 5: Test end-to-end
1. `node server.js` (fresh start)
2. Try dummy email → "Invalid credentials"
3. Login with real demo accounts only

**Current Progress**: 4/5 ✅ 
**Next**: Test end-to-end
**Estimated time**: 15 minutes (completed)

