

// /* eslint-disable react/no-unknown-property */
// import { Canvas, useFrame, useThree } from '@react-three/fiber';
// import { forwardRef, useRef, useMemo, useLayoutEffect } from 'react';
// import { Color } from 'three';
// import { Field, Formik, Form, ErrorMessage } from 'formik';
// import React, { useState } from 'react';
// import toast from 'react-hot-toast';
// import * as yup from "yup";
// import { api } from '../service/api';
// import { useNavigate } from 'react-router-dom';

// // Silk Component (Background Animation)
// const hexToNormalizedRGB = hex => {
//   hex = hex.replace('#', '');
//   return [
//     parseInt(hex.slice(0, 2), 16) / 255,
//     parseInt(hex.slice(2, 4), 16) / 255,
//     parseInt(hex.slice(4, 6), 16) / 255
//   ];
// };

// const vertexShader = `
// varying vec2 vUv;
// varying vec3 vPosition;

// void main() {
//   vPosition = position;
//   vUv = uv;
//   gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
// }
// `;

// const fragmentShader = `
// varying vec2 vUv;
// varying vec3 vPosition;

// uniform float uTime;
// uniform vec3  uColor;
// uniform float uSpeed;
// uniform float uScale;
// uniform float uRotation;
// uniform float uNoiseIntensity;

// const float e = 2.71828182845904523536;

// float noise(vec2 texCoord) {
//   float G = e;
//   vec2  r = (G * sin(G * texCoord));
//   return fract(r.x * r.y * (1.0 + texCoord.x));
// }

// vec2 rotateUvs(vec2 uv, float angle) {
//   float c = cos(angle);
//   float s = sin(angle);
//   mat2  rot = mat2(c, -s, s, c);
//   return rot * uv;
// }

// void main() {
//   float rnd        = noise(gl_FragCoord.xy);
//   vec2  uv         = rotateUvs(vUv * uScale, uRotation);
//   vec2  tex        = uv * uScale;
//   float tOffset    = uSpeed * uTime;

//   tex.y += 0.03 * sin(8.0 * tex.x - tOffset);

//   float pattern = 0.6 +
//                   0.4 * sin(5.0 * (tex.x + tex.y +
//                                    cos(3.0 * tex.x + 5.0 * tex.y) +
//                                    0.02 * tOffset) +
//                            sin(20.0 * (tex.x + tex.y - 0.1 * tOffset)));

//   vec4 col = vec4(uColor, 1.0) * vec4(pattern) - rnd / 15.0 * uNoiseIntensity;
//   col.a = 1.0;
//   gl_FragColor = col;
// }
// `;

// const SilkPlane = forwardRef(function SilkPlane({ uniforms }, ref) {
//   const { viewport } = useThree();

//   useLayoutEffect(() => {
//     if (ref.current) {
//       ref.current.scale.set(viewport.width, viewport.height, 1);
//     }
//   }, [ref, viewport]);

//   useFrame((_, delta) => {
//     ref.current.material.uniforms.uTime.value += 0.1 * delta;
//   });

//   return (
//     <mesh ref={ref}>
//       <planeGeometry args={[1, 1, 1, 1]} />
//       <shaderMaterial uniforms={uniforms} vertexShader={vertexShader} fragmentShader={fragmentShader} />
//     </mesh>
//   );
// });
// SilkPlane.displayName = 'SilkPlane';

// const BackgroundSilk = () => {
//   const meshRef = useRef();

//   const uniforms = useMemo(
//     () => ({
//       uSpeed: { value: 3 },
//       uScale: { value: 2 },
//       uNoiseIntensity: { value: 1.2 },
//       uColor: { value: new Color(...hexToNormalizedRGB('#6366f1')) }, // Indigo color
//       uRotation: { value: 0.5 },
//       uTime: { value: 0 }
//     }),
//     []
//   );

