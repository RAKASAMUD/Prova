# Crate risc0_zkvm Reference Manual

`risc0_zkvm` adalah crate inti dari RISC Zero yang mengimplementasikan Zero-Knowledge Virtual Machine (zkVM) berbasis arsitektur RISC-V. Menggunakan crate ini memungkinkan pembuatan bukti kriptografi (*receipt*) dari kode yang dieksekusi, membuktikan keaslian eksekusi tanpa membocorkan data input privat ke publik.

---

## 1. Crate Feature Flags

Untuk menggunakan `risc0-zkvm` di sisi **Guest**, kamu wajib menonaktifkan fitur bawaan (`default-features = false`) di `Cargo.toml`.

| Feature | Target(s) | Implies | Description |
| :--- | :--- | :--- | :--- |
| **`client`** | Semua kecuali rv32im | `std` | Mengaktifkan Client API untuk interaksi eksternal dengan server zkVM. |
| **`prove`** | Semua kecuali rv32im | `std` | Mengaktifkan kemampuan *Prover* (Incompatibel di dalam ZK guest). |
| **`disable-dev-mode`** | Semua kecuali rv32im | - | Menonaktifkan dev mode untuk mencegah pemalsuan bukti (`RISC0_DEV_MODE`) di produksi. |
| **`cuda`** | `prove`, `std` | - | Mengaktifkan akselerasi GPU menggunakan NVIDIA CUDA Toolkit untuk Prover. |
| **`metal`** | macOS (`prove`, `std`) | - | *Deprecated* - Akselerasi GPU Metal untuk Apple Silicon sekarang aktif secara bawaan. |
| **`std`** | Semua | - | Menyediakan dukungan untuk Rust standard library (`stdlib`). |

---

## 2. Modul (Modules)

* **`guest`**: Menyediakan API internal untuk sisi Guest (kode yang dieksekusi di dalam lingkungan sandbox RISC-V zkVM).
* **`recursion`**: Implementasi Prover khusus untuk mendukung sirkuit rekursif (pemadatan bukti STARK).
* **`rpc`**: Infrastruktur komunikasi Client-Server untuk delegasi tugas komputasi zkVM.
* **`serde`**: Utilitas serialisasi dan deserialisasi data yang dioptimalkan untuk batas memori zkVM.
* **`sha`**: Layanan komputasi fungsi hash SHA-256 yang diakselerasi secara native di dalam sirkuit.

---

## 3. Makro (Macros)

* `declare_syscall`: Membuat deklarasi `SyscallName` pada saat kompilasi (*compile time*).
* `digest`: Makro pembantu untuk menyusun objek `Digest` langsung dari string berbasis heksadesimal.
* `entry`: Menetapkan fungsi utama (`main`) dan titik masuk (*entrypoint*) resmi bagi program Guest.

---

## 4. Struktur Data Kritis (Structs)

### Manajemen Lingkungan & Eksekusi (Host Sisi)
* **`ExecutorEnv` & `ExecutorEnvBuilder`**: Objek konfigurasi utama tempat Host menyuntikkan data input privat, variabel lingkungan, dan *stream* I/O sebelum memicu eksekusi Guest.
* **`ExecutorImpl`**: Mesin pengeksekusi biner beraliran RISC-V (ELF) untuk menghasilkan jejak eksekusi (*execution trace*) ke dalam objek `Session`.
* **`Session` & `SessionStats`**: Rekaman trace penuh dari jalannya program termasuk statistik total siklus eksekusi (*cycle count*) yang digunakan oleh Prover.

### Arsitektur Pembuktian (Provers)
* **`DefaultProver` / `LocalProver` / `ExternalProver`**: Berbagai abstraksi komponen Prover untuk mengeksekusi biner ELF dan menghasilkan objek bukti (`Receipt`).
* **`DevModeProver` & `DevModeDelay`**: Implementasi Prover tiruan untuk kebutuhan pengujian lokal instan tanpa melakukan kalkulasi matematika ZK yang berat.
* **`BonsaiProver`**: **Komponen Kunci Stellar Hacks.** Implementasi Prover jarak jauh yang mendelegasikan tugas kalkulasi pembuktian berat ke Bonsai Cloud API.

