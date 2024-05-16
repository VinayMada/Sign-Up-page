import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SignUpPage.css";
import OtpInput from "otp-input-react";
import PhoneInput from "react-phone-input-2";
import toast, { Toaster } from "react-hot-toast";
import { auth } from "./Firebase.config";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

export default function SignUpPage() {
  
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOTP] = useState("");
  const [ph, setPh] = useState("");
  const [showOTP, setShowOTP] = useState(false);
  const [termsChecked, setTermsChecked] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordRules, setPasswordRules] = useState([
    "Be between 8 to 16 characters",
    "Contain at least one uppercase letter",
    "Contain at least one lowercase letter",
    "Contain at least one digit",
  ]);

  const navto = useNavigate();

  function validatePassword(password) {
    const passwordRegex =
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])[a-zA-Z\d!@#$%^&*]{8,16}$/;
    return passwordRegex.test(password);
  }

  function handlePasswordChange(value) {
    setPassword(value);

    const containsUpperCase = /[A-Z]+/.test(value);
    const containsLowerCase = /[a-z]+/.test(value);
    const containsDigit = /[0-9]+/.test(value);
    const containsSpecialChar = /[*@!#%&()^~{}]+/.test(value);

    let updatedRules = [
      "Be between 8 to 16 characters",
      "Contain at least one uppercase letter",
      "Contain at least one lowercase letter",
      "Contain at least one digit",
      "Contain at least one special character",
    ];

    if (value.length >= 8 && value.length <= 16) {
      updatedRules = updatedRules.filter(
        (rule) => rule !== "Be between 8 to 16 characters"
      );
    }

    if (containsUpperCase) {
      updatedRules = updatedRules.filter(
        (rule) => rule !== "Contain at least one uppercase letter"
      );
    }

    if (containsLowerCase) {
      updatedRules = updatedRules.filter(
        (rule) => rule !== "Contain at least one lowercase letter"
      );
    }

    if (containsDigit) {
      updatedRules = updatedRules.filter(
        (rule) => rule !== "Contain at least one digit"
      );
    }

    if (containsSpecialChar) {
      updatedRules = updatedRules.filter(
        (rule) => rule !== "Contain at least one special character"
      );
    }

    setPasswordRules(updatedRules);
  }

  function onCaptchaVerify() {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        {
          size: "invisible",
          callback: (response) => {
            onSignup();
          },
          "expired-callback": () => {},
          auth,
        }
      );
    }
  }

  function onSignup() {
    if (!termsChecked) {
      toast.error("Please accept terms and conditions.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }
    if (!validatePassword(password)) {
      toast.error(
        "Password must be between 8 to 16 characters and contain at least one uppercase letter, one lowercase letter, one special character, and one digit."
      );
      return;
    }

    onCaptchaVerify();
    const appVerifier = window.recaptchaVerifier;

    const formatph = "+" + ph;
    signInWithPhoneNumber(auth, formatph, appVerifier)
      .then((confirmationResult) => {
        window.confirmationResult = confirmationResult;
        setShowOTP(true);
        toast.success("OTP sent successfully!");
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function onOTPVerify() {
    window.confirmationResult
      .confirm(otp)
      .then(async (res) => {
        navto("/post-verification", { state: { data: { name, ph } } });
      })
      .catch((err) => {
        toast.error("OTP doesn't match!!");
      });
  }

  return (
    <div className="signup-container">
      <Toaster toastOptions={{ duration: 4000 }} />
      <div id="recaptcha-container"></div>
      <div className="signup-form">
        {!showOTP && (
          <div>
            <h2>Sign Up</h2>
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <div>
              <PhoneInput
                specialLabel=""
                placeholder="WhatsApp number"
                country={"in"}
                value={ph}
                onChange={setPh}
                className={"phi"}
                required
              />
            </div>
            <div className="password-field">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => handlePasswordChange(e.target.value)}
                onFocus={() => setPasswordFocused(true)}
                required
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="password-toggle"
              >
                {showPassword ? (
                  <FontAwesomeIcon icon={faEyeSlash} />
                ) : (
                  <FontAwesomeIcon icon={faEye} />
                )}
              </span>
            </div>
            {passwordFocused && (
              <div className="password-rules">
                {passwordRules.length > 0 ? (
                  <p>Password must:</p>
                ) : (
                  <p>Good Password</p>
                )}
                <ul>
                  {passwordRules.map((rule, index) => (
                    <li key={index}>{rule}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="password-field">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <span
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="password-toggle"
              >
                {showConfirmPassword ? (
                  <FontAwesomeIcon icon={faEyeSlash} />
                ) : (
                  <FontAwesomeIcon icon={faEye} />
                )}
              </span>
            </div>
            <div>
              <div className="terms-checkbox">
                <input
                  type="checkbox"
                  id="termsCheckbox"
                  style={{ width: "4%" }}
                  required
                  onChange={(e) => setTermsChecked(e.target.checked)}
                />
                <label htmlFor="termsCheckbox" style={{ fontSize: "10px" }}>
                  By signing up, you accept our Terms of Service and Privacy
                  Policy.
                </label>
              </div>
            </div>
            <button onClick={onSignup}>Sign Up</button>
            <br />
            <br />
            <div>
              Already a member?{" "}
              <a href="#" style={{ color: "yellow" }}>
                Sign In
              </a>
            </div>
          </div>
        )}
        {showOTP && (
          <div>
            <h2>Enter OTP</h2>
            <p>OTP sent to +91xxxxxx{ph % 10000}</p>
            <OtpInput
              value={otp}
              onChange={setOTP}
              OTPLength={6}
              otpType="number"
              disabled={false}
              autoFocus
              className="otp-container"
            ></OtpInput>
            <br />
            <button onClick={onOTPVerify}>
              <span>Verify OTP</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
