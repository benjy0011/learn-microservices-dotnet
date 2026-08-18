'use client'

import { Button, HelperText, Spinner, TextInput } from "flowbite-react";
import { useRouter } from "next/navigation";
import { FieldValues, useForm } from 'react-hook-form'
import sleep from "../utils/sleep";
import Input from "../components/Input";
import { useEffect } from "react";
import DateInput from "../components/DateInput";

export default function AuctionForm() {
  const router = useRouter();
  const { control, handleSubmit, setFocus,
    formState: {
      isSubmitting, isValid, isDirty, errors,
    }
  } = useForm({
    mode: 'onTouched',
  });

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

      {/* Color */}
      <Input
        name="color"
        label="Color"
        control={control}
        rules={{ required: 'Color is required' }}
      />


      <div className="grid grid-cols-2 gap-3">
        {/* Year */}
        <Input
          name="year"
          label="Year"
          type="number"
          control={control}
          rules={{ required: 'Year is required' }}
        />

        {/* Mileage */}
        <Input
          name="mileage"
          label="Mileage"
          type="number"
          control={control}
          rules={{ required: 'Mileage is required' }}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        {/* Reserve Price */}
        <Input
          name="reservePrice"
          label="Reserve price (enter 0 if no reserve price)"
          type="number"
          control={control}
          rules={{ required: 'Reserve Price is required' }}
        />

        {/* Auction end date */}
        <DateInput
          name="auctionEnd"
          label="Auction end date/time"
          control={control}
          showTimeSelect
          dateFormat={'dd MMMM yyy h:mm a'}
          rules={{ required: 'Auction end date is required' }}
        />
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