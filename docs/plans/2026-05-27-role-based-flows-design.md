# Role-Based Flows Design — MijnDesignAirco

**Datum**: 2026-05-27
**Status**: Goedgekeurd

## Samenvatting

De huidige lineaire 4-staps demo (Formulier → Email → Installateur → Dashboard) wordt omgebouwd naar een rol-gebaseerde navigatie met drie tabs: **Klant**, **Installateur** en **Admin**. Elke rol heeft een eigen flow met sub-steps. Data stroomt tussen rollen via shared client-side state.

Dit voegt twee ontbrekende email-views toe (bevestigingsmail aan klant, offertemail aan klant) en een meldingen-panel voor de admin.

---

## Architectuur

- **SPA met client-side state** — geen backend, geen auth, geen database
- `page.tsx` blijft de centrale state-coordinator
- Drie rol-tabs in de navigatie vervangen de huidige 4 step-tabs
- Sub-step indicators per rol (klikbaar na voltooiing)
- CTAs in elke view leiden naar de volgende logische stap (ook cross-rol)

### State structuur (page.tsx)

```typescript
type RoleTab = "klant" | "installateur" | "admin";
type KlantStep = "aanvraag" | "bevestiging" | "offerte";
type InstallateurStep = "aanvraag" | "reactie";

interface InstallateurResponse {
  kosten: string;
  datum: string;
  doorlooptijd: string;
  toelichting: string;
  contact: string;
  telefoon: string;
  status: "geaccepteerd" | "afgewezen";
}

interface Notification {
  id: string;
  type: "aanvraag" | "offerte" | "afgewezen";
  message: string;
  timestamp: string;
}

// State in Home component:
activeRole: RoleTab
klantStep: KlantStep
installateurStep: InstallateurStep
formSubmitData: FormSubmitData | null
matchedInstaller: Installer | null
installateurResponse: InstallateurResponse | null
notifications: Notification[]
```

### Data flow

```
Klant submit form
  → formSubmitData + matchedInstaller filled
  → Installateur tab enabled (notification badge)
  → Admin notification: "Nieuwe aanvraag van [naam]"

Installateur responds (accept/reject)
  → installateurResponse filled
  → Klant offerte-step enabled
  → Admin notification: "Offerte verstuurd" / "Aanvraag afgewezen"
```

---

## Navigatie (navigation.tsx — AANPASSEN)

### Layout

```
[Logo MDA]  ─  [👤 Klant]  [🔧 Installateur]  [🛡 Admin]  ─  [● Demo modus]
```

### Specificaties

- **Drie tabs** met lucide-icons: `User` (Klant), `Wrench` (Installateur), `ShieldCheck` (Admin)
- Active state: underline indicator + bold text (bestaand patroon)
- **Notification badges**: klein getal-badge op tab wanneer er events zijn
  - Installateur: badge na klant form-submit
  - Admin: badge bij elke actie
- Demo modus badge: ongewijzigd
- Sticky nav met backdrop-blur: ongewijzigd

### Type definitie

```typescript
type RoleTab = "klant" | "installateur" | "admin";

interface NavigationProps {
  activeRole: RoleTab;
  onNavigate: (role: RoleTab) => void;
  installateurBadge: boolean;
  adminBadgeCount: number;
}
```

---

## Sub-step Indicator (step-indicator.tsx — NIEUW)

Herbruikbaar component voor sub-navigatie binnen een rol.

```typescript
interface StepIndicatorProps {
  steps: { key: string; label: string }[];
  currentStep: string;
  completedSteps: string[];
  onNavigate: (step: string) => void;
}
```

### Visueel

```
● Aanvraag  ─  ○ Bevestiging  ─  ○ Offerte
  (active)     (locked)          (locked)
```

- Filled dot (●) + bold text = actieve stap
- Outlined dot (○) + muted text = nog niet bereikt
- Filled dot (●) + normal text = voltooid, klikbaar
- Verbindingslijntjes tussen dots
- Past in bestaand kleurenpalet: mda-accent voor active, mda-text-muted voor locked

---

## Klant Flow

