# FEABA Travels – Invoice Generator

A fully offline, mobile-first invoice generator for FEABA Travels.

## 🚀 How to Use

### Option 1 – Open Locally
Just double-click `index.html` in your browser. No server needed.

### Option 2 – Deploy to Vercel
1. Unzip this folder
2. Go to https://vercel.com/new
3. Drag & drop the `feaba-travels-invoice` folder
4. Done — live URL in seconds!

### Option 3 – Deploy to Netlify
1. Go to https://app.netlify.com/drop
2. Drag & drop the folder
3. Done!

## 📦 Files
- `index.html` — The entire app (self-contained, no dependencies to install)

## ✨ Features
- Auto invoice number generation
- Trip details (cab type, driver, from/to, km)
- Dynamic line items with auto-calculation
- GST (5/12/18/28%) + Discount support
- Amount in words (Indian: Lakh/Crore)
- PDF download (A4)
- Save invoices to browser (localStorage)
- Mark invoices as Paid/Due
- Company settings + theme colors

## 🔧 Customization
Open `index.html` in any text editor and search for:
- `FEABA TRAVELS` — change company name
- `98801 59085` — change phone
- `Bommanahalli` — change address

No build step, no npm, no setup needed.
