import React, { createContext, useContext, useState } from 'react';
import type { User, Booking, TroubleReport, CleaningRequest } from '../types';
import { mockUsers, mockBookings, mockTroubleReports } from '../data/mockData';

interface AppContextType {
  currentUser: User | null;
  login: (email: string) => boolean;
  register: (input: {
    name: string;
    email: string;
    nationality?: string;
    purpose?: User['purpose'];
  }) => { ok: boolean; reason?: 'duplicate_email' };
  logout: () => void;
  bookings: Booking[];
  createBooking: (input: Omit<Booking, 'id' | 'smartLockCode' | 'isLocked'>) => Booking;
  activeBooking: Booking | null;
  toggleLock: (bookingId: string) => void;
  troubleReports: TroubleReport[];
  addTroubleReport: (report: Omit<TroubleReport, 'id' | 'createdAt' | 'updatedAt'>) => void;
  cleaningRequests: CleaningRequest[];
  addCleaningRequest: (req: Omit<CleaningRequest, 'id' | 'createdAt'>) => void;
  extendStay: (bookingId: string, newCheckOut: string) => void;
  favorites: string[];
  toggleFavorite: (propertyId: string) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [bookings, setBookings] = useState<Booking[]>(mockBookings);
  const [troubleReports, setTroubleReports] = useState<TroubleReport[]>(mockTroubleReports);
  const [cleaningRequests, setCleaningRequests] = useState<CleaningRequest[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);

  const login = (email: string): boolean => {
    const user = users.find(u => u.email === email);
    if (user) {
      setCurrentUser(user);
      return true;
    }
    return false;
  };

  const register = (input: {
    name: string;
    email: string;
    nationality?: string;
    purpose?: User['purpose'];
  }) => {
    const normalizedEmail = input.email.trim().toLowerCase();
    const exists = users.some((user) => user.email.toLowerCase() === normalizedEmail);

    if (exists) {
      return { ok: false as const, reason: 'duplicate_email' as const };
    }

    const newUser: User = {
      id: `u${Date.now()}`,
      name: input.name.trim(),
      email: normalizedEmail,
      role: 'guest',
      nationality: input.nationality?.trim() || undefined,
      purpose: input.purpose,
    };

    setUsers((prev) => [...prev, newUser]);
    setCurrentUser(newUser);

    return { ok: true as const };
  };

  const logout = () => setCurrentUser(null);

  const createBooking = (input: Omit<Booking, 'id' | 'smartLockCode' | 'isLocked'>): Booking => {
    const booking: Booking = {
      ...input,
      id: `b${Date.now()}`,
      smartLockCode: `${Math.floor(1000 + Math.random() * 9000)}`,
      isLocked: true,
    };

    setBookings((prev) => [
      ...prev.filter((item) => !(item.userId === booking.userId && item.status === 'active')),
      booking,
    ]);

    return booking;
  };

  const activeBooking = currentUser
    ? bookings.find(b => b.userId === currentUser.id && b.status === 'active') ?? null
    : null;

  const toggleLock = (bookingId: string) => {
    setBookings(prev =>
      prev.map(b => b.id === bookingId ? { ...b, isLocked: !b.isLocked } : b)
    );
  };

  const addTroubleReport = (report: Omit<TroubleReport, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    setTroubleReports(prev => [
      ...prev,
      { ...report, id: `tr${Date.now()}`, createdAt: now, updatedAt: now },
    ]);
  };

  const addCleaningRequest = (req: Omit<CleaningRequest, 'id' | 'createdAt'>) => {
    setCleaningRequests(prev => [
      ...prev,
      { ...req, id: `cr${Date.now()}`, createdAt: new Date().toISOString() },
    ]);
  };

  const extendStay = (bookingId: string, newCheckOut: string) => {
    setBookings(prev =>
      prev.map(b => b.id === bookingId ? { ...b, checkOut: newCheckOut } : b)
    );
  };

  const toggleFavorite = (propertyId: string) => {
    setFavorites(prev =>
      prev.includes(propertyId) ? prev.filter(id => id !== propertyId) : [...prev, propertyId]
    );
  };

  return (
    <AppContext.Provider value={{
      currentUser, login, register, logout,
      bookings, createBooking, activeBooking, toggleLock,
      troubleReports, addTroubleReport,
      cleaningRequests, addCleaningRequest,
      extendStay,
      favorites, toggleFavorite,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