### Sub-step 1: Aanvraag (formulier-view.tsx — AANPASSEN)

- Bestaand formulier + airco preview + kaart
- Label: "Klant · Aanvraag"
- Na submit: success-state met CTA **"Bekijk je bevestigingsmail →"**
- CTA navigeert naar klantStep "bevestiging"

Wijzigingen t.o.v. huidig:
- Step-label tekst aanpassen
- Success-state CTA tekst/actie aanpassen
- "Bekijk de mail naar de installateur" → "Bekijk je bevestigingsmail"

### Sub-step 2: Bevestigingsmail (bevestiging-email-view.tsx — NIEUW)

Gesimuleerde email van platform naar klant.

**Email layout** (zelfde stijl als installer-email-view.tsx):

| Veld | Waarde |
|---|---|
| Van | Mijn Design Airco <noreply@mijndesignairco.nl> |
| Aan | [klant email] |
| Onderwerp | Je aanvraag is ontvangen — [model naam] |

**Email body**:
1. Aanhef: "Beste [voornaam],"
2. Tekst: "Bedankt voor je aanvraag. We hebben je aanvraag ontvangen en doorgestuurd naar een installateur bij jou in de buurt."
3. Aanvraag-samenvatting card: model, adres, postcode
4. Gekoppelde installateur card: naam, stad, reactietijd
5. "Wat gebeurt er nu?" tijdlijn:
   - ✓ Aanvraag ontvangen
   - → Installateur bekijkt je aanvraag (binnen 24 uur)
   - ○ Je ontvangt een offerte
6. Footer: platforminfo

**CTA onder email**: "Bekijk wat de installateur ontvangt →" → navigeert naar Installateur tab

```typescript
interface BevestigingEmailViewProps {
  formData: FormSubmitData;
  matchedInstaller: Installer;
  onNextStep: () => void; // → navigeer naar installateur
}
```

### Sub-step 3: Offerte ontvangen (offerte-email-view.tsx — NIEUW)

Twee states:

**A) Wachtstate (installateur heeft nog niet gereageerd)**:
- Centered card met animated loader
- "Je installateur bekijkt je aanvraag..."
- "Gemiddelde reactietijd: [installer.reactie] uur"
- CTA: "Simuleer de reactie in het installateurs-portaal →" → Installateur tab

**B) Offerte ontvangen (na acceptatie)**:
- Gesimuleerde email:
  - Van: Mijn Design Airco (namens [installateur])
  - Onderwerp: "Goed nieuws — je hebt een offerte ontvangen!"
  - Body: offerte-details uit installateurResponse (kosten, datum, doorlooptijd, toelichting, contactpersoon, telefoon)
  - CTA in email: "Neem contact op"
- CTA onder email: "Bekijk het dashboard als admin →" → Admin tab

**C) Afwijzing (na afwijzing)**:
- Gesimuleerde email:
  - Onderwerp: "Update over je aanvraag"
  - Body: "[Installateur] is momenteel niet beschikbaar. We zoeken een nieuwe installateur voor je."
- CTA: "Bekijk het dashboard als admin →" → Admin tab

```typescript
interface OfferteEmailViewProps {
  formData: FormSubmitData;
  matchedInstaller: Installer;
  installateurResponse: InstallateurResponse | null;
  onGoToInstallateur: () => void;
  onGoToAdmin: () => void;
}
```

---

## Installateur Flow

### Empty State (geen aanvraag ingediend)

- Centered card:
  - Wrench icon in cirkel
  - "Nog geen aanvragen"
  - "Er zijn nog geen nieuwe aanvragen binnengekomen."
  - CTA: "Ga naar het klantformulier →" → Klant tab

### Sub-step 1: Aanvraag bekijken (installer-email-view.tsx — AANPASSEN)

- Bestaande email-preview, aangepast:
  - Label: "Installateur · Nieuwe aanvraag"
  - CTA in email body: "Reageer op deze aanvraag →" → sub-step 2
  - CTA buiten email: "Bekijk aanvraag en reageer →"

Wijzigingen t.o.v. huidig:
- Step-label tekst
- CTA tekst en navigatie-actie

