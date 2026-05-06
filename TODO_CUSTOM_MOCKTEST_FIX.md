# Custom Mock Test Generation Fix - TODO

## Issue: "Please provide text content" error despite valid input
**Root Cause**: Frontend sends FormData without proper Content-Type → Backend can't parse req.body.text

## Steps to Fix (3 steps total):

### [x] Step 1: Install multer ✓ (already in package.json)

### [x] Step 2: Fix server.js - Added multer middleware + improved error handling ✓

### [ ] Step 3: Fix script.js - Remove Content-Type header for FormData
**Frontend**: Let browser auto-set multipart boundary header

### [ ] Step 4: Test end-to-end
1. `npm install multer`
2. Restart server: `node server.js`
3. Test with sample text → Should generate questions!

### [ ] Step 5: UI Polish (bonus)
Add character counter + better validation

**Current Progress**: 0/5 complete
**Estimated time**: 10 minutes

