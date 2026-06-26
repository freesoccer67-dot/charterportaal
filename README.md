# Cargro Charterportaal MVP

A Streamlit prototype for Stan's charterportaal idea.

This is a demo layer on top of MendriX/TMS thinking. It does **not** replace MendriX. MendriX stays the transport/order backbone. The charterportaal becomes Cargro's custom layer for route publishing, charter bidding, tariff explanation, weekly factuur, performance, margin and fair opportunity.

## Core idea

Planning creates or exports routes from MendriX. The portal receives every route with:

- Route ID
- Customer
- Zone: Midden, Oost, Zuid, Noord, West, Randstad
- Loading time
- Needed vehicle type
- Stops
- KM
- Hours
- Kilos
- Packages
- Needed equipment: laadklep, steekwagen, pompwagen, spanbanden
- Omschrijving / special instructions

The portal then calculates a route price using:

```text
route price = (km × vehicle km rate) + (stops × stop tariff) + (hours × hour rate)
```

Example vehicle km rates in the demo:

- L3: €0.25/km
- L4: €0.35/km
- Bakwagen: €0.45/km
- Bakwagen laadklep: €0.50/km

## What is included

- Executive overview
- Planning route upload page
- Route marketplace
- Open route bidding system
- Bid approval cockpit
- Charter account page
- Vehicle upload section
- Driver management section
- Weekly factuur / self-billing overview
- Tariff specification per route
- Power BI-style margin dashboard
- Charter performance dashboard
- Earnings scoreboard
- Fair route distribution system
- MendriX data flow page

## Why this is different from MendriX

MendriX handles transport orders and route execution.

The charterportaal handles Cargro's external charter network:

- Who can see which route
- Which vehicle/driver is connected to the charter
- What the route price is based on
- Which charters bid on difficult routes
- Which bid planning approves
- Whether route distribution is fair
- Weekly factuur transparency
- Cargro margin per route
- Charter performance and scoreboard

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

## Future real version

The fake data in `app.py` should later be replaced with:

- MendriX route/order import through API, CSV or middleware
- Database tables for routes, bids, charters, vehicles, drivers and invoices
- Real login/roles for planning, admin, charter and driver
- Charter document uploads: KVK, BTW, NIWO, insurance, rijbewijs
- Vehicle document/photo uploads
- Driver app/mobile PWA
- POD/photo/status sync back to MendriX
- PDF weekly self-billing statements
- Customer-specific tariffs
- TLN/diesel correction logic
- Approval history and dispute system
- Fairness algorithm with override reason
- Power BI or embedded analytics later

## Important note

This prototype uses fake demo data only. Do not put real customer addresses, driver details or financial data into this public demo repository.
