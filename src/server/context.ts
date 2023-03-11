import { initTRPC } from '@trpc/server';

export const createContext = async () => await initTRPC.context().create();
