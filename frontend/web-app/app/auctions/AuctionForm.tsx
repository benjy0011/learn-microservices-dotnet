'use client'

import { Button, HelperText, Spinner, TextInput } from "flowbite-react";
import { useRouter } from "next/navigation";
import { FieldValues, useForm } from 'react-hook-form'
import sleep from "../utils/sleep";

export default function AuctionForm() {
  const router = useRouter();
  const { register, handleSubmit, setFocus,
    formState: {
      isSubmitting, isValid, isDirty, errors,
    }
  } = useForm();

  async function onSubmit(data: FieldValues) {
    await sleep(2000);
    console.log(data)
  }


  return (
    <form className="flex flex-col mt-3" onSubmit={handleSubmit(onSubmit)}>

      {/* Make */}
      <div className="mb-3 block">
        <TextInput
          {...register('make', { required: 'Make is required' })}
          placeholder="Make"
          color={errors?.make && 'failure'}
        />
        <HelperText color="failure">
          {errors.make?.message as string}
        </HelperText>
      </div>

      {/* Model */}
      <div className="mb-3 block">
        <TextInput
          {...register('model', { required: 'Model is required' })}
          placeholder="Model"
          color={errors?.model && 'failure'}
        />
        <HelperText color="failure">
          {errors.model?.message as string}
        </HelperText>
      </div>

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