//   return (
//     <div className="absolute inset-0 z-0">
//       <Canvas dpr={[1, 2]} frameloop="always">
//         <SilkPlane ref={meshRef} uniforms={uniforms} />
//       </Canvas>
//     </div>
//   );
// };

// // -----------------------------registration form------------------
// function Registration() {
//   const [showpass, setshowpass] = useState(false);
//   const navigate = useNavigate();
  
//   const intialvalue = {
//     name: "",
//     email: "",
//     password: "",
//     confirmPassword: ""
//   };

//   const validation = yup.object({ 
//     name: yup.string()
//       .min(2, "Name must be at least 2 characters")
//       .max(50, "Name must be less than 50 characters")
//       .required("Name is required"),
//     email: yup.string()
//       .email("Invalid email address")
//       .required("Email is required"),
//     password: yup.string()
//       .min(6, "Password must be at least 6 characters")
//       .matches(
//         /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
//         "Password must contain at least one uppercase letter, one lowercase letter, and one number"
//       )
//       .required("Password is required"),
//     confirmPassword: yup.string()
//       .oneOf([yup.ref('password'), null], "Passwords must match")
//       .required("Please confirm your password")
//   });

//   const register = async (values, { setSubmitting, resetForm }) => {
//     try {
    
//       const res = await api.get("/users");
//       const oldUser = res.data.find(user => user.email === values.email);

//       if (oldUser) {
//         toast.error("User is already registered");
//         setSubmitting(false);
//         return;
//       }

//       const newUser = {
//         ...values,
//         isBlock: false,
//         isLoggedIn: false,
//         shippingaddres: [],
//         role:"user",
//         cart: [],
//         orders: [],
//         wishlist: [],
//       };

//       delete newUser.confirmPassword;

//       await api.post("/users", newUser);
      
//       toast.success("Registered successfully");
//       resetForm();
//       navigate("/login"); 

//     } catch (error) {
//       console.error("Registration error:", error);
//       toast.error("Registration failed");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   return (
//     <div className="pt-20 relative min-h-screen bg-gradient-to-br from-purple-50 to-blue-100 overflow-hidden">
//       {/* Animated Silk Background */}
//       <BackgroundSilk />
      
//       {/* Registration Form */}
//       <div className="relative z-10 flex justify-center items-center min-h-screen">
//         <div className="bg-white/40 backdrop-blur-sm p-8 rounded-2xl shadow-2xl w-96 border border-white/50">
//           <div className="text-center mb-8">
//             <h2 className="text-3xl font-bold text-white mb-2">Create Account</h2>
//             <p className="text-white">Join our community today</p>
//           </div>
          
//           <Formik
//             initialValues={intialvalue}
//             validationSchema={validation}
//             onSubmit={register}
//           >
//             {(({ isSubmitting, errors, touched }) => (
//               <Form className="flex flex-col gap-6">
//                 {/* Full Name Field */}
//                 <div>
//                   <label htmlFor="name" className="block text-sm font-medium text-white mb-2">
//                     Full Name
//                   </label>
//                   <Field
//                     name="name"
//                     type="text"
//                     placeholder="Enter your full name"
//                     className={`w-full border p-3 rounded-lg focus:ring-2 focus:outline-none transition-all duration-200 ${
//                       errors.name && touched.name 
//                         ? "border-red-500 focus:ring-red-200" 
//                         : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
//                     }`}
//                   />
//                   <ErrorMessage name="name" component="p" className="text-red-500 text-sm mt-1" />
//                 </div>

//                 {/* Email Field */}
//                 <div>
//                   <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
//                     Email Address
//                   </label>
//                   <Field
//                     name="email"
//                     type="email"
//                     placeholder="Enter your email"
//                     className={`w-full border p-3 rounded-lg focus:ring-2 focus:outline-none transition-all duration-200 ${
//                       errors.email && touched.email 
//                         ? "border-red-500 focus:ring-red-200" 
//                         : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
//                     }`}
//                   />
//                   <ErrorMessage name="email" component="p" className="text-red-500 text-sm mt-1" />
//                 </div>

