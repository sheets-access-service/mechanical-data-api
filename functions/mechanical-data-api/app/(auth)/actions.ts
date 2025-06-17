'use server';

import { z } from 'zod';
import { createUser, getUser } from '@/lib/db/queries';
import { signIn } from './auth';

// SCHEMA
const authFormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export interface LoginActionState {
  status: 'idle' | 'in_progress' | 'success' | 'failed' | 'invalid_data';
}

export interface RegisterActionState {
  status: 'idle' | 'in_progress' | 'success' | 'failed' | 'user_exists' | 'invalid_data';
}

export const login = async (_: LoginActionState, formData: FormData): Promise<LoginActionState> => {
  try {
    const validatedData = authFormSchema.parse({
      email: formData.get('email'),
      password: formData.get('password'),
    });

    await signIn('credentials', {
      email: validatedData.email,
      password: validatedData.password,
      redirect: false,
    });

    return { status: 'success' };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { status: 'invalid_data' };
    }
    return { status: 'failed' };
  }
};

export const register = async (_: RegisterActionState, formData: FormData): Promise<RegisterActionState> => {
  try {
    const validatedData = authFormSchema.parse({
      email: formData.get('email'),
      password: formData.get('password'),
    });

    const [user] = await getUser(validatedData.email);
    if (user) {
      return { status: 'user_exists' };
    }

    await createUser(validatedData.email, validatedData.password);
    await signIn('credentials', {
      email: validatedData.email,
      password: validatedData.password,
      redirect: false,
    });

    return { status: 'success' };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { status: 'invalid_data' };
    }
    return { status: 'failed' };
  }
};

export const fetchSheetData = async () => {
  try {
    const response = await fetch('https://script.google.com/macros/s/AKfycbw-LqcuJxof3kxdCUcBsMlB13uWbBDvL262TDWWwKnm/dev');
    if (!response.ok) throw new Error('Failed to fetch data');
    return await response.json();
  } catch (error) {
    console.error('Error fetching sheet data:', error);
    return null;
  }
};
