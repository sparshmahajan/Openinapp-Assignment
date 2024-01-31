# REST API server for OpeninApp-Assignment

## ENV Vars

```env
MONGO_URL=Your_Mongo_Database_URL
JWT_KEY=token_encryption_secret_for_jwt
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number
```

### API Routes

---

### USER ROUTES

| Description      | URL               | Method | Body                  | Status  |
| ---------------- | ----------------- | ------ | --------------------- | ------- |
| Register         | api/user/register | POST   | phone_number,priority | CREATED |
| LogIn            | api/user/login    | POST   | phone_number          | OK      |
| Get User details | api/user          | GET    | \_\_                  | OK      |

---

### Task Routes

---

| Description | URL              | Method | Body                       | query                        | Status  |
| ----------- | ---------------- | ------ | -------------------------- | ---------------------------- | ------- |
| Create Task | api/task         | POST   | title,description,due_date | \_\_                         | CREATED |
| Get Tasks   | api/task         | GET    | \_\_                       | priority,due_date,page,limit | OK      |
| Update Task | api/task/:taskId | PUT    | due_date, status?          | \_\_                         | OK      |
| Delete Task | api/task/:taskId | DELETE | \_\_                       | \_\_                         | OK      |

---

---

### SubTask Routes

| Description | URL              | Method | Body    | query              | Status  |
| ----------- | ---------------- | ------ | ------- | ------------------ | ------- |
| Create Task | api/task         | POST   | task_id | \_\_               | CREATED |
| Get Tasks   | api/task         | GET    | \_\_    | task_id,page,limit | OK      |
| Update Task | api/task/:taskId | PUT    | status  | \_\_               | OK      |
| Delete Task | api/task/:taskId | DELETE | \_\_    | \_\_               | OK      |

---
