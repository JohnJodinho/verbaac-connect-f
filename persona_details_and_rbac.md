# Persona 1: The Guest

## 1. Scope & Intent

The Guest is an anonymous visitor who has not yet created or logged into an account. Their primary goal is to browse the value proposition and search for available listings to determine if the platform meets their needs 2222.

## 2. Accessible Pages & Page Types

Landing Page (Marketing Page): The primary home page detailing the platform's dual-service ecosystem (housing and marketplace) 3333.

- Housing Discovery (Browse Page): A public-facing gallery of available accommodation listings444444
- Marketplace Discovery (Browse Page): A public-facing gallery of second-hand items for sales.
  Listing Detail Previews (Dynamic View Page): Individual pages for specific houses or items, with limited data visibility666666666
- About / FAQ / Legal (Static Pages): Pages explaining the escrow system (Secure Pay), verification process, and terms of service777777777

## 3. Content Visibility

A Guest has "Read-Only" access to high-level information but is restricted from seeing sensitive or contact-specific data888888888

| Feature              | Visible to Guest? | Detail/Restriction                                                                         |
| :------------------- | :---------------- | :----------------------------------------------------------------------------------------- |
| Property/Item Title  | Yes               | Displays the name and headline 99999                                                       |
| Price                | Yes               | Shows the rent or item price 1010101010                                                    |
| Images/Videos        | Yes               | Full gallery access to see the asset 11111111                                              |
| General Location     | Yes               | Neighborhood or campus zone (e.g., "Naraguta") 121212121212121212                          |
| Verification Badge   | Yes               | Confirms if an Ambassador has verified the listing 13131313.                               |
| User Reviews         | Yes               | Public ratings and comments for trust-building 1414141414                                  |
| Landlord/Seller Name | Yes               | The name or shop name is visible 1515151515                                                |
| Contact Details      | No                | Phone numbers, WhatsApp links, and chat buttons are hidden behind a login wall161616161616 |
| Precise GPS/Pin      | No                | Exact map coordinates are restricted to prevent off-platform "agent" poaching .            |
| Roommate Profiles    | No                | Completely hidden for student safety and privacy 181818                                    |

## 4. Functional Capabilities (Actions & Restrictions)

**Allowed (Read Only):**

- Search and filter by price, property type, or category 1919191919
- Sort listings (e.g., newest, lowest price) 2020202020
- View "How it Works" animations or tutorials 21.

**Restricted (Blocked Actions):**

- No Messaging: Cannot chat with landlords or sellers222222222222222222
- No Transactions: Cannot book a room or buy an item via Secure Pay232323232323232323
- No Social Interaction: Cannot post reviews or match with roommates242424242424242424
- No Listing: Cannot post properties or items for sale25.

## 5. Gating & Redirection

If a Guest attempts a restricted action, the system will trigger a specific response:

- **Call-to-Action (CTA):** Clicking "Book Now," "Message," or "Find Roommates" will open a modal or redirect to the /signup page with a message: "Sign up to securely message landlords and book your stay"262626262626262626
- **Role Teaser:** When clicking the "Agreements" tab, the Guest is shown an infographic explaining the benefit of digital contracts, followed by a "Get Started" button272727272727272727

---

# Persona 2: The Consumer

## 1. Scope & Intent

The Consumer is a registered and verified user (Student/NYSC/Fresh Graduate)2. Their primary goal is to browse, secure, and pay for housing or second-hand items while protected by the Verbum Secure Pay escrow system 333333333

## 2. Accessible Pages & Page Types

- Consumer Dashboard: A personalized view of recommended housing and marketplace items 444.
- Roommate Matching Gallery: A specialized portal to view "seeker" or "host" profiles based on lifestyle preferences.
- Digital Agreements Portal: A secure area to review and sign rental contracts6666.
- My Wallet & Transactions: A ledger for tracking payments, "pending_balance," and escrow status?.
- Dispute Center: A functional area to file complaints using Al-supported forms (e.g., uploading unboxing videos or photos for verification)8888.

