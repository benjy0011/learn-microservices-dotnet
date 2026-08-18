import { HelperText, Label, TextInput } from "flowbite-react";
import { HTMLInputTypeAttribute } from "react";
import { useController, type UseControllerProps } from "react-hook-form";

type Props = {
  label: string;
  type?: HTMLInputTypeAttribute;
  showLabel?: boolean;
} & UseControllerProps

export default function Input(props : Props) {
  const { field, fieldState } = useController({ ...props });

  return (
    <div className="mb-3 block">
      {props.showLabel && (
        <div className="mb-2 block">
          <Label htmlFor={field.name}>{props.label}</Label>
        </div>
      )}
      <TextInput
        {...props}
        {...field}
        type={props.type || 'text'}
        placeholder={props.label}
        value={field.value || ''}
        color={
          fieldState?.error 
          ? 'failure' 
          : !fieldState.isDirty
            ? ''
            : 'success'
        }
      />
      <HelperText color="failure">
        {fieldState.error?.message}
      </HelperText>
    </div>
  )
}