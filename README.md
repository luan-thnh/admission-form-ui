# Admission Form UI

Website đăng ký tuyển sinh với React + Vite + Tailwind CSS + shadcn/ui.

## Tính năng

- 📋 Form đăng ký đầy đủ thông tin cá nhân
- ✅ Validate số điện thoại Việt Nam
- 🏫 Danh sách 43 trường THPT/THCS tỉnh Gia Lai
- 🎓 Chọn nguyện vọng theo khối ngành (6 khối, 50+ ngành)
- 📷 Quét mã QR trên CCCD để điền tự động
- 📤 Gửi dữ liệu lên Google Sheets qua Google Apps Script
- 📱 Hỗ trợ mobile, giao diện thân thiện

## Cài đặt

```bash
npm install
cp .env.example .env
# Điền VITE_GOOGLE_SCRIPT_URL vào .env
npm run dev
```

## Cấu hình Google Sheets

1. Tạo Google Sheet mới.
2. Vào **Extensions → Apps Script**.
3. Dán đoạn script sau:

```javascript
function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const data = JSON.parse(e.postData.contents);
  sheet.appendRow([
    new Date(),
    data.fullName, data.dob, data.gender,
    data.phone, data.cccd, data.email,
    data.highSchool, data.major1, data.major2 || ''
  ]);
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'ok' }))
    .setMimeType(ContentService.MimeType.JSON);
}
```

4. Deploy → **New deployment** → Web App → Execute as **Me** → Who has access **Anyone**.
5. Copy URL và dán vào `VITE_GOOGLE_SCRIPT_URL` trong file `.env`.

## Tech Stack

- [Vite](https://vite.dev/) + [React](https://react.dev/) + TypeScript
- [Tailwind CSS v4](https://tailwindcss.com/)
- [Radix UI](https://www.radix-ui.com/) (Select, RadioGroup, Label)
- [react-hook-form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- [html5-qrcode](https://github.com/mebjas/html5-qrcode)
- [lucide-react](https://lucide.dev/)
