# Cargro Charterportaal Netlify Prototype

A polished static Netlify prototype for the Cargro charter portal.

## Live site

https://cargrocharterportaal.netlify.app

## What is included

- Cargro Office and Charter role switch
- Dashboard with route, payout, margin and action metrics
- Route upload with two flows:
  - bulk upload placeholder for MendriX / Excel / CSV
  - manual single-route entry
- Routes to be approved
- Route marketplace
- Bid approval cockpit
- Invoice submission and payables overview
- Disputes to be handled as its own action page, not just a filter
- Charter / vehicle overview
- Internal margin and allocation screen
- More colorful tables, status badges and button styles

## Files

- `index.html` — Netlify/static app shell
- `styles.css` — visual design and responsive layout
- `app.js` — demo data, navigation, local state and interactions

## Important note

This is still a frontend prototype with fake demo data. It uses browser localStorage only. Do not put real customer addresses, driver information, invoices or private route data into this public demo repository.

## Real production version later

For the real version, replace the demo data with:

- Supabase Auth for Cargro Office / Charter roles
- Supabase Postgres tables for routes, bids, invoices, disputes, charters, vehicles and drivers
- Supabase Storage for Excel imports, invoice files and documents
- Row-level security so each charter only sees their own routes, invoices and disputes
- MendriX import/API connection
- Real audit trail for approvals, bid decisions and disputes
