# SURAKSHA — 3D Photorealistic UI Assets & Photos Catalog

All 10 high-resolution, photorealistic 3D rendered assets have been generated and organized in [`photos/`](file:///Users/harshtanti/Krrish/newsihps/photos) for immediate implementation across your 10 frontend screens.

---

## Asset Mapping by Screen

| # | Filename | Target Screen & Route | Visual Concept & Usage |
|---|---|---|---|
| **01** | [`01_security_deposit_vault.jpg`](file:///Users/harshtanti/Krrish/newsihps/photos/01_security_deposit_vault.jpg) | **Hero / Shell / Landing** | Isometric digital security deposit vault with glowing golden shield and cyan circuit traces. Perfect for landing hero or login background card. |
| **02** | [`02_fdr_certificate_3d.jpg`](file:///Users/harshtanti/Krrish/newsihps/photos/02_fdr_certificate_3d.jpg) | **Submission Wizard (`/instruments/new`)** | Floating 3D official Fixed Deposit Receipt (FDR) security bond with embossed gold foil and holographic AICTE security seal. |
| **03** | [`03_campus_institution_3d.jpg`](file:///Users/harshtanti/Krrish/newsihps/photos/03_campus_institution_3d.jpg) | **Institution 360 / Wizard Step 1** | Miniature 3D engineering campus model with glowing holographic architectural blueprints. Used for college profiling. |
| **04** | [`04_audit_hash_chain.jpg`](file:///Users/harshtanti/Krrish/newsihps/photos/04_audit_hash_chain.jpg) | **Cryptographic Audit Verifier (`/audit`)** | Interlocking 3D crystal data cubes with etched SHA-256 hashes and laser linkages. Represents the tamper-evident audit ledger. |
| **05** | [`05_release_clearance_graph.jpg`](file:///Users/harshtanti/Krrish/newsihps/photos/05_release_clearance_graph.jpg) | **Release Eligibility Graph (`/releases/:id`)** | Floating hexagonal clearance nodes (Green/Amber/Red) converging into a golden security gateway. Illustrates Clause 6.46 multi-clearance gating. |
| **06** | [`06_time_machine_chronometer.jpg`](file:///Users/harshtanti/Krrish/newsihps/photos/06_time_machine_chronometer.jpg) | **Time Machine & Calendar (`/time-machine`)** | Intricate 3D brass and titanium gyroscopic chronometer with T-90, T-30, T-0 maturity milestone lasers. |
| **07** | [`07_pledge_graph_radar.jpg`](file:///Users/harshtanti/Krrish/newsihps/photos/07_pledge_graph_radar.jpg) | **Pledge Graph & Fraud Radar (`/pledge-graph`)** | Forensic fraud intelligence radar showing glowing blue topography with a pulsating red collision ring detecting duplicate FDR pledges. |
| **08** | [`08_aicte_regulatory_emblem.jpg`](file:///Users/harshtanti/Krrish/newsihps/photos/08_aicte_regulatory_emblem.jpg) | **Login Header & Branding (`/login`)** | Official national regulatory medallion in brushed gold and navy blue enamel with state lion crest and trust laurels. |
| **09** | [`09_provenance_scanner_3d.jpg`](file:///Users/harshtanti/Krrish/newsihps/photos/09_provenance_scanner_3d.jpg) | **Three-Way Provenance (`/instruments/:id/provenance`)** | Forensic scanner with 3 holographic projection columns comparing Declared vs Document vs Bank data with golden discrepancy highlight. |
| **10** | [`10_control_tower_command.jpg`](file:///Users/harshtanti/Krrish/newsihps/photos/10_control_tower_command.jpg) | **Portfolio / Home (`/`)** | Futuristic regulatory control tower operations center with a giant 3D spherical hologram of institutional deposit networks. |

---

## How to Implement in React / Vite / HTML

### 1. In Vite / React (from `public/` or `assets/`):
```tsx
import vaultImg from '/photos/01_security_deposit_vault.jpg';
import fdrImg from '/photos/02_fdr_certificate_3d.jpg';
import emblemImg from '/photos/08_aicte_regulatory_emblem.jpg';

export function HeroBanner() {
  return (
    <div className="relative rounded-2xl overflow-hidden border border-[#26364f] bg-[#111a2b]">
      <img src={vaultImg} alt="SURAKSHA Security Vault" className="w-full h-64 object-cover opacity-60" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0b1220] via-transparent to-transparent p-6 flex flex-col justify-end">
        <h1 className="text-2xl font-bold text-[#e8eef8]">AICTE Security Deposit Control Tower</h1>
        <p className="text-sm text-[#9fb0c7]">Policy-native compliance engine for SIH26265</p>
      </div>
    </div>
  );
}
```

### 2. In Vanilla HTML / CSS:
```html
<div class="card-hero" style="background-image: linear-gradient(180deg, rgba(11,18,32,0.3), #0b1220), url('/photos/10_control_tower_command.jpg');">
  <h2>Executive Portfolio Overview</h2>
</div>
```
