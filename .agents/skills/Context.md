# CONTEXT HANDBOOK: STELLAR HACKS - REAL-WORLD ZK

---

## 1. INFO UMUM HACKATHON

* **Nama Kompetisi**: Stellar Hacks: Real-World ZK.
* **Fokus Utama**: Membangun aplikasi apa saja menggunakan teknologi Zero-Knowledge (ZK) yang berjalan di atas jaringan Stellar (Soroban smart contract). 
* **Narasi Utama Juri**: Mengutamakan proyek yang membawa teknologi ZK ke dalam kasus penggunaan dunia nyata (*real-world use cases*), terutama yang berkaitan dengan kekuatan utama Stellar seperti pergerakan uang riil, *stablecoins*, *cross-border payments*, tokenisasi *Real-World Assets* (RWA), dan penyelesaian institusional. Namun, dApp eksperimental atau alat privasi ceruk (*niche*) lainnya tetap valid untuk dilombakan selama ZK bekerja secara esensial.
* **Garis Waktu (Timeline 2026)**:
    * **Submisi Dibuka**: 15 Juni 2026.
    * **Extended Deadline**: 4 Juli 2026 pukul 00:00 (Virtual).
* **Persyaratan Submisi (Must-Have)**:
    * **Repositori Terbuka**: Link repositori publik (GitHub/GitLab/Bitbucket) berisi keseluruhan kode sumber beserta file `README.md` yang menjelaskan fungsionalitas proyek secara jujur.
    * **Video Demo**: Rekaman layar berdurasi 2–3 menit yang mendemonstrasikan aplikasi berjalan dan menjelaskan peran riil komputasi ZK di dalamnya.
    * **Integrasi ZK + Stellar**: Logika ZK harus berfungsi sebagai penopang sistem (*load-bearing*) dan proses verifikasi bukti (*proof verification*) wajib dieksekusi di dalam smart contract Soroban.
* **Total Hadiah**: $10,000 dalam bentuk token XLM.
    * Juara 1: $5,000 | Juara 2: $2,000 | Juara 3: $1,250 | Juara 4: $1,000 | Juara 5: $750.
* **Platform Kelola**: DoraHacks, dengan status submisi dikunci secara privat (*Private BUIDLs*) oleh panitia untuk mencegah plagiarisme antar-peserta selama kompetisi berjalan.

---

## 2. PILIHAN TEKNOLOGI: RISC ZERO (zkVM)

Proyek ini diputuskan untuk dieksekusi menggunakan **RISC Zero (zkVM)** dengan pertimbangan taktis berikut:
* **Bahasa Rust Standar**: Menulis logika Zero-Knowledge menggunakan bahasa Rust biasa tanpa perlu mendesain sirkuit matematika tingkat rendah yang rumit dari nol.
* **Pemisahan Peran**: Kode rahasia (*Guest Code*) dijalankan secara terisolasi di dalam zkVM untuk menghasilkan resi (*receipt*). Kode aplikasi luar (*Host Code*) bertugas menyuplai input privat dan mengirimkan bukti hasil eksekusi.
* **Kompatibilitas Groth16**: Bukti beraliran STARK yang dihasilkan secara lokal akan dikonversi menjadi format Groth16 (SNARK) di atas kurva BN254 melalui Bonsai API. Format ini divalidasi secara murah dan efisien oleh pustaka kontrak pintar bawaan milik Stellar Protocol 25/26.

---

## 3. RELEVANSI PERALATAN DAN TAUTAN PERANG (CURATED LINKS)

Berikut adalah daftar dokumentasi dan alat bantu esensial yang dikurasi untuk mengejar target pembuatan produk dalam sisa waktu 4 hari:

### A. Repositori Referensi Utama ( Starter Code & Kontrak)
* **Nethermind Stellar RISC Zero Verifier**: [github.com/NethermindEth/stellar-risc0-verifier](https://github.com/NethermindEth/stellar-risc0-verifier)
    * *Manfaat*: Komponen paling penting. Menyediakan cetak biru kontrak `VerifierRouter` dan `Groth16Verifier` siap pakai, lengkap dengan skrip manajemen operasional `./scripts/manage.sh` untuk melakukan *deploy* dan registrasi *selector* bukti di Stellar Testnet.

### B. Pusat Dokumentasi Teknologi ZK & AI Context
* **RISC Zero Official Dev Docs**: [dev.risczero.com](https://dev.risczero.com/)
    * *Manfaat*: Buku panduan utama untuk memahami struktur makro crate `risc0_zkvm`, makro `entry`, serta mekanisme transfer data via `env::read()` dan `env::commit()`.
* **Stellar Skills Agent Reference**: [skills.stellar.org](https://skills.stellar.org/)
    * *Manfaat*: File dokumentasi ramah mesin (*machine-readable context*) untuk disuapi ke AI Coding Agent agar menghasilkan kode Soroban yang presisi sesuai standar Protocol 26 terbaru.

### C. Alat Interaksi Jaringan & Pembuatan Aplikasi Web
* **Stellar CLI Installation & Guide**: [developers.stellar.org/docs/tools/cli](https://developers.stellar.org/docs/tools/cli)
    * *Manfaat*: Alat mutlak di terminal untuk melakukan kompilasi kontrak (`stellar contract build --optimize`), pendanaan akun, dan simulasi pemanggilan fungsi verifikasi.
* **Stellar Lab Browser Playground**: [developers.stellar.org/docs/tools/lab](https://developers.stellar.org/docs/tools/lab)
    * *Manfaat*: Jalan pintas berbasis web untuk memantau transaksi, membuat pasangan kunci, dan meminta saldo uji coba gratis (*faucet*) di Testnet tanpa drama setup infrastruktur lokal.
* **Scaffold Stellar**: [scaffoldstellar.org](https://scaffoldstellar.org)
    * *Manfaat*: Menyediakan *boilerplate* siap pakai untuk mempercepat pembuatan antarmuka aplikasi web (frontend dApp) yang terhubung langsung dengan smart contract Soroban.
* **Stellar Wallets Kit**: [stellarwalletskit.dev](https://stellarwalletskit.dev/)
    * *Manfaat*: Pustaka API terpadu untuk menghubungkan berbagai dompet digital ekosistem Stellar (seperti Freighter) ke dApp.

### D. Mekanika Dasar Soroban Smart Contract
* **Soroban Contract Storage Guide**: [developers.stellar.org/docs/build/guides/storage](https://developers.stellar.org/docs/build/guides/storage)
    * *Manfaat*: Panduan wajib untuk mengelola siklus hidup data di Stellar menggunakan skema *Persistent Storage* agar status verifikasi dan data aplikasi tidak kedaluwarsa atau hilang dari blockchain.
* **Soroban Contract Testing Framework**: [developers.stellar.org/docs/build/guides/testing](https://developers.stellar.org/docs/build/guides/testing)
    * *Manfaat*: Panduan menulis pengujian lokal (`test.rs`) memanfaatkan lingkungan tiruan (*mock environment*) untuk memvalidasi alur logika bisnis dApp secara instan sebelum melakukan *deploy* asli.