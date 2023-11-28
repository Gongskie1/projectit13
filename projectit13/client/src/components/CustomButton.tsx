import { CustomButtonStyles } from "../types"

const CustomButton = ({btnText,btntype,styles}:CustomButtonStyles) => {
  return (
    <div>
      <button
        className={`${styles}`}
        type={btntype}>
        {btnText}
      </button>
    </div>
  )
}

export default CustomButton
