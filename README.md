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
- 📊 **Tự động phân loại theo trường THPT** — mỗi trường 1 sheet riêng

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
// ─── Headers cho mỗi sheet ────────────────────────────────────────
var HEADERS = [
  'Thời gian',
  'Họ tên',
  'Ngày sinh',
  'Giới tính',
  'SĐT',
  'CCCD/CMND',
  'Email',
  'Trường THPT',
  'Nguyện vọng 1',
  'Nguyện vọng 2',
  'Cơ sở học',
  'Phương thức xét tuyển',
  'Chứng chỉ ngoại ngữ',
  'Điểm ngoại ngữ',
  'Địa chỉ',
  'Hình thức nhập học',
  'Mong muốn tư vấn',
];

function doPost(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var data = JSON.parse(e.postData.contents);

  // ─── Xác định tên sheet theo trường THPT ─────────────────────────
  var sheetName = (data.highSchool || 'Khác').trim();

  // Lấy hoặc tạo sheet mới
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
    // Thêm header row
    sheet.appendRow(HEADERS);
    // Định dạng header: in đậm, nền xanh, chữ trắng
    var headerRange = sheet.getRange(1, 1, 1, HEADERS.length);
    headerRange
      .setFontWeight('bold')
      .setBackground('#2E7D32')
      .setFontColor('#FFFFFF')
      .setHorizontalAlignment('center');
    // Auto-resize columns
    for (var i = 1; i <= HEADERS.length; i++) {
      sheet.autoResizeColumn(i);
    }
    // Freeze header
    sheet.setFrozenRows(1);
  }

  // ─── Thêm dữ liệu sinh viên ─────────────────────────────────────
  sheet.appendRow([
    new Date(),
    data.fullName || '',
    data.dob || '',
    data.gender || '',
    data.phone || '',
    data.cccd || '',
    data.email || '',
    data.highSchool || '',
    data.major1 || '',
    data.major2 || '',
    data.campus || '',
    (data.methods || []).join(', '),
    data.englishCert || '',
    data.englishScore || '',
    data.address || '',
    data.onlineAdmission || '',
    (data.surveyInterests || []).join(', '),
  ]);

  // ─── Cũng ghi vào sheet "Tất cả" (tổng hợp) ────────────────────
  var allSheet = ss.getSheetByName('Tất cả');
  if (!allSheet) {
    allSheet = ss.insertSheet('Tất cả', 0); // Đặt ở vị trí đầu
    allSheet.appendRow(HEADERS);
    var allHeaderRange = allSheet.getRange(1, 1, 1, HEADERS.length);
    allHeaderRange
      .setFontWeight('bold')
      .setBackground('#1B5E20')
      .setFontColor('#FFFFFF')
      .setHorizontalAlignment('center');
    for (var j = 1; j <= HEADERS.length; j++) {
      allSheet.autoResizeColumn(j);
    }
    allSheet.setFrozenRows(1);
  }
  allSheet.appendRow([
    new Date(),
    data.fullName || '',
    data.dob || '',
    data.gender || '',
    data.phone || '',
    data.cccd || '',
    data.email || '',
    data.highSchool || '',
    data.major1 || '',
    data.major2 || '',
    data.campus || '',
    (data.methods || []).join(', '),
    data.englishCert || '',
    data.englishScore || '',
    data.address || '',
    data.onlineAdmission || '',
    (data.surveyInterests || []).join(', '),
  ]);

  return ContentService.createTextOutput(
    JSON.stringify({ status: 'ok', sheet: sheetName })
  ).setMimeType(ContentService.MimeType.JSON);
}
```

4. Deploy → **New deployment** → Web App → Execute as **Me** → Who has access **Anyone**.
5. Copy URL và dán vào `VITE_GOOGLE_SCRIPT_URL` trong file `.env`.

### Cách hoạt động

- Mỗi khi sinh viên submit form, script tự động:
  1. Kiểm tra có sheet tên trường THPT chưa → nếu chưa thì **tạo mới** với header.
  2. Thêm dữ liệu sinh viên vào **sheet trường tương ứng**.
  3. Đồng thời ghi vào sheet **"Tất cả"** để có bản tổng hợp.

## Tech Stack

- [Vite](https://vite.dev/) + [React](https://react.dev/) + TypeScript
- [Tailwind CSS v4](https://tailwindcss.com/)
- [Radix UI](https://www.radix-ui.com/) (Select, RadioGroup, Label)
- [react-hook-form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- [html5-qrcode](https://github.com/mebjas/html5-qrcode)
- [lucide-react](https://lucide.dev/)
