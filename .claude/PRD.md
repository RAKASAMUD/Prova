# Verified Disabled Creator — PRD & Implementation Plan

> **Status dokumen:** Peta jalan tingkat-milestone. Requirement sudah dikunci
> lewat sesi brainstorming/grilling; dokumen ini aman dijadikan basis. **Tidak
> memuat kode lengkap** — kode diturunkan penuh di tiap plan milestone
> (`docs/.../YYYY-MM-DD-mN-*.md`, gaya `writing-plans`: failing test →
> implementasi minimal → perintah+output → commit). PRD memegang spesifikasi,
> interface antar-milestone, dan keputusan terkunci.

---

## 1. Ringkasan Produk

**Goal (satu kalimat):** Kreator penyandang disabilitas membuktikan secara
privat bahwa ia memegang kredensial disabilitas sah dari otoritas tepercaya,
dan menerima badge **soulbound** "Verified Disabled Creator" di Stellar — tanpa
pernah membuka diagnosis, kategori, atau identitas medis ke pihak mana pun.

**Arsitektur (ringkas):** Guest RISC Zero membuktikan kepemilikan `secret` yang
commitment-nya terdaftar sah + menghitung nullifier terikat kontrak. Journal
bersih di-commit sebagai **byte mentah berlayout tetap**. Proof Groth16
diverifikasi on-chain via VerifierRouter (Nethermind). Kontrak badge menjalankan
pengecekan bisnis lalu mint badge soulbound (non-transferable, dikelola kontrak).

**Tech stack:** RISC Zero zkVM 3.0.5 (Rust guest), Soroban smart contract (Rust,
target `wasm32v1-none`), Nethermind stellar-risc0-verifier (router + groth16
verifier), Stellar CLI 27, WSL2/Ubuntu, Docker (untuk determinisme image_id +
proving fixture akhir — di **mesin lain**, bukan laptop).

**Ambisi (dikunci):** *Spine = inti solid + future work rapi* (jalur fixture).
Wallet + Bonsai + game adalah **lapisan aditif** yang dibaut di M5+ **hanya jika**
API key Bonsai tiba tepat waktu. Lapisan atas tak pernah berada di jalur kritis;
M1–M4 identik di kedua skenario.

---

## 2. Mengapa Proyek Ini Layak (jawaban untuk juri/reviewer)

| Serangan | Jawaban |
|---|---|
| "ZK cuma namecheck?" | Copot ZK → kreator harus serahkan surat medis ke platform. ZK load-bearing. |
| "Kenapa Stellar?" | Verifikasi Groth16 pakai BN254 host functions Protocol 25/26; badge terbit sebagai credential on-chain. |
| "Double-claim?" | Nullifier `sha256(secret‖target_contract)` + storage per-kontrak. |
| "Replay lintas-kontrak?" | Journal mengikat `target_contract`; kontrak menolak jika bukan alamatnya. |
| "Commitment karangan?" | Kontrak memegang set commitment sah; proof dengan commitment asing ditolak. |
| "Guest palsu?" | Kontrak menyimpan `trusted_image_id`; proof dari image lain ditolak. |
| "Privasi bocor via tier?" | Kelas tunggal → tak ada tier untuk dibedakan. |
| "Kredensial dijual/Sybil?" | Diakui jujur sebagai di-luar-scope; one-shot membatasi penyalahgunaan. |

---

## 3. Global Constraints (berlaku untuk semua task)

- **Tiga SHA-256, input berbeda — jangan tertukar (sumber bug klasik):**
  - `commitment = sha256(secret)`
  - `nullifier  = sha256(secret ‖ target_contract)`
  - `journal_hash = sha256(journal_raw)` — argumen ke-3 `router.verify`, dihitung
    kontrak atas **byte journal mentah apa adanya**.
- **Journal = byte mentah berlayout tetap (97 byte)**, di-commit via
  `commit_slice`, **bukan** risc0-serde (`env::commit`). Ini menjamin
  `journal_hash` di kontrak deterministik & cocok dengan seal.

  | offset | field | tipe |
  |---|---|---|
  | `[0]` | `eligible` | `u8` (1 = true) |
  | `[1..33]` | `commitment` | `[u8;32]` |
  | `[33..65]` | `nullifier` | `[u8;32]` |
  | `[65..97]` | `target_contract` | `[u8;32]` |

  Layout ini **satu sumber kebenaran**: dipegang crate `shared` (dipakai guest &
  test host), dan menjadi kontrak-byte yang kontrak Soroban parse di M2.
- **Kontrak MEMBANDINGKAN nilai, tidak menghitung ulang hash** (hindari mismatch
  SHA vs Poseidon). Satu-satunya hash yang kontrak hitung sendiri = `journal_hash`
  atas byte mentah — dan itu **tanpa** deserialize-lalu-re-serialize.
- **Receipt wajib Groth16** (bukan full receipt — terlalu besar on-chain).
- **Verifier interface:** `verify(seal, image_id, journal_hash)` — **revert-on-fail
  (panic), bukan boolean**. Argumen ke-3 = **hash** journal, bukan journal mentah.
  (Terkonfirmasi dari referensi typezero.)