## 3. Content Visibility

Visibility for the Consumer is divided into two stages: Pre-Payment and Post-Payment.

| Feature          | Pre-Payment Visibility                                     | Post-Payment (Escrow Held) Visibility                       |
| :--------------- | :--------------------------------------------------------- | :---------------------------------------------------------- |
| Asset Details    | Title, Price, Photos, and General Zone 999.                | Same as Pre-Payment 10.                                     |
| Precise Location | Hidden. Only "General Zone" (e.g., Naraguta) is visible"". | Revealed. Full address and Google Pin/GPS location 12.      |
| Contact Info     | Hidden. Only "In-App Chat" is available 1313.              | Revealed. Landlord/Seller's direct phone number/WhatsApp14. |
| Trust Metrics    | Verification badges and public reviews 151515              | Full history of Landlord/Seller ratings 16.                 |
| Roommate Data    | Lifestyle preferences of potential matches17.              | N/A (Handled via social matching).                          |

## 4. Functional Capabilities (Actions & Restrictions)

**Allowed (Tenant/Buyer Actions):**

- **Secure Booking:** Pay rent plus the 12% service charge (10% booking + 2% service fee) into escrow 18.
- **Marketplace Purchase:** Pay for items plus the 12% commission 19.
- **Verification & Release:** Confirm property inspection or item quality to release funds to the provider 20202020
- **Dispute Filing:** Initiate a dispute if an item is sabotaged or the property does not match the listing 21212121
- **Reviewing:** Post ratings on cleanliness, safety, and value after a confirmed stay/purchase 22.

**Restricted (Blocked Actions):**

- **Direct Payouts:** Cannot withdraw funds from the wallet (Consumers only pay into the system)23232323
- **Asset Management:** Cannot list properties or market items without switching roles24.

## 5. Gating & Redirection

- **Escrow Gate:** Attempting to view a property's precise location or landlord's phone number triggers a: "Pay to Reveal: Protect your transaction with Verbum Secure Pay" message 25.
- **KYC Completion:** Users cannot access "Roommate Matching" or "Agreements" until they provide university-specific identity data (e.g., Matric No) 26.

---

# Persona 3: The Seller

## 1. Scope & Intent

The Seller is a registered user who has undergone the "Marketplace Profile" onboarding 22. Their primary goal is to list items for sale, manage inventory, and coordinate pickups or deliveries with buyers to earn revenue 3333. This role transitions the user from a buyer (Consumer) to a provider with a "display_id" formatted as SLR-YEAR-SEQ44.

## 2. Accessible Pages & Page Types

Seller Dashboard (Management View): A high-level overview of active listings, pending orders, and total earnings 55.

- Listing Creation Suite (Form/Wizard): A multi-step flow to input item titles, conditions, prices, and media 666.
- Inventory Manager (Gallery View): A page to track the "Availability Status" (Available, Sold, Reserved) and "Quantity" of listed items777.
- Order Tracking & Fulfillment (Transactional): Detailed views for specific sales, including the "Market Logistics" choice (Pickup or Delivery) 8888.
- Seller Wallet (Financial): Access to the individual ledger for tracking "pending_balance" from escrow and "available_balance" for withdrawal.

## 3. Content Visibility

The Seller has full access to their own data and limited visibility into buyer information for transaction security 1010

| Feature              | Visible to Seller? | Detail/Restriction                                                                                                      |
| :------------------- | :----------------- | :---------------------------------------------------------------------------------------------------------------------- |
| Active Listings      | Yes                | Full control over titles, descriptions, and media"".                                                                    |
| Seller Rating        | Yes                | Can see their public 1-5 star feedback and reviews 12121212                                                             |
| Buyer Identity       | Limited            | Can see the buyer's name and "shipping_address" (if delivery is chosen) only after escrow payment is confirmed 13131313 |
| Buyer Contact Info   | No                 | Phone numbers are hidden; communication must happen via the "In-App Chat" to protect buyer privacy 1414                 |
| Commission Breakdown | Yes                | Sees the 12% deduction (commission) from their "base_price"15151515                                                     |
| Dispute Data         | Yes                | Can see Al-generated computer vision scores or Admin comments if a buyer files a quality complaint 16161616             |