### Komponen Bukti Kriptografi (Receipts)
* **`Receipt`**: Objek bukti utuh penanda kejujuran eksekusi program Guest. Terdiri dari data klaim (`ReceiptClaim`) dan metadata tambahan (`ReceiptMetadata`).
* **`Journal`**: Rekaman komitmen publik yang ditulis oleh Guest via `env::commit()`. Struktur data inilah yang nantinya diekspos dan dibaca on-chain.
* **`Groth16Receipt`**: **Format Mutlak untuk Stellar.** Bukti ZK berbasis kurva BN_254 yang dihasilkan lewat konversi STARK-to-SNARK di Bonsai, kompatibel dengan verifikator kontrak Soroban.
* **`Groth16Seal` & `Groth16ReceiptVerifierParameters`**: Objek segel mentah berformat *big-endian* beserta parameter verifikasi pendukung untuk mengecek keabsahan `Groth16Receipt`.
* **`SuccinctReceipt`**: Bukti ringkas berbasis teknologi rekursi STARK (sebelum dikonversi ke Groth16).
* **`Digest`**: Wadah penyimpanan data hash 256-bit berbasis struktur data array `u32` demi efisiensi penyelarasan memori internal zkVM.

---

## 5. Enumerasi (Enums)

* **`ExitCode`**: Status kondisi akhir saat mesin virtual berhenti (Sukses, Gagal, atau Terbagi dalam Segmen).
* **`Asset` & `AssetRequest`**: Menentukan format aset digital atau skema permintaan data yang diproses oleh sistem.
* **`AssumptionReceipt` & `InnerAssumptionReceipt`**: Membungkus bukti bersyarat (*assumptions*) ketika sebuah program Guest mengandalkan hasil validasi dari program Guest lainnya (`env::verify`).
* **`InnerReceipt`**: Representasi internal tingkat rendah dari sistem pembuktian kriptografi yang digunakan (apakah bertipe *Succinct* STARK atau *Groth16* SNARK).
* **`MaybePruned`**: Pola optimisasi memori yang menyimpan nilai asli atau ringkasan hash `Digest` jika data telah dipangkas (*pruned*).

---

## 6. Nilai Tetap (Constants)

* `PAGE_SIZE`: Ukuran halaman memori internal di dalam zkVM, bernilai bawaan 4096 byte (4KB).
* `GUEST_MAX_MEM`: Batas kapasitas memori maksimum yang dialokasikan untuk program di sisi Guest.
* `DEFAULT_MAX_PO2`: Ukuran segmen maksimum dalam pangkat dua yang diizinkan oleh parameter verifikator bawaan.
* `VERSION`: String penanda versi rilis crate `risc0_zkvm` aktif saat ini.

---

## 7. Pola Karakteristik (Traits)

* **`Executor`**: Kemampuan sebuah objek untuk membaca dan menjalankan file biner kompilasi berbentuk ELF.
* **`Prover` & `ProverServer`**: Antarmuka standar untuk mentransformasikan hasil eksekusi program menjadi sebuah `Receipt` valid yang siap dikirim.
* **`SegmentRef`**: Referensi memori penunjuk fragmen pecahan (*segment*) dari keseluruhan jejak eksekusi program.

---

## 8. Fungsi Global (Functions)

* **`compute_image_id`**: Menghitung sidik jari kriptografi unik (`ImageID`) dari file biner ELF Guest. `ImageID` inilah yang nantinya didaftarkan ke dalam *smart contract* verifikator Soroban di Stellar sebagai satu-satunya penanda identitas kode program yang sah.
* `default_executor` / `default_prover`: Mengembalikan instansiasi mesin eksekutor atau pembukti bawaan berbasis konfigurasi *environment variables*.
* `prove_zkr` / `register_zkr`: Fungsi khusus untuk memproses atau mendaftarkan program komputasi rekursif berbasis kendali ID (`control_id`).