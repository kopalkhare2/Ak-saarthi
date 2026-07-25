import fs from 'fs';
import path from 'path';

export interface AdvisorAccount {
  id: string;
  email: string;
  passwordHash: string;
  role: 'advisor';
  createdAt: string;
}

export interface AccessRequest {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'pending' | 'approved' | 'declined';
  createdAt: string;
}

// In-memory store persistent across requests in serverless process lifecycle
const globalStore = global as typeof globalThis & {
  __ak_advisors?: AdvisorAccount[];
  __ak_requests?: AccessRequest[];
};

if (!globalStore.__ak_advisors) {
  globalStore.__ak_advisors = [];
}
if (!globalStore.__ak_requests) {
  globalStore.__ak_requests = [];
}

const getStorePath = (filename: string) => {
  const tmpDir = process.env.VERCEL ? '/tmp' : path.join(process.cwd(), 'prisma');
  if (!fs.existsSync(tmpDir)) {
    try {
      fs.mkdirSync(tmpDir, { recursive: true });
    } catch (e) {}
  }
  return path.join(tmpDir, filename);
};

export const getStoreAdvisors = (): AdvisorAccount[] => {
  try {
    const file = getStorePath('advisors.json');
    if (fs.existsSync(file)) {
      const data = JSON.parse(fs.readFileSync(file, 'utf8'));
      if (Array.isArray(data)) {
        globalStore.__ak_advisors = data;
      }
    }
  } catch (e) {}
  return globalStore.__ak_advisors || [];
};

export const saveStoreAdvisor = (advisor: AdvisorAccount) => {
  const list = getStoreAdvisors();
  const existingIndex = list.findIndex((a) => a.email.toLowerCase() === advisor.email.toLowerCase());
  if (existingIndex >= 0) {
    list[existingIndex] = advisor;
  } else {
    list.push(advisor);
  }
  globalStore.__ak_advisors = list;

  try {
    const file = getStorePath('advisors.json');
    fs.writeFileSync(file, JSON.stringify(list, null, 2), 'utf8');
  } catch (e) {}
};

export const getStoreRequests = (): AccessRequest[] => {
  try {
    const file = getStorePath('requests.json');
    if (fs.existsSync(file)) {
      const data = JSON.parse(fs.readFileSync(file, 'utf8'));
      if (Array.isArray(data)) {
        globalStore.__ak_requests = data;
      }
    }
  } catch (e) {}
  return globalStore.__ak_requests || [];
};

export const saveStoreRequest = (req: AccessRequest) => {
  const list = getStoreRequests();
  const existingIndex = list.findIndex((r) => r.id === req.id || r.email.toLowerCase() === req.email.toLowerCase());
  if (existingIndex >= 0) {
    list[existingIndex] = req;
  } else {
    list.push(req);
  }
  globalStore.__ak_requests = list;

  try {
    const file = getStorePath('requests.json');
    fs.writeFileSync(file, JSON.stringify(list, null, 2), 'utf8');
  } catch (e) {}
};

export const updateStoreRequestStatus = (id: string, status: 'approved' | 'declined') => {
  const list = getStoreRequests();
  const target = list.find((r) => r.id === id);
  if (target) {
    target.status = status;
    globalStore.__ak_requests = list;
    try {
      const file = getStorePath('requests.json');
      fs.writeFileSync(file, JSON.stringify(list, null, 2), 'utf8');
    } catch (e) {}
  }
};
