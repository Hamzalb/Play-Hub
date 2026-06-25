'use client';

import {
  createContext, useContext, useState, useEffect,
  useCallback, type ReactNode,
} from 'react';
import { useAuth } from '@/lib/auth';
import { api } from '@/lib/api';
import { ApiSuccess } from '@/types';

export interface BranchInfo { _id: string; name: string; address: string; }

interface BranchCtx {
  branchId:       string;
  branchName:     string;
  branches:       BranchInfo[];
  setActiveBranch:(id: string) => void;
  refreshBranches:() => void;
  loading:        boolean;
}

const BranchContext = createContext<BranchCtx>({
  branchId: '', branchName: '', branches: [],
  setActiveBranch: () => {}, refreshBranches: () => {}, loading: true,
});

export function BranchProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [branches,   setBranches]   = useState<BranchInfo[]>([]);
  const [selectedId, setSelectedId] = useState('');
  const [loading,    setLoading]    = useState(true);

  const fetchBranches = useCallback(async () => {
    if (!user) { setLoading(false); return; }

    if (user.role === 'super_admin') {
      const res = await api.get<BranchInfo[]>('/branches');
      if (res.status === 'success') {
        const data = (res as ApiSuccess<BranchInfo[]>).data;
        setBranches(data);

        // Restore persisted selection or fall back to first branch
        const stored =
          typeof window !== 'undefined'
            ? localStorage.getItem('playhub-active-branch')
            : null;
        const match = data.find((b) => b._id === stored);
        setSelectedId(match?._id ?? data[0]?._id ?? '');
      }
    } else {
      // Branch managers / staff: use the branchId embedded in their JWT
      setSelectedId(user.branchId ?? '');
    }
    setLoading(false);
  }, [user]);

  useEffect(() => { fetchBranches(); }, [fetchBranches]);

  const setActiveBranch = (id: string) => {
    setSelectedId(id);
    if (typeof window !== 'undefined')
      localStorage.setItem('playhub-active-branch', id);
  };

  const active = branches.find((b) => b._id === selectedId);

  return (
    <BranchContext.Provider value={{
      branchId:       selectedId,
      branchName:     active?.name ?? '',
      branches,
      setActiveBranch,
      refreshBranches: fetchBranches,
      loading,
    }}>
      {children}
    </BranchContext.Provider>
  );
}

export function useBranch(): BranchCtx {
  return useContext(BranchContext);
}
