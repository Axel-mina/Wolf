import { Role } from '../types';

export interface RoleInfo {
  id: Role;
  name: string;
  badge: string;
  color: string;
  bgColor: string;
  borderColor: string;
  description: string;
  nightInstruction: string;
}

export const ROLES_INFO: Record<Role, RoleInfo> = {
  WOLF: {
    id: 'WOLF',
    name: 'الذئب',
    badge: '🐺 شرير متخفٍ',
    color: 'text-red-400',
    bgColor: 'bg-red-950/50',
    borderColor: 'border-red-600',
    description: 'أنت الذئب المتنكر بين أهل القرية. في كل ليلة تختار ضحية للقضاء عليها دون أن يكتشف أمرك أحد.',
    nightInstruction: 'اختر مواطناً للقضاء عليه هذه الليلة:',
  },
  DOCTOR: {
    id: 'DOCTOR',
    name: 'الطبيب',
    badge: '🩺 منقذ القرية',
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-950/50',
    borderColor: 'border-emerald-600',
    description: 'أنت طبيب القرية الشجاع. كل ليلة تختار شخصاً واحداً (أو نفسك) لحمايته وترياقه من أنياب الذئب.',
    nightInstruction: 'اختر شخصاً لحمايته وإسعافه هذه الليلة:',
  },
  CITIZEN: {
    id: 'CITIZEN',
    name: 'مواطن صالح',
    badge: '🧑‍🌾 قروي بريء',
    color: 'text-amber-400',
    bgColor: 'bg-amber-950/40',
    borderColor: 'border-amber-600',
    description: 'أنت مواطن شريف مسالم. ليس لديك قوى ليلية خارقة، ولكن صوتك في الصباح هو سلاحك الأقوى لكشف الذئب والقضاء عليه.',
    nightInstruction: 'أنت نائم بأمان الليلة... لا يوجد إجراء لك. احفظ هويتك واستعد لنقاشات الصباح!',
  },
};

export const DEFAULT_ARABIC_NAMES = [
  'أحمد',
  'سارة',
  'كريم',
  'ليلى',
  'عمر',
  'مريم',
  'يوسف',
  'فاطمة',
  'حمزة',
  'نور',
  'خالد',
  'زينب'
];

export const AVATAR_COLORS = [
  'bg-blue-600 text-blue-100',
  'bg-purple-600 text-purple-100',
  'bg-emerald-600 text-emerald-100',
  'bg-rose-600 text-rose-100',
  'bg-amber-600 text-amber-100',
  'bg-cyan-600 text-cyan-100',
  'bg-indigo-600 text-indigo-100',
  'bg-teal-600 text-teal-100',
];
