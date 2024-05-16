import { useLocation } from "react-router-dom";
export default function PostVerification({ props }) {
  const location = useLocation();
  const { data } = location.state;
  return (
    <div>
      <h3>SignUp Successfull 🎉</h3>
      <h3>Your Details</h3>
      <p>Name:&nbsp;{data.name}</p>
      <p>Mobile Number:&nbsp;+{data.ph}</p>
    </div>
  );
}
