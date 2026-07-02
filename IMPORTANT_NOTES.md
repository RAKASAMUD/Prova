# Stellar + RISC Zero Groth16 Verifier
**Daftar Identitas & Konstanta Penting (Fase 1 - 6)**

File ini berisi seluruh alamat, ID, dan hex penting yang kita gunakan di jaringan **Testnet** agar tidak tertukar.

## 1. Identitas & Admin
| Nama / Peran | Nilai | Penjelasan |
|---|---|---|
| **Creator Admin (GDWG...)** | `GDWG5G5IWFIFESNPFH3LFDNHO2RZUGUUMWGZVEN2YCNYOCT6HBXQEDAF` | Alamat identitas `creator` di Stellar CLI Anda (WSL2). Digunakan sebagai Admin saat inisialisasi kontrak Badge dan untuk meregistrasi *commitment*. |

## 2. Smart Contracts
| Nama Kontrak | ID (StrKey) | Penjelasan |
|---|---|---|
| **Router Contract** | `CBWROF2D7JFBJXOU5SFQQVV5UYJNHQLBSTHJKYYSS25MTCWRQ32VJD7N` | Kontrak *Router* inti dari arsitektur verifier. (Sudah ter-deploy & jalan). |
| **Timelock Contract** | `CD66CDUQJVUXPWOUAEEQ5OUKLHLOGT4AIMKCRJT6H3BKSGOTVUSZ2KJG` | Kontrak Timelock yang mengatur delay operasi. |
| **Badge Contract (BARU)** | `CBEQLHIXCR2GG2ZLPGQMZKE2JUZJ5OINJQX6KUHNYDNRGAOTTMC4DZBQ` | Kontrak aplikasi utama kita (M2/M3) yang baru saja di-deploy ulang pada Fase 2. |

## 3. Parameter Hexadesimal (32-Byte)
| Nama / Parameter | Nilai Hex | Penjelasan |
|---|---|---|
| **self_hex_BARU** | `49059d171474636b2b79a0cca89a4d329eb90d4c2fe550edc0db1301d39b05c1` | Hasil konversi *Badge Contract ID* di atas menjadi format *hex 32-byte*. Ini menjadi parameter `--target_hex` saat Anda menjalankan GitHub Actions di Fase 4. |
| **trusted_image_id** | `e01e3a99417685ca65f92d8846a05e32fb051d54ac490b61f187870f8f3d2493` | *Hash* (ID) dari kode program *Guest* RISC Zero yang di-*compile* di dalam Docker. Dimasukkan saat `initialize`. |
| **creator_secret** | `c27172aa78bf94c2326b3b64370a747b3358c848903326b8c822266b2edd03a6` | *Secret Key* 32-byte acak murni yang hanya diketahui oleh Anda (Creator). Menjadi parameter `--secret_hex` saat menjalankan GitHub Actions di Fase 4. |
| **commitment** | `68db2bd3cbfe02d83c3877eb876d7fca0e4a944e523708dc561790060e6043b5` | Hasil `SHA-256` dari `creator_secret`. **SUDAH TERDAFTAR (Fase 3 Selesai)!** [Tx Hash: 08021e8c7eb66eb671023362fe4dec739ae5d03a4a3ce3431a8d894c531dafb3] |

## 4. Transaksi & Bukti Final
| Operasi | Tx Hash |
|---|---|
| **Initialize Badge** | *(Telah sukses dieksekusi)* |
| **Register Commitment** | `08021e8c7eb66eb671023362fe4dec739ae5d03a4a3ce3431a8d894c531dafb3` |
| **Claim Badge (Success)** | `7efdbe322e86599451e3ac7341ca887182f53deb9f271172110c1db699bead9d` |

---

### Panduan Input GitHub Actions (Fase 4 - Prove)
Saat menjalankan alur *prove* di tab **Actions** GitHub, ini yang harus Anda masukkan:

- **secret_hex:**
  `c27172aa78bf94c2326b3b64370a747b3358c848903326b8c822266b2edd03a6`
- **target_hex:**
  `49059d171474636b2b79a0cca89a4d329eb90d4c2fe550edc0db1301d39b05c1`
- **selector_hex:**
  *(Gunakan 4 byte bebas pilihan Anda, misal: `12345678`)*
