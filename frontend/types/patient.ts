export type UserProfile = {
    id: string; // uuid
    updated_at: string; // timestamptz
    username: string; // text
    full_name: string; // text
    avatar_url: string; // text
    age: number; // int2
    gender: string; // text
    medical_history: string; // text
    emergency_name: string; // text
    emergency_phone: string; // text
    relationship: string; // text
    allergies: string; // text
    contact_phone: string; // text
};