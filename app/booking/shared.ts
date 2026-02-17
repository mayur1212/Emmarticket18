export type Step =
  | "intro"
  | "experience"
  | "package"
  | "datetime"
  | "tickets"
  | "summary"
  | "contact"
  | "payment"
  | "success";

export type SlotPeriod = "all" | "morning" | "afternoon" | "evening" | "night";

export type AttractionType = {
  id: string;
  title: string;
  availability: string;
  image: string;
};

export type PackageType = {
  id: string;
  title: string;
  price: number;
  subtitle: string;
  image: string;
  imageMode?: "cover" | "contain";
};

export type SlotOption = {
  time: string;
  period: Exclude<SlotPeriod, "all">;
};

export type FlowState = {
  selectedAttractionId: string;
  selectedPackageId: string | null;
  selectedDate: string;
  selectedSlot: string;
  slotFilter: SlotPeriod;
  adults: number;
  children: number;
  childrenEnabled: boolean;
  fullName: string;
  phone: string;
  email: string;
};

export const BOOKING_STORAGE_KEY = "booking_flow_state_v1";
export const DATE_COUNT = 7;

export const ATTRACTIONS: AttractionType[] = [
  {
    id: "aquarium",
    title: "Dubai Aquarium & Underwater Zoo",
    availability: "Next Availability: 4:00 PM",
    image:
      "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: "reel",
    title: "Reel Cinemas",
    availability: "Next Show: Multiplex",
    image:
      "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: "adventure",
    title: "Adventure Park",
    availability: "Next Availability: All Day",
    image:
      "https://images.unsplash.com/photo-1576347115976-198d7fd35d2f?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: "kidzania",
    title: "KidZania Dubai",
    availability: "Next Availability: All Day",
    image:
      "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: "skyviews",
    title: "Sky Views Observatory",
    availability: "Next Availability: All Day",
    image:
      "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: "icerink",
    title: "Dubai Ice Rink",
    availability: "Next Availability: All Day",
    image:
      "https://images.unsplash.com/photo-1515703407324-5f753afd8be8?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: "playdxb",
    title: "Play DXB",
    availability: "Next Availability: All Day",
    image:
      "https://images.unsplash.com/photo-1609743522653-52354461eb27?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: "chinatown",
    title: "Chinatown",
    availability: "Next Availability: All Day",
    image:
      "https://images.unsplash.com/photo-1508061253366-f7da158b6d46?auto=format&fit=crop&w=1000&q=80",
  },
];

export const PACKAGES: PackageType[] = [
  {
    id: "family-3",
    title: "4 FOR THE PRICE OF 3",
    subtitle: "Summer Offer",
    price: 596,
    image:
      "https://images.unsplash.com/photo-1534008757030-27299c4371b6?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "one-pass",
    title: "THREE ATTRACTIONS, ONE PASS",
    subtitle: "Best Value",
    price: 235,
    image:
      "https://images.unsplash.com/photo-1561731216-c3a4d99437d5?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "combo",
    title: "DUBAI AQUARIUM + SKY VIEWS",
    subtitle: "Top Combo",
    price: 309,
    image:
      "https://images.unsplash.com/photo-1520637836862-4d197d17c13a?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "residents",
    title: "UAE RESIDENTS OFFER",
    subtitle: "Limited Time",
    price: 330,
    image:
      "https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "silver",
    title: "SILVER SEASON PASS",
    subtitle: "Season Pass",
    price: 500,
    imageMode: "contain",
    image:
      "https://images.unsplash.com/photo-1457803097033-73570aebaae0?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "gold",
    title: "GOLD SEASON PASS",
    subtitle: "Season Pass",
    price: 450,
    imageMode: "contain",
    image:
      "https://images.unsplash.com/photo-1531431057391-da7a1f174fc6?auto=format&fit=crop&w=900&q=80",
  },
];

export const SLOT_OPTIONS: SlotOption[] = [
  { time: "6:00 AM", period: "morning" },
  { time: "8:00 AM", period: "morning" },
  { time: "11:00 AM", period: "morning" },
  { time: "1:00 PM", period: "afternoon" },
  { time: "4:00 PM", period: "evening" },
  { time: "6:00 PM", period: "evening" },
  { time: "8:00 PM", period: "night" },
  { time: "10:00 PM", period: "night" },
];

export function todayClock(): string {
  const now = new Date();
  return now.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export function futureDates(count: number): string[] {
  const list: string[] = [];
  for (let i = 0; i < count; i += 1) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    list.push(
      date.toLocaleDateString("en-GB", {
        weekday: "long",
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    );
  }
  return list;
}

export function formatAED(value: number): string {
  return `AED ${value.toFixed(2)}`;
}

export function formatReceiptDate(input: string): string {
  const parsed = new Date(input);
  if (Number.isNaN(parsed.getTime())) return input;
  return parsed.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function validateName(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return "Full name is required.";
  if (trimmed.length < 3) return "Enter at least 3 characters.";
  if (!/^[a-zA-Z ]+$/.test(trimmed)) return "Use letters and spaces only.";
  return "";
}

export function validatePhone(value: string): string {
  const digits = value.replace(/\D/g, "");
  if (!digits) return "Mobile number is required.";
  if (digits.length < 8) return "Enter at least 8 digits.";
  if (digits.length > 12) return "Enter a valid mobile number.";
  return "";
}

export function validateEmail(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return "Email is required.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) return "Enter a valid email address.";
  return "";
}

export function getDefaultFlowState(): FlowState {
  return {
    selectedAttractionId: ATTRACTIONS[0].id,
    selectedPackageId: null,
    selectedDate: futureDates(DATE_COUNT)[0],
    selectedSlot: "4:00 PM",
    slotFilter: "all",
    adults: 0,
    children: 0,
    childrenEnabled: false,
    fullName: "",
    phone: "",
    email: "",
  };
}

export function readFlowState(): FlowState {
  const fallback = getDefaultFlowState();
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.sessionStorage.getItem(BOOKING_STORAGE_KEY);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw) as Partial<FlowState>;
    return { ...fallback, ...parsed };
  } catch {
    return fallback;
  }
}

export function writeFlowState(flow: FlowState): void {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(BOOKING_STORAGE_KEY, JSON.stringify(flow));
}

export function clearFlowState(): void {
  if (typeof window === "undefined") return;
  window.sessionStorage.removeItem(BOOKING_STORAGE_KEY);
}