//                 {/* Password Field */}
//                 <div className='relative'>
//                   <label htmlFor="password" className="block text-sm font-medium text-white mb-2">
//                     Password
//                   </label>
//                   <Field
//                     name="password"
//                     type={showpass ? "text" : "password"}
//                     placeholder="Create a password"
//                     className={`w-full border p-3 rounded-lg focus:ring-2 focus:outline-none transition-all duration-200 ${
//                       errors.password && touched.password 
//                         ? "border-red-500 focus:ring-red-200" 
//                         : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
//                     }`}
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setshowpass(!showpass)}
//                     className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-800 transition-colors"
//                   >
//                     {showpass ? (
//                       <svg
//                         xmlns="http://www.w3.org/2000/svg"
//                         className="h-5 w-5"
//                         fill="none"
//                         viewBox="0 0 24 24"
//                         stroke="currentColor"
//                       >
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           strokeWidth={2}
//                           d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-1.47.327-2.865.906-4.125M19.07 19.07A9.966 9.966 0 0112 19c-5.523 0-10-4.477-10-10 0-1.538.357-2.992.988-4.278M15 12a3 3 0 11-6 0 3 3 0 016 0z"
//                         />
//                       </svg>
//                     ) : (
//                       <svg
//                         xmlns="http://www.w3.org/2000/svg"
//                         className="h-5 w-5"
//                         fill="none"
//                         viewBox="0 0 24 24"
//                         stroke="currentColor"
//                       >
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           strokeWidth={2}
//                           d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
//                         />
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
//                       </svg>
//                     )}
//                   </button>
//                   <ErrorMessage name="password" component="div" className="text-red-500 text-sm mt-1" />
//                 </div>

//                 {/* Confirm Password Field */}
//                 <div className='relative'>
//                   <label htmlFor="confirmPassword" className="block text-sm font-medium text-white mb-2">
//                     Confirm Password
//                   </label>
//                   <Field
//                     name="confirmPassword"
//                     type={showpass ? "text" : "password"}
//                     placeholder="Confirm your password"
//                     className={`w-full border p-3 rounded-lg focus:ring-2 focus:outline-none transition-all duration-200 ${
//                       errors.confirmPassword && touched.confirmPassword 
//                         ? "border-red-500 focus:ring-red-200" 
//                         : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
//                     }`}
//                   />
//                   <ErrorMessage name="confirmPassword" component="p" className="text-red-500 text-sm mt-1" />
//                 </div>

//                 {/* Submit Button */}
//                 <button
//                   type="submit"
//                   disabled={isSubmitting}
//                   className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-transform"
//                 >
//                   {isSubmitting ? "Creating Account..." : "Create Account"}
//                 </button>

//                 {/* Login Link */}
//                 <div className="text-center mt-4">
//                   <p className="text-white">
//                     Already have an account?{' '}
//                     <button
//                       type="button"
//                       onClick={() => navigate('/login')}
//                       className="text-blue-600 hover:text-blue-700 font-semibold transition-colors"
//                     >
//                       Sign in
//                     </button>
//                   </p>
//                 </div>
//               </Form>
//             ))}
//           </Formik>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Registration;















import React, { useState, useRef, useMemo, useLayoutEffect, forwardRef, useEffect } from "react";
import { Field, Formik, Form, ErrorMessage } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { api } from "../service/api";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Color } from "three";

// ---------------- SILK BACKGROUND ----------------
const hexToNormalizedRGB = (hex) => {
  hex = hex.replace("#", "");
  return [
    parseInt(hex.slice(0, 2), 16) / 255,
    parseInt(hex.slice(2, 4), 16) / 255,
    parseInt(hex.slice(4, 6), 16) / 255,
  ];
};

const vertexShader = `
varying vec2 vUv;
varying vec3 vPosition;
void main() {
  vPosition = position;
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`;