### Sub-step 2: Reageren (installateur-reactie-view.tsx — AANPASSEN)

- Bestaand twee-koloms layout: links aanvraagdetails, rechts offerteformulier
- Label: "Installateur · Reageren"
- Na reactie: success/reject state
  - Accepted: "Offerte verstuurd!" + CTA "Bekijk de offerte als klant →" → Klant tab offerte-step
  - Rejected: "Aanvraag afgewezen" + CTA "Bekijk de status als klant →" → Klant tab offerte-step

Wijzigingen t.o.v. huidig:
- Step-label tekst
- Back-button verwijst naar sub-step 1 (niet naar "stap 2")
- CTAs na reactie navigeren naar Klant tab
- Response data wordt opgeslagen in installateurResponse state

---

## Admin Flow (dashboard-view.tsx — AANPASSEN)

### Meldingen-panel (NIEUW, bovenaan dashboard)

- Card met titel "Meldingen" en badge count
- Lijst van notifications, meest recent bovenaan
- Elke melding:
  - Kleurgecodeerde dot: 🔵 aanvraag, 🟢 offerte, 🟠 afwijzing
  - Tekst: "[Naam] heeft een aanvraag ingediend voor de [model]" / "[Installateur] heeft een offerte verstuurd"
  - Timestamp: "zojuist"
- Empty state: "Geen nieuwe meldingen — doorloop eerst de demo"

### Dashboard (bestaand, licht aangepast)

- KPI's: ongewijzigd
- Installateur-tabel: ongewijzigd
- Aanvragenlijst: ongewijzigd (toont nieuwe aanvraag met bijgewerkte status)
- Sidebar: label "Admin · Dashboard"
- Verwijder de "Reageer" knop uit de request list (dat is nu de installateur-flow)

### Props update

```typescript
interface DashboardViewProps {
  notifications: Notification[];
  userRequest: UserRequest | null;
  requestStatuses: Record<string, RecentRequest["status"]>;
  requestResolutions: Record<string, RequestResolution>;
}
```

---

## Component Map

| Component | Status | Werk |
|---|---|---|
| `navigation.tsx` | Aanpassen | 3 rol-tabs, icons, badges |
| `step-indicator.tsx` | Nieuw | Herbruikbare sub-step dots |
| `bevestiging-email-view.tsx` | Nieuw | Klant bevestigingsmail |
| `offerte-email-view.tsx` | Nieuw | Klant offerte + wachtstate |
| `formulier-view.tsx` | Aanpassen | Labels, CTAs |
| `installer-email-view.tsx` | Aanpassen | Labels, CTAs, rol-context |
| `installateur-reactie-view.tsx` | Aanpassen | Labels, CTAs, response opslaan |
| `dashboard-view.tsx` | Aanpassen | Meldingen-panel, sidebar cleanup |
| `page.tsx` | Aanpassen | Rol-state, sub-steps, notifications |
| `data.ts` | Ongewijzigd | — |
| `airco-preview.tsx` | Ongewijzigd | — |
| `kaart-view.tsx` | Ongewijzigd | — |
| `globals.css` | Mogelijk licht | Step-indicator styling indien nodig |

---

## Teststrategie

Handmatig testen (demo app, geen unit tests):

1. **Klant happy path**: Form invullen → bevestiging zien → installateur accepteert → offerte zien
2. **Klant reject path**: Form invullen → installateur wijst af → afwijzing zien
3. **Installateur empty state**: Direct naar installateur tab → "geen aanvragen"
4. **Installateur flow**: Na klant submit → email zien → offerte sturen
5. **Admin meldingen**: Na elke actie → meldingen verschijnen in dashboard
6. **Navigatie**: Rol-tabs werken, sub-steps klikbaar na voltooiing
7. **Responsiveness**: Alle views op mobile + desktop
8. **State reset**: Nieuwe aanvraag → hele flow reset

---

## Niet in scope

- Backend/API
- Echte email verzending
- Authenticatie/inloggen
- Database/persistentie
- Meerdere aanvragen tegelijk
- Installateur inbox met meerdere aanvragen
