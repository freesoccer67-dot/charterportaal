# Cargro Charterportaal MVP

A Streamlit prototype for a Cargro charter portal.

This is a demo layer on top of MendriX/TMS thinking. It does **not** replace MendriX. MendriX stays the transport/order backbone. The charterportaal becomes Cargro's custom layer for route publishing, charter bidding, tariff explanation, weekly invoices, payables, disputes, performance, internal margin and fair allocation.

## Core structure

The portal is split into two separate role-based areas:

### 1. Cargro Office

Internal users can see:

- Route upload from MendriX / Excel / CSV
- Manual single-route creation
- Route management
- Bid approval
- Internal customer revenue
- Charter payout per route
- Cargro margin per route
- Weekly payables to charters
- Disputes
- Charter management
- Vehicles and drivers
- Internal fair allocation priority
- Margin dashboard

### 2. Charter Portal

Charters can only see their own private environment:

- Available routes / marketplace
- Their own assigned routes
- Their own bids
- Their own vehicles
- Their own drivers
- Their own invoices
- Their own invoice history
- Their own disputes/profile

Charters do **not** see Cargro customer revenue, Cargro margin, other charters' invoices, or internal allocation logic.

## Route upload

Planning has two upload options:

1. **Bulk upload from MendriX / Excel / CSV**  
   This is the main workflow. One file can contain multiple routes.

2. **Manual single route**  
   This is for urgent routes, corrections or demo/testing.

The portal receives every route with:

- Route ID
- Route type, usually a mixed delivery route
- Internal account group / source group
- Zone: Midden, Oost, Zuid, Noord, West, Randstad
- Loading time
- Needed vehicle type
- Stops
- KM
- Hours
- Kilos
- Optional/internal package count
- Needed equipment: laadklep, steekwagen, pompwagen, spanbanden
- Omschrijving / special instructions

## Route price calculation

The portal calculates the route payout with:

```text
route payout = (km × vehicle km rate) + (stops × stop tariff) + (hours × hour rate)
```

Example vehicle km rates in the demo:

- L3: €0.25/km
- L4: €0.35/km
- Bakwagen: €0.45/km
- Bakwagen laadklep: €0.50/km

## What is included

- Separate Cargro Office and Charter Portal
- Route upload page with bulk and manual modes
- Route marketplace with highlighted filters
- Tariff specification inside route cards
- Open route bidding system
- Bid approval cockpit
- Charter login simulation with email/password
- Charter vehicles and drivers
- Charter invoice history
- Route-level dispute flow
- Internal invoices/payables page
- Internal margin dashboard
- Charter management page
- Fair allocation page
- MendriX data flow page

## Run locally

```bash
pip install -r requirements.txt
streamlit run app.py
```

## Deploy on Streamlit Cloud

1. Go to Streamlit Cloud.
2. Click **New app**.
3. Choose this GitHub repo: `freesoccer67-dot/charterportaal`.
4. Main file path: `app.py`.
5. Click **Deploy**.

## Demo login

The demo includes fake charter emails. Use password:

```text
demo123
```

In the real version, this must be replaced with secure role-based authentication.

## Future real version

The fake data in `app.py` should later be replaced with:

- MendriX route/order import through API, CSV or middleware
- Database tables for routes, bids, charters, vehicles, drivers, invoices and disputes
- Real login/roles for planning, admin, charter and driver
- Charter document uploads: KVK, BTW, NIWO, insurance, rijbewijs
- Vehicle document/photo uploads
- Driver app/mobile PWA
- POD/photo/status sync back to MendriX
- PDF weekly self-billing statements
- TLN/diesel correction logic
- Approval history and dispute system
- Fair allocation algorithm with override reason
- Power BI or embedded analytics later

## Important note

This prototype uses fake demo data only. Do not put real customer addresses, driver details or financial data into this public demo repository.
