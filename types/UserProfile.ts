export interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  photoUrl?: string;
  password?: string;
}

export interface UserProfileState {
  user: UserProfile | null;
  loading: boolean;
  error: string | null;
}