const fragmentShader = `
varying vec2 vUv;
varying vec3 vPosition;
uniform float uTime;
uniform vec3 uColor;
uniform float uSpeed;
uniform float uScale;
uniform float uRotation;
uniform float uNoiseIntensity;

const float e = 2.71828182845904523536;

float noise(vec2 texCoord) {
  float G = e;
  vec2 r = (G * sin(G * texCoord));
  return fract(r.x * r.y * (1.0 + texCoord.x));
}

vec2 rotateUvs(vec2 uv, float angle) {
  float c = cos(angle);
  float s = sin(angle);
  mat2 rot = mat2(c, -s, s, c);
  return rot * uv;
}

void main() {
  float rnd = noise(gl_FragCoord.xy);
  vec2 uv = rotateUvs(vUv * uScale, uRotation);
  vec2 tex = uv * uScale;
  float tOffset = uSpeed * uTime;
  tex.y += 0.03 * sin(8.0 * tex.x - tOffset);
  float pattern = 0.6 + 0.4 * sin(5.0 * (tex.x + tex.y + cos(3.0 * tex.x + 5.0 * tex.y) + 0.02 * tOffset) + sin(20.0 * (tex.x + tex.y - 0.1 * tOffset)));
  vec4 col = vec4(uColor, 1.0) * vec4(pattern) - rnd / 15.0 * uNoiseIntensity;
  col.a = 1.0;
  gl_FragColor = col;
}`;

const SilkPlane = forwardRef(({ uniforms }, ref) => {
  const { viewport } = useThree();

  useLayoutEffect(() => {
    if (ref.current) ref.current.scale.set(viewport.width, viewport.height, 1);
  }, [ref, viewport]);

  useFrame((_, delta) => {
    if (ref.current) ref.current.material.uniforms.uTime.value += 0.1 * delta;
  });

  return (
    <mesh ref={ref}>
      <planeGeometry args={[1, 1, 1, 1]} />
      <shaderMaterial uniforms={uniforms} vertexShader={vertexShader} fragmentShader={fragmentShader} />
    </mesh>
  );
});

const Silk = ({ speed = 3, scale = 2, color = '#555555', noiseIntensity = 1.2, rotation = 0.2 }) => {
  const meshRef = useRef();
  const uniforms = useMemo(
    () => ({
      uSpeed: { value: speed },
      uScale: { value: scale },
      uNoiseIntensity: { value: noiseIntensity },
      uColor: { value: new Color(...hexToNormalizedRGB(color)) },
      uRotation: { value: rotation },
      uTime: { value: 0 },
    }),
    [speed, scale, noiseIntensity, color, rotation]
  );

  return (
    <Canvas dpr={[1, 2]} frameloop="always">
      <SilkPlane ref={meshRef} uniforms={uniforms} />
    </Canvas>
  );
};