- **Kelas tunggal:** semua kredensial disabilitas sah → berhak. Tidak ada tier.
- **Badge non-transferable:** tidak ada fungsi `transfer()`. Soulbound by omission.
- **`trusted_image_id` & set commitment sah** disimpan kontrak, tidak diterima
  dari user.
- **Issuer disimulasikan:** keypair/proses yang dikontrol. Ditulis jujur di README
  sebagai mock authority.
- **Proving:** fase build (M0–M4) pakai dev mode + mock verifier. Groth16 asli
  hanya untuk 1 fixture demo di M5, dijalankan di **mesin lain** (laptop RAM 8GB
  tidak sanggup) — VPS besar sementara atau Bonsai. Build fixture pakai Docker
  (`RISC0_USE_DOCKER`) agar image_id cocok dengan `trusted_image_id`.
- **Target wasm:** `wasm32v1-none` untuk kontrak Soroban.

---

## 4. Spesifikasi Komponen

### 4.1 Guest Program (RISC Zero) — *diimplementasi M1*
**Tanggung jawab:** membuktikan kelayakan privat, menghasilkan journal bersih.

- **Input privat:** `secret: [u8;32]`.
- **Input publik:** `target_contract: [u8;32]` (alamat kontrak badge).
- **Urutan `env::read`:** `secret` dulu, lalu `target_contract`.
- **Logika:** hitung `commitment`, `nullifier`, susun journal 97-byte (§3),
  `env::commit_slice(&journal)`.
- **Tidak pernah di-commit:** `secret`.

### 4.2 Kontrak Badge (Soroban) — *diimplementasi M2*
**Tanggung jawab:** verifikasi proof + aturan bisnis + mint badge soulbound.

- **Storage:** `trusted_image_id: BytesN<32>`, `valid_commitments: Map<BytesN<32>, bool>`,
  `used_nullifiers: Map<BytesN<32>, bool>`, `badges: Map<Address, BadgeData>`,
  `router_address: Address`.
- **`claim_badge(seal, journal_raw)` — urutan wajib:**
  1. Terima `seal` + `journal_raw` (byte mentah dari `receipt.journal.bytes`).
  2. `journal_hash = sha256(journal_raw)` — **atas byte apa adanya**, jangan
     parse-lalu-encode-ulang sebelum hashing.
  3. `router.verify(seal, trusted_image_id, journal_hash)` — panic jika gagal.
  4. **Baru** parse `journal_raw` (layout §3) → `{eligible, commitment, nullifier, target}`.
  5. Cek `eligible == true`.
  6. Cek `target == env.current_contract_address()`.
  7. Cek `commitment ∈ valid_commitments`.
  8. Cek `nullifier ∉ used_nullifiers`.
  9. Set `used_nullifiers[nullifier] = true`; mint badge ke `env.invoker()`.
- **Fungsi baca:** `has_badge(addr) -> bool`, `badge_info(addr) -> BadgeData`.
- **Admin:** `register_commitment(commitment)` (dipakai issuer M3).
- **Tidak ada:** `transfer`, `burn` (soulbound).

### 4.3 Setup Issuer (script, disimulasikan) — *diimplementasi M3*
- Generate `secret` acak, hitung `commitment = sha256(secret)`.
- Panggil admin `register_commitment(commitment)`.
- Output `secret` ke file aman (jadi "kredensial" yang dipegang kreator).

### 4.4 Frontend (halaman dua-sisi) — *diimplementasi M4*
- Kiri: "Yang kreator masukkan" — dokumen disabilitas (privat, digembok visual).
  Terminal kiri **jujur**: load fixture + verifikasi live on-chain — TIDAK
  berpura-pura proving live.
- Kanan: "Yang dunia lihat" — badge ✅ + journal `{eligible, nullifier, target}`.
- Tengah: garis "Diagnosis tidak pernah menyeberang sini."
- Tombol "Coba klaim lagi" → ❌ Already claimed (nullifier exists).
- Verifikasi kepemilikan badge: `has_badge(address)` + link tx Stellar Lab.
- Wallet connect penuh: future work (jalur Bonsai). Demo baca badge publik tanpa wallet.

---

## 5. Rencana Bertahap (Milestone)

> Tiap milestone = software bisa-ditest sendiri. **Selesaikan satu sampai utuh
> sebelum lanjut.** Fork ambisi baru menggigit di M5.

### M0 — Toolchain & Skeleton — ✅ SELESAI
- WSL2 Ubuntu (8GB, dibatasi 3.5GB + swap 8GB), Rust host 1.96.1 / guest 1.94.1
  (rzup: cargo-risczero 3.0.5, r0vm 3.0.5), Stellar CLI 27, identity `creator`
  testnet didanai. Repo Nethermind + typezero cloned. Skeleton `creator-badge` hijau.

### M1 — Guest Program + Dev Mode — ⏳ BERIKUTNYA
- Crate `shared` (build_journal + layout 97B), guest commit via `commit_slice`,
  host jalankan dev mode, test journal cocok + secret tak bocor.
- **Deliverable:** journal ter-commit benar, ditest lokal tanpa proving asli.

