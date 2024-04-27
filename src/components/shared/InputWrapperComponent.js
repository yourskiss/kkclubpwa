"use client";
import { forwardRef } from 'react';
const InputWrapperComponent = forwardRef(({ labeltext, errors, ...props }, ref) => (
	<div className="registerField">
		<div className="registertext">{labeltext} <small>*</small></div>
	  	<input ref={ref} {...props} />
	  	{errors && <span className="registerError">{errors}</span> }
	</div>
  ));
  export default InputWrapperComponent;

  
 
