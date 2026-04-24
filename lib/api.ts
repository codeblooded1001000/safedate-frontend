import axios from 'axios';
import { getPublicApiUrl } from './runtime-config';

const API_URL = getPublicApiUrl();

const client = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

export const api = {
  // Sessions
  createSession: async (data: { creatorName: string; creatorPhone: string }) => {
    const res = await client.post('/api/sessions', data);
    return res.data;
  },

  getSession: async (code: string, opts?: { as?: 'CREATOR' | 'PARTNER' }) => {
    const res = await client.get(`/api/sessions/${code}`, {
      params: opts?.as ? { as: opts.as } : undefined,
    });
    return res.data;
  },

  joinSession: async (code: string, data: { partnerName: string; partnerPhone: string }) => {
    const res = await client.patch(`/api/sessions/${code}/join`, data);
    return res.data;
  },

  selectVenue: async (code: string, data: { venueId: string; dateTime?: string }) => {
    const res = await client.patch(`/api/sessions/${code}/select-venue`, data);
    return res.data;
  },

  updateDateTime: async (
    code: string,
    data: { dateTime: string; userType: 'CREATOR' | 'PARTNER' },
  ) => {
    const res = await client.patch(`/api/sessions/${code}/date-time`, data);
    return res.data;
  },

  // Preferences
  submitPreferences: async (
    code: string,
    data: {
      userType: string;
      latitude: number;
      longitude: number;
      areaName?: string;
      budgetMin: number;
      budgetMax: number;
      vibes: string[];
      timeSlot: string;
    },
  ) => {
    const res = await client.post(`/api/sessions/${code}/preferences`, data);
    return res.data;
  },

  getPreferences: async (code: string) => {
    const res = await client.get(`/api/sessions/${code}/preferences`);
    return res.data;
  },

  // Venues
  getVenues: async (code: string, opts?: { as?: 'CREATOR' | 'PARTNER' }) => {
    const res = await client.get(`/api/sessions/${code}/venues`, {
      params: opts?.as ? { as: opts.as } : undefined,
    });
    return res.data;
  },

  suggestVenue: async (code: string, venueId: string, suggestedBy: string) => {
    const res = await client.post(`/api/sessions/${code}/venues/${venueId}/suggest`, {
      suggestedBy,
    });
    return res.data;
  },

  voteVenue: async (code: string, venueId: string, userType: string, vote: boolean) => {
    const res = await client.post(`/api/sessions/${code}/venues/${venueId}/vote`, {
      userType,
      vote,
    });
    return res.data;
  },

  // Safety
  addSafetyContact: async (
    code: string,
    data: {
      userType: string;
      contactName: string;
      contactPhone: string;
      notifyOnStart?: boolean;
      checkinIntervalMins?: number;
    },
  ) => {
    const res = await client.post(`/api/sessions/${code}/safety/contact`, data);
    return res.data;
  },

  removeSafetyContact: async (code: string, contactId: string) => {
    const res = await client.delete(`/api/sessions/${code}/safety/contact/${contactId}`);
    return res.data;
  },

  shareLocation: async (code: string, userType: string) => {
    const res = await client.post(`/api/sessions/${code}/safety/share`, { userType });
    return res.data;
  },

  checkin: async (code: string, userType: string, isOk: boolean) => {
    const res = await client.post(`/api/sessions/${code}/safety/checkin`, { userType, isOk });
    return res.data;
  },

  sos: async (code: string, userType: string) => {
    const res = await client.post(`/api/sessions/${code}/safety/sos`, { userType });
    return res.data;
  },
};
