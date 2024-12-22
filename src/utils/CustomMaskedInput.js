// CustomMaskedInput.js
import React from 'react';
import MaskedInput from 'react-text-mask';

const CustomMaskedInput = React.forwardRef(function CustomMaskedInput(props, ref) {
  const { inputRef, ...other } = props;

  return (
    <MaskedInput
      {...other}
      ref={(input) => {
        inputRef(input ? input.inputElement : null);
        if (typeof ref === 'function') {
          ref(input ? input.inputElement : null);
        } else if (ref) {
          ref.current = input ? input.inputElement : null;
        }
      }}
      mask={props.mask}
    />
  );
});

export default CustomMaskedInput;