### M2 — Kontrak Badge + Mock Verifier
- Deploy mock verifier (`deploy-mock-verifier`) + router ke testnet.
- `claim_badge` dgn urutan §4.2 (hash-raw → verify → parse → 4 cek → mint).
- Test (mock env): klaim sah lolos; commitment asing / target salah / double-claim ditolak.
- **Deliverable:** alur penuh jalan di testnet dengan mock verifier.

### M3 — Issuer Setup + Integrasi End-to-End (Dev)
- Script issuer: generate secret → register commitment → guest proof (dev) → mint.
- **Deliverable:** satu kreator dapat badge end-to-end (masih dev mode).

### M4 — Frontend Dua-Sisi
- Halaman statis dua-sisi + tombol klaim-ulang ditolak; baca badge dari testnet.
- **Deliverable:** demo visual "diagnosis tak menyeberang".

### M5 — Proof Groth16 Asli (Fixture) — *fork ambisi di sini*
- Di **mesin lain** (VPS/Bonsai, bukan laptop 8GB): generate **satu** Groth16
  receipt asli, build dgn `RISC0_USE_DOCKER` untuk image_id deterministik.
- Deploy Groth16Verifier asli; add selector ke router (timelock delay 0).
- **(Aditif, jika key Bonsai tiba):** proving on-demand → wallet penuh (badge ke
  alamat juri) + game pengisi jeda. Tak mengubah kontrak/M1–M4.
- **Deliverable:** badge ter-mint dari proof Groth16 sungguhan; tx di Stellar Lab.

### M6 — README + Video
- README: 8-serangan-8-jawaban (§2), trust assumptions (§6b), batasan jujur,
  future work (Merkle, Ed25519-in-zkVM, SAC, wallet, tier, client-side proving),
  diferensiasi vs `NethermindEth/stellar-private-payments`.
- Video 2–3 menit: masalah → input privat → journal bersih → verifikasi on-chain
  → penolakan nullifier.
- **Deliverable:** submission lengkap.

---

## 6. Checkpoint Keputusan (sudah dikunci)

- Use-case: **Verified Disabled Creator** (badge, bukan diskon/marketplace/escrow).
- Verifikasi kredensial: **commitment + set langsung**. Merkle & Ed25519-in-zkVM = future work.
- Badge: **token kontrak soulbound** (bukan SAC native). SAC = future work.
- Akses: **one-shot per layanan/kontrak**. Privasi: **kelas tunggal**.
- Journal: **byte mentah 97B via `commit_slice`** (bukan serde); layout dipegang crate `shared`.
- Kontrak: **hash journal mentah → verify → parse → 4 cek** (urutan §4.2).
- Proving: **dev mode → fixture Groth16 di MESIN LAIN** (VPS/Bonsai). Laptop 8GB
  tidak sanggup Groth16.
- Ambisi: **spine fixture; wallet+Bonsai+game aditif di M5+** (jika key tepat waktu).
- Lingkungan: **WSL2 Ubuntu, laptop 8GB**.
- Deadline: **extended 4 Juli 2026** (dikonfirmasi via DoraHacks — otoritas final;
  jejak "29 Juni" hanya historis).

## 6b. Trust Assumptions (untuk README)

- **Dijamin kriptografis:** setelah proof, tak ada pihak melihat diagnosis.
- **Trust assumption:** proving service melihat `secret` saat generate — tapi
  `secret` = angka acak tanpa muatan identitas/medis, jadi kebocoran tipis.
- **ZK = minimalisasi kepercayaan, bukan penghapusan.** Verifikasi terdesentralisasi;
  proving (PoC) terpusat. Jalur ke client-side proving terbuka **tanpa ubah kontrak**.
- **Scope boundary:** KYC/penerbitan kredensial & distribusi secret = **di luar
  scope** (domain issuer/pemerintah). Sistem ini VERIFIER, mulai dari "kreator
  sudah pegang kredensial". Analogi: verifikator paspor tak bangun kantor imigrasi.
- **Diakui jujur:** berbagi-kredensial & Sybil di luar scope; one-shot membatasi
  penyalahgunaan. Mock issuer (keypair dikontrol) ditulis terbuka.

---

## 7. Risiko Terbuka (pantau)

- **Bonsai key:** form sudah diisi, menunggu email API key + URL. **Menentukan
  apakah lapisan aditif M5 (wallet+game) terjangkau.** Fixture jalan tanpanya.
  Set `BONSAI_API_KEY` & `BONSAI_API_URL` saat tiba.
- **Mesin proving M5:** VPS besar belum dipunya; siapkan sebelum masuk M5
  (Groth16 tak bisa di laptop 8GB).
- **Bonsai SDK versi:** banyak contoh online v1.x; kita pakai 3.0.5 — verifikasi
  API ke dokumen 3.x saat integrasi.
- **Diferensiasi:** ada `NethermindEth/stellar-private-payments`. Sebut beda angle
  di README agar tak terlihat turunan.

> **Ditutup sesi ini:** deadline (4 Juli, DoraHacks final), koreksi RAM (8GB bukan
> 16GB → proving pindah mesin), keputusan ambisi (spine fixture).
