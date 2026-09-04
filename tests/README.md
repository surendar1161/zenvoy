# DealPilot Test Suite

Comprehensive functional tests for the entire DealPilot application.

## 📋 Test Coverage

### Core Feature Tests

| Test Suite | File | Coverage | Status |
|------------|------|----------|--------|
| **Clients** | `01-clients.test.ts` | CRM CRUD operations, RLS | ✅ |
| **Proposals** | `02-proposals.test.ts` | Status pipeline, views | ✅ |
| **Projects** | `03-projects-tasks.test.ts` | Project & task management | ✅ |
| **Contracts** | `04-contracts.test.ts` | Contract lifecycle, signatures | ✅ |
| **Portals** | `05-portals.test.ts` | Client portal access & messaging | ✅ |
| **Analytics** | `06-content-analytics.test.ts` | Content library & notifications | ✅ |

### New Comprehensive Tests

| Test Suite | File | Coverage | Lines |
|------------|------|----------|-------|
| **Proposal Edit/Save** | `08-proposal-edit-save.test.ts` | Full edit flow, auto-save, validations | 250+ |
| **Contract Edit/Save** | `09-contract-edit-save.test.ts` | Full edit flow, signatures, immutability | 280+ |
| **Full Workflow** | `10-full-workflow.test.ts` | End-to-end: Client → Proposal → Contract → Project → Portal | 400+ |

---

## 🚀 Quick Start

### 1. Prerequisites

```bash
# Install dependencies
npm install

# Ensure you have access to the Supabase project
# URL: https://ubutaehhczggyhyjgqjp.supabase.co
```

### 2. Setup Test Users

Create two test users in Supabase Dashboard:

**Option A: Use existing test accounts**
- Freelancer: `surendar1160+1@gmail.com`
- Client: `surendar1160+2@gmail.com`

**Option B: Create your own test users**
1. Go to: https://supabase.com/dashboard/project/ubutaehhczggyhyjgqjp/auth/users
2. Click "Invite user" and create:
   - A freelancer account (full dashboard access)
   - A client account (portal-only access)
3. Update `tests/setup.ts` with your emails

### 3. Configure Environment

Create or update `.env.local` with test credentials:

```bash
# Test user passwords
FREELANCER_PASSWORD=your_freelancer_password
CLIENT_PASSWORD=your_client_password

# Supabase (already configured)
NEXT_PUBLIC_SUPABASE_URL=https://ubutaehhczggyhyjgqjp.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
```

### 4. Run Tests

```bash
# Run all tests
npm test

# Run specific test suite
npm test tests/08-proposal-edit-save.test.ts

# Run with watch mode
npm run test:watch

# Run with UI (interactive)
npm run test:ui
```

---

## 📊 Test Scenarios

### Proposal Edit & Save Flow (`08-proposal-edit-save.test.ts`)

✅ **CREATE** — Generate draft proposal  
✅ **READ** — Fetch for editing  
✅ **UPDATE** — Auto-save with 2s debounce  
✅ **MULTIPLE EDITS** — Continuous editing session  
✅ **METADATA** — Update budget alongside text  
✅ **STATUS TRANSITION** — Draft → Sent  
✅ **LATE EDITS** — Edit after sending  
✅ **VALIDATION** — Empty text, large text (10KB+)  
✅ **CLEANUP** — Soft delete

### Contract Edit & Save Flow (`09-contract-edit-save.test.ts`)

✅ **CREATE** — Generate NDA contract  
✅ **READ** — Fetch for editing  
✅ **UPDATE SECTION** — Edit individual sections  
✅ **ADD SECTION** — Append new clauses  
✅ **PARTY NAMES** — Update parties  
✅ **STATUS FLOW** — Draft → Reviewed → Signed  
✅ **E-SIGNATURE** — Typed signature with metadata  
✅ **IMMUTABILITY** — Prevent edits after signing  
✅ **VALIDATION** — Large text (50KB+), special chars  
✅ **HISTORY** — Timestamp tracking

### Full Workflow (`10-full-workflow.test.ts`)

**Step 1: Client Management**
- Create client in CRM
- Update status: Lead → Active

**Step 2: Proposal Generation**
- Generate AI proposal
- Edit content multiple times
- Send to client
- Track client view
- Accept proposal

**Step 3: Contract Signing**
- Generate service agreement
- Edit terms
- Review contract
- E-signature by client