## 4. Functional Capabilities (Actions & Restrictions)

**Allowed (Seller Actions):**

- **List Items:** Create listings with mandatory "Condition Tags" (Used, Refurbished, Brand New) and at least 3 photos 171717.
- **Manage Prices:** Toggle between "Negotiable" or "Fixed" price types 18.
- **Fulfillment:** Update item status to "Sold" or "Reserved" to prevent wasted inquiries¹.
- **Chat:** Negotiate and coordinate logistics within the app's messaging system20202020.
- **Payouts:** Request withdrawals of the "available_balance" once the buyer confirms the item matches the description and escrow is released 21.

**Restricted (Blocked Actions):**

- **Direct Payment:** Cannot request payment outside the platform; doing so violates trust and safety protocols22222222
- **Housing Management:** Cannot list rooms or hostels unless they also activate the Landlord or Agent roles 23232323.
- **Admin Tasks:** Cannot resolve their own disputes or moderate other sellers24.

## 5. Gating & Redirection

- **Onboarding Wall:** To list an item, the user must first provide "Financial & Payment Details," including a Bank Name, Account Name (matching ID), and Account Number for rent/sale disbursement 25.
- **KYC Status:** Listings from new sellers are marked as "pending" until the "verification_status" is updated by an admin to build buyer confidence26262626

---

# Persona 4: The Landlord

## 1. Scope & Intent

The Landlord is a verified individual or company whose primary goal is to list, manage, and rent out residential properties 33. This role is assigned a unique identity (e.g., LLD-YEAR-SEQ) and is responsible for maintaining accurate listing data, responding to inquiries, and managing rent disbursements through the Verbaac Secure Pay escrow system44444444

## 2. Accessible Pages & Page Types

- Landlord Dashboard (Management Hub): A central view showing "num_properties_managed," active bookings, and current verification status 5555
- Property & Listing Suite (Form/Wizard): Tools to create "buildings" (parent assets) and "listings" (individual units) with detailed metadata like room dimensions, bathroom types, and amenities666666666
- Booking Management (Transactional): A list of prospective tenants who have paid into escrow, allowing the landlord to confirm move-ins77777
- Financial/Payout Portal (Ledger): Access to the landlord's "wallet" to view the 88% base rent payout and "available_balance" for withdrawal888888888888888888888
- Verification Tracking: A page to monitor the progress of physical audits conducted by Ambassadors 9999999999999999999

## 3. Content Visibility

The Landlord sees comprehensive data regarding their assets and limited, transaction-contingent data about tenants 10.

| Feature              | Visible to Landlord? | Detail/Restriction                                                                                       |
| :------------------- | :------------------- | :------------------------------------------------------------------------------------------------------- |
| Asset Performance    | Yes                  | Views for listings marked as "Verified," "Occupied," or "Pending Vetting"1111111111                      |
| Tenant Identity      | Limited              | Can see tenant names and "tenant_sub_profiles" (institution/level) only after a booking is initiated 12. |
| Tenant Contact Info  | Restricted           | Direct phone/WhatsApp is only revealed after the tenant pays into escrow13.                              |
| Verification Reports | Yes                  | Can see "amenities_confirmed" and comments from the Ambassador's visit14141414141414141414141414141414   |
| Revenue Splits       | Yes                  | Transparent view of the 12% platform commission vs. the 88% net rent 15151515151515151515151515151515    |
| Competitor Data      | No                   | Cannot see precise payout details or internal documents of other landlords.                              |

## 4. Functional Capabilities (Actions & Restrictions)

**Allowed (Landlord Actions):**

- **Asset Creation:** Add properties with "Media View" ($360^{\circ}$ views/video tours) and specify "listing_terms" such as yearly or semester frequency 16161616
- **Tenant Selection:** Accept or reject "roommate_splitting" requests and set "max_occupancy" for units 17171717.
- **Communication:** Chat with prospective tenants to answer inquiries 18181818
- **Confirmation:** Confirm the tenant has successfully moved in to trigger the release of escrowed funds 19.

**Restricted (Blocked Actions):**

- **Direct Payments:** Strictly prohibited from requesting off-platform payments to maintain the "Verified" status2020202020202020202020
- **Self-Verification:** Cannot approve their own listings; all must pass through an Ambassador and Admin review212121212121212121
- **Marketplace Selling:** Cannot list resale items without switching to the Seller persona.

## 5. Gating & Redirection

- **KYC Wall:** Landlords must upload a government-issued ID (National ID, Driver's License, etc.) and "Proof of Property Ownership" (C of O or Rent Agreement) before publishing any listing22222222222222222222222222222222
- **Financial Validation:** Bank account names must match the provided legal ID or BVN before payouts are enabled23232323232323232323232323232323
- - **Vetting Gate:** All new listings are tagged "Pending Verification" and hidden from public search until an Ambassador report is approved 242424242424242424

---

# Persona 5: The Agent

## 1. Scope & Intent

The Agent is a professional intermediary managing a portfolio of properties. Their primary goal is to scale listings rapidly while acting as a bridge between property owners (Landlords) and students. They are identified by a unique AGT-YEAR-SEQ ID.

## 2. Accessible Pages & Page Types

- Agent Dashboard: Real-time view of "number of properties managed," "total commissions earned," and "pending verifications".
- Unified Property Management Suite: A dashboard where agents can perform bulk updates to listings, prices, and availability.
- The "Add New Building" Wizard: A specialized multi-step flow that includes the Landlord Search/Add component.
- Escrow Tracker: A view of tenant payments currently held in "Verbaac Secure Pay".

## 3. Content Visibility & Functional Capabilities

| Feature                     | Agent Visibility & Capability | Detailed Rule/Logic                                                                                                          |
| :-------------------------- | :---------------------------- | :--------------------------------------------------------------------------------------------------------------------------- |
| Landlord Search             | Full Search Access            | Can search for existing Landlords by phone or email to avoid duplicate owner_id entries.                                     |
| Shadow Profile Creation     | Create (Proxy)                | Can initiate a "Landlord Onboarding Mini-Form" to create a placeholder landlord_profile with legal name and contact details. |
| Building/Listing Management | Full CRUD (Managed By)        | Can create, read, update, and delete listings where they are set as the "Managed By" user.                                   |
| Payout Visibility           | Restricted View               | Can see that the 88% is held in escrow but cannot access the Landlord's wallet data.                                         |
| Verification Status         | Read-Only Status              | Monitors if the Ambassador has verified the asset to move it from "Pending" to "Live".                                       |

## 4. The "Proxy Workflow" Logic

- **Search/Match Phase:** Before adding a building, the Agent searches for the owner. If a match is found, they request a "Management Link" to that existing owner_id.
- **Mini-Form Phase:** If no match exists, the Agent fills in the Landlord Mini-Form.
- Fields: Full Name, Phone (WhatsApp), and Email.
- DB Persistence: The system auto-generates a landlord_profile with placeholder KYC data (e.g., id_url set to "pending_onboarding").
- **Live Listing Phase:** The building is saved with the Agent as the managed_by_id. Once the Ambassador verifies the physical site, the listing goes live for students.
- **The Payout Gate (The Hard Stop):** \* When a tenant pays rent, the 88% is held in a "Restricted Ledger".
- The Landlord receives an automated "Payment Pending" notification via WhatsApp/Email.
- The Landlord must then complete their full KYC (ID upload and bank details) to "Claim" their wallet and receive the funds.

## 5. Restrictions

- **No Commission Withdrawal:** Agents cannot withdraw their 3% share until the tenant confirms the move-in and the Landlord is fully verified.
- **No ID Forging:** Agents can upload property documents (Rent Agreements) but cannot bypass the Landlord's personal ID verification.

---

# Persona 6: The Ambassador (Finalized)

## 1. Scope & Intent

The Ambassador is a student verification officer whose primary goal is to physically or virtually confirm the existence and quality of housing accommodations¹. They serve as the platform's eyes on the ground, ensuring that listing details provided by Landlords or Agents are true before a listing is marked "Verified"2.

## 2. Accessible Pages & Page Types

- Verification Task Queue: A specialized list of housing listings tagged as "Pending Verification" and auto-assigned based on campus proximity 3333,
- Ambassador Mobile Verification Form: A GPS-locked form for real-time field data entry (amenities, photos, and rent confirmation)4444
- Credibility & Analytics Dashboard: Displays personal performance metrics, including "Total credibility score," verified listings, and rejection rates 5555.
- Verification Wallet: Tracking for the 2% commission earned per verified rent booking (e.g., 5,000 on a 250,000 rent) 666666666
- Dispute Re-Verification Portal (Tier 3 Only): Access for Lead Ambassadors to conduct secondary field audits if a tenant disputes a property condition7777.

## 3. Content Visibility & Functional Capabilities

| Feature           | Ambassador Capability | Detailed Rule/Logic                                                                                                             |
| :---------------- | :-------------------- | :------------------------------------------------------------------------------------------------------------------------------ |
| Housing Data      | Full Audit Access     | Can see all internal listing data (price, location, amenities) to conduct the check8888                                         |
| Marketplace Data  | No Access             | Ambassadors do not verify marketplace vendors or resale items; this is handled via Al (Computer Vision) and Admins.             |
| Contact Info      | Revealed for Audit    | Can view the Landlord/Agent's contact info strictly to coordinate the verification visit 10101010                               |
| Self-Verification | Strictly Blocked      | If an Ambassador is also a Landlord/Agent, the system prevents them from seeing or claimng their own listings for verification. |
| Dispute Audits    | Tier-Restricted       | Only "Tier 3/Lead Ambassadors" can perform re-verifications for active disputes 11111111                                        |

## 4. Verification & Dispute Logic

**Workflow:**

- **Auto-Assignment:** The system assigns a task based on proximity and availability 12121212
- **Geo-Validation:** The form requires a GPS capture at the property door; the backend compares this against the building's coordinates for a "Confidence Tier" Score 131313131313131313
- **Physical Evidence:** The Ambassador captures live photos and confirms the "Amenities Checklist" (water, light, kitchen, etc.) 14141414

**The Dispute "Fresh Eyes" Rule:**

- If a tenant files a condition complaint, a completely new Tier 3/Lead Ambassador-who did not perform the original audit-is sent for a field confirmation 15151515
- This ensures objectivity and prevents collusion 16161616

## 5. Restrictions

- **No Listing Approval:** Ambassadors submit reports; only an Admin can officially move a listing to "Verified"17.
- **No Marketplace Involvement:** Their authority is limited strictly to the housing segment 18.
- **Tier Limitations:** New (Tier 1) ambassadors cannot handle re-verifications or autonomous audits without supervision19.

---

# Persona 7: The Admin

## 1. Scope & Intent

The Admin's primary goal is platform governance. They do not participate in the marketplace as buyers or sellers but oversee all other personas 33. Their work ensures that the Verbaac Secure Pay system remains trusted and that all listings meet the platform's high standards 4444

## 2. Accessible Pages & Page Types

- Global Admin Dashboard: A high-level overview of Platform GMV, active users, and system health 5.
- Verification & Moderation Hub: A workspace to review Ambassador Reports and approve/reject housing listings 666.
- KYC Review Center: A dedicated area for verifying sensitive documents (Government IDs, Proof of Ownership) for Landlords, Agents, and Sellers 77777777.
- Dispute Resolution Center: A specialized portal where Admins review Al-scored complaints and make final rulings on escrow releases or penalties 88888
- Financial Operations (FinOps) Portal: Management of the global ledger, payment gateway integrations (Paystack/Monnify), and manual payout overrides 9999
- Master Registry Management: Interface to manage the "Geography Domain" (States, Cities, Zones) and the "Property Types" master list 101010

## 3. Content Visibility

Admins have "God-Mode" visibility, with different access levels based on their specific tier.

| Feature              | Admin Visibility   | Detail/Restriction                                                                                  |
| :------------------- | :----------------- | :-------------------------------------------------------------------------------------------------- |
| Sensitive KYC Data   | Full Access        | Can view uploaded IDs, BVNs (if provided), and property ownership documents 11111111                |
| Global Wallet Data   | Full Access        | Sees all pending_balance and available balance across the entire user base 12.                      |
| Escrow Details       | Full Access        | Monitors every transaction reference, including the split to landlords, agents, and ambassadors 13. |
| Private Chat Logs    | Limited/Audit Only | Can access chat threads only during active dispute resolution to protect user privacy 14.           |
| Al Confidence Scores | Full Access        | Sees the backend Al scoring for property condition and unboxing video analysis 15151515             |

## 4. Functional Capabilities (Actions & Restrictions)

**Moderation (CRUD):**

- Approve or reject listings based on Ambassador reports 16.
- Ban or deactivate users (Landlords/Sellers/Consumers) for policy violations 17.
- Manually assign or override Ambassador tasks 18.

**Dispute Resolution:**

- Issue reimbursements to tenants/buyers if an asset is in "Bad Condition"1919191919
- Charge penalty fees to providers for fraudulent listings or "Sabotage Fees" to consumers202020202020202020

**Master Control:**

- Create and retire property_types (e.g., adding "Studio Apartment") to ensure zero typos in the system 21.
- Update platform commission rates (e.g., adjusting the 12% model) 22.

## 5. Admin Tiers (RBAC Levels)

According to the ERD, the admin_tier enum defines three distinct levels2323.

1. **Super Admin:** Unrestricted access to all data, settings, and user management.
2. **Moderator:** Focuses on listing approvals, KYC verification, and general support.
3. **Finance:** Specialized access to wallets, ledger payouts, and tax compliance but cannot edit property types or ban users 24242424

---

**Frontend Development Team From: Project Lead, Verbacc Connect Subject: Technical Implementation Directive: Role-Based Access Control (RBAC) and Persona Switching**

Following our established system architecture and confirmed user personas, you are directed to implement the following Role-Based Access Control (RBAC) and Persona Switching logic. This implementation is critical for maintaining the security of the Verbaac Secure Pay escrow system and ensuring a seamless experience for our diverse user base in Jos.

### 1. Global State Management & Persona Context

You must implement a global Persona Context to manage the operational state across the entire responsive web app.

- **Persona State:** Maintain a currentActiveRole variable (default: consumer) and an unlockedRoles array derived from the roles_registry table.
- **Persistence:** Use localStorage to persist the currentActiveRole. If a user refreshes the page while in "Landlord Mode," the app must stay in that context.
- **Route Guarding:** Update the Protected Route. tsx component to accept a requiredRole prop. If the currentActiveRole does not match the permission level, redirect the user to their default Consumer dashboard.

### 2. Adaptive UI/UX & Navigation

The interface must dynamically transform based on the active persona.

- **Top-Navigation Switcher:** Implement a dropdown in the top-right header (adjacent to the profile photo). This must list all roles currently held in the roles_registry.
- **Persona Toggling:** For roles not yet activated, show a "Become a [Role]" CTA. Clicking this must trigger the respective Onboarding Wizard.
- **Dynamic Sidebar:** The sidebar in src/layout/DashboardLayout. tsx must re-map links based on the active persona:
  - Consumer Mode: Roommate Finder, Marketplace, My Bookings.
  - Landlord/Agent Mode: My Buildings, Listing Management, Payouts/Wallet.
  - Ambassador Mode: Verification Queue, Field Reports.
- **Visual Distinctions:** Use subtle color accents or a dedicated status badge (e.g., "Active: Agent") to ensure users are aware of their current operational mode.

### 3. On-Demand Role Activation (Onboarding Wizards)

Users start with a consumer role by default. Activation of professional roles must be "on-demand."

- **Activation Trigger:** If a Consumer attempts to "List a Property," redirect them to the Landlord Activation Wizard.
- **Data Collection Requirements:**
  - Landlord/Agent: Capture landlord_type (Individual/Agent/Company), upload Government ID (id_url), and Proof of Property Ownership (property_proof_url).
  - Financial Setup: Collect bank account details (account_name, account_number, bank_name) to link to the user's wallets record.
  - Legal Compliance: Include mandatory checkboxes for "Terms & Conditions" and "Data Policy (NDPR Compliance)."

### 4. API Integration & Security Headers

The frontend must provide the backend with the necessary context for authorization.

- **Header-Based Authorization:** Every request from src/lib/api.ts must include an X-Active-Role header.
- **Server-Side Verification:** The backend will use this header to verify against the roles_registry before executing write operations (e.g., creating a listing).
- **Data Scoping:** Ensure that fetching "My Listings" in Landlord Mode strictly filters by the owner_id or managed_by_id associated with the active session.

### 5. The "Shadow Landlord" & Payout Gate Workflow

This specialized flow is mandatory for the Agent persona when adding new inventory.

- **Agent Proxy Action:** Within the "Add New Building" wizard, implement a Landlord Search/Add component.
- **Placeholder Creation:** If a landlord is not found, allow the Agent to create a placeholder landlord_profile with basic contact details (Name, Phone, Email).
- **The Payment Lock:** The system must show that the 88% base rent is held in pending_balance.
- **The Claim Trigger:** When the Landlord receives the link and logs in, the frontend must intercept the session and force them into the Landlord Activation Wizard to claim their funds.
- **Fund Release:** Disbursement to the available_balance is blocked until the Admin/Ambassador marks the role as "Verified."

---

### Proposed Project Tree

**src/**

- **assets/** # Logos, icons, and global styles
- **components/** # Shared, stateless Ul components
  - **shared/** # Navbar, Footer, Sidebar, EscrowBadge
  - **ui/** # Reusable Shadcn/Tailwind primitives (Buttons, Inputs)
  - **forms/** # Common form wrappers (KYC upload, Multi-step wizard)
- **contexts/**
  - **AuthContext.tsx** # User session & Authentication
  - **PersonaContext.tsx** # Global state for currentActiveRole and Switching
- **hooks/**
  - **usePersona.ts** #Helper to check permissions and switch roles
  - **useAuth.ts**
- **layout/**
  - **MainLayout.tsx** #Guest/Public view (Navbar + Footer)
  - **AuthLayout.tsx** # Login/Register view
  - **Dashboard Layout.tsx** # Sidebar + Header (Adapts based on Active Role)
- **lib/** # API clients, utils, and validators
- **modules/**
  - **- shared/** # Wallet, Chat, and Notifications (used by all)
  - **consumer/** #Housing search, Marketplace, Roommates
  - **seller/** # Marketplace inventory & Order management
  - **landlord/** # Building/Listing management & KYC status
  - **agent/** # Portfolio management + Landlord Search/Add
    - **components/**
      - **Landlord ProxyForm.tsx** # For the "Shadow Landlord" workflow
    - **pages/** # Agent-specific dashboards
  - **ambassador/** # Housing Verification Queue & Report forms
  - **admin/** # Governance, FinOps, and Dispute Resolution
- **routes/**
  - **index.tsx** # Root router configuration
  - **Protected Route.tsx** # Permission-aware route guarding
- **types/** # Global TypeScript interfaces (Personas, Listings)
- **App.tsx** # Entry point with Context Providers
