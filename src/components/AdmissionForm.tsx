import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { QrCode, Send, GraduationCap, User, Phone, CreditCard, Mail, CalendarDays, School } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { QRScanner } from '@/components/QRScanner';
import { cn } from '@/lib/utils';

// ─── Validation Schema ──────────────────────────────────────────────────────
const schema = z.object({
  fullName: z.string().min(2, 'Họ tên không được để trống'),
  dob: z.string().min(1, 'Vui lòng chọn ngày sinh'),
  gender: z.enum(['Nam', 'Nữ', 'Khác']),
  phone: z
    .string()
    .regex(/^(0[35789][0-9]{8}|84[35789][0-9]{8})$/, 'Số điện thoại không hợp lệ (VD: 0912345678 hoặc 84912345678)'),
  cccd: z.string().min(9, 'CCCD/CMND không hợp lệ (ít nhất 9 số)').max(12, 'CCCD/CMND không hợp lệ'),
  email: z.string().email('Email không hợp lệ'),
  highSchool: z.string().min(1, 'Vui lòng chọn trường THPT'),
  major1: z.string().min(1, 'Vui lòng chọn Nguyện vọng 1'),
  major2: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

// ─── Data ────────────────────────────────────────────────────────────────────
const schools = [
  'THCS và THPT Phạm Hồng Thái',
  'THCS và THPT Y Đôn',
  'THCS, THPT Nguyễn Văn Cừ',
  'THPT A Sanh',
  'THPT Anh hùng Núp',
  'THPT Dân Tộc Nội Trú Đông Gia Lai',
  'THPT Hà Huy Tập',
  'THPT Hoàng Hoa Thám',
  'THPT Huỳnh Thúc Kháng',
  'THPT Lê Hoàn',
  'THPT Lê Hồng Phong',
  'THPT Lê Lợi',
  'THPT Lê Quý Đôn',
  'THPT Lê Thánh Tông',
  'THPT Lương Thế Vinh',
  'THPT Lý Thường Kiệt',
  'THPT Mạc Đĩnh Chi',
  'THPT Nguyễn Bỉnh Khiêm',
  'THPT Nguyễn Chí Thanh',
  'THPT Nguyễn Huệ',
  'THPT Nguyễn Khuyến',
  'THPT Nguyễn Tất Thành',
  'THPT Nguyễn Thái Học',
  'THPT Nguyễn Thị Minh Khai',
  'THPT Nguyễn Trãi',
  'THPT Nguyễn Trường Tộ',
  'THPT Phạm Văn Đồng',
  'THPT Phan Chu Trinh',
  'THPT Pleiku',
  'THPT Quang Trung',
  'THPT Tôn Đức Thắng',
  'THPT Trần Cao Vân',
  'THPT Trần Hưng Đạo',
  'THPT Trần Phú',
  'THPT Trần Quốc Tuấn',
  'THPT Trường Chinh',
  'THPT Võ Nguyên Giáp',
  'THPT Võ Văn Kiệt',
  'THPT Ya Ly',
  'Trường PTDTNT THPT số 2 tỉnh Gia Lai',
  'TT GDNN-GDTX Chư Prông',
  'TT GDNN-GDTX Đức Cơ',
  'TT GDTX số 2 tỉnh Gia Lai',
];

const majorGroups = [
  {
    group: 'KHỐI NGÀNH NGÔN NGỮ',
    list: ['Ngôn ngữ Trung Quốc', 'Ngôn ngữ Anh', 'Ngôn ngữ Hàn Quốc', 'Ngôn ngữ Nhật'],
  },
  {
    group: 'KHỐI NGÀNH SỨC KHỎE',
    list: ['Y khoa', 'Dược học', 'Điều dưỡng', 'Kỹ thuật Phục hồi chức năng', 'Hộ sinh', 'Dinh dưỡng'],
  },
  {
    group: 'KHỐI NGÀNH KINH DOANH VÀ QUẢN LÝ',
    list: [
      'Quản trị kinh doanh',
      'Kinh doanh thương mại',
      'Kinh doanh số',
      'Marketing',
      'Digital Marketing',
      'Quản trị thương hiệu và truyền thông',
      'Logistics và quản lý chuỗi cung ứng',
      'Thương mại điện tử',
      'Kế toán',
      'Tài chính - Ngân hàng',
      'Công nghệ tài chính (Fintech)',
      'Kinh doanh quốc tế',
      'Truyền thông đa phương tiện',
      'Quan hệ công chúng và Quản trị sự kiện',
      'Quản trị nhân lực',
    ],
  },
  {
    group: 'KHỐI NGÀNH DỊCH VỤ - DU LỊCH - KHÁCH SẠN',
    list: [
      'Quản trị dịch vụ du lịch và lữ hành',
      'Hướng dẫn du lịch quốc tế',
      'Quản trị sự kiện và giải trí',
      'Quản trị khách sạn',
      'Quản trị nhà hàng và dịch vụ ăn uống',
    ],
  },
  {
    group: 'KHỐI NGÀNH KỸ THUẬT',
    list: [
      'Công nghệ kỹ thuật ô tô',
      'Công nghệ thông tin',
      'Quản trị CNTT trong doanh nghiệp',
      'Kỹ thuật máy tính',
      'Trí tuệ nhân tạo',
      'Đồ họa',
      'Thiết kế nội thất',
      'Mỹ thuật số',
      'Công nghệ kỹ thuật điện, điện tử',
      'Thiết kế vi mạch bán dẫn',
      'Kỹ thuật Cơ điện tử',
      'Kiến trúc',
      'Công nghệ thực phẩm',
    ],
  },
  {
    group: 'KHỐI NGÀNH TÂM LÝ - SƯ PHẠM - LUẬT',
    list: ['Luật', 'Luật kinh tế', 'Giáo dục học', 'Giáo dục mầm non', 'Giáo dục tiểu học', 'Tâm lý học', 'Quản lý văn hóa'],
  },
];

// Replace this with your actual Google Apps Script URL
const GOOGLE_SCRIPT_URL = import.meta.env.VITE_GOOGLE_SCRIPT_URL ?? '';

// ─── Helper ───────────────────────────────────────────────────────────────────
function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1 text-xs text-red-500">{message}</p>;
}

function FieldWrapper({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('flex flex-col gap-1.5', className)}>{children}</div>;
}

// ─── Parse CCCD QR data ───────────────────────────────────────────────────────
// CCCD QR format: id|cmnd|full_name|dob|gender|address|issue_date
function parseCCCDQR(raw: string) {
  const parts = raw.split('|');
  if (parts.length >= 7) {
    const rawDob = parts[3]; // DDMMYYYY
    let dob = '';
    if (rawDob.length === 8) {
      dob = `${rawDob.slice(4)}-${rawDob.slice(2, 4)}-${rawDob.slice(0, 2)}`;
    }
    return {
      cccd: parts[0],
      fullName: parts[2],
      dob,
      gender: parts[4] === 'Nam' ? 'Nam' : parts[4] === 'Nữ' ? 'Nữ' : 'Khác',
    };
  }
  return null;
}

// ─── Main Component ──────────────────────────────────────────────────────────
export default function AdmissionForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showQR, setShowQR] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { gender: 'Nam' },
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      if (GOOGLE_SCRIPT_URL) {
        await fetch(GOOGLE_SCRIPT_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
      } else {
        // Dev fallback: log to console
        console.log('Form data:', data);
        await new Promise((r) => setTimeout(r, 800));
      }
      setSubmitted(true);
    } catch {
      alert('Có lỗi xảy ra, vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQRScan = (raw: string) => {
    setShowQR(false);
    const parsed = parseCCCDQR(raw);
    if (parsed) {
      setValue('cccd', parsed.cccd, { shouldValidate: true });
      setValue('fullName', parsed.fullName, { shouldValidate: true });
      if (parsed.dob) setValue('dob', parsed.dob, { shouldValidate: true });
      setValue('gender', parsed.gender as 'Nam' | 'Nữ' | 'Khác', { shouldValidate: true });
    } else {
      // Fall back: put raw data into CCCD field
      setValue('cccd', raw, { shouldValidate: true });
    }
  };

  if (submitted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-xl">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="mb-2 text-2xl font-bold text-gray-800">Đăng ký thành công!</h2>
          <p className="mb-6 text-gray-500">Thông tin của bạn đã được ghi nhận. Chúng tôi sẽ liên hệ sớm nhất.</p>
          <Button onClick={() => setSubmitted(false)} className="w-full">
            Đăng ký thêm
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      {showQR && <QRScanner onScan={handleQRScan} onClose={() => setShowQR(false)} />}

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-8">
        {/* Header */}
        <div className="mx-auto mb-6 max-w-2xl text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 shadow-lg">
            <GraduationCap className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 sm:text-3xl">Phiếu Đăng Ký Tuyển Sinh</h1>
          <p className="mt-1 text-sm text-gray-500">Vui lòng điền đầy đủ thông tin bên dưới</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mx-auto max-w-2xl space-y-6">
          {/* ── Personal Info Card ── */}
          <div className="rounded-2xl bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-4 flex items-center gap-2 border-b border-gray-100 pb-3">
              <User className="h-5 w-5 text-blue-600" />
              <h2 className="text-base font-semibold text-gray-700">Thông tin cá nhân</h2>
            </div>

            <div className="space-y-4">
              {/* Full Name */}
              <FieldWrapper>
                <Label htmlFor="fullName">
                  Họ và tên <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="fullName"
                  placeholder="Nguyễn Văn A"
                  {...register('fullName')}
                  className={errors.fullName ? 'border-red-400 focus-visible:ring-red-400' : ''}
                />
                <FieldError message={errors.fullName?.message} />
              </FieldWrapper>

              {/* DOB + Gender row */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FieldWrapper>
                  <Label htmlFor="dob">
                    Ngày sinh <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <Input
                      id="dob"
                      type="date"
                      className={cn('pl-9', errors.dob ? 'border-red-400 focus-visible:ring-red-400' : '')}
                      {...register('dob')}
                    />
                  </div>
                  <FieldError message={errors.dob?.message} />
                </FieldWrapper>

                <FieldWrapper>
                  <Label>
                    Giới tính <span className="text-red-500">*</span>
                  </Label>
                  <Controller
                    name="gender"
                    control={control}
                    render={({ field }) => (
                      <RadioGroup
                        value={field.value}
                        onValueChange={field.onChange}
                        className="mt-1 flex gap-4"
                      >
                        {['Nam', 'Nữ', 'Khác'].map((g) => (
                          <div key={g} className="flex items-center gap-1.5">
                            <RadioGroupItem value={g} id={`gender-${g}`} />
                            <Label htmlFor={`gender-${g}`} className="cursor-pointer font-normal">
                              {g}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    )}
                  />
                </FieldWrapper>
              </div>

              {/* Phone */}
              <FieldWrapper>
                <Label htmlFor="phone">
                  Số điện thoại <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="0912345678"
                    className={cn('pl-9', errors.phone ? 'border-red-400 focus-visible:ring-red-400' : '')}
                    {...register('phone')}
                  />
                </div>
                <FieldError message={errors.phone?.message} />
              </FieldWrapper>

              {/* CCCD with QR scan */}
              <FieldWrapper>
                <div className="flex items-center justify-between">
                  <Label htmlFor="cccd">
                    CCCD / CMND <span className="text-red-500">*</span>
                  </Label>
                  <button
                    type="button"
                    onClick={() => setShowQR(true)}
                    className="flex items-center gap-1 rounded-md bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-600 hover:bg-blue-100 transition-colors"
                  >
                    <QrCode className="h-3.5 w-3.5" />
                    Quét QR
                  </button>
                </div>
                <div className="relative">
                  <CreditCard className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    id="cccd"
                    placeholder="012345678901"
                    className={cn('pl-9', errors.cccd ? 'border-red-400 focus-visible:ring-red-400' : '')}
                    {...register('cccd')}
                  />
                </div>
                <FieldError message={errors.cccd?.message} />
              </FieldWrapper>

              {/* Email */}
              <FieldWrapper>
                <Label htmlFor="email">
                  Email <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="example@email.com"
                    className={cn('pl-9', errors.email ? 'border-red-400 focus-visible:ring-red-400' : '')}
                    {...register('email')}
                  />
                </div>
                <FieldError message={errors.email?.message} />
              </FieldWrapper>
            </div>
          </div>

          {/* ── School Card ── */}
          <div className="rounded-2xl bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-4 flex items-center gap-2 border-b border-gray-100 pb-3">
              <School className="h-5 w-5 text-blue-600" />
              <h2 className="text-base font-semibold text-gray-700">Trường đang học</h2>
            </div>

            <FieldWrapper>
              <Label>
                Trường THPT / THCS <span className="text-red-500">*</span>
              </Label>
              <Controller
                name="highSchool"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className={errors.highSchool ? 'border-red-400 ring-red-400' : ''}>
                      <SelectValue placeholder="-- Chọn trường của bạn --" />
                    </SelectTrigger>
                    <SelectContent>
                      {schools.map((school) => (
                        <SelectItem key={school} value={school}>
                          {school}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              <FieldError message={errors.highSchool?.message} />
            </FieldWrapper>
          </div>

          {/* ── Majors Card ── */}
          <div className="rounded-2xl bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-4 flex items-center gap-2 border-b border-gray-100 pb-3">
              <GraduationCap className="h-5 w-5 text-blue-600" />
              <h2 className="text-base font-semibold text-gray-700">Nguyện vọng xét tuyển</h2>
            </div>

            <div className="space-y-4">
              {/* Major 1 */}
              <FieldWrapper>
                <Label>
                  Nguyện vọng 1 <span className="text-red-500">*</span>
                </Label>
                <Controller
                  name="major1"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className={errors.major1 ? 'border-red-400 ring-red-400' : ''}>
                        <SelectValue placeholder="-- Chọn ngành --" />
                      </SelectTrigger>
                      <SelectContent>
                        {majorGroups.map((mg) => (
                          <SelectGroup key={mg.group}>
                            <SelectLabel>{mg.group}</SelectLabel>
                            {mg.list.map((major) => (
                              <SelectItem key={`nv1-${major}`} value={major}>
                                {major}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                <FieldError message={errors.major1?.message} />
              </FieldWrapper>

              {/* Major 2 */}
              <FieldWrapper>
                <Label>
                  Nguyện vọng 2{' '}
                  <span className="text-xs font-normal text-gray-400">(không bắt buộc)</span>
                </Label>
                <Controller
                  name="major2"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value ?? ''}>
                      <SelectTrigger>
                        <SelectValue placeholder="-- Chọn ngành (tùy chọn) --" />
                      </SelectTrigger>
                      <SelectContent>
                        {majorGroups.map((mg) => (
                          <SelectGroup key={mg.group}>
                            <SelectLabel>{mg.group}</SelectLabel>
                            {mg.list.map((major) => (
                              <SelectItem key={`nv2-${major}`} value={major}>
                                {major}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </FieldWrapper>
            </div>
          </div>

          {/* ── Submit ── */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 text-base font-semibold shadow-md"
            size="lg"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Đang gửi...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Send className="h-5 w-5" />
                Gửi đăng ký
              </span>
            )}
          </Button>

          <p className="pb-4 text-center text-xs text-gray-400">
            Bằng cách gửi form này, bạn đồng ý cho phép chúng tôi lưu trữ thông tin để xử lý đăng ký.
          </p>
        </form>
      </div>
    </>
  );
}
