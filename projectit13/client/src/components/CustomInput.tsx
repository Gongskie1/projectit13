import { CustomInputStyles } from "../types";


const CustomInput: React.FC<CustomInputStyles> = ({styles,type,placeholder,name,values,onChange,onBlur}) => {
  return (
    <div className="w-full">
      <div className={`flex items-center w-full`}>
        <input 
          type={type}
          className={`outline-none border-collapse w-full  ${styles}`}
          placeholder={`${placeholder}`}
          name={name}
          value={values}
          onChange={onChange}
          onBlur={onBlur}
        />
      </div>
    </div>
  )
}

export default CustomInput
