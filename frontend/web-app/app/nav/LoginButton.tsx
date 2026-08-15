'use client';

import { signIn } from "next-auth/react";
import { Button } from "flowbite-react";

export default function LoginButton() {
  return (
    <Button
      outline
      onClick={() => signIn('id-server', {redirectTo: '/'}, {prompt: 'login'})}
      color='red'
    >
      Login
    </Button>
  )
}