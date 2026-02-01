# Verbacc Escrow System

## 1. Comprehensive Payment Flows

### Housing Payment Flow (PropTech)

The housing flow is designed to eliminate high agent fees and fraud through the Verbum  
Secure Pay escrow system.

- **Booking:** A prospective tenant pays the rent plus a 12% service charge (composed of  
  a 10% booking fee and a 2% service fee).

- **Escrow Hold:** Funds are held securely by the platform. The system then reveals the  
  property's precise location and the contact details for the verified landlord or agent.

- **Inspection:** The tenant uses the revealed details to physically visit and inspect the  
  property to ensure it matches the digital listing.

- **Release & Split:** Upon tenant acceptance and landlord/agent confirmation, the escrow  
  releases the funds into respective wallets:
  - Landlord: Receives 88% (Base Rent).
  - Agent (if involved): Receives 3%.
  - Ambassador: Receives 2% for the initial verification.
  - Verbacc Platform: Retains the remaining 7% (or 10% if no agent is involved) as  
    net revenue.

---

### Housing Dispute Stages

1. **AI Cross-Check & Scoring:** A tenant files a complaint via an intelligent form. The  
   system uses AI to compare current complaint data (photos/descriptions) against the  
   Ambassador's initial verification report.
   - **High Score (>90% match):** The system flags the property as _"In Good  
     Condition."_

   - **Low Score:** The system flags as _"Bad Condition."_ The tenant is reimbursed, and  
     the landlord is charged a penalty fee after admin review.

2. **Ambassador Field Confirmation:** If the AI score is high but the tenant still disputes, a  
   Secondary/Lead Ambassador (who did not perform the original check) is sent to the  
   location.
   - **Condition Check:** If they confirm the property is below par, the landlord pays a  
     higher fee (to cover the refund and the Ambassador’s extra visit).

   - **Change of Mind (New):** If the property is confirmed as _"Good"_ but the tenant  
     simply decides not to proceed after being escorted by an agent/ambassador, the  
     tenant pays a _"Service/Viewing Fee"_ deducted from their escrowed funds to  
     compensate the agent and platform.

3. **False Alarm Penalty:** If the Ambassador confirms the property is good and the tenant's  
   dispute is deemed frivolous (not a _"change of mind"_ but a false claim), the tenant is  
   charged a fee deducted from their escrowed funds to compensate the Ambassador.

---

### Marketplace Payment Flow (Resale)

This flow targets second-hand goods like electronics and furniture, focusing on localized safety.

- **Payment:** The buyer pays for the item. The total includes the item price and a 12%  
  marketplace commission.

- **Verification Period:** Funds are held in escrow. A Transaction Protection Notice  
  informs the buyer that payment is only released after quality confirmation.

- **Delivery/Pickup:** The buyer meets the seller at a localized pickup point or uses Verbum  
  Logistics.

- **Confirmation:** Once the buyer confirms the item matches the _"Used,"_ _"Refurbished,"_ or  
  _"Brand New"_ condition listed, funds are released to the seller's wallet after the 12%  
  commission is deducted.

---

### Refined Dispute Resolution (Marketplace)

- **Stage 1: Computer Vision (CV) Analysis:**
  - The buyer files a complaint with photos.
  - **Applied Fix:** For items over ₦20,000, the buyer must provide an unboxing  
    video or high-res photos.
  - **Logic:** AI (CV) compares these against the seller's initial listing images.
  - **Outcome:** If the AI confirms the condition is _"Good"_ (matches listing), the Admin  
    reviews the case; the buyer may be charged a fee for a false dispute.

- **Stage 2: Proportional Quality Penalty (Admin Review):**
  - If the condition is _"Bad,"_ an Admin reviews the discrepancy.
  - **Applied Fix:** The fee charged to the seller is calculated proportionally to the  
    quality drop (e.g., an item listed as _"Fairly Used"_ arriving in _"Scrapped"_ condition  
    incurs a higher penalty than a minor cosmetic issue).

  - **Outcome:** Funds are reimbursed to the buyer's wallet.

- **Stage 3: Sabotage Protection:**
  - If the Admin/AI detects the buyer intentionally damaged the item to force a refund  
    (sabotage).

  - **Outcome:** The buyer is charged a heavy _"Sabotage Fee,"_ and the seller is  
    compensated for the damage.
