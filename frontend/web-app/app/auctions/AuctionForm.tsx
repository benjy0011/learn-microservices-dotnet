'use client'

import { Button, HelperText, Spinner, TextInput } from "flowbite-react";
import { useRouter } from "next/navigation";
import { FieldValues, useForm } from 'react-hook-form'
import sleep from "../utils/sleep";
import Input from "../components/Input";
import { useEffect } from "react";

export default function AuctionForm() {
  const router = useRouter();
  const { control, handleSubmit, setFocus,
    formState: {
      isSubmitting, isValid, isDirty, errors,
    }
  } = useForm();

  useEffect(() => {
    setFocus('make')
  }, [setFocus]);

  async function onSubmit(data: FieldValues) {
    await sleep(2000);
    console.log(data)
  }


  return (
    <form className="flex flex-col mt-3" onSubmit={handleSubmit(onSubmit)}>

      {/* Make */}
      <Input
        name="make"
        label="Make"
        control={control}
        rules={{ required: 'Make is required' }}
      />

      {/* Model */}
      <Input
        name="model"
        label="Model"
        control={control}
        rules={{ required: 'Model is required' }}
      />

      <div className="flex justify-between">
        <Button color='alternative' onClick={() => router.push('/') }>
          Cancel
        </Button>
        <Button
          outline
          color='green'
          type="submit"
          disabled={!isValid || !isDirty || isSubmitting}
        >
          {isSubmitting && <Spinner size="sm" />}
          Submit
        </Button>
      </div>

    </form>
  )
}