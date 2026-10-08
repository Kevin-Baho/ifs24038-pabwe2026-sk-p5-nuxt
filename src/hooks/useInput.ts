import { ref } from "vue";

export function useInput(initialValue: string = "") {
  const value = ref(initialValue);

  const onChange = (e: Event | { target: { value: string } }) => {
    const target = e.target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
    value.value = target.value;
  };

  const setValue = (newValue: string) => {
    value.value = newValue;
  };

  const reset = () => {
    value.value = initialValue;
  };

  return [value, onChange, setValue, reset] as const;
}

