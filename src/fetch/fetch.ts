import wretch from 'wretch';
import { ZodAddon } from 'zod-wretch';

export const fetch = wretch().addon(ZodAddon);