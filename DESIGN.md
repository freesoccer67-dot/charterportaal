# Charterportaal DESIGN.md

## Goal
Redesign Charterportaal into a premium blue-white logistics control portal for real distribution operations. It must feel like a serious B2B operating system for a distribution company managing routes, charters, requests, bids, invoices, disputes and weekly payouts.

## Visual direction
Use this as inspiration, not copying:
- Vercel: clean precision and strong hierarchy
- Linear: minimal product layout and calm focus
- HP: white canvas with electric-blue accents
- IBM Carbon: enterprise data density

The portal should feel premium, calm, operational, trustworthy and fast to scan.

## Colors
- App background: #F6F9FC
- Surface white: #FFFFFF
- Soft blue surface: #EEF6FF
- Border: #D9E4F2
- Primary blue: #0B63CE
- Strong blue: #074EA3
- Electric blue accent: #2F80FF
- Primary navy text: #0B1220
- Secondary slate text: #42526B
- Muted text: #6B7A90
- Success: #14804A
- Warning: #B7791F
- Danger: #C2410C

Use blue for primary actions, green for approved/completed/paid, amber for pending/review, red-orange for rejected/dispute/overdue and grey for inactive states.

## Typography
Prefer Inter, Geist or system font.
- Page title: 28-36px, weight 700
- Section heading: 18-22px, weight 650
- Card title: 15-17px, weight 650
- Body: 14-16px
- Table text: 13-14px
- Labels: 11-12px, weight 600

## Layout
- Logged-in portals should use sidebar navigation plus top bar.
- Dashboard should use metric cards and operational tables.
- Tables are core UI and must look clean, dense and professional.
- Use clear master-detail layouts for route and invoice review.
- Use 24-32px desktop page padding and 16px mobile padding.
- Use 12-18px card radius and 8-12px control radius.

## Navigation
Office side:
- Dashboard
- Routes
- Aanvragen & biedingen
- Facturen & disputes
- Charters
- Instellingen

Charter side:
- Marketplace
- Mijn aanvragen
- Mijn routes
- Facturen
- Disputes
- Profiel

Avoid too many pages. Combine related flows.

## Login flow
The front page must immediately show two login choices:
- Office login
- Charter login

Clicking Inloggen in the top navigation should jump to the login choice section.

## User-facing language
Keep headings in Dutch. Use professional operational language.

Avoid user-facing words that make the app feel temporary, such as demo, prototype, sample, mock, dummy, placeholder or test data.

Use alternatives:
- Concept
- Te controleren
- Nog geen gegevens
- Upload een Excelbestand
- Operationeel overzicht

## Business rules
- Higher offer must happen inside the route request flow.
- Mijn aanvragen and hogere biedingen should be combined.
- Office route requests, higher bids and applicants per route should be combined.
- Expected payment is calculated by office and not editable by charter.
- Charter can enter a separate invoice amount.
- Show excl. btw and incl. btw clearly.
- Vehicle profiles should include beladingsruimte.
- Do not make POD/navigation a core portal feature while MendriX handles it.

## Components
Buttons must look clickable and premium. Primary buttons are blue. Secondary buttons are white or pale blue. Danger actions use red-orange.

Cards use white surfaces, light borders, subtle depth and clear headers.

Tables use strong headers, status badges, readable row height, hover states and grouped actions.

Status badges should include states like Concept, Te controleren, Gepubliceerd, Aangevraagd, Hoger bod, Goedgekeurd, Toegewezen, Afgerond, Factuur ingediend, Dispute open and Uitbetaald.

## Agent instructions
When redesigning:
1. Inspect existing pages and components first.
2. Do not remove working business logic.
3. Do not remove upload, route request, bid approval, invoice, dispute, login or Supabase functionality.
4. Apply this design system consistently.
5. Remove temporary/demo-feeling language from user-facing UI.
6. Keep Dutch headings.
7. Summarize exactly which files changed.

## Definition of done
The redesign is successful when the portal looks like a real premium logistics SaaS, office and charter flows are clear, login choices are easy to find, buttons/tables/cards/badges are consistent, and the interface is credible enough to show the distribution company owner.
