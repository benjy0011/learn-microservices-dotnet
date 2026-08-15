'use server';

import { auth } from "@/auth";

export async function getCurrentUser() {
  try {
    const sesssion = await auth();
    
    if (!sesssion) return null;

    return sesssion.user;
    
  } catch (error) {
    console.log(error);
    return null;
  }
}