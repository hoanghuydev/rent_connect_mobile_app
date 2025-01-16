
import React from 'react';
import { TextInput } from 'react-native-paper';

interface Option {
  value: string;
  label: string;
}

interface SelectInputProps {
  label: string;
  value: string;
  options: Option[];
  onSelect: (value: string) => void;
  onPress: () => void;
  style?: any;
}

const SelectInput: React.FC<SelectInputProps> = ({
  label,
  value,
  options,
  onPress,
  style
}) => {
  const selectedLabel = options.find(opt => opt.value === value)?.label || '';

  return (
    <TextInput
      label={label}
      value={selectedLabel}
      mode="outlined"
      style={style}
      editable={false}
      right={
        <TextInput.Icon 
          icon="menu-down" 
          onPress={onPress}
          forceTextInputFocus={false}
        />
      }
      onPressIn={onPress}
    />
  );
};

export default SelectInput;
