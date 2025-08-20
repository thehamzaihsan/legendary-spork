// Premium purchase + status service using new backend purchase flow
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import getApiUrl from '../utils/apiUrl.js';

const LS_ANON_ID = 'voodo_anon_user_id';
const LS_PURCHASES = 'premium_purchases';
const LS_IDEMPOTENCY = 'payment_idempotency';

function ensureAnonUserId() {
  let id = localStorage.getItem(LS_ANON_ID);
  if (!id) {
    id = (crypto?.randomUUID?.() ?? uuidv4());
    localStorage.setItem(LS_ANON_ID, id);
  }
  return id;
}

function readPurchases() {
  try {
    const raw = localStorage.getItem(LS_PURCHASES);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writePurchases(purchases) {
  localStorage.setItem(LS_PURCHASES, JSON.stringify(purchases));
}

function mergeServerPurchases(serverActive) {
  const existing = readPurchases();
  const byId = new Map(existing.map((p) => [p.purchaseId, p]));
  for (const p of serverActive) byId.set(p.purchaseId, { ...p, status: 'completed' });
  const merged = Array.from(byId.values()).filter((p) => new Date(p.endAt) > new Date());
  writePurchases(merged);
  return merged;
}

function getActiveBadge(purchases) {
  const now = Date.now();
  const active = purchases.find((p) => new Date(p.endAt).getTime() > now);
  if (!active) return null;
  const tier = active.planId === '30min' ? 'bronze' : active.planId === '1hour' ? 'gold' : 'arcane';
  const name = tier === 'bronze' ? 'Bronze' : tier === 'gold' ? 'Gold' : 'Arcane';
  const color = tier === 'bronze' ? '#CD7F32' : tier === 'gold' ? '#FFD700' : '#8B5CF6';
  return { name, tier, color, endAt: active.endAt };
}

export const premiumApi = {
  ensureAnonUserId,

  getPlans: async () => {
    const { data } = await axios.get(getApiUrl('/purchase/plans'));
    return data.data;
  },

  createCheckout: async ({ planId, successUrl, cancelUrl, idempotencyKey }) => {
    const anonUserId = ensureAnonUserId();
    const { data } = await axios.post(getApiUrl('/purchase/create-checkout'), {
      anonUserId,
      planId,
      successUrl,
      cancelUrl,
      idempotencyKey,
    });
    // cache idempotency + session for retry
    const store = JSON.parse(localStorage.getItem(LS_IDEMPOTENCY) || '{}');
    store[idempotencyKey] = { stripeSessionId: data.stripeSessionId, planId };
    localStorage.setItem(LS_IDEMPOTENCY, JSON.stringify(store));
    return data;
  },

  verifyCheckout: async ({ stripeSessionId, expectedPlanId, redirectUrl, idempotencyKey }) => {
    const anonUserId = ensureAnonUserId();
    const { data } = await axios.post(getApiUrl('/purchase/verify'), {
      anonUserId,
      stripeSessionId,
      expectedPlanId,
      redirectUrl,
      idempotencyKey,
    });
    if (data?.success && data?.data) {
      const merged = mergeServerPurchases([
        {
          purchaseId: data.data.purchaseId,
          planId: data.data.planId,
          startAt: data.data.startAt,
          endAt: data.data.endAt,
        },
      ]);
      return { ...data, localPurchases: merged };
    }
    return data;
  },

  getStatus: async () => {
    const anonUserId = ensureAnonUserId();
    const { data } = await axios.get(getApiUrl(`/purchase/status?anonUserId=${anonUserId}`));
    const merged = mergeServerPurchases(data.activePurchases || []);
    return { serverTime: data.serverTime, purchases: merged };
  },

  getLocalPurchases: readPurchases,
  getActiveBadge,

  getAndSyncStatus: async () => {
    // read local first for fast UI
    const local = readPurchases();
    const badge = getActiveBadge(local);
    // then sync with server
    const remote = await premiumApi.getStatus();
    return { badge, purchases: remote.purchases, serverTime: remote.serverTime };
  },
};
