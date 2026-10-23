# IMPLEMENTATION.md

## Student

- **Name:** Tristan Bielby
- **Student ID:** 301510035
- **Section:** 404
- **Date:** October 23, 2026

---

## 1. Environment

- Node version (`node -v`): v25.6.1
- MongoDB: Local — MongoDB Community Server running as a Windows service (`mongodb://127.0.0.1:27017/comp229_midterm`)
- How you ran the server `npm run dev`, listening on port 8080

---

## 2. Endpoint Checklist

### GET `/api/items`
- **Filters supported:** `?type=`, `?category=` (validated against allowed values)
- **Status codes:** 200; 400 for an invalid filter value

### GET `/api/items/mine`
- **How you scope to the signed-in user:** `Item.find({ owner: req.userId })`
- **Status codes:** 200; 401 without a valid token

### GET `/api/items/:id`
- **How you validate `:id`:** `mongoose.Types.ObjectId.isValid(id)`
- **Status codes (valid id / invalid id / not found):** 200 / 400 / 404

### POST `/api/items`
- **How you set `owner`:** from `req.userId`, never from the body
- **How validation errors are returned:** 400 with an error message (missing fields or Mongoose validation)
- **Status codes:** 201; 400; 401; 409 for a duplicate title

### PUT `/api/items/:id`
- **How you check ownership:** `item.owner.equals(req.userId)`
- **Which fields you allow to be updated:** title, description, type, category, location, date, status
- **Status codes (invalid id / not found / not owner / success):** 400 / 404 / 403 / 200

### DELETE `/api/items/mine`
- **Query used:** `Item.deleteMany({ owner: req.userId })`
- **Response shape (`deletedCount` / `204`):** 200 with `{ deletedCount }`

### DELETE `/api/items/:id`
- **How you check ownership:** `item.owner.equals(req.userId)`
- **Status codes:** 200; 400; 401; 403; 404

---

## 3. Testing

- Tool used: Thunder Client (VS Code extension), MongoDB Compass for database checks
- Collection file (if any): None — screenshots in the submitted Word document
- Which scenarios you verified:
  - Signup / signin happy path
  - Signin with wrong password , 401
  - Protected route without token , 401
  - Create item with missing required field , 400
  - Create item success → 201
  - List all + filters (`?type=`, `?category=`)
  - Get by invalid id , 400
  - Get by missing id , 404
  - List mine returns only my items
  - Update by non-owner , 403
  - Update by owner , 200
  - Delete by non-owner , 403
  - Delete by owner , 200 / 204
  - Delete /mine empties my list

---

## 4. Known Issues / Things I Would Improve

- Title uniqueness is case-sensitive ("Phone" and "phone" are treated as different items).
- `ObjectId.isValid` accepts any 12-character string, so a few odd ids return 404 instead of 400.
- No pagination on `GET /api/items`; a large collection would return everything at once.

---

## 5. References

- Mongoose docs: https://mongoosejs.com/docs/
- Express docs: https://expressjs.com/en/guide/routing.html
- Course notes and previous assignments