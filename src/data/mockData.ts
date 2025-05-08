export interface Item {
  id: string;
  title: string;
  description: string;
  image: string;
  location: string;
  type: "Lost" | "Found";
  date: string;
  contactEmail: string;
  status: "Pending" | "Claimed" | "Resolved";
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

export interface Claim {
  id: string;
  itemId: string;
  email: string;
  message: string;
  date: string;
  status: "Pending" | "Approved" | "Rejected";
  aiConfidence: number;
  aiReason: string;
}

export const locations = [
  "Main Building",
  "Library",
  "Cafeteria",
  "Engineering Block",
  "Sports Complex",
  "Auditorium",
  "Hostel Block A",
  "Hostel Block B",
  "Parking Lot",
  "Science Block"
];

export const mockItems: Item[] = [
  {
    id: "1",
    title: "MacBook Pro 16-inch",
    description: "Space gray MacBook Pro 16-inch (2021) with MIT sticker on the cover. Last seen in the library study room 203.",
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853",
    location: "Library",
    type: "Lost",
    date: "2023-04-10",
    contactEmail: "student@mit.edu",
    status: "Pending",
    coordinates: {
      latitude: 42.3596,
      longitude: -71.0912
    }
  },
  {
    id: "2",
    title: "iPhone 14 Pro (Black)",
    description: "iPhone 14 Pro in matte black with a clear case. The lock screen wallpaper is the MIT campus. Lost near the cafeteria.",
    image: "https://images.unsplash.com/photo-1592286927505-1def25115df8",
    location: "Cafeteria",
    type: "Lost",
    date: "2023-04-12",
    contactEmail: "johndoe@mit.edu",
    status: "Claimed",
    coordinates: {
      latitude: 42.3601,
      longitude: -71.0942
    }
  },
  {
    id: "3",
    title: "Car Keys with MIT Keychain",
    description: "Honda car keys with an MIT keychain and a small red flashlight attached. Found near the parking lot entrance.",
    image: "https://images.unsplash.com/photo-1582139329536-e7284fece509",
    location: "Parking Lot",
    type: "Found",
    date: "2023-04-15",
    contactEmail: "security@mit.edu",
    status: "Pending"
  },
  {
    id: "4",
    title: "Blue Water Bottle",
    description: "Hydro Flask blue water bottle with MIT engineering department sticker. Found in Lecture Hall 102 after the Algorithms class.",
    image: "https://images.unsplash.com/photo-1602443276673-f52c60ee4fc8",
    location: "Engineering Block",
    type: "Found",
    date: "2023-04-08",
    contactEmail: "staff@mit.edu",
    status: "Pending",
    coordinates: {
      latitude: 42.3598,
      longitude: -71.0921
    }
  },
  {
    id: "5",
    title: "Noise Cancelling Headphones",
    description: "Sony WH-1000XM4 noise cancelling headphones in black. Left in the library study room near the computer stations.",
    image: "https://images.unsplash.com/photo-1545127398-14699f92334b",
    location: "Library",
    type: "Found",
    date: "2023-04-14",
    contactEmail: "library@mit.edu",
    status: "Pending"
  },
  {
    id: "6",
    title: "Student ID Card",
    description: "MIT student ID card for Sarah Johnson. Found near the entrance to the cafeteria during lunch hours.",
    image: "https://images.unsplash.com/photo-1586074299757-dc655f18518c",
    location: "Cafeteria",
    type: "Found",
    date: "2023-04-11",
    contactEmail: "frontdesk@mit.edu",
    status: "Resolved",
    coordinates: {
      latitude: 42.3601,
      longitude: -71.0942
    }
  }
];

export const mockClaims: Claim[] = [
  {
    id: "1",
    itemId: "3",
    email: "carowner@mit.edu",
    message: "These are my car keys. The Honda key has a scratch on the side and the keychain has my initials 'MJ' on the back. I lost them on April 15th after parking my car in the morning.",
    date: "2023-04-16",
    status: "Pending",
    aiConfidence: 85,
    aiReason: "The description details match the item. The date of loss aligns with the found date, and the location is consistent with where the item might have been lost."
  },
  {
    id: "2",
    itemId: "2",
    email: "phoneowner@mit.edu",
    message: "This is my iPhone. I can unlock it with my Face ID, and I can describe the phone case which has a small crack in the bottom right corner. I lost it during lunch in the cafeteria.",
    date: "2023-04-13",
    status: "Approved",
    aiConfidence: 93,
    aiReason: "High confidence match due to ability to unlock with biometrics, specific details about the case damage, and matching location and timing of loss."
  }
];

// Mock AI analysis responses
export const mockAIResponses = {
  itemMatching: {
    items: ["iPhone 14 Pro (Black)", "iPhone 13 (Black case)"],
    confidence: 78,
    reason: "Both items are iPhones with similar physical characteristics. The color and case description match, but the models differ. The reported loss locations are near each other."
  },
  claimVerification: {
    itemId: "3",
    claimId: "1",
    confidence: 85,
    reason: "The claimant provided specific details about the key (scratch) and keychain (initials) that weren't in the original description. The timeline and location are consistent."
  },
  descriptionSummary: {
    original: "I think I left my um... you know, the blue bag, the one with all my books and I think my calculator was in there too. It's kinda large and has like a logo on it. I think it was North... North Face? Yeah, that's it. I had it in the morning class, then lunch, then I noticed it was gone when I got to the lab.",
    summary: "Blue North Face backpack containing books and a calculator. Last seen between lunch period and afternoon lab session.",
    confidence: 90,
    reason: "Extracted key item characteristics (blue North Face bag), contents (books, calculator), and last known locations/timing."
  }
};