// ---------------- REGISTRATION COMPONENT ----------------
export default function Registration() {
  const [showpass, setShowPass] = useState(false);
  const navigate = useNavigate();

  const initialValues = {
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  };

  const validation = yup.object({
    name: yup.string().min(2, "Name too short").max(50, "Too long").required("Required"),
    email: yup.string().email("Invalid email").required("Required"),
    password: yup
      .string()
      .min(6, "Min 6 characters")
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Must contain uppercase, lowercase, number")
      .required("Required"),
    confirmPassword: yup.string().oneOf([yup.ref("password")], "Passwords must match").required("Required"),
  });

  const register = async (values, { setSubmitting, resetForm }) => {
    try {
      const res = await api.get("/users");
      const existing = res.data.find((u) => u.email === values.email);
      if (existing) return toast.error("Email already registered");

      const newUser = {
        ...values,
        isBlock: false,
        role: "user",
        cart: [],
        orders: [],
        wishlist: [],
      };
      delete newUser.confirmPassword;

      await api.post("/users", newUser);
      toast.success("Registered successfully!");
      resetForm();
      navigate("/login");
    } catch (err) {
      toast.error("Registration failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className=" pt-20 relative min-h-screen overflow-hidden">
      {/* Silk Background */}
      <div className="absolute inset-0 z-0">
        <Silk />
      </div>

      {/* Soft glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-600/10 blur-3xl"></div>

      {/* Glass Form */}
      <div className="relative z-10 min-h-screen flex justify-center items-center px-4">
        <div
          className="w-full max-w-md bg-white/10 backdrop-blur-2xl border border-white/20 
          shadow-[0_0_40px_rgba(255,255,255,0.2)] rounded-2xl p-8 
          transition-all duration-300 hover:bg-white/20 hover:shadow-[0_0_60px_rgba(255,255,255,0.3)]"
        >
          <h1 className="text-3xl font-bold text-center text-white mb-6 drop-shadow-md">
            Create Account
          </h1>

          <Formik initialValues={initialValues} validationSchema={validation} onSubmit={register}>
            {({ touched, errors, isSubmitting }) => (
              <Form className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Full Name</label>
                  <Field
                    name="name"
                    type="text"
                    placeholder="Enter your full name"
                    className={`w-full bg-white/10 border p-3 rounded-lg text-white placeholder-gray-300
                      focus:ring-2 focus:outline-none transition-all duration-200
                      ${
                        errors.name && touched.name
                          ? "border-red-500 focus:ring-red-300"
                          : "border-white/30 focus:ring-blue-400 focus:border-blue-400"
                      }`}
                  />
                  <ErrorMessage name="name" component="div" className="text-red-300 text-sm mt-1" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">Email</label>
                  <Field
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    className={`w-full bg-white/10 border p-3 rounded-lg text-white placeholder-gray-300
                      focus:ring-2 focus:outline-none transition-all duration-200
                      ${
                        errors.email && touched.email
                          ? "border-red-500 focus:ring-red-300"
                          : "border-white/30 focus:ring-blue-400 focus:border-blue-400"
                      }`}
                  />
                  <ErrorMessage name="email" component="div" className="text-red-300 text-sm mt-1" />
                </div>

                <div className="relative">
                  <label className="block text-sm font-medium text-white mb-2">Password</label>
                  <Field
                    name="password"
                    type={showpass ? "text" : "password"}
                    placeholder="Enter your password"
                    className={`w-full bg-white/10 border p-3 rounded-lg text-white placeholder-gray-300
                      focus:ring-2 focus:outline-none transition-all duration-200 pr-10
                      ${
                        errors.password && touched.password
                          ? "border-red-500 focus:ring-red-300"
                          : "border-white/30 focus:ring-blue-400 focus:border-blue-400"
                      }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showpass)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-300 hover:text-white"
                  >
                    {showpass ? "Hide" : "Show"}
                  </button>
                  <ErrorMessage name="password" component="div" className="text-red-300 text-sm mt-1" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">Confirm Password</label>
                  <Field
                    name="confirmPassword"
                    type={showpass ? "text" : "password"}
                    placeholder="Confirm your password"
                    className={`w-full bg-white/10 border p-3 rounded-lg text-white placeholder-gray-300
                      focus:ring-2 focus:outline-none transition-all duration-200
                      ${
                        errors.confirmPassword && touched.confirmPassword
                          ? "border-red-500 focus:ring-red-300"
                          : "border-white/30 focus:ring-blue-400 focus:border-blue-400"
                      }`}
                  />
                  <ErrorMessage name="confirmPassword" component="div" className="text-red-300 text-sm mt-1" />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gray-600/80 hover:bg-gray-700/90 text-white p-3 rounded-lg font-semibold 
                    transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Creating Account..." : "Register"}
                </button>
              </Form>
            )}
          </Formik>

          <div className="mt-6 text-center pt-6 border-t border-white/10">
            <p className="text-gray-200">
              Already have an account?{" "}
              <button
                onClick={() => navigate("/login")}
                className="text-blue-400 font-semibold hover:text-blue-300 hover:underline"
              >
                Login
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

