**Step 4: Project Delivery**
- Create project from proposal
- Add tasks with statuses

**Step 5: Client Portal**
- Create branded portal
- Upload files
- Generate invoices

**Verification**
- All entities linked correctly
- Data integrity check

---

## 🔧 Troubleshooting

### ❌ Authentication Failed

```bash
Error: Freelancer auth failed: Invalid login credentials
```

**Solution:**
1. Verify user exists in Supabase Auth
2. Check password in `.env.local`
3. Ensure `FREELANCER_PASSWORD` env var is set

### ❌ RLS Policy Errors

```bash
Error: new row violates row-level security policy
```

**Solution:**
1. Check if migrations are applied:
   - `supabase/migrations.sql`
   - `supabase/update-01.sql` through `update-23.sql`
2. Verify user role in `profiles` table

### ❌ Foreign Key Violations

```bash
Error: violates foreign key constraint
```

**Solution:**
- Tests create dependencies (Client → Proposal → Contract)
- Ensure cleanup runs in reverse order
- Check `afterAll()` hooks

---

## 📈 Test Reports

### Current Coverage

```
┌─────────────────────────────────────────────────┐
│  Feature          │ Tests │ Pass │ Coverage     │
├───────────────────┼───────┼──────┼──────────────┤
│  Clients          │   4   │  ✅  │ CRUD + RLS   │
│  Proposals        │   5   │  ✅  │ Pipeline     │
│  Contracts        │  15   │  ✅  │ Full flow    │
│  Portals          │  13   │  ✅  │ Access + msg │
│  Analytics        │   5   │  ✅  │ Tracking     │
│  Proposal Edit    │  11   │  ✅  │ 100%         │
│  Contract Edit    │  13   │  ✅  │ 100%         │
│  Full Workflow    │  18   │  ✅  │ E2E          │
├───────────────────┼───────┼──────┼──────────────┤
│  TOTAL            │  84   │  ✅  │ Comprehensive│
└─────────────────────────────────────────────────┘
```

---

## 🎯 Next Testing Priorities

### Before Phase 1 (Website Analyzer)

- [ ] Invoice generation and payment tracking
- [ ] Time tracking accuracy
- [ ] Email notification delivery
- [ ] Webhook processing (Stripe/Chargebee)
- [ ] PDF generation for proposals/contracts
- [ ] Mobile app API endpoints

### Integration Tests Needed

- [ ] Payment flow: Stripe checkout → webhook → database update
- [ ] Email flow: Proposal sent → client opens → notification created
- [ ] Document flow: Generate → edit → save → PDF export
- [ ] Portal flow: Create → share link → client access → messaging

### Performance Tests

- [ ] Large proposal (100KB+ text) save time
- [ ] 100+ proposals pipeline render time
- [ ] Concurrent edits (race conditions)
- [ ] Database query optimization

---

## 🤝 Contributing

### Writing New Tests

1. **Follow the pattern:**
   ```typescript
   describe("Feature Name — Flow Description", () => {
     beforeAll(async () => { /* setup */ });
     afterAll(async () => { /* cleanup */ });
     
     it("✓ ACTION — what it tests", async () => {
       // Arrange
       // Act
       // Assert
       console.log(`    ✅ Success message`);
     });
   });
   ```

2. **Naming convention:**
   - Use `✓` for passing tests in description
   - Use descriptive action verbs: CREATE, UPDATE, DELETE, VERIFY
   - Log success with `✅` emoji

3. **Cleanup:**
   - Always clean up created data in `afterAll()`
   - Delete in reverse order (child → parent)
   - Clear ID variables after deletion

### Running Tests in CI/CD

```yaml
# .github/workflows/test.yml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install
      - run: npm test
    env:
      FREELANCER_PASSWORD: ${{ secrets.FREELANCER_PASSWORD }}
      CLIENT_PASSWORD: ${{ secrets.CLIENT_PASSWORD }}
```

---

## 📞 Support

If tests fail or you need help:

1. Check the error message and stack trace
2. Review the troubleshooting section above
3. Run with `--reporter=verbose` for detailed output
4. Check Supabase logs for database errors

---

**Last Updated:** September 4, 2026  
**Test Suite Version:** 2.0  
**Total Tests:** 84  
**Maintained by:** DealPilot Team